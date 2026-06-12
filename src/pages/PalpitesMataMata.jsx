import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

function PalpitesMataMata({
  usuario,
  voltar,
}) {
const [dados, setDados] =
  useState({
    oitavas: "",
    quartas: "",
    semifinal: "",
    final: "",
    campeao: "",
  });
  const [encerrado, setEncerrado] =
  useState(false);

  const [dataLimite, setDataLimite] =
  useState(null);

const [tempoRestante, setTempoRestante] =
  useState("");

  useEffect(() => {
  carregarConfiguracoes();
}, []);

useEffect(() => {
  carregarPalpite();
}, []);

useEffect(() => {
  if (!dataLimite) return;

  const atualizarTempo = () => {
    const agora =
      new Date();

    const limite =
      new Date(dataLimite);

    const diferenca =
      limite - agora;

    if (diferenca <= 0) {
      setTempoRestante(
        "Encerrado"
      );
      return;
    }

    const dias =
      Math.floor(
        diferenca /
          (1000 *
            60 *
            60 *
            24)
      );

    const horas =
      Math.floor(
        (diferenca %
          (1000 *
            60 *
            60 *
            24)) /
          (1000 *
            60 *
            60)
      );

    const minutos =
      Math.floor(
        (diferenca %
          (1000 *
            60 *
            60)) /
          (1000 * 60)
      );

    setTempoRestante(
      `${dias}d ${horas}h ${minutos}min`
    );
  };

  atualizarTempo();

  const intervalo =
    setInterval(
      atualizarTempo,
      60000
    );

  return () =>
    clearInterval(intervalo);
}, [dataLimite]);

const carregarPalpite =
  async () => {
    try {
      const snapshot =
        await getDoc(
          doc(
            db,
            "palpitesMataMata",
            usuario.uid
          )
        );

      if (snapshot.exists()) {
        const dadosFirebase =
          snapshot.data();

        setDados({
          oitavas:
            dadosFirebase.oitavas?.join(
              ", "
            ) || "",

          quartas:
            dadosFirebase.quartas?.join(
              ", "
            ) || "",

          semifinal:
            dadosFirebase.semifinal?.join(
              ", "
            ) || "",

          final:
            dadosFirebase.final?.join(
              ", "
            ) || "",

          campeao:
            dadosFirebase.campeao ||
            "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const carregarConfiguracoes =
  async () => {
    try {
      const snapshot =
        await getDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          )
        );

      if (snapshot.exists()) {
        const config =
          snapshot.data();

        const limite =
          config.dataLimitePalpites;
          setDataLimite(limite);

        if (
          limite &&
          new Date() >
            new Date(limite)
        ) {
          setEncerrado(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const alterar = (
    campo,
    valor
  ) => {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const salvar = async () => {
    if (encerrado) {
  alert(
    "Os palpites estão encerrados."
  );
  return;
}
    try {
      await setDoc(
        doc(
          db,
          "palpitesMataMata",
          usuario.uid
        ),
        {
          oitavas:
            dados.oitavas
              .split(",")
              .map((s) =>
                s.trim()
              ),

          quartas:
            dados.quartas
              .split(",")
              .map((s) =>
                s.trim()
              ),

          semifinal:
            dados.semifinal
              .split(",")
              .map((s) =>
                s.trim()
              ),

          final:
            dados.final
              .split(",")
              .map((s) =>
                s.trim()
              ),

          campeao:
            dados.campeao,
        }
      );

      alert(
        "Palpite do Mata-Mata salvo!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao salvar."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>
        🏆 Mata-Mata
      </h1>

      {dataLimite &&
  !encerrado && (
    <div
      style={{
        backgroundColor:
          "#0d6efd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontWeight: "bold",
      }}
    >
      ⏳ Encerramento dos
      palpites em:
      {" "}
      {tempoRestante}
    </div>
)}  

      {encerrado && (
  <div
    style={{
      backgroundColor:
        "#dc3545",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "bold",
    }}
  >
    🔒 Os palpites do
    Mata-Mata estão
    encerrados.
  </div>
)}

      <p>
        Digite as seleções
        separadas por vírgula.
      </p>

      <input
        placeholder="Oitavas"
        value={dados.oitavas}
        onChange={(e) =>
          alterar(
            "oitavas",
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Quartas"
        value={dados.quartas}
        onChange={(e) =>
          alterar(
            "quartas",
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Semifinal"
        value={dados.semifinal}
        onChange={(e) =>
          alterar(
            "semifinal",
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Final"
        value={dados.final}
        onChange={(e) =>
          alterar(
            "final",
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Campeão"
        value={dados.campeao}
        onChange={(e) =>
          alterar(
            "campeao",
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button onClick={salvar}>
        💾 Salvar
      </button>

      <button
        onClick={voltar}
        style={{
          marginLeft: "10px",
        }}
      >
        Voltar
      </button>
    </div>
  );
}

export default PalpitesMataMata;