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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🏆 Terceirizados Mil Grau</h1>

        <div>
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
                marginTop: "10px",
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

      <ParticipantesTable
        participantes={participantes}
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
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoVerde = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoDourado = {
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoRoxo = {
  backgroundColor: "#6f42c1",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoLaranja = {
  backgroundColor: "#fd7e14",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoVermelho = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
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

export default Dashboard;