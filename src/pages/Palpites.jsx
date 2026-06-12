import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { grupos } from "../data/grupos";
import GrupoPalpite from "../components/GrupoPalpite";

function Palpites({
  usuario,
  voltar,
  abrirResumo,
}) {
  const [palpites, setPalpites] = useState({});
  const [liberado, setLiberado] =
    useState(true);
  const [dataLimite, setDataLimite] =
  useState(null);

  const [tempoRestante, setTempoRestante] =
  useState("");

  useEffect(() => {
    carregarConfiguracoes();
    carregarPalpites();
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

  const carregarConfiguracoes =
    async () => {
      try {
        const snapshot = await getDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          )
        );

       if (snapshot.exists()) {
  const config =
    snapshot.data();

  setLiberado(
    config.palpitesLiberados
  );

  setDataLimite(
    config.dataLimitePalpites ||
      null
  );
}
      } catch (error) {
        console.error(error);
      }
    };

  const palpitesEncerrados =
  dataLimite
    ? new Date() >
      new Date(dataLimite)
    : false;

  const carregarPalpites = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, "palpites", usuario.uid)
      );

      if (snapshot.exists()) {
        const dados = snapshot.data();

        delete dados.atualizadoEm;

        setPalpites(dados);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const alterarValor = (
    grupo,
    posicao,
    valor
  ) => {
    if (!liberado) return;

    setPalpites((anterior) => ({
      ...anterior,
      [grupo]: {
        ...anterior[grupo],
        [posicao]: valor,
      },
    }));
  };

  const salvarPalpites = async () => {
    if (
  !liberado ||
  palpitesEncerrados
) {
      alert(
        "Os palpites estão encerrados."
      );
      return;
    }

    try {
      await setDoc(
        doc(db, "palpites", usuario.uid),
        {
          ...palpites,
          atualizadoEm:
            new Date().toISOString(),
        }
      );

      alert(
        "Palpites salvos com sucesso!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao salvar palpites."
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
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <h1>
        ⚽ Palpites Copa 2026
      </h1>

      {dataLimite &&
  !palpitesEncerrados && (
    <div
      style={{
        backgroundColor:
          "#0d6efd",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "15px",
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

      {(!liberado ||
  palpitesEncerrados) && (
        <div
          style={{
            backgroundColor:
              "#dc3545",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          🔒 Os palpites estão
          encerrados.
        </div>
      )}

      <div
        style={{
          maxWidth: "900px",
          marginTop: "20px",
        }}
      >
        {Object.entries(grupos).map(
          ([grupo, selecoes]) => (
            <GrupoPalpite
              key={grupo}
              grupo={grupo}
              selecoes={selecoes}
              valores={
                palpites[grupo] || {}
              }
              alterarValor={
                alterarValor
              }
            />
          )
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              ...botaoSalvar,
              opacity: liberado
                ? 1
                : 0.6,
            }}
            onClick={salvarPalpites}
          >
            {liberado
              ? "💾 Salvar Palpites"
              : "🔒 Palpites Encerrados"}
          </button>

          <button
            style={botaoResumo}
            onClick={abrirResumo}
          >
            📋 Ver Resumo
          </button>

          <button
            style={botaoVoltar}
            onClick={voltar}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

const botaoSalvar = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};

const botaoResumo = {
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};

const botaoVoltar = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};

export default Palpites;