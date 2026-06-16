import {
  useState,
  useEffect,
} from "react";

import { db } from "../firebase";
import { grupos } from "../data/grupos";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const fasesMataMata = [
  {
    chave: "oitavas",
    titulo: "Oitavas",
    quantidade: 8,
  },
  {
    chave: "quartas",
    titulo: "Quartas",
    quantidade: 4,
  },
  {
    chave: "semifinal",
    titulo: "Semifinal",
    quantidade: 2,
  },
  {
    chave: "final",
    titulo: "Final",
    quantidade: 1,
  },
];

const criarJogoMataMata = (
  fase,
  numero
) => ({
  id: `${fase}-${numero}`,
  fase,
  timeA: "",
  timeB: "",
  data: "",
  horario: "",
  placarA: "",
  placarB: "",
  classificado: "",
  decididoNosPenaltis: false,
});

const criarJogosMataMataVazios =
  () =>
    fasesMataMata.reduce(
      (acc, fase) => {
        acc[fase.chave] =
          Array.from(
            {
              length:
                fase.quantidade,
            },
            (_, index) =>
              criarJogoMataMata(
                fase.chave,
                index + 1
              )
          );

        return acc;
      },
      {}
    );

const normalizarJogosMataMata = (
  dados = {}
) => {
  const jogosSalvos =
    dados.jogos || {};

  return fasesMataMata.reduce(
    (acc, fase) => {
      const jogosDaFase =
        Array.isArray(
          jogosSalvos[fase.chave]
        )
          ? jogosSalvos[fase.chave]
          : [];

      const classificadosAntigos =
        Array.isArray(
          dados[fase.chave]
        )
          ? dados[fase.chave]
          : [];

      acc[fase.chave] =
        Array.from(
          {
            length:
              fase.quantidade,
          },
          (_, index) => {
            const jogoSalvo =
              jogosDaFase[index] || {};

            return {
              ...criarJogoMataMata(
                fase.chave,
                index + 1
              ),
              ...jogoSalvo,
              fase: fase.chave,
              decididoNosPenaltis: Boolean(
                jogoSalvo.decididoNosPenaltis
              ),
              classificado:
                jogoSalvo.classificado ||
                classificadosAntigos[
                  index
                ] ||
                "",
            };
          }
        );

      return acc;
    },
    {}
  );
};

const normalizarConfrontosOficiais = (
  dados = {}
) => {
  const jogosSalvos =
    dados.jogos || {};

  return fasesMataMata.reduce(
    (acc, fase) => {
      const jogosDaFase =
        Array.isArray(
          jogosSalvos[fase.chave]
        )
          ? jogosSalvos[fase.chave]
          : [];

      acc[fase.chave] =
        Array.from(
          {
            length:
              fase.quantidade,
          },
          (_, index) => {
            const jogoSalvo =
              jogosDaFase[index] || {};

            return {
              ...criarJogoMataMata(
                fase.chave,
                index + 1
              ),
              timeA:
                jogoSalvo.timeA || "",
              timeB:
                jogoSalvo.timeB || "",
              data:
                jogoSalvo.data || "",
              horario:
                jogoSalvo.horario ||
                "",
            };
          }
        );

      return acc;
    },
    {}
  );
};

const existemConfrontosOficiais = (
  jogos = {}
) =>
  fasesMataMata.some((fase) =>
    (jogos[fase.chave] || []).some(
      (jogo) =>
        jogo.timeA ||
        jogo.timeB ||
        jogo.data ||
        jogo.horario
    )
  );

const mesclarJogosComConfrontos = (
  confrontos,
  dadosSalvos = {}
) => {
  const jogosSalvos =
    dadosSalvos.jogos || {};

  return fasesMataMata.reduce(
    (acc, fase) => {
      const baseDaFase =
        Array.isArray(
          confrontos[fase.chave]
        )
          ? confrontos[fase.chave]
          : [];

      const jogosDaFase =
        Array.isArray(
          jogosSalvos[fase.chave]
        )
          ? jogosSalvos[fase.chave]
          : [];

      const classificadosAntigos =
        Array.isArray(
          dadosSalvos[fase.chave]
        )
          ? dadosSalvos[fase.chave]
          : [];

      acc[fase.chave] =
        baseDaFase.map(
          (jogoBase, index) => {
            const jogoSalvo =
              jogosDaFase[index] || {};

            return {
              ...jogoBase,
              placarA:
                jogoSalvo.placarA ||
                "",
              placarB:
                jogoSalvo.placarB ||
                "",
              decididoNosPenaltis: Boolean(
                jogoSalvo.decididoNosPenaltis
              ),
              classificado:
                jogoSalvo.classificado ||
                classificadosAntigos[
                  index
                ] ||
                "",
            };
          }
        );

      return acc;
    },
    {}
  );
};

const prepararConfrontosParaSalvar = (
  jogos = {}
) =>
  fasesMataMata.reduce((acc, fase) => {
    acc[fase.chave] = (
      jogos[fase.chave] || []
    ).map((jogo, index) => ({
      id:
        jogo.id ||
        `${fase.chave}-${index + 1}`,
      fase: fase.chave,
      timeA: jogo.timeA || "",
      timeB: jogo.timeB || "",
      data: jogo.data || "",
      horario: jogo.horario || "",
    }));

    return acc;
  }, {});

const listarClassificadosMataMata = (
  jogos = []
) =>
  jogos
    .map((jogo) =>
      jogo.classificado.trim()
    )
    .filter(Boolean);

const criarResultadosGruposVazios =
  () =>
    Object.keys(grupos).reduce(
      (acc, grupo) => {
        acc[grupo] = {
          primeiro: "",
          segundo: "",
          terceiro: "",
          quarto: "",
        };

        return acc;
      },
      {}
    );

const criarResultadosMataMataVazios =
  () => ({
    jogos: {
      oitavas: [],
      quartas: [],
      semifinal: [],
      final: [],
    },
    oitavas: [],
    quartas: [],
    semifinal: [],
    final: [],
    campeao: "",
  });

function Resultados({
  usuario,
  voltar,
}) {
  const [resultados, setResultados] =
    useState({});

  const [mataMata, setMataMata] =
    useState(
      criarJogosMataMataVazios
    );

  const [
    confrontosOficiais,
    setConfrontosOficiais,
  ] = useState(
    criarJogosMataMataVazios
  );

  const [
    temConfrontosOficiais,
    setTemConfrontosOficiais,
  ] = useState(false);

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

        const configSnapshot =
          await getDoc(
            doc(
              db,
              "configuracoes",
              "mataMata"
            )
          );

        const mataMataSnapshot =
          await getDoc(
            doc(
              db,
              "resultados",
              "mataMata"
            )
          );

        const dadosMataMata =
          mataMataSnapshot.exists()
            ? mataMataSnapshot.data()
            : {};

        if (configSnapshot.exists()) {
          const confrontos =
            normalizarConfrontosOficiais(
              configSnapshot.data()
            );

          const possuiConfrontos =
            existemConfrontosOficiais(
              confrontos
            );

          setConfrontosOficiais(
            confrontos
          );
          setTemConfrontosOficiais(
            possuiConfrontos
          );

          setMataMata(
            possuiConfrontos
              ? mesclarJogosComConfrontos(
                  confrontos,
                  dadosMataMata
                )
              : normalizarJogosMataMata(
                  dadosMataMata
                )
          );

          return;
        }

        if (mataMataSnapshot.exists()) {
          setMataMata(
            normalizarJogosMataMata(
              dadosMataMata
            )
          );
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

  const alterarConfrontoOficial = (
    fase,
    index,
    campo,
    valor
  ) => {
    setConfrontosOficiais(
      (anterior) => ({
        ...anterior,
        [fase]: anterior[fase].map(
          (jogo, jogoIndex) =>
            jogoIndex === index
              ? {
                  ...jogo,
                  [campo]: valor,
                }
              : jogo
        ),
      })
    );
  };

  const alterarMataMata = (
    fase,
    index,
    campo,
    valor
  ) => {
    setMataMata((anterior) => ({
      ...anterior,
      [fase]: anterior[fase].map(
        (jogo, jogoIndex) =>
          jogoIndex === index
            ? {
                ...jogo,
                [campo]: valor,
              }
            : jogo
      ),
    }));
  };

  const salvarConfrontosOficiais =
    async () => {
      try {
        const jogosOficiais =
          prepararConfrontosParaSalvar(
            confrontosOficiais
          );

        await setDoc(
          doc(
            db,
            "configuracoes",
            "mataMata"
          ),
          {
            jogos: jogosOficiais,
            atualizadoEm:
              new Date().toISOString(),
          }
        );

        const possuiConfrontos =
          existemConfrontosOficiais(
            jogosOficiais
          );

        setTemConfrontosOficiais(
          possuiConfrontos
        );
        setMataMata(
          possuiConfrontos
            ? mesclarJogosComConfrontos(
                jogosOficiais,
                { jogos: mataMata }
              )
            : mataMata
        );

        alert(
          "Confrontos oficiais salvos com sucesso!"
        );
      } catch (error) {
        console.error(error);
        alert(
          "Erro ao salvar confrontos oficiais."
        );
      }
    };

  const salvarResultados =
    async () => {
      try {
        await setDoc(
          doc(
            db,
            "resultados",
            "grupos"
          ),
          resultados
        );

        const classificadosMataMata =
          fasesMataMata.reduce(
            (acc, fase) => {
              acc[fase.chave] =
                listarClassificadosMataMata(
                  mataMata[
                    fase.chave
                  ]
                );

              return acc;
            },
            {}
          );

        await setDoc(
          doc(
            db,
            "resultados",
            "mataMata"
          ),
          {
            jogos: mataMata,
            ...classificadosMataMata,
            campeao:
              classificadosMataMata
                .final[0] || "",
            atualizadoEm:
              new Date().toISOString(),
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

  const zerarResultadosTeste =
    async () => {
      const confirmado = window.confirm(
        "Tem certeza que deseja zerar os resultados de teste?\n\nEsta acao vai limpar apenas resultados/grupos e resultados/mataMata.\n\nNao altera usuarios, palpites, palpites do Mata-Mata, configuracoes ou permissoes."
      );

      if (!confirmado) return;

      try {
        const resultadosGruposVazios =
          criarResultadosGruposVazios();

        const resultadosMataMataVazios =
          criarResultadosMataMataVazios();

        await setDoc(
          doc(
            db,
            "resultados",
            "grupos"
          ),
          resultadosGruposVazios
        );

        await setDoc(
          doc(
            db,
            "resultados",
            "mataMata"
          ),
          resultadosMataMataVazios
        );

        setResultados(
          resultadosGruposVazios
        );

        setMataMata(
          temConfrontosOficiais
            ? mesclarJogosComConfrontos(
                confrontosOficiais,
                resultadosMataMataVazios
              )
            : normalizarJogosMataMata(
                resultadosMataMataVazios
              )
        );

        alert(
          "Resultados de teste zerados com sucesso."
        );
      } catch (error) {
        console.error(error);
        alert(
          "Erro ao zerar resultados de teste."
        );
      }
    };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Resultados Oficiais
      </h1>

      {Object.entries(grupos).map(
        ([grupo, selecoes]) => (
          <div
            key={grupo}
            style={secaoStyle}
          >
            <h2>Grupo {grupo}</h2>

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
                  .filter(
                    (selecao) => {
                      const escolhas =
                        Object.values(
                          resultados[
                            grupo
                          ] || {}
                        );

                      const atual =
                        resultados[
                          grupo
                        ]?.[
                          posicao
                        ];

                      return (
                        !escolhas.includes(
                          selecao
                        ) ||
                        selecao === atual
                      );
                    }
                  )
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

      {usuario?.tipoUsuario ===
        "superadmin" && (
        <div style={secaoStyle}>
          <h2>
            Confrontos Oficiais Mata-Mata
          </h2>

          <p style={textoApoioStyle}>
            Defina os confrontos oficiais.
            Os participantes usarao estes
            times como base dos palpites.
          </p>

          {fasesMataMata.map(
            (fase) => (
              <div
                key={fase.chave}
                style={faseMataMataStyle}
              >
                <h3>{fase.titulo}</h3>

                <div style={listaJogosStyle}>
                  {confrontosOficiais[
                    fase.chave
                  ].map(
                    (jogo, index) => (
                      <div
                        key={jogo.id}
                        style={jogoStyle}
                      >
                        <strong>
                          Jogo {index + 1}
                        </strong>

                        <div
                          style={
                            confrontoConfigStyle
                          }
                        >
                          <input
                            placeholder="Time A"
                            value={
                              jogo.timeA
                            }
                            onChange={(e) =>
                              alterarConfrontoOficial(
                                fase.chave,
                                index,
                                "timeA",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />

                          <input
                            placeholder="Time B"
                            value={
                              jogo.timeB
                            }
                            onChange={(e) =>
                              alterarConfrontoOficial(
                                fase.chave,
                                index,
                                "timeB",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />

                          <input
                            type="date"
                            value={
                              jogo.data
                            }
                            onChange={(e) =>
                              alterarConfrontoOficial(
                                fase.chave,
                                index,
                                "data",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />

                          <input
                            type="time"
                            value={
                              jogo.horario
                            }
                            onChange={(e) =>
                              alterarConfrontoOficial(
                                fase.chave,
                                index,
                                "horario",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}

          <button
            style={botaoConfig}
            onClick={
              salvarConfrontosOficiais
            }
          >
            Salvar Confrontos
          </button>
        </div>
      )}

      <div style={secaoStyle}>
        <h2>Resultados Mata-Mata</h2>

        {temConfrontosOficiais && (
          <p style={textoApoioStyle}>
            Confrontos oficiais ativos:
            informe apenas placar e
            classificado.
          </p>
        )}

        {fasesMataMata.map(
          (fase) => (
            <div
              key={fase.chave}
              style={faseMataMataStyle}
            >
              <h3>{fase.titulo}</h3>

              <div style={listaJogosStyle}>
                {mataMata[
                  fase.chave
                ].map(
                  (jogo, index) => (
                    <div
                      key={jogo.id}
                      style={jogoStyle}
                    >
                      <strong>
                        Jogo {index + 1}
                      </strong>

                      {temConfrontosOficiais && (
                        <div
                          style={
                            dadosJogoStyle
                          }
                        >
                          <span>
                            {jogo.data ||
                              "Data a definir"}
                          </span>

                          <span>
                            {jogo.horario ||
                              "Horario a definir"}
                          </span>
                        </div>
                      )}

                      <div
                        style={
                          confrontoStyle
                        }
                      >
                        {temConfrontosOficiais ? (
                          <strong
                            style={
                              nomeTimeStyle
                            }
                          >
                            {jogo.timeA ||
                              "Time A"}
                          </strong>
                        ) : (
                          <input
                            placeholder="Time A"
                            value={
                              jogo.timeA
                            }
                            onChange={(e) =>
                              alterarMataMata(
                                fase.chave,
                                index,
                                "timeA",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />
                        )}

                        <input
                          inputMode="numeric"
                          placeholder="0"
                          value={
                            jogo.placarA
                          }
                          onChange={(e) =>
                            alterarMataMata(
                              fase.chave,
                              index,
                              "placarA",
                              e.target.value
                            )
                          }
                          style={placarStyle}
                        />

                        <span>X</span>

                        <input
                          inputMode="numeric"
                          placeholder="0"
                          value={
                            jogo.placarB
                          }
                          onChange={(e) =>
                            alterarMataMata(
                              fase.chave,
                              index,
                              "placarB",
                              e.target.value
                            )
                          }
                          style={placarStyle}
                        />

                        {temConfrontosOficiais ? (
                          <strong
                            style={
                              nomeTimeStyle
                            }
                          >
                            {jogo.timeB ||
                              "Time B"}
                          </strong>
                        ) : (
                          <input
                            placeholder="Time B"
                            value={
                              jogo.timeB
                            }
                            onChange={(e) =>
                              alterarMataMata(
                                fase.chave,
                                index,
                                "timeB",
                                e.target.value
                              )
                            }
                            style={
                              selectStyle
                            }
                          />
                        )}
                      </div>

                      <input
                        placeholder="Classificado oficial"
                        value={
                          jogo.classificado
                        }
                        onChange={(e) =>
                          alterarMataMata(
                            fase.chave,
                            index,
                            "classificado",
                            e.target.value
                          )
                        }
                        style={selectStyle}
                      />

                      <label
                        style={checkboxLabelStyle}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(
                            jogo.decididoNosPenaltis
                          )}
                          onChange={(e) =>
                            alterarMataMata(
                              fase.chave,
                              index,
                              "decididoNosPenaltis",
                              e.target.checked
                            )
                          }
                        />
                        Decidido nos penaltis
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>

      <button
        style={botaoSalvar}
        onClick={salvarResultados}
      >
        Salvar Resultados
      </button>

      {usuario?.tipoUsuario ===
        "superadmin" && (
        <button
          style={botaoZerar}
          onClick={zerarResultadosTeste}
        >
          Zerar Resultados de Teste
        </button>
      )}

      <button
        style={botaoVoltar}
        onClick={voltar}
      >
        Voltar
      </button>
    </div>
  );
}

const paginaStyle = {
  minHeight: "100vh",
  backgroundColor: "#0d0d0d",
  color: "white",
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  padding: "clamp(16px, 4vw, 30px)",
  fontFamily:
    "Arial, sans-serif",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const tituloStyle = {
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1.15,
};

const secaoStyle = {
  backgroundColor: "#1a1a1a",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: "8px",
  marginBottom: "20px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const textoApoioStyle = {
  color: "#ddd",
  maxWidth: "780px",
};

const selectStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px",
};

const faseMataMataStyle = {
  borderTop: "1px solid #333",
  paddingTop: "14px",
  marginTop: "14px",
};

const listaJogosStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "14px",
};

const jogoStyle = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "10px",
};

const confrontoStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 56px 20px 56px minmax(0, 1fr)",
  alignItems: "center",
  gap: "8px",
};

const confrontoConfigStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "8px",
};

const dadosJogoStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  color: "#ccc",
  fontSize: "14px",
};

const nomeTimeStyle = {
  minWidth: 0,
  overflowWrap: "anywhere",
};

const placarStyle = {
  ...selectStyle,
  textAlign: "center",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#ddd",
  fontSize: "14px",
};

const botaoConfig = {
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginTop: "12px",
  marginBottom: "10px",
  width: "min(100%, 220px)",
};

const botaoSalvar = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginRight: "10px",
  marginBottom: "10px",
  width: "min(100%, 190px)",
};

const botaoZerar = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginRight: "10px",
  marginBottom: "10px",
  width: "min(100%, 240px)",
};

const botaoVoltar = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginBottom: "10px",
  width: "min(100%, 140px)",
};

export default Resultados;
