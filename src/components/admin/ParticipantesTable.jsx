function ParticipantesTable({
  participantes,
  isSuperAdmin,
  isAdmin,
  confirmarPagamento,
  tornarAdmin,
  removerAdmin,
  excluirParticipante,
}) {
  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        padding: "25px",
        borderRadius: "12px",
      }}
    >
      <h2>Participantes</h2>

     <div
  style={{
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    width: "100%",
  }}
>
  <table
    style={{
      width: "100%",
      minWidth: "900px",
      marginTop: "20px",
      borderCollapse: "collapse",
    }}
  >
        <thead>
          <tr>
            <th style={th}>Nome</th>
            <th style={th}>Apelido</th>
            <th style={th}>Perfil</th>
            <th style={th}>Pagamento</th>
            <th style={th}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {participantes.map((p) => (
            <tr key={p.id}>
              <td style={td}>{p.nome}</td>

              <td style={td}>{p.apelido}</td>

              <td style={td}>
                {p.tipoUsuario === "superadmin"
                  ? "👑 SuperAdmin"
                  : p.tipoUsuario === "admin"
                  ? "🛡️ Admin"
                  : "👤 Participante"}
              </td>

              <td style={td}>
                {p.pagamento
                  ? "✅ Pago"
                  : "❌ Pendente"}
              </td>

              <td style={td}>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "120px",
    }}
  >
    {(isAdmin || isSuperAdmin) && (
<>
                    {!p.pagamento && (
                      <button
                        style={botaoVerde}
                        onClick={() =>
                          confirmarPagamento(
                            p.id,
                            true
                          )
                        }
                      >
                        Confirmar
                      </button>
                    )}

                    {p.pagamento && (
                      <button
                        style={botaoLaranja}
                        onClick={() =>
                          confirmarPagamento(
                            p.id,
                            false
                          )
                        }
                      >
                        Pendente
                      </button>
                    )}

                    {isSuperAdmin &&
 p.tipoUsuario ===
  "participante" && (
                      <button
                        style={botaoAzul}
                        onClick={() =>
                          tornarAdmin(p.id)
                        }
                      >
                        Tornar Admin
                      </button>
                    )}

                    {isSuperAdmin &&
 p.tipoUsuario ===
  "admin" && (
                      <button
                        style={botaoVermelho}
                        onClick={() =>
                          removerAdmin(p.id)
                        }
                      >
                        Remover Admin
                      </button>
                    )}

                                         {isSuperAdmin &&
 p.tipoUsuario !==
  "superadmin" && (
                      <button
                        style={botaoExcluir}
                        onClick={() =>
                          excluirParticipante(
                            p.id,
                            p.nome
                          )
                        }
                      >
                        🗑 Excluir
                      </button>
                    )}
                  </>
)}
  </div>
</td>
            </tr>
          ))}
               </tbody>
      </table>
    </div>

  </div>
);
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #444",
  padding: "12px",
};

const td = {
  borderBottom: "1px solid #333",
  padding: "12px",
};

const botaoVerde = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  width: "100%",
  fontSize: "12px",
  cursor: "pointer",
};

const botaoLaranja = {
  backgroundColor: "#fd7e14",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  width: "100%",
  fontSize: "12px",
  cursor: "pointer",
};

const botaoAzul = {
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  width: "100%",
  fontSize: "12px",
  cursor: "pointer",
};

const botaoVermelho = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  width: "100%",
  fontSize: "12px",
  cursor: "pointer",
};

const botaoExcluir = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  width: "100%",
  fontSize: "12px",
  cursor: "pointer",
};

export default ParticipantesTable;