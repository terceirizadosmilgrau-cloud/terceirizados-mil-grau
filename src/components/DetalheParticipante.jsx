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
          "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          backgroundColor:
            "#1a1a1a",
          borderRadius: "12px",
          padding: "25px",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>
          🏆 {participante.nome}
        </h1>

        <h2>
          {participante.pontos} pts
        </h2>

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