import {
  useEffect,
  useMemo,
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

const criarJogo = (fase, numero) => ({
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

const normalizarTexto = (valor) =>
  String(valor || "").trim();

const normalizarChave = (valor) =>
  normalizarTexto(valor).toLowerCase();

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const placarChave = (jogo) =>
  placarPreenchido(jogo)
    ? `${String(jogo.placarA).trim()}-${String(
        jogo.placarB
      ).trim()}`
    : "";

const formatarPlacar = (jogo) =>
  placarPreenchido(jogo)
    ? `${jogo.placarA} x ${jogo.placarB}`
    : "-";

const temConteudoJogo = (jogo) =>
  placarPreenchido(jogo) ||
  normalizarTexto(jogo?.classificado) ||
  jogo?.decididoNosPenaltis;

const normalizarConfrontosOficiais = (
  dados = {}
) => {
  const jogosSalvos = dados.jogos || {};

  return fases.reduce((acc, fase) => {
    const jogosDaFase = Array.isArray(
      jogosSalvos[fase.chave]
    )
      ? jogosSalvos[fase.chave]
      : [];

    acc[fase.chave] = Array.from(
      { length: fase.quantidade },
      (_, index) => {
        const jogoSalvo =
          jogosDaFase[index] || {};

        return {
          ...criarJogo(
            fase.chave,
            index + 1
          ),
          timeA: jogoSalvo.timeA || "",
          timeB: jogoSalvo.timeB || "",
          data: jogoSalvo.data || "",
          horario:
            jogoSalvo.horario || "",
        };
      }
    );

    return acc;
  }, {});
};

const normalizarJogos = (
  dados = {},
  confrontos = null
) => {
  const jogosSalvos = dados.jogos || {};

  return fases.reduce((acc, fase) => {
    const baseDaFase = Array.isArray(
      confrontos?.[fase.chave]
    )
      ? confrontos[fase.chave]
      : Array.from(
          { length: fase.quantidade },
          (_, index) =>
            criarJogo(
              fase.chave,
              index + 1
            )
        );

    const jogosDaFase = Array.isArray(
      jogosSalvos[fase.chave]
    )
      ? jogosSalvos[fase.chave]
      : [];

    const classificadosAntigos =
      Array.isArray(dados[fase.chave])
        ? dados[fase.chave]
        : [];

    acc[fase.chave] = baseDaFase.map(
      (jogoBase, index) => {
        const jogoSalvo =
          jogosDaFase[index] || {};

        return {
          ...jogoBase,
          ...jogoSalvo,
          timeA:
            jogoBase.timeA ||
            jogoSalvo.timeA ||
            "",
          timeB:
            jogoBase.timeB ||
            jogoSalvo.timeB ||
            "",
          fase: fase.chave,
          placarA:
            jogoSalvo.placarA ?? "",
          placarB:
            jogoSalvo.placarB ?? "",
          decididoNosPenaltis: Boolean(
            jogoSalvo.decididoNosPenaltis
          ),
          classificado:
            jogoSalvo.classificado ||
            classificadosAntigos[index] ||
            "",
        };
      }
    );

    return acc;
  }, {});
};

const criarContagem = (itens, total) =>
  Object.values(
    itens.reduce((acc, item) => {
      const valor = normalizarTexto(item);
      if (!valor || valor === "-") return acc;

      const chave = normalizarChave(valor);

      if (!acc[chave]) {
        acc[chave] = {
          valor,
          quantidade: 0,
          percentual: 0,
        };
      }

      acc[chave].quantidade += 1;

      return acc;
    }, {})
  )
    .map((item) => ({
      ...item,
      percentual:
        total > 0
          ? Math.round(
              (item.quantidade / total) *
                100
            )
          : 0,
    }))
    .sort((a, b) => {
      if (
        b.quantidade !== a.quantidade
      ) {
        return (
          b.quantidade - a.quantidade
        );
      }

      return a.valor.localeCompare(
        b.valor
      );
    });

const compararJogos = (jogoA, jogoB) => {
  const aTemPalpite =
    temConteudoJogo(jogoA);
  const bTemPalpite =
    temConteudoJogo(jogoB);

  const mesmoPlacar =
    Boolean(placarChave(jogoA)) &&
    placarChave(jogoA) ===
      placarChave(jogoB);

  const mesmoClassificado =
    Boolean(
      normalizarChave(
        jogoA?.classificado
      )
    ) &&
    normalizarChave(
      jogoA?.classificado
    ) ===
      normalizarChave(
        jogoB?.classificado
      );

  const mesmosPenaltis =
    Boolean(
      jogoA?.decididoNosPenaltis
    ) ===
    Boolean(
      jogoB?.decididoNosPenaltis
    );

  return {
    aTemPalpite,
    bTemPalpite,
    mesmoPlacar,
    mesmoClassificado,
    mesmosPenaltis,
    iguais:
      mesmoPlacar &&
      mesmoClassificado &&
      mesmosPenaltis,
  };
};

function ComparacaoPalpites({ voltar }) {
  const [participantes, setParticipantes] =
    useState([]);
  const [confrontos, setConfrontos] =
    useState(null);
  const [resultados, setResultados] =
    useState(null);
  const [participanteAId, setParticipanteAId] =
    useState("");
  const [participanteBId, setParticipanteBId] =
    useState("");
  const [faseTendencia, setFaseTendencia] =
    useState("oitavas");
  const [jogoTendencia, setJogoTendencia] =
    useState(0);
  const [
    tendenciasAbertas,
    setTendenciasAbertas,
  ] = useState(false);
  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [
        usuariosSnapshot,
        palpitesSnapshot,
        configuracaoSnapshot,
        resultadosSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "usuarios")),
        getDocs(
          collection(db, "palpitesMataMata")
        ),
        getDoc(
          doc(
            db,
            "configuracoes",
            "mataMata"
          )
        ),
        getDoc(
          doc(db, "resultados", "mataMata")
        ),
      ]);

      const usuarios = {};

      usuariosSnapshot.docs.forEach(
        (usuarioDoc) => {
          usuarios[usuarioDoc.id] =
            usuarioDoc.data();
        }
      );

      const confrontosNormalizados =
        configuracaoSnapshot.exists()
          ? normalizarConfrontosOficiais(
              configuracaoSnapshot.data()
            )
          : null;

      const resultadosNormalizados =
        resultadosSnapshot.exists()
          ? normalizarJogos(
              resultadosSnapshot.data(),
              confrontosNormalizados
            )
          : null;

      const palpitesPorUsuario = {};

      palpitesSnapshot.docs.forEach(
        (palpiteDoc) => {
          palpitesPorUsuario[palpiteDoc.id] =
            palpiteDoc.data();
        }
      );

      const lista = usuariosSnapshot.docs.map(
        (usuarioDoc) => {
          const usuario =
            usuarios[usuarioDoc.id] || {};
          const dadosPalpite =
            palpitesPorUsuario[
              usuarioDoc.id
            ] || null;

          return {
            id: usuarioDoc.id,
            nome:
              usuario.apelido ||
              usuario.nome ||
              "Sem nome",
            temPalpite: Boolean(
              dadosPalpite
            ),
            campeao:
              dadosPalpite?.campeao || "",
            jogos: normalizarJogos(
              dadosPalpite || {},
              confrontosNormalizados
            ),
          };
        }
      );

      setConfrontos(
        confrontosNormalizados
      );
      setResultados(
        resultadosNormalizados
      );
      setParticipantes(
        lista.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const participanteA =
    participantes.find(
      (participante) =>
        participante.id === participanteAId
    ) || null;

  const participanteB =
    participantes.find(
      (participante) =>
        participante.id === participanteBId
    ) || null;

  const jogosDaTendencia =
    confrontos?.[faseTendencia] ||
    normalizarJogos({})[
      faseTendencia
    ] ||
    [];

  const resumoComparativo = useMemo(() => {
    if (!participanteA || !participanteB) {
      return null;
    }

    const resumo = {
      placarIgual: 0,
      placarDiferente: 0,
      classificadoIgual: 0,
      classificadoDiferente: 0,
      jogosVaziosA: 0,
      jogosVaziosB: 0,
      campeaoA:
        participanteA.campeao || "",
      campeaoB:
        participanteB.campeao || "",
      mesmoCampeao:
        Boolean(
          normalizarChave(
            participanteA.campeao
          )
        ) &&
        normalizarChave(
          participanteA.campeao
        ) ===
          normalizarChave(
            participanteB.campeao
          ),
    };

    fases.forEach((fase) => {
      const jogosA =
        participanteA.jogos?.[
          fase.chave
        ] || [];
      const jogosB =
        participanteB.jogos?.[
          fase.chave
        ] || [];

      Array.from(
        { length: fase.quantidade },
        (_, index) => index
      ).forEach((index) => {
        const jogoA =
          jogosA[index] || {};
        const jogoB =
          jogosB[index] || {};

        if (!temConteudoJogo(jogoA)) {
          resumo.jogosVaziosA += 1;
        }

        if (!temConteudoJogo(jogoB)) {
          resumo.jogosVaziosB += 1;
        }

        if (
          placarChave(jogoA) &&
          placarChave(jogoB)
        ) {
          if (
            placarChave(jogoA) ===
            placarChave(jogoB)
          ) {
            resumo.placarIgual += 1;
          } else {
            resumo.placarDiferente += 1;
          }
        }

        const classificadoA =
          normalizarChave(
            jogoA.classificado
          );
        const classificadoB =
          normalizarChave(
            jogoB.classificado
          );

        if (
          classificadoA &&
          classificadoB
        ) {
          if (
            classificadoA ===
            classificadoB
          ) {
            resumo.classificadoIgual += 1;
          } else {
            resumo.classificadoDiferente += 1;
          }
        }
      });
    });

    return resumo;
  }, [participanteA, participanteB]);

  const tendenciaAtual = useMemo(() => {
    const total = participantes.filter(
      (participante) =>
        temConteudoJogo(
          participante.jogos?.[
            faseTendencia
          ]?.[jogoTendencia] || {}
        )
    ).length;

    const jogos = participantes.map(
      (participante) =>
        participante.jogos?.[
          faseTendencia
        ]?.[jogoTendencia] || {}
    );

    return {
      total,
      placares: criarContagem(
        jogos.map(formatarPlacar),
        total
      ),
      classificados: criarContagem(
        jogos.map(
          (jogo) => jogo.classificado
        ),
        total
      ),
    };
  }, [
    faseTendencia,
    jogoTendencia,
    participantes,
  ]);

  const selecionarFaseTendencia = (fase) => {
    setFaseTendencia(fase);
    setJogoTendencia(0);
  };

  const renderSelectParticipante = (
    label,
    valor,
    aoAlterar,
    bloquearId
  ) => (
    <label style={selectLabelStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        value={valor}
        onChange={(event) =>
          aoAlterar(event.target.value)
        }
        style={inputStyle}
      >
        <option value="">
          Selecione um participante
        </option>
        {participantes.map(
          (participante) => (
            <option
              key={participante.id}
              value={participante.id}
              disabled={
                participante.id === bloquearId
              }
            >
              {participante.nome}
            </option>
          )
        )}
      </select>
    </label>
  );

  const renderResumoComparativo = () => {
    if (!participanteA || !participanteB) {
      return (
        <div style={cardStyle}>
          Selecione dois participantes para
          comparar os palpites lado a lado.
        </div>
      );
    }

    return (
      <section style={resumoGridStyle}>
        <div style={resumoCardStyle}>
          <span style={labelStyle}>
            Placares iguais
          </span>
          <strong style={numeroStyle}>
            {resumoComparativo.placarIgual}
          </strong>
        </div>

        <div style={resumoCardStyle}>
          <span style={labelStyle}>
            Placares diferentes
          </span>
          <strong style={numeroStyle}>
            {
              resumoComparativo
                .placarDiferente
            }
          </strong>
        </div>

        <div style={resumoCardStyle}>
          <span style={labelStyle}>
            Classificados iguais
          </span>
          <strong style={numeroStyle}>
            {
              resumoComparativo
                .classificadoIgual
            }
          </strong>
        </div>

        <div style={resumoCardStyle}>
          <span style={labelStyle}>
            Classificados diferentes
          </span>
          <strong style={numeroStyle}>
            {
              resumoComparativo
                .classificadoDiferente
            }
          </strong>
        </div>

        <div style={campeaoCardStyle}>
          <span style={labelStyle}>
            Campeao de {participanteA.nome}
          </span>
          <strong style={campeaoNomeStyle}>
            {resumoComparativo.campeaoA ||
              "-"}
          </strong>
        </div>

        <div style={campeaoCardStyle}>
          <span style={labelStyle}>
            Campeao de {participanteB.nome}
          </span>
          <strong style={campeaoNomeStyle}>
            {resumoComparativo.campeaoB ||
              "-"}
          </strong>
        </div>

        <div
          style={
            resumoComparativo.mesmoCampeao
              ? comparacaoOkStyle
              : comparacaoDiferenteStyle
          }
        >
          <strong>
            {resumoComparativo.mesmoCampeao
              ? "Mesmo campeao"
              : "Campeoes diferentes"}
          </strong>
        </div>
      </section>
    );
  };

  const renderPalpite = (
    participante,
    jogo
  ) => (
    <div style={palpiteCardStyle}>
      <strong style={participanteNomeStyle}>
        {participante?.nome || "-"}
      </strong>

      {!temConteudoJogo(jogo) ? (
        <span style={vazioStyle}>
          Jogo sem palpite preenchido.
        </span>
      ) : (
        <>
          <span>
            Placar:{" "}
            <strong>
              {formatarPlacar(jogo)}
            </strong>
          </span>

          <span>
            Classificado:{" "}
            <strong>
              {jogo?.classificado || "-"}
            </strong>
          </span>

          <span>
            {jogo?.decididoNosPenaltis
              ? "Penaltis"
              : "Sem penaltis"}
          </span>
        </>
      )}
    </div>
  );

  const renderResultadoComparacao = (
    comparacao
  ) => {
    if (
      !comparacao.aTemPalpite ||
      !comparacao.bTemPalpite
    ) {
      return (
        <div style={comparacaoVaziaStyle}>
          Comparacao incompleta
        </div>
      );
    }

    if (
      comparacao.mesmoPlacar &&
      comparacao.mesmoClassificado
    ) {
      return (
        <div style={comparacaoOkStyle}>
          Mesmo placar e mesmo classificado
        </div>
      );
    }

    return (
      <div style={comparacaoDiferenteStyle}>
        Palpites diferentes
      </div>
    );
  };

  const renderJogosComparados = () => {
    if (!participanteA || !participanteB) {
      return null;
    }

    return (
      <>
        {fases.map((fase) => (
          <section
            key={fase.chave}
            style={cardStyle}
          >
            <h2 style={cardTituloStyle}>
              {fase.titulo}
            </h2>

            <div style={jogosGridStyle}>
              {Array.from(
                { length: fase.quantidade },
                (_, index) => {
                  const jogoBase =
                    confrontos?.[
                      fase.chave
                    ]?.[index] ||
                    criarJogo(
                      fase.chave,
                      index + 1
                    );
                  const jogoA =
                    participanteA.jogos?.[
                      fase.chave
                    ]?.[index] || {};
                  const jogoB =
                    participanteB.jogos?.[
                      fase.chave
                    ]?.[index] || {};
                  const comparacao =
                    compararJogos(
                      jogoA,
                      jogoB
                    );

                  return (
                    <div
                      key={
                        jogoBase.id ||
                        `${fase.chave}-${index}`
                      }
                      style={jogoCardStyle}
                    >
                      <div
                        style={
                          jogoCabecalhoStyle
                        }
                      >
                        <span
                          style={labelStyle}
                        >
                          Jogo {index + 1}
                        </span>
                        <strong
                          style={
                            jogoNomeStyle
                          }
                        >
                          {jogoBase.timeA ||
                            "Time A"}{" "}
                          x{" "}
                          {jogoBase.timeB ||
                            "Time B"}
                        </strong>
                      </div>

                      <div
                        style={
                          ladoALadoStyle
                        }
                      >
                        {renderPalpite(
                          participanteA,
                          jogoA
                        )}
                        {renderPalpite(
                          participanteB,
                          jogoB
                        )}
                      </div>

                      <div
                        style={
                          detalheComparacaoStyle
                        }
                      >
                        <span>
                          Placar:{" "}
                          <strong>
                            {comparacao.mesmoPlacar
                              ? "igual"
                              : "diferente"}
                          </strong>
                        </span>
                        <span>
                          Classificado:{" "}
                          <strong>
                            {comparacao.mesmoClassificado
                              ? "igual"
                              : "diferente"}
                          </strong>
                        </span>
                        <span>
                          Penaltis:{" "}
                          <strong>
                            {comparacao.mesmosPenaltis
                              ? "igual"
                              : "diferente"}
                          </strong>
                        </span>
                      </div>

                      {renderResultadoComparacao(
                        comparacao
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </section>
        ))}

        <section style={cardStyle}>
          <h2 style={cardTituloStyle}>
            Campeao
          </h2>

          <div style={campeaoComparacaoStyle}>
            <div style={palpiteCardStyle}>
              <strong>
                {participanteA.nome}
              </strong>
              <span>
                {participanteA.campeao ||
                  "-"}
              </span>
            </div>

            <div style={palpiteCardStyle}>
              <strong>
                {participanteB.nome}
              </strong>
              <span>
                {participanteB.campeao ||
                  "-"}
              </span>
            </div>

            <div
              style={
                resumoComparativo.mesmoCampeao
                  ? comparacaoOkStyle
                  : comparacaoDiferenteStyle
              }
            >
              {resumoComparativo.mesmoCampeao
                ? "Mesmo campeao"
                : "Campeoes diferentes"}
            </div>
          </div>
        </section>
      </>
    );
  };

  const renderContagem = (
    titulo,
    lista
  ) => (
    <div style={tendenciaCardStyle}>
      <h3 style={tendenciaTituloStyle}>
        {titulo}
      </h3>

      {lista.length === 0 ? (
        <p style={textoSecundarioStyle}>
          Sem dados suficientes.
        </p>
      ) : (
        <div style={contagemListaStyle}>
          {lista.slice(0, 5).map((item) => (
            <div
              key={`${titulo}-${item.valor}`}
              style={contagemLinhaStyle}
            >
              <strong>{item.valor}</strong>
              <span>
                {item.quantidade} palpite
                {item.quantidade === 1
                  ? ""
                  : "s"}{" "}
                ({item.percentual}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTendencias = () => {
    const jogoBase =
      jogosDaTendencia[jogoTendencia] ||
      criarJogo(
        faseTendencia,
        jogoTendencia + 1
      );
    const resultadoAtual =
      resultados?.[faseTendencia]?.[
        jogoTendencia
      ] || null;

    return (
      <section style={cardStyle}>
        <button
          onClick={() =>
            setTendenciasAbertas(
              (aberto) => !aberto
            )
          }
          style={botaoSecaoStyle}
        >
          Tendencias do Bolao{" "}
          {tendenciasAbertas ? "[fechar]" : "[abrir]"}
        </button>

        {tendenciasAbertas && (
          <div style={tendenciasConteudoStyle}>
            <div style={filtrosStyle}>
              <div style={tabsStyle}>
                {fases.map((fase) => (
                  <button
                    key={fase.chave}
                    onClick={() =>
                      selecionarFaseTendencia(
                        fase.chave
                      )
                    }
                    style={
                      faseTendencia ===
                      fase.chave
                        ? tabAtivaStyle
                        : tabStyle
                    }
                  >
                    {fase.titulo}
                  </button>
                ))}
              </div>

              <select
                value={jogoTendencia}
                onChange={(event) =>
                  setJogoTendencia(
                    Number(
                      event.target.value
                    )
                  )
                }
                style={inputStyle}
              >
                {jogosDaTendencia.map(
                  (jogo, index) => (
                    <option
                      key={
                        jogo.id ||
                        `${faseTendencia}-${index}`
                      }
                      value={index}
                    >
                      Jogo {index + 1}
                    </option>
                  )
                )}
              </select>
            </div>

            <div style={jogoAtualStyle}>
              <span style={labelStyle}>
                Jogo {jogoTendencia + 1}
              </span>
              <strong style={jogoNomeStyle}>
                {jogoBase.timeA || "Time A"} x{" "}
                {jogoBase.timeB || "Time B"}
              </strong>
              {resultadoAtual &&
                temConteudoJogo(
                  resultadoAtual
                ) && (
                  <span
                    style={resultadoStyle}
                  >
                    Oficial:{" "}
                    {formatarPlacar(
                      resultadoAtual
                    )}{" "}
                    | Classificado:{" "}
                    {resultadoAtual.classificado ||
                      "-"}
                  </span>
                )}
            </div>

            <div style={resumoGridStyle}>
              <div
                style={
                  tendenciaDestaqueStyle
                }
              >
                <span style={labelStyle}>
                  Total de palpites
                </span>
                <strong style={numeroStyle}>
                  {tendenciaAtual.total}
                </strong>
              </div>

              {renderContagem(
                "Placares mais repetidos",
                tendenciaAtual.placares
              )}

              {renderContagem(
                "Classificados mais apostados",
                tendenciaAtual.classificados
              )}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Comparador de Participantes
      </h1>

      <button
        onClick={voltar}
        style={botaoVoltarTopoStyle}
      >
        Voltar ao Dashboard
      </button>

      {carregando && (
        <div style={cardStyle}>
          Carregando comparador...
        </div>
      )}

      {!carregando && (
        <>
          {participantes.length < 2 && (
            <div style={cardStyle}>
              Nao ha participantes suficientes
              com palpites do Mata-Mata para
              comparar.
            </div>
          )}

          {participantes.length >= 2 && (
            <>
              <section style={seletoresStyle}>
                {renderSelectParticipante(
                  "Participante A",
                  participanteAId,
                  setParticipanteAId,
                  participanteBId
                )}

                {renderSelectParticipante(
                  "Participante B",
                  participanteBId,
                  setParticipanteBId,
                  participanteAId
                )}
              </section>

              {participanteA &&
                !participanteA.temPalpite && (
                  <div style={cardStyle}>
                    Participante A nao tem
                    palpite Mata-Mata.
                  </div>
                )}

              {participanteB &&
                !participanteB.temPalpite && (
                  <div style={cardStyle}>
                    Participante B nao tem
                    palpite Mata-Mata.
                  </div>
                )}

              {renderResumoComparativo()}
              {renderJogosComparados()}
              {renderTendencias()}
            </>
          )}
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

const cardStyle = {
  backgroundColor: "#181818",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "clamp(16px, 4vw, 20px)",
  marginBottom: "18px",
  boxSizing: "border-box",
};

const seletoresStyle = {
  ...cardStyle,
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const selectLabelStyle = {
  display: "grid",
  gap: "8px",
};

const labelStyle = {
  color: "#cfcfcf",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#111",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px",
};

const resumoGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginBottom: "18px",
};

const resumoCardStyle = {
  backgroundColor: "#181818",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "16px",
  display: "grid",
  gap: "8px",
};

const campeaoCardStyle = {
  ...resumoCardStyle,
  backgroundColor: "#211a05",
  borderColor: "#ffc107",
};

const numeroStyle = {
  color: "#ffd76a",
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1,
};

const campeaoNomeStyle = {
  color: "#ffd76a",
  fontSize: "20px",
  lineHeight: 1.2,
};

const cardTituloStyle = {
  marginTop: 0,
};

const jogosGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "14px",
};

const jogoCardStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "12px",
};

const jogoCabecalhoStyle = {
  display: "grid",
  gap: "4px",
};

const jogoNomeStyle = {
  color: "#ffd76a",
  fontSize: "18px",
  lineHeight: 1.2,
};

const ladoALadoStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const palpiteCardStyle = {
  backgroundColor: "#1b1b1b",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "12px",
  display: "grid",
  gap: "7px",
  minWidth: 0,
};

const participanteNomeStyle = {
  color: "#ffd76a",
  overflowWrap: "anywhere",
};

const vazioStyle = {
  color: "#aaa",
  lineHeight: 1.35,
};

const detalheComparacaoStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "8px",
  color: "#ccc",
  fontSize: "14px",
};

const comparacaoOkStyle = {
  backgroundColor: "#12351f",
  border: "1px solid #198754",
  color: "#9fe6b8",
  borderRadius: "8px",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const comparacaoDiferenteStyle = {
  backgroundColor: "#3a1417",
  border: "1px solid #dc3545",
  color: "#ffc1c7",
  borderRadius: "8px",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const comparacaoVaziaStyle = {
  backgroundColor: "#242424",
  border: "1px solid #444",
  color: "#ccc",
  borderRadius: "8px",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const campeaoComparacaoStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const botaoSecaoStyle = {
  width: "100%",
  backgroundColor: "#343a40",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  textAlign: "left",
  fontSize: "16px",
};

const tendenciasConteudoStyle = {
  marginTop: "16px",
};

const filtrosStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) minmax(160px, 220px)",
  gap: "12px",
  marginBottom: "14px",
};

const tabsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const tabStyle = {
  backgroundColor: "#343a40",
  color: "white",
  border: "none",
  padding: "10px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const tabAtivaStyle = {
  ...tabStyle,
  backgroundColor: "#ffc107",
  color: "#120d00",
};

const jogoAtualStyle = {
  backgroundColor: "#211a05",
  border: "1px solid #ffc107",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "7px",
  marginBottom: "14px",
};

const resultadoStyle = {
  color: "#9fe6b8",
  fontWeight: "bold",
};

const tendenciaCardStyle = {
  backgroundColor: "#181818",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "16px",
  display: "grid",
  gap: "10px",
};

const tendenciaDestaqueStyle = {
  ...tendenciaCardStyle,
  backgroundColor: "#211a05",
  borderColor: "#ffc107",
};

const tendenciaTituloStyle = {
  margin: 0,
  color: "#ffd76a",
};

const textoSecundarioStyle = {
  color: "#bbb",
  lineHeight: 1.4,
};

const contagemListaStyle = {
  display: "grid",
  gap: "8px",
};

const contagemLinhaStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "10px",
};

export default ComparacaoPalpites;
