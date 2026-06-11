function DetalheParticipante({
  participante,
  fechar,
}) {
  if (!participante) return null;

  const grupos = Object.keys(
    participante.detalhes || {}
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
        alignItems: "center",
        zIndex: 9999,
        overflowY: "auto",
        padding: "20px",
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
          Total: {participante.pontos} pts
        </h2>

        {grupos.map((grupo) => (
          <div
            key={grupo}
            style={{
              backgroundColor:
                "#262626",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <h3>
              Grupo {grupo}
            </h3>

            <p>
              <strong>
                Pontuação:
              </strong>{" "}
              {
                participante
                  .detalhes[grupo]
                  ?.pontos
              }{" "}
              pts
            </p>

            <div
              style={{
                display: "flex",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h4>Palpite</h4>

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
                  Resultado Oficial
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
        ))}

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
  );
}

export default DetalheParticipante;