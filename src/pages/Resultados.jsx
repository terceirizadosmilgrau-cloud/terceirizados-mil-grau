import {
  useState,
  useEffect
} from "react";

import { db } from "../firebase";
import { grupos } from "../data/grupos";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

function Resultados({ voltar }) {
  const [resultados, setResultados] =
    useState({});

    const [mataMata, setMataMata] =
  useState({
    oitavas: "",
    quartas: "",
    semifinal: "",
    final: "",
    campeao: "",
  });
  useEffect(() => {
  carregarResultados();
}, []);

const carregarResultados =
  async () => {
    try {
      const gruposSnapshot =
        await getDoc(
          doc(
            db,
            "resultados",
            "grupos"
          )
        );

      if (gruposSnapshot.exists()) {
        setResultados(
          gruposSnapshot.data()
        );
      }

      const mataMataSnapshot =
        await getDoc(
          doc(
            db,
            "resultados",
            "mataMata"
          )
        );

      if (
        mataMataSnapshot.exists()
      ) {
        const dados =
          mataMataSnapshot.data();

        setMataMata({
          oitavas:
            dados.oitavas?.join(
              ", "
            ) || "",

          quartas:
            dados.quartas?.join(
              ", "
            ) || "",

          semifinal:
            dados.semifinal?.join(
              ", "
            ) || "",

          final:
            dados.final?.join(
              ", "
            ) || "",

          campeao:
            dados.campeao || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const alterarResultado = (
    grupo,
    posicao,
    valor
  ) => {
    setResultados((anterior) => ({
      ...anterior,

      [grupo]: {
        ...anterior[grupo],
        [posicao]: valor,
      },
    }));
  };

  const alterarMataMata = (
  campo,
  valor
) => {
  setMataMata((anterior) => ({
    ...anterior,
    [campo]: valor,
  }));
};

  const salvarResultados = async () => {
    try {
      await setDoc(
        doc(
          db,
          "resultados",
          "grupos"
        ),
        resultados
      );

      await setDoc(
  doc(
    db,
    "resultados",
    "mataMata"
  ),
  {
    oitavas:
      mataMata.oitavas
        .split(",")
        .map((s) => s.trim()),

    quartas:
      mataMata.quartas
        .split(",")
        .map((s) => s.trim()),

    semifinal:
      mataMata.semifinal
        .split(",")
        .map((s) => s.trim()),

    final:
      mataMata.final
        .split(",")
        .map((s) => s.trim()),

    campeao:
      mataMata.campeao,
  }
);

      alert(
        "Resultados salvos com sucesso!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao salvar resultados."
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
        ⚽ Resultados Oficiais
      </h1>

      {Object.entries(grupos).map(
        ([grupo, selecoes]) => (
          <div
            key={grupo}
            style={{
              backgroundColor:
                "#1a1a1a",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>
              Grupo {grupo}
            </h2>

            {[
              "primeiro",
              "segundo",
              "terceiro",
              "quarto",
            ].map((posicao) => (
              <select
                key={posicao}
                value={
                  resultados[
                    grupo
                  ]?.[
                    posicao
                  ] || ""
                }
                onChange={(e) =>
                  alterarResultado(
                    grupo,
                    posicao,
                    e.target.value
                  )
                }
                style={selectStyle}
              >
                <option value="">
                  Selecione...
                </option>

                {selecoes
  .filter((selecao) => {
    const escolhas =
      Object.values(
        resultados[grupo] || {}
      );

    const atual =
      resultados[grupo]?.[
        posicao
      ];

    return (
      !escolhas.includes(
        selecao
      ) ||
      selecao === atual
    );
  })
  .map((selecao) => (
    <option
      key={selecao}
      value={selecao}
    >
      {selecao}
    </option>
  ))}
              </select>
            ))}
          </div>
        )
      )}

      <div
  style={{
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h2>
    🏆 Resultados Mata-Mata
  </h2>

  <input
    placeholder="Oitavas (separadas por vírgula)"
    value={mataMata.oitavas}
    onChange={(e) =>
      alterarMataMata(
        "oitavas",
        e.target.value
      )
    }
    style={selectStyle}
  />

  <input
    placeholder="Quartas"
    value={mataMata.quartas}
    onChange={(e) =>
      alterarMataMata(
        "quartas",
        e.target.value
      )
    }
    style={selectStyle}
  />

  <input
    placeholder="Semifinal"
    value={mataMata.semifinal}
    onChange={(e) =>
      alterarMataMata(
        "semifinal",
        e.target.value
      )
    }
    style={selectStyle}
  />

  <input
    placeholder="Final"
    value={mataMata.final}
    onChange={(e) =>
      alterarMataMata(
        "final",
        e.target.value
      )
    }
    style={selectStyle}
  />

  <input
    placeholder="Campeão"
    value={mataMata.campeao}
    onChange={(e) =>
      alterarMataMata(
        "campeao",
        e.target.value
      )
    }
    style={selectStyle}
  />
</div>

      <button
        style={botaoSalvar}
        onClick={
          salvarResultados
        }
      >
        Salvar Resultados
      </button>

      <button
        style={botaoVoltar}
        onClick={voltar}
      >
        Voltar
      </button>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
};

const botaoSalvar = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoVoltar = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};

export default Resultados;