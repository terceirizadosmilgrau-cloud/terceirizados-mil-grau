import { useState } from "react";

function DetalheParticipante({
  participante,
  fechar,
}) {
  const [
    grupoAberto,
    setGrupoAberto,
  ] = useState("A");

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

  return (
    <div
      className="detail-v37-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor:
          "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 9999,
        overflowY: "auto",
        padding: "clamp(12px, 4vw, 20px)",
        paddingTop: "clamp(16px, 5vw, 40px)",
        boxSizing: "border-box",
      }}
    >
      <div
        className="detail-v37-panel"
        style={{
          width: "min(900px, 100%)",
          maxWidth: "100%",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "clamp(16px, 4vw, 25px)",
          color: "white",
          boxSizing: "border-box",
          overflowWrap: "anywhere",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(26px, 6vw, 42px)",
            lineHeight: 1.15,
          }}
        >
          🏆 {participante.nome}
        </h1>

        <div
  style={{
    backgroundColor: "#262626",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  }}
>
  <h2
    style={{
      margin: 0,
    }}
  >
    📊 Estatísticas Gerais
  </h2>
</div>

       <div
  style={{
    backgroundColor: "#222",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  }}
>
  <p>
  🏆 Pontos Totais:
  {" "}
  {participante.pontos}
</p>

<p>
  🏆 Pontos Grupos:
  {" "}
  {participante.pontosGrupos || 0}
</p>

<p>
  ⚽ Pontos Mata-Mata:
  {" "}
  {participante.pontosMataMata || 0}
</p>

  <p>
    📍 Posição:
    {" "}
    {participante.posicao}º
  </p>

  <p>
    📊 Diferença para líder:
    {" "}
    {participante.diferencaLider}
    {" "}
    pts
  </p>

  <p>
    🎯 Acertos exatos:
    {" "}
    {participante.acertosExatos}
  </p>

  <p>
    ⚽ Acertos parciais:
    {" "}
    {participante.acertosParciais}
  </p>

  <p>
    📈 Aproveitamento:
    {" "}
    {participante.aproveitamento}
    %
  </p>
</div>
        
<div
  style={{
    backgroundColor: "#222",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  }}
>
  <h3>
    🏅 Medalhas
  </h3>

  {participante.medalhas?.map(
    (medalha, index) => (
      <p
        key={index}
        style={{
          fontWeight: "bold",
          color: "#ffc107",
          margin: "5px 0",
        }}
      >
        {medalha}
      </p>
    )
  )}
</div>

{participante.detalhesMataMata && (
  <div
    style={{
      backgroundColor: "#222",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "15px",
    }}
  >
    <h3>
      🏆 Mata-Mata
    </h3>

    <p>
      ⚽ Pontos Mata-Mata:
      {" "}
      {
        participante.pontosMataMata
      }
    </p>

    <p>
      Oitavas:
      {" "}
      {
        participante
          .detalhesMataMata
          .oitavas
      }
      {" "}pts
    </p>

    <p>
      Quartas:
      {" "}
      {
        participante
          .detalhesMataMata
          .quartas
      }
      {" "}pts
    </p>

    <p>
      Semifinal:
      {" "}
      {
        participante
          .detalhesMataMata
          .semifinal
      }
      {" "}pts
    </p>

    <p>
      Final:
      {" "}
      {
        participante
          .detalhesMataMata
          .final
      }
      {" "}pts
    </p>

    <p>
      Campeão:
      {" "}
      {
        participante
          .detalhesMataMata
          .campeao
      }
      {" "}pts
    </p>
  </div>
)}

        {participante.premiacao >
        0 ? (
          <p>
            💰 Premiação projetada:
            {" "}
            R$
            {" "}
            {participante.premiacao.toFixed(
              2
            )}
          </p>
        ) : (
          <p>
            ❌ Fora da zona de
            premiação
          </p>
        )}

        <hr
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            borderColor: "#333",
          }}
        />

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
              style={{
                backgroundColor:
                  "#262626",
                borderRadius: "10px",
                marginBottom: "12px",
                overflow: "hidden",
              }}
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
                style={{
                  padding: "15px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
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
    style={{
      padding:
        "0 15px 15px 15px",
      borderTop:
        "1px solid #444",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        marginTop: "15px",
        marginBottom: "15px",
        flexWrap: "wrap",
      }}
    >
      <span>
        🏆 Pontuação:{" "}
        {participante.detalhes[grupo]?.pontos} pts
      </span>

      <span>
        🎯 Acertos Exatos:{" "}
        {participante.detalhes[grupo]?.acertosExatos ?? 0}
      </span>

      <span>
        ⚽ Acertos Parciais:{" "}
        {participante.detalhes[grupo]?.acertosParciais ?? 0}
      </span>
    </div>

    <div
      className="detail-v37-grid"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
      }}
    
                  >
                    <div>
                      <h4>
                        📝 Palpite
                      </h4>

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
                        🏆 Resultado
                        Oficial
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

        <div
          style={{
            textAlign: "center",
          }}
        >
          <button
            onClick={fechar}
            style={{
              marginTop: "20px",
              backgroundColor:
                "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalheParticipante;
