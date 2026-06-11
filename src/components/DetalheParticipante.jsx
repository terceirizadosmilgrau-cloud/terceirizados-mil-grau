function DetalheParticipante({
  participante,
  fechar,
}) {
  if (!participante) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor:
          "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "90%",
          color: "white",
        }}
      >
        <h2>
          📊 {participante.nome}
        </h2>

        {Object.entries(
          participante.detalhes || {}
        ).map(([grupo, pontos]) => (
          <p key={grupo}>
            Grupo {grupo} → {pontos} pts
          </p>
        ))}

        <hr
          style={{
            borderColor: "#333",
            margin: "15px 0",
          }}
        />

        <h3>
          Total: {participante.pontos} pts
        </h3>

        <button
          onClick={fechar}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default DetalheParticipante;