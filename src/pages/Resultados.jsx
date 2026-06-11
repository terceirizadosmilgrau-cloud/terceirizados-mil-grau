import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import { grupos } from "../data/grupos";

function Resultados({ voltar }) {
  const [resultados, setResultados] =
    useState({});

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

                {selecoes.map(
                  (selecao) => (
                    <option
                      key={
                        selecao
                      }
                      value={
                        selecao
                      }
                    >
                      {selecao}
                    </option>
                  )
                )}
              </select>
            ))}
          </div>
        )
      )}

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