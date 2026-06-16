import { useState } from "react";

const fasesMataMata = [
  ["Oitavas", "oitavas"],
  ["Quartas", "quartas"],
  ["Semifinal", "semifinal"],
  ["Final", "final"],
];

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
              {participante.posicao}º
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
          {participante.premiacao > 0 ? (
            <p>
              💰 Premiação projetada: R${" "}
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
