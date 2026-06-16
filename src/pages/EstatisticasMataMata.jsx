import {
  useEffect,
  useState,
} from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

const fases = [
  {
    chave: "oitavas",
    titulo: "Oitavas",
  },
  {
    chave: "quartas",
    titulo: "Quartas",
  },
  {
    chave: "semifinal",
    titulo: "Semifinal",
  },
  {
    chave: "final",
    titulo: "Final",
  },
];

const criarContadores = () => ({
  placarExato: 0,
  resultadoCorreto: 0,
  classificadoCorreto: 0,
  penaltisCorreto: 0,
  acertoTotal: 0,
});

const normalizarTexto = (valor) =>
  String(valor || "")
    .toLowerCase()
    .trim();

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const jogoOficialCompleto = (jogo) =>
  placarPreenchido(jogo) &&
  Boolean(
    normalizarTexto(jogo?.classificado)
  );

const resultadoDoJogo = (jogo) => {
  if (!placarPreenchido(jogo)) {
    return "";
  }

  const placarA = Number(jogo.placarA);
  const placarB = Number(jogo.placarB);

  if (
    Number.isNaN(placarA) ||
    Number.isNaN(placarB)
  ) {
    return "";
  }

  if (placarA > placarB) {
    return "timeA";
  }

  if (placarB > placarA) {
    return "timeB";
  }

  return "empate";
};

const criarResumoFases = () =>
  fases.reduce((acc, fase) => {
    acc[fase.chave] = {
      ...criarContadores(),
      jogosContabilizados: 0,
      totalAcertos: 0,
    };

    return acc;
  }, {});

const ordenarRanking = (lista, campo) =>
  [...lista]
    .filter((item) => item[campo] > 0)
    .sort((a, b) => {
      if (b[campo] !== a[campo]) {
        return b[campo] - a[campo];
      }

      return a.nome.localeCompare(b.nome);
    })
    .slice(0, 5);

const calcularEstatisticas = ({
  usuarios,
  palpites,
  resultadoMataMata,
}) => {
  const participantes = [];
  const fasesResumo = criarResumoFases();
  const jogosOficiais =
    resultadoMataMata?.jogos || {};

  const jogosContabilizados =
    fases.reduce((total, fase) => {
      const jogosDaFase =
        jogosOficiais[fase.chave] || [];
      const completos =
        jogosDaFase.filter(
          jogoOficialCompleto
        ).length;

      fasesResumo[
        fase.chave
      ].jogosContabilizados = completos;

      return total + completos;
    }, 0);

  palpites.forEach((palpiteDoc) => {
    const usuario =
      usuarios[palpiteDoc.id] || {};
    const dadosPalpite =
      palpiteDoc.data();
    const contadores =
      criarContadores();
    const porFase =
      criarResumoFases();

    let oportunidades = 0;
    let acertosAproveitamento = 0;

    fases.forEach((fase) => {
      const palpitesDaFase =
        dadosPalpite.jogos?.[
          fase.chave
        ] || [];
      const resultadosDaFase =
        jogosOficiais[fase.chave] || [];

      resultadosDaFase.forEach(
        (jogoResultado, index) => {
          if (
            !jogoOficialCompleto(
              jogoResultado
            )
          ) {
            return;
          }

          const jogoPalpite =
            palpitesDaFase[index] || {};

          const placarExato =
            placarPreenchido(
              jogoPalpite
            ) &&
            String(
              jogoPalpite.placarA
            ).trim() ===
              String(
                jogoResultado.placarA
              ).trim() &&
            String(
              jogoPalpite.placarB
            ).trim() ===
              String(
                jogoResultado.placarB
              ).trim();

          const resultadoCorreto =
            resultadoDoJogo(
              jogoPalpite
            ) &&
            resultadoDoJogo(
              jogoPalpite
            ) ===
              resultadoDoJogo(
                jogoResultado
              );

          const classificadoCorreto =
            normalizarTexto(
              jogoPalpite.classificado
            ) &&
            normalizarTexto(
              jogoPalpite.classificado
            ) ===
              normalizarTexto(
                jogoResultado.classificado
              );

          const penaltisCorreto =
            jogoResultado.decididoNosPenaltis ===
              true &&
            jogoPalpite.decididoNosPenaltis ===
              true;

          const acertoTotal =
            placarExato &&
            resultadoCorreto &&
            classificadoCorreto &&
            (!jogoResultado.decididoNosPenaltis ||
              penaltisCorreto);

          const faseAtual =
            porFase[fase.chave];
          const faseGlobal =
            fasesResumo[fase.chave];

          faseAtual.jogosContabilizados += 1;
          oportunidades +=
            4 +
            (jogoResultado.decididoNosPenaltis
              ? 1
              : 0);

          [
            ["placarExato", placarExato],
            [
              "resultadoCorreto",
              resultadoCorreto,
            ],
            [
              "classificadoCorreto",
              classificadoCorreto,
            ],
            [
              "penaltisCorreto",
              penaltisCorreto,
            ],
            ["acertoTotal", acertoTotal],
          ].forEach(([campo, acertou]) => {
            if (!acertou) return;

            contadores[campo] += 1;
            faseAtual[campo] += 1;
            faseGlobal[campo] += 1;
            faseAtual.totalAcertos += 1;
            faseGlobal.totalAcertos += 1;
            acertosAproveitamento += 1;
          });
        }
      );
    });

    participantes.push({
      id: palpiteDoc.id,
      nome:
        usuario.apelido ||
        usuario.nome ||
        "Sem nome",
      ...contadores,
      porFase,
      totalAcertos:
        contadores.placarExato +
        contadores.resultadoCorreto +
        contadores.classificadoCorreto +
        contadores.penaltisCorreto +
        contadores.acertoTotal,
      aproveitamento:
        oportunidades > 0
          ? Number(
              (
                (acertosAproveitamento /
                  oportunidades) *
                100
              ).toFixed(1)
            )
          : 0,
    });
  });

  const totalAcertos = participantes.reduce(
    (total, participante) =>
      total + participante.totalAcertos,
    0
  );

  const faseComMaisAcertos =
    fases
      .map((fase) => ({
        ...fase,
        total:
          fasesResumo[fase.chave]
            .totalAcertos,
      }))
      .sort((a, b) => b.total - a.total)[0] ||
    null;

  return {
    participantes,
    fasesResumo,
    resumo: {
      participantesComPalpite:
        participantes.length,
      jogosOficiaisContabilizados:
        jogosContabilizados,
      mediaAcertosPorParticipante:
        participantes.length > 0
          ? (
              totalAcertos /
              participantes.length
            ).toFixed(1)
          : "0.0",
      faseComMaisAcertos:
        faseComMaisAcertos?.total > 0
          ? faseComMaisAcertos.titulo
          : "-",
    },
    rankings: {
      placarExato: ordenarRanking(
        participantes,
        "placarExato"
      ),
      resultadoCorreto: ordenarRanking(
        participantes,
        "resultadoCorreto"
      ),
      classificadoCorreto: ordenarRanking(
        participantes,
        "classificadoCorreto"
      ),
      penaltisCorreto: ordenarRanking(
        participantes,
        "penaltisCorreto"
      ),
      acertoTotal: ordenarRanking(
        participantes,
        "acertoTotal"
      ),
      aproveitamento: [...participantes]
        .filter(
          (item) => item.aproveitamento > 0
        )
        .sort((a, b) => {
          if (
            b.aproveitamento !==
            a.aproveitamento
          ) {
            return (
              b.aproveitamento -
              a.aproveitamento
            );
          }

          return a.nome.localeCompare(
            b.nome
          );
        })
        .slice(0, 5),
    },
  };
};

function EstatisticasMataMata({ voltar }) {
  const [carregando, setCarregando] =
    useState(true);
  const [dados, setDados] =
    useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    carregarEstatisticas();
  }, []);

  const carregarEstatisticas =
    async () => {
      try {
        const [
          usuariosSnapshot,
          palpitesSnapshot,
          resultadoSnapshot,
        ] = await Promise.all([
          getDocs(
            collection(db, "usuarios")
          ),
          getDocs(
            collection(
              db,
              "palpitesMataMata"
            )
          ),
          getDoc(
            doc(
              db,
              "resultados",
              "mataMata"
            )
          ),
        ]);

        if (!resultadoSnapshot.exists()) {
          setDados(null);
          return;
        }

        const usuarios = {};

        usuariosSnapshot.docs.forEach(
          (usuarioDoc) => {
            usuarios[usuarioDoc.id] =
              usuarioDoc.data();
          }
        );

        const estatisticas =
          calcularEstatisticas({
            usuarios,
            palpites:
              palpitesSnapshot.docs,
            resultadoMataMata:
              resultadoSnapshot.data(),
          });

        setDados(estatisticas);
      } catch (error) {
        console.error(error);
        setDados(null);
      } finally {
        setCarregando(false);
      }
    };

  const temDados =
    dados?.resumo
      ?.jogosOficiaisContabilizados > 0;

  const renderRanking = (
    titulo,
    lista,
    campo,
    sufixo = ""
  ) => (
    <section style={cardStyle}>
      <h2 style={cardTituloStyle}>
        {titulo}
      </h2>

      {lista.length === 0 ? (
        <p style={textoSecundarioStyle}>
          Sem acertos contabilizados.
        </p>
      ) : (
        <div style={listaStyle}>
          {lista.map(
            (participante, index) => (
              <div
                key={`${campo}-${participante.id}`}
                style={linhaRankingStyle}
              >
                <span style={posicaoStyle}>
                  #{index + 1}
                </span>
                <strong style={nomeStyle}>
                  {participante.nome}
                </strong>
                <span style={valorStyle}>
                  {participante[campo]}
                  {sufixo}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Estatisticas Mata-Mata
      </h1>

      <button
        onClick={voltar}
        style={botaoVoltarTopoStyle}
      >
        Voltar ao Dashboard
      </button>

      {carregando && (
        <div style={cardStyle}>
          Carregando estatisticas...
        </div>
      )}

      {!carregando && !temDados && (
        <div style={cardStyle}>
          <h2 style={cardTituloStyle}>
            Sem resultados suficientes
          </h2>
          <p style={textoSecundarioStyle}>
            Preencha resultados oficiais do
            Mata-Mata com placar e
            classificado para gerar as
            estatisticas.
          </p>
        </div>
      )}

      {!carregando && temDados && (
        <>
          <section style={resumoGridStyle}>
            <div style={destaqueStyle}>
              <span style={labelStyle}>
                Participantes com palpite
              </span>
              <strong style={numeroStyle}>
                {
                  dados.resumo
                    .participantesComPalpite
                }
              </strong>
            </div>

            <div style={destaqueStyle}>
              <span style={labelStyle}>
                Jogos contabilizados
              </span>
              <strong style={numeroStyle}>
                {
                  dados.resumo
                    .jogosOficiaisContabilizados
                }
              </strong>
            </div>

            <div style={destaqueStyle}>
              <span style={labelStyle}>
                Media de acertos
              </span>
              <strong style={numeroStyle}>
                {
                  dados.resumo
                    .mediaAcertosPorParticipante
                }
              </strong>
            </div>

            <div style={destaqueStyle}>
              <span style={labelStyle}>
                Fase com mais acertos
              </span>
              <strong style={numeroStyle}>
                {
                  dados.resumo
                    .faseComMaisAcertos
                }
              </strong>
            </div>
          </section>

          <section style={gridStyle}>
            {renderRanking(
              "Mais placares exatos",
              dados.rankings.placarExato,
              "placarExato"
            )}

            {renderRanking(
              "Mais resultados corretos",
              dados.rankings.resultadoCorreto,
              "resultadoCorreto"
            )}

            {renderRanking(
              "Mais classificados corretos",
              dados.rankings.classificadoCorreto,
              "classificadoCorreto"
            )}

            {renderRanking(
              "Mais acertos em penaltis",
              dados.rankings.penaltisCorreto,
              "penaltisCorreto"
            )}

            {renderRanking(
              "Mais acertos totais",
              dados.rankings.acertoTotal,
              "acertoTotal"
            )}

            {renderRanking(
              "Melhor aproveitamento",
              dados.rankings.aproveitamento,
              "aproveitamento",
              "%"
            )}
          </section>

          <section style={cardStyle}>
            <h2 style={cardTituloStyle}>
              Estatisticas por fase
            </h2>

            <div style={fasesGridStyle}>
              {fases.map((fase) => {
                const resumo =
                  dados.fasesResumo[
                    fase.chave
                  ];

                return (
                  <div
                    key={fase.chave}
                    style={faseCardStyle}
                  >
                    <h3 style={faseTituloStyle}>
                      {fase.titulo.toUpperCase()}
                    </h3>

                    <p style={jogosOficiaisStyle}>
                      Jogos com resultado oficial:{" "}
                      {
                        resumo.jogosContabilizados
                      }
                    </p>

                    <div style={acertosBlocoStyle}>
                      <strong
                        style={subtituloFaseStyle}
                      >
                        Acertos dos participantes
                      </strong>

                      <p style={linhaFaseStyle}>
                        <span>
                          Placares exatos:
                        </span>
                        <strong>
                          {resumo.placarExato}
                        </strong>
                      </p>

                      <p style={linhaFaseStyle}>
                        <span>
                          Resultados corretos:
                        </span>
                        <strong>
                          {
                            resumo.resultadoCorreto
                          }
                        </strong>
                      </p>

                      <p style={linhaFaseStyle}>
                        <span>
                          Classificados corretos:
                        </span>
                        <strong>
                          {
                            resumo.classificadoCorreto
                          }
                        </strong>
                      </p>

                      <p style={linhaFaseStyle}>
                        <span>
                          Penaltis corretos:
                        </span>
                        <strong>
                          {
                            resumo.penaltisCorreto
                          }
                        </strong>
                      </p>

                      <p style={linhaFaseStyle}>
                        <span>
                          Acertos totais:
                        </span>
                        <strong>
                          {resumo.acertoTotal}
                        </strong>
                      </p>
                    </div>

                    <small style={notaFaseStyle}>
                      Total de acertos somando todos
                      os participantes.
                    </small>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
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
  boxSizing: "border-box",
  overflowWrap: "anywhere",
  fontFamily: "Arial, sans-serif",
};

const tituloStyle = {
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1.15,
  textAlign: "center",
};

const botaoVoltarTopoStyle = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "22px",
  fontWeight: "bold",
  maxWidth: "100%",
};

const resumoGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
};

const destaqueStyle = {
  backgroundColor: "#211a05",
  border: "1px solid #ffc107",
  borderRadius: "8px",
  padding: "16px",
  display: "grid",
  gap: "8px",
  textAlign: "left",
};

const labelStyle = {
  color: "#ddd",
  fontSize: "13px",
};

const numeroStyle = {
  color: "#ffd76a",
  fontSize: "clamp(24px, 5vw, 34px)",
  lineHeight: 1,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "14px",
  alignItems: "start",
};

const cardStyle = {
  backgroundColor: "#181818",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "clamp(16px, 4vw, 20px)",
  marginBottom: "18px",
  boxSizing: "border-box",
};

const cardTituloStyle = {
  marginTop: 0,
};

const textoSecundarioStyle = {
  color: "#bbb",
  lineHeight: 1.4,
};

const listaStyle = {
  display: "grid",
  gap: "8px",
};

const linhaRankingStyle = {
  display: "grid",
  gridTemplateColumns:
    "44px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "10px",
  textAlign: "left",
};

const posicaoStyle = {
  color: "#ffd76a",
  fontWeight: "bold",
};

const nomeStyle = {
  minWidth: 0,
  overflowWrap: "anywhere",
};

const valorStyle = {
  color: "#ffc107",
  fontWeight: "bold",
};

const fasesGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "12px",
};

const faseCardStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  lineHeight: 1.55,
  display: "grid",
  gap: "12px",
};

const faseTituloStyle = {
  marginTop: 0,
  marginBottom: 0,
  color: "#ffd76a",
};

const jogosOficiaisStyle = {
  margin: 0,
  color: "#e6e6e6",
  fontWeight: "bold",
};

const acertosBlocoStyle = {
  display: "grid",
  gap: "6px",
  borderTop: "1px solid #2c2c2c",
  paddingTop: "10px",
};

const subtituloFaseStyle = {
  color: "#ddd",
  fontSize: "14px",
};

const linhaFaseStyle = {
  margin: 0,
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  color: "#cfcfcf",
};

const notaFaseStyle = {
  color: "#999",
  lineHeight: 1.35,
};

export default EstatisticasMataMata;
