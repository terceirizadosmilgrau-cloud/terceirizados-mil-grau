import { useState } from "react";

import {
  formatarResultadoOficial,
  jogoEncerrado,
  obterIndicadoresJogo,
  placarPreenchido,
  textoPreenchido,
} from "../utils/mataMataVisual";

const fasesMataMata = [
  ["Oitavas", "oitavas"],
  ["Quartas", "quartas"],
  ["Semifinal", "semifinal"],
  ["Final", "final"],
];

const normalizarChave = (valor) =>
  textoPreenchido(valor).toLowerCase();

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

const formatarPlacarDetalhado = (jogo) => {
  if (!jogo) return "-";

  return `${jogo.timeA || "Time A"} ${
    jogo.placarA !== undefined &&
    jogo.placarA !== ""
      ? jogo.placarA
      : "-"
  } x ${
    jogo.placarB !== undefined &&
    jogo.placarB !== ""
      ? jogo.placarB
      : "-"
  } ${jogo.timeB || "Time B"}`;
};

const calcularDetalheJogoMataMata = (
  jogoPalpite = {},
  jogoResultado = {}
) => {
  const resultadoComPlacar =
    placarPreenchido(jogoResultado);
  const temClassificadoOficial =
    Boolean(
      normalizarChave(
        jogoResultado.classificado
      )
    );

  const placarExato =
    resultadoComPlacar &&
    placarPreenchido(jogoPalpite) &&
    String(jogoPalpite.placarA).trim() ===
      String(
        jogoResultado.placarA
      ).trim() &&
    String(jogoPalpite.placarB).trim() ===
      String(
        jogoResultado.placarB
      ).trim();

  const resultadoCorreto =
    resultadoComPlacar &&
    resultadoDoJogo(jogoPalpite) &&
    resultadoDoJogo(jogoPalpite) ===
      resultadoDoJogo(jogoResultado);

  const classificadoCorreto =
    temClassificadoOficial &&
    normalizarChave(
      jogoPalpite.classificado
    ) &&
    normalizarChave(
      jogoPalpite.classificado
    ) ===
      normalizarChave(
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

  const criterios = [
    {
      label: "Placar exato",
      pontos: 10,
      acertou: placarExato,
      aplicavel: resultadoComPlacar,
    },
    {
      label: "Resultado correto",
      pontos: 5,
      acertou: resultadoCorreto,
      aplicavel: resultadoComPlacar,
    },
    {
      label: "Classificado correto",
      pontos: 5,
      acertou: classificadoCorreto,
      aplicavel: temClassificadoOficial,
    },
    {
      label: "Penaltis correto",
      pontos: 3,
      acertou: penaltisCorreto,
      aplicavel:
        jogoResultado.decididoNosPenaltis ===
        true,
    },
    {
      label: "Acerto total",
      pontos: 2,
      acertou: acertoTotal,
      aplicavel:
        resultadoComPlacar &&
        temClassificadoOficial,
    },
  ];

  const pontos = criterios.reduce(
    (total, criterio) =>
      total +
      (criterio.acertou
        ? criterio.pontos
        : 0),
    0
  );

  return {
    pontos,
    criterios,
    resultadoInformado:
      resultadoComPlacar ||
      temClassificadoOficial,
    resultadoCompleto:
      resultadoComPlacar &&
      temClassificadoOficial,
  };
};

const renderBadge = (texto, estilo) => (
  <span style={estilo}>{texto}</span>
);

function DetalheParticipante({
  participante,
  fechar,
}) {
  const [
    grupoAberto,
    setGrupoAberto,
  ] = useState(null);
  const [
    gruposAbertos,
    setGruposAbertos,
  ] = useState(false);
  const [
    mataMataAberto,
    setMataMataAberto,
  ] = useState(false);
  const [
    faseMataMataAberta,
    setFaseMataMataAberta,
  ] = useState(null);

  if (!participante) return null;

  const grupos = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ].filter(
    (grupo) =>
      participante.detalhes?.[grupo]
  );

  const detalhesMataMata =
    participante.detalhesMataMata;
  const posicaoModal =
    participante.posicaoModal ||
    participante.posicao;
  const emZonaPremiacao =
    participante.emZonaPremiacao ??
    posicaoModal <= 3;
  const palpiteMataMata =
    participante.palpiteMataMata;
  const resultadoMataMata =
    participante.resultadoMataMata;
  const temJogosMataMata =
    palpiteMataMata?.jogos &&
    resultadoMataMata?.jogos;

  const renderIndicadoresMataMata = (
    jogoPalpite,
    jogoResultado
  ) => {
    if (!jogoEncerrado(jogoResultado)) {
      return (
        <div style={statusBlocoStyle}>
          {renderBadge(
            "Pendente",
            statusPendenteStyle
          )}
        </div>
      );
    }

    const indicadores =
      obterIndicadoresJogo(
        jogoPalpite,
        jogoResultado
      );

    return (
      <div style={indicadoresMataMataStyle}>
        <div style={statusBlocoStyle}>
          {renderBadge(
            "Encerrado",
            statusEncerradoStyle
          )}
        </div>

        <div style={resultadoOficialStyle}>
          Resultado oficial:{" "}
          <strong>
            {formatarResultadoOficial(
              jogoResultado
            )}
          </strong>
        </div>

        <div style={chipsStyle}>
          {renderBadge(
            `${
              indicadores.placar
                ? "OK"
                : "X"
            } Placar`,
            indicadores.placar
              ? chipAcertoStyle
              : chipErroStyle
          )}

          {renderBadge(
            `${
              indicadores.classificado
                ? "OK"
                : "X"
            } Classificado`,
            indicadores.classificado
              ? chipAcertoStyle
              : chipErroStyle
          )}

          {indicadores.compararPenaltis &&
            renderBadge(
              `${
                indicadores.penaltis
                  ? "OK"
                  : "X"
              } Penaltis`,
              indicadores.penaltis
                ? chipAcertoStyle
                : chipErroStyle
            )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="detail-v37-overlay"
      style={overlayStyle}
    >
      <div
        className="detail-v37-panel"
        style={panelStyle}
      >
        <h1 style={tituloStyle}>
          🏆 {participante.nome}
        </h1>

        <section style={resumoStyle}>
          <div style={resumoItemStyle}>
            <span style={labelStyle}>
              Posição
            </span>
            <strong>
              {posicaoModal}º
            </strong>
          </div>

          <div style={resumoItemStyle}>
            <span style={labelStyle}>
              Pontos totais
            </span>
            <strong>
              {participante.pontos}
            </strong>
          </div>

          <div style={resumoItemStyle}>
            <span style={labelStyle}>
              Pontos Mata-Mata
            </span>
            <strong>
              {participante.pontosMataMata ||
                0}
            </strong>
          </div>

          <div style={resumoItemStyle}>
            <span style={labelStyle}>
              Pontos de grupos
            </span>
            <strong>
              {participante.pontosGrupos ||
                0}
            </strong>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={cardTituloStyle}>
            ⚽ Desempenho Mata-Mata
          </h2>

          {detalhesMataMata ? (
            <>
              <p>
                ⚽ Pontos Mata-Mata:{" "}
                <strong>
                  {participante.pontosMataMata ||
                    0}
                </strong>
              </p>

              <div style={faseGridStyle}>
                {fasesMataMata.map(
                  ([label, fase]) => (
                    <div
                      key={fase}
                      style={faseItemStyle}
                    >
                      <span style={labelStyle}>
                        {label}
                      </span>
                      <strong>
                        {detalhesMataMata[
                          fase
                        ] || 0}{" "}
                        pts
                      </strong>
                    </div>
                  )
                )}
              </div>

              <p>
                Campeão:{" "}
                <strong>
                  {detalhesMataMata.campeao ||
                    0}{" "}
                  pts
                </strong>
              </p>
            </>
          ) : (
            <p>
              Nenhum detalhe de Mata-Mata
              disponível.
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={cardTituloStyle}>
            📊 Estatísticas Gerais
          </h2>

          <p>
            📉 Diferença para líder:{" "}
            {participante.diferencaLider} pts
          </p>
          <p>
            🎯 Acertos exatos:{" "}
            {participante.acertosExatos}
          </p>
          <p>
            ⚽ Acertos parciais:{" "}
            {participante.acertosParciais}
          </p>
          <p>
            📈 Aproveitamento:{" "}
            {participante.aproveitamento}%
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={cardTituloStyle}>
            🏅 Medalhas
          </h3>

          {participante.medalhas?.length >
          0 ? (
            participante.medalhas.map(
              (medalha, index) => (
                <p
                  key={index}
                  style={medalhaStyle}
                >
                  {medalha}
                </p>
              )
            )
          ) : (
            <p>Nenhuma medalha.</p>
          )}
        </section>

        <section style={cardStyle}>
          {emZonaPremiacao ? (
            <p>
              Dentro da zona de premiação. Premiação projetada: R${" "}
              {participante.premiacao.toFixed(
                2
              )}
            </p>
          ) : (
            <p>
              ❌ Fora da zona de premiação
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <div
            className="detail-v37-header"
            onClick={() =>
              setMataMataAberto(
                (aberto) => !aberto
              )
            }
            style={sectionHeaderStyle}
          >
            <strong>
              {mataMataAberto ? "▲" : "▼"}{" "}
              Detalhamento Mata-Mata
            </strong>
            <span>
              {participante.pontosMataMata || 0} pts
            </span>
          </div>

          {!temJogosMataMata ? (
            <p>
              Nenhum detalhe de jogos do
              Mata-Mata disponivel.
            </p>
          ) : (
            <div style={mataMataWrapperStyle}>
              <div style={faseGridStyle}>
                {fasesMataMata.map(
                  ([label, fase]) => (
                    <button
                      key={fase}
                      type="button"
                      onClick={() => {
                        setMataMataAberto(true);
                        setFaseMataMataAberta(
                          faseMataMataAberta ===
                            fase
                            ? null
                            : fase
                        );
                      }}
                      style={faseResumoButtonStyle}
                    >
                      <span>{label}</span>
                      <strong>
                        {detalhesMataMata?.[
                          fase
                        ] || 0}{" "}
                        pts
                      </strong>
                    </button>
                  )
                )}
              </div>

              {mataMataAberto &&
                fasesMataMata.map(
                  ([label, fase]) => {
                    const faseAberta =
                      faseMataMataAberta ===
                      fase;
                    const palpitesDaFase =
                      palpiteMataMata.jogos[
                        fase
                      ] || [];
                    const resultadosDaFase =
                      resultadoMataMata.jogos[
                        fase
                      ] || [];
                    const quantidadeJogos =
                      Math.max(
                        palpitesDaFase.length,
                        resultadosDaFase.length
                      );

                    if (quantidadeJogos === 0) {
                      return null;
                    }

                    return (
                      <div
                        key={fase}
                        style={faseDetalheStyle}
                      >
                        <div
                          className="detail-v37-header"
                          onClick={() =>
                            setFaseMataMataAberta(
                              faseAberta
                                ? null
                                : fase
                            )
                          }
                          style={faseDetalheHeaderStyle}
                        >
                          <strong>
                            {faseAberta
                              ? "▲"
                              : "▼"}{" "}
                            {label}
                          </strong>
                          <span>
                            {detalhesMataMata?.[
                              fase
                            ] || 0}{" "}
                            pts
                          </span>
                        </div>

                        {faseAberta && (
                          <div
                            style={
                              jogosMataMataGridStyle
                            }
                          >
                            {Array.from(
                              {
                                length:
                                  quantidadeJogos,
                              },
                              (_, index) => {
                                const jogoPalpite =
                                  palpitesDaFase[
                                    index
                                  ] || {};
                                const jogoResultado =
                                  resultadosDaFase[
                                    index
                                  ] || {};
                                const detalhe =
                                  calcularDetalheJogoMataMata(
                                    jogoPalpite,
                                    jogoResultado
                                  );

                                return (
                                  <div
                                    key={
                                      jogoPalpite.id ||
                                      jogoResultado.id ||
                                      `${fase}-${index}`
                                    }
                                    style={
                                      jogoDetalheStyle
                                    }
                                  >
                                    <strong>
                                      Jogo{" "}
                                      {index + 1} -{" "}
                                      {jogoResultado.timeA ||
                                        jogoPalpite.timeA ||
                                        "Time A"}{" "}
                                      x{" "}
                                      {jogoResultado.timeB ||
                                        jogoPalpite.timeB ||
                                        "Time B"}
                                    </strong>

                                    <p>
                                      Palpite:{" "}
                                      {formatarPlacarDetalhado(
                                        jogoPalpite
                                      )}
                                    </p>
                                    <p>
                                      Classificado:{" "}
                                      <strong>
                                        {jogoPalpite.classificado ||
                                          "-"}
                                      </strong>
                                    </p>

                                    {renderIndicadoresMataMata(
                                      jogoPalpite,
                                      jogoResultado,
                                      detalhe
                                    )}

                                    {detalhe.resultadoCompleto && (
                                      <p
                                        style={
                                          pontosJogoStyle
                                        }
                                      >
                                        Pontos:{" "}
                                        {detalhe.pontos}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <div
            className="detail-v37-header"
            onClick={() =>
              setGruposAbertos(
                (aberto) => !aberto
              )
            }
            style={sectionHeaderStyle}
          >
            <strong>
              {gruposAbertos ? "▲" : "▼"} 📦
              Fase de Grupos
            </strong>
            <span>{grupos.length} grupos</span>
          </div>

          {gruposAbertos && (
            <div style={gruposWrapperStyle}>
              {grupos.map((grupo) => {
                const aberto =
                  grupoAberto === grupo;
                const pontosGrupo =
                  participante.detalhes[
                    grupo
                  ]?.pontos || 0;

                let statusGrupo = "🔴";

                if (pontosGrupo >= 30) {
                  statusGrupo = "🟢";
                } else if (
                  pontosGrupo >= 15
                ) {
                  statusGrupo = "🟡";
                }

                return (
                  <div
                    key={grupo}
                    style={grupoStyle}
                  >
                    <div
                      className="detail-v37-header"
                      onClick={() =>
                        setGrupoAberto(
                          aberto
                            ? null
                            : grupo
                        )
                      }
                      style={
                        grupoHeaderStyle
                      }
                    >
                      <strong>
                        {aberto
                          ? "▲"
                          : "▼"}{" "}
                        {statusGrupo} Grupo{" "}
                        {grupo}
                      </strong>

                      <span>
                        {
                          participante
                            .detalhes[
                            grupo
                          ]?.pontos
                        }{" "}
                        pts
                      </span>
                    </div>

                    {aberto && (
                      <div
                        style={
                          grupoConteudoStyle
                        }
                      >
                        <div
                          style={
                            grupoMetricasStyle
                          }
                        >
                          <span>
                            🏆 Pontuação:{" "}
                            {
                              participante
                                .detalhes[
                                grupo
                              ]?.pontos
                            }{" "}
                            pts
                          </span>

                          <span>
                            🎯 Acertos Exatos:{" "}
                            {participante
                              .detalhes[
                              grupo
                            ]?.acertosExatos ??
                              0}
                          </span>

                          <span>
                            ⚽ Acertos
                            Parciais:{" "}
                            {participante
                              .detalhes[
                              grupo
                            ]
                              ?.acertosParciais ??
                              0}
                          </span>
                        </div>

                        <div
                          className="detail-v37-grid"
                          style={gridStyle}
                        >
                          <div>
                            <h4>📝 Palpite</h4>

                            <p>
                              1º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.palpite
                                  ?.primeiro
                              }
                            </p>
                            <p>
                              2º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.palpite
                                  ?.segundo
                              }
                            </p>
                            <p>
                              3º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.palpite
                                  ?.terceiro
                              }
                            </p>
                            <p>
                              4º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.palpite
                                  ?.quarto
                              }
                            </p>
                          </div>

                          <div>
                            <h4>
                              🏆 Resultado Oficial
                            </h4>

                            <p>
                              1º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.resultado
                                  ?.primeiro
                              }
                            </p>
                            <p>
                              2º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.resultado
                                  ?.segundo
                              }
                            </p>
                            <p>
                              3º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.resultado
                                  ?.terceiro
                              }
                            </p>
                            <p>
                              4º{" "}
                              {
                                participante
                                  .detalhes[
                                  grupo
                                ]?.resultado
                                  ?.quarto
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div style={fecharWrapperStyle}>
          <button
            onClick={fechar}
            style={botaoFecharStyle}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  zIndex: 9999,
  overflowY: "auto",
  padding: "clamp(12px, 4vw, 20px)",
  paddingTop: "clamp(16px, 5vw, 40px)",
  boxSizing: "border-box",
};

const panelStyle = {
  width: "min(900px, 100%)",
  maxWidth: "100%",
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  padding: "clamp(16px, 4vw, 25px)",
  color: "white",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const tituloStyle = {
  fontSize: "clamp(26px, 6vw, 42px)",
  lineHeight: 1.15,
};

const resumoStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "10px",
  marginBottom: "15px",
};

const resumoItemStyle = {
  backgroundColor: "#262626",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "12px",
  display: "grid",
  gap: "5px",
};

const labelStyle = {
  color: "#bbb",
  fontSize: "13px",
};

const cardStyle = {
  backgroundColor: "#222",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
};

const cardTituloStyle = {
  marginTop: 0,
};

const faseGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "8px",
  marginBottom: "12px",
};

const faseItemStyle = {
  backgroundColor: "#181818",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "10px",
  display: "grid",
  gap: "4px",
};

const faseResumoButtonStyle = {
  backgroundColor: "#181818",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "10px",
  color: "white",
  display: "grid",
  gap: "4px",
  textAlign: "left",
  cursor: "pointer",
};

const mataMataWrapperStyle = {
  display: "grid",
  gap: "14px",
};

const faseDetalheStyle = {
  backgroundColor: "#181818",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "12px",
};

const faseDetalheTituloStyle = {
  marginTop: 0,
  color: "#ffc107",
};

const faseDetalheHeaderStyle = {
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
  padding: "2px 0 10px",
};

const jogosMataMataGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const jogoDetalheStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "12px",
  display: "grid",
  gap: "8px",
  lineHeight: 1.35,
};

const pontosJogoStyle = {
  color: "#ffc107",
  fontWeight: "bold",
};

const indicadoresMataMataStyle = {
  borderTop: "1px solid #242424",
  paddingTop: "10px",
  display: "grid",
  gap: "8px",
};

const statusBlocoStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  alignItems: "center",
};

const statusBaseStyle = {
  borderRadius: "6px",
  padding: "4px 7px",
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: 1.2,
};

const statusPendenteStyle = {
  ...statusBaseStyle,
  backgroundColor: "#262626",
  border: "1px solid #3a3a3a",
  color: "#cfcfcf",
};

const statusEncerradoStyle = {
  ...statusBaseStyle,
  backgroundColor: "#1d2a22",
  border: "1px solid #34513c",
  color: "#bfe7c9",
};

const resultadoOficialStyle = {
  color: "#cfcfcf",
  fontSize: "13px",
  lineHeight: 1.4,
};

const chipsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const chipBaseStyle = {
  borderRadius: "6px",
  padding: "4px 7px",
  fontSize: "12px",
  lineHeight: 1.2,
};

const chipAcertoStyle = {
  ...chipBaseStyle,
  backgroundColor: "#17251b",
  border: "1px solid #2d5a38",
  color: "#a9d8b5",
};

const chipErroStyle = {
  ...chipBaseStyle,
  backgroundColor: "#2a1719",
  border: "1px solid #5b3035",
  color: "#e6a8ae",
};

const medalhaStyle = {
  fontWeight: "bold",
  color: "#ffc107",
  margin: "5px 0",
};

const sectionHeaderStyle = {
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const gruposWrapperStyle = {
  marginTop: "12px",
};

const grupoStyle = {
  backgroundColor: "#262626",
  borderRadius: "10px",
  marginBottom: "12px",
  overflow: "hidden",
};

const grupoHeaderStyle = {
  padding: "15px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const grupoConteudoStyle = {
  padding: "0 15px 15px 15px",
  borderTop: "1px solid #444",
};

const grupoMetricasStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  marginTop: "15px",
  marginBottom: "15px",
  flexWrap: "wrap",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const fecharWrapperStyle = {
  textAlign: "center",
};

const botaoFecharStyle = {
  marginTop: "20px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
};

export default DetalheParticipante;
