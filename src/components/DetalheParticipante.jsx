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
        padding: "20px",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          width: "900px",
          maxWidth: "100%",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "25px",
          color: "white",
        }}
      >
        <h1>
          🏆 {participante.nome}
        </h1>

        <h2>
          {participante.pontos} pts
        </h2>

        <p>
          📍 Posição:{" "}
          {participante.posicao}º
        </p>

        <p>
          📊 Diferença para o líder:{" "}
          {participante.diferencaLider} pts
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
                }}
              >
                <strong>
                  {aberto
                    ? "▲"
                    : "▼"}{" "}
                  Grupo {grupo}
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
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "20px",
                      marginTop: "15px",
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