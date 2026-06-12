import { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import ParticipantesTable from "../components/admin/ParticipantesTable";

function Dashboard({
  usuario,
  sair,
  abrirPalpites,
  abrirMataMata,
  abrirResultados,
  abrirRanking,
  abrirCentralPalpites,
  abrirCentralMataMata,
}) {
  const [participantes, setParticipantes] = useState([]);
  const [palpitesLiberados, setPalpitesLiberados] =
    useState(true);

    const [busca, setBusca] =
  useState("");

const [filtro, setFiltro] =
  useState("todos");

  const isSuperAdmin =
    usuario?.email === "ardcost4@icloud.com";

  useEffect(() => {
    carregarConfiguracoes();

    const unsubscribe = onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setParticipantes(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  const participantesFiltrados =
  participantes.filter((p) => {
    const nome =
      (
        p.apelido ||
        p.nome ||
        ""
      ).toLowerCase();

    const buscaOk =
      nome.includes(
        busca.toLowerCase()
      );

    let filtroOk = true;

    if (filtro === "pagos") {
      filtroOk = p.pagamento;
    }

    if (
      filtro === "pendentes"
    ) {
      filtroOk = !p.pagamento;
    }

    if (
      filtro === "admins"
    ) {
      filtroOk =
        p.tipoUsuario ===
        "admin" ||
        p.tipoUsuario ===
        "superadmin";
    }

    if (
      filtro ===
      "participantes"
    ) {
      filtroOk =
        p.tipoUsuario ===
        "participante";
    }

    return (
      buscaOk && filtroOk
    );
  });

  const carregarConfiguracoes =
    async () => {
      try {
        const snapshot = await getDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          )
        );

        if (snapshot.exists()) {
          setPalpitesLiberados(
            snapshot.data()
              .palpitesLiberados
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const alterarStatusPalpites =
    async (status) => {
      try {
        await updateDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          ),
          {
            palpitesLiberados: status,
          }
        );

        setPalpitesLiberados(status);

        alert(
          status
            ? "Palpites liberados."
            : "Palpites encerrados."
        );
      } catch (error) {
        console.error(error);
      }
    };

  const confirmarPagamento = async (
    id,
    status
  ) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          pagamento: status,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const tornarAdmin = async (id) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          tipoUsuario: "admin",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removerAdmin = async (id) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          tipoUsuario: "participante",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const excluirParticipante = async (
    id,
    nome
  ) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir ${nome}?`
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(db, "usuarios", id)
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir participante.");
    }
  };

  const pagos = participantes.filter(
    (p) => p.pagamento
  ).length;

  const pendentes =
    participantes.length - pagos;

  const arrecadacaoPrevista =
    participantes.length * 20;

  const arrecadacaoConfirmada =
    pagos * 20;

    const lider =
  participantes.length > 0
    ? participantes[0]
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  }}
>
        <h1
  style={{
    textAlign: "center",
    margin: 0,
  }}
>
  🏆 Terceirizados Mil Grau
</h1>

        <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    maxWidth: "900px",
  }}
>
          <button
            onClick={abrirPalpites}
            style={botaoAzul}
          >
            ⚽ Palpites da Copa
          </button>

          <button
  onClick={abrirMataMata}
  style={botaoDourado}
>
  🏆 Mata-Mata
</button>

          <button
            onClick={abrirRanking}
            style={botaoVerde}
          >
            🏆 Ranking
          </button>

          {isSuperAdmin && (
            <>
              <button
                onClick={abrirCentralPalpites}
                style={botaoRoxo}
              >
                📊 Central de Palpites
              </button>

              <button
  onClick={
    abrirCentralMataMata
  }
  style={botaoRoxo}
>
  🏆 Central Mata-Mata
</button>

              <button
                onClick={abrirResultados}
                style={botaoLaranja}
              >
                ⚽ Resultados Oficiais
              </button>
            </>
          )}

          <button
            onClick={sair}
            style={botaoVermelho}
          >
            Sair
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>Bem-vindo!</h2>

        <p>
          <strong>Usuário:</strong>{" "}
          {usuario?.email}
        </p>

        <p>
          <strong>Participantes:</strong>{" "}
          {participantes.length}
        </p>

        <p>
          <strong>Pagos:</strong>{" "}
          {pagos}
        </p>

        <p>
          <strong>Pendentes:</strong>{" "}
          {pendentes}
        </p>

        <p>
          <strong>Arrecadação prevista:</strong>{" "}
          R$ {arrecadacaoPrevista.toFixed(2)}
        </p>

        <p>
          <strong>Arrecadação confirmada:</strong>{" "}
          R$ {arrecadacaoConfirmada.toFixed(2)}
        </p>

        {isSuperAdmin && (
          <>
            <p>👑 Super Admin</p>

            <p>
              <strong>
                Status dos Palpites:
              </strong>{" "}
              {palpitesLiberados
                ? "🟢 Aberto"
                : "🔴 Encerrado"}
            </p>

            <div
  style={{
    marginTop: "15px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  }}
>
              <button
                onClick={() =>
                  alterarStatusPalpites(
                    true
                  )
                }
                style={botaoLiberar}
              >
                🔓 Liberar Palpites
              </button>

              <button
                onClick={() =>
                  alterarStatusPalpites(
                    false
                  )
                }
                style={botaoEncerrar}
              >
                🔒 Encerrar Palpites
              </button>
            </div>
          </>
        )}
      </div>

      <div
  style={{
    backgroundColor:
      "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h2>
    🔎 Buscar Participantes
  </h2>

  <input
    type="text"
    placeholder="Buscar por nome ou apelido..."
    value={busca}
    onChange={(e) =>
      setBusca(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      marginBottom: "15px",
    }}
  />

  <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "10px",
  }}
>
    <button
  onClick={() =>
    setFiltro("todos")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "todos"
        ? "#0d6efd"
        : "#343a40",
  }}
>
  Todos
</button>

<button
  onClick={() =>
    setFiltro("pagos")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "pagos"
        ? "#198754"
        : "#343a40",
  }}
>
  Pagos
</button>

<button
  onClick={() =>
    setFiltro("pendentes")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "pendentes"
        ? "#dc3545"
        : "#343a40",
  }}
>
  Pendentes
</button>

<button
  onClick={() =>
    setFiltro("admins")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "admins"
        ? "#6f42c1"
        : "#343a40",
  }}
>
  Admins
</button>

<button
  onClick={() =>
    setFiltro(
      "participantes"
    )
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro ===
      "participantes"
        ? "#fd7e14"
        : "#343a40",
  }}
>
  Participantes
</button>
  </div>

  <p
  style={{
    marginTop: "15px",
    textAlign: "center",
    fontSize: "18px",
  }}
>
  👥 Exibindo: {participantesFiltrados.length} participantes
</p>
</div>

      <ParticipantesTable
  participantes={
    participantesFiltrados
  }
        isSuperAdmin={isSuperAdmin}
        confirmarPagamento={confirmarPagamento}
        tornarAdmin={tornarAdmin}
        removerAdmin={removerAdmin}
        excluirParticipante={excluirParticipante}
      />
    </div>
  );
}

const botaoAzul = {
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoVerde = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoDourado = {
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoRoxo = {
  backgroundColor: "#6f42c1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoLaranja = {
  backgroundColor: "#fd7e14",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoVermelho = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoLiberar = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoEncerrar = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
};

const botaoFiltro = {
  backgroundColor: "#343a40",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Dashboard;