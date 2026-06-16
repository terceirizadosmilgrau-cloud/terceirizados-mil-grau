import {
  useEffect,
  useState,
} from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

const fases = [
  {
    chave: "oitavas",
    titulo: "Oitavas",
  },
  {
    chave: "quartas",
    titulo: "Quartas",
  },
  {
    chave: "semifinal",
    titulo: "Semifinal",
  },
  {
    chave: "final",
    titulo: "Final",
  },
];

function CentralMataMata({ voltar }) {
  const [lista, setLista] =
    useState([]);

  const [busca, setBusca] =
    useState("");

  const [estatisticas, setEstatisticas] =
    useState({
      campeao: [],
      oitavas: [],
      quartas: [],
      semifinal: [],
      final: [],
    });

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const usuariosSnapshot =
        await getDocs(
          collection(db, "usuarios")
        );

      const palpitesSnapshot =
        await getDocs(
          collection(
            db,
            "palpitesMataMata"
          )
        );

      const usuarios = {};

      usuariosSnapshot.docs.forEach(
        (doc) => {
          usuarios[doc.id] =
            doc.data();
        }
      );

      const dados =
        palpitesSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            nome:
              usuarios[doc.id]
                ?.apelido ||
              usuarios[doc.id]
                ?.nome ||
              "Sem nome",
            ...doc.data(),
          })
        );

      const top3Escolhidos = (
        listaValores
      ) => {
        const contador = {};

        listaValores.forEach(
          (item) => {
            if (!item) return;

            contador[item] =
              (contador[item] || 0) + 1;
          }
        );

        return Object.entries(
          contador
        )
          .sort(
            (a, b) =>
              b[1] - a[1]
          )
          .slice(0, 3);
      };

      setEstatisticas({
        campeao:
          top3Escolhidos(
            dados.map(
              (p) => p.campeao
            )
          ),

        oitavas:
          top3Escolhidos(
            dados.flatMap(
              (p) =>
                p.oitavas || []
            )
          ),

        quartas:
          top3Escolhidos(
            dados.flatMap(
              (p) =>
                p.quartas || []
            )
          ),

        semifinal:
          top3Escolhidos(
            dados.flatMap(
              (p) =>
                p.semifinal || []
            )
          ),

        final:
          top3Escolhidos(
            dados.flatMap(
              (p) =>
                p.final || []
            )
          ),
      });

      setLista(
        dados.sort((a, b) =>
          a.nome.localeCompare(
            b.nome
          )
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const listaFiltrada =
    lista.filter((item) =>
      item.nome
        .toLowerCase()
        .includes(
          busca.toLowerCase()
        )
    );

  const renderBadges = (
    listaValores = []
  ) => (
    <div style={badgesStyle}>
      {listaValores.map(
        (item, index) => (
          <span
            key={`${item}-${index}`}
            style={badgeStyle}
          >
            {item.toUpperCase()}
          </span>
        )
      )}
    </div>
  );

  const renderJogos = (
    participante,
    fase
  ) => {
    const jogos =
      participante.jogos?.[fase.chave];

    if (
      !Array.isArray(jogos) ||
      jogos.length === 0
    ) {
      return renderBadges(
        participante[fase.chave] ||
          []
      );
    }

    return (
      <div style={jogosStyle}>
        {jogos.map(
          (jogo, index) => (
            <div
              key={
                jogo.id ||
                `${fase.chave}-${index}`
              }
              style={jogoStyle}
            >
              <strong>
                Jogo {index + 1}
              </strong>

              <span>
                {jogo.timeA || "-"}{" "}
                {jogo.placarA || "0"} x{" "}
                {jogo.placarB || "0"}{" "}
                {jogo.timeB || "-"}
              </span>

              <small>
                Classificado:{" "}
                {jogo.classificado ||
                  "-"}
              </small>

              {jogo.decididoNosPenaltis && (
                <small>
                  Decidido nos penaltis
                </small>
              )}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Central Mata-Mata
      </h1>

      <button
        onClick={voltar}
        style={botaoVoltarTopo}
      >
        Voltar ao Dashboard
      </button>

      <div style={estatisticasStyle}>
        <h2>Estatisticas Gerais</h2>

        <h3>Campeoes Mais Apostados</h3>
        {estatisticas.campeao.map(
          ([nome, qtd], i) => (
            <p key={nome}>
              <strong>
                {i + 1}o
              </strong>{" "}
              {nome.toUpperCase()} ({qtd})
            </p>
          )
        )}

        {fases.map((fase) => (
          <div key={fase.chave}>
            <h3>{fase.titulo}</h3>
            {estatisticas[
              fase.chave
            ].map(
              ([nome, qtd], i) => (
                <p key={nome}>
                  <strong>
                    {i + 1}o
                  </strong>{" "}
                  {nome.toUpperCase()}{" "}
                  ({qtd})
                </p>
              )
            )}
          </div>
        ))}
      </div>

      <div style={buscaStyle}>
        <input
          type="text"
          placeholder="Buscar participante..."
          value={busca}
          onChange={(e) =>
            setBusca(
              e.target.value
            )
          }
          style={inputBuscaStyle}
        />

        <p style={{ marginTop: "10px" }}>
          Participantes:{" "}
          {listaFiltrada.length}
        </p>
      </div>

      {listaFiltrada.map(
        (p) => (
          <div
            key={p.id}
            style={participanteStyle}
          >
            <h2 style={nomeStyle}>
              {p.nome}
            </h2>

            <div style={gridStyle}>
              <div>
                <h3>Campeao</h3>
                {renderBadges([
                  p.campeao,
                ].filter(Boolean))}
              </div>

              {fases.map((fase) => (
                <div key={fase.chave}>
                  <h3>{fase.titulo}</h3>
                  {renderJogos(
                    p,
                    fase
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

const paginaStyle = {
  minHeight: "100vh",
  backgroundColor: "#0d0d0d",
  color: "white",
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  padding: "clamp(16px, 4vw, 30px)",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const tituloStyle = {
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1.15,
};

const botaoVoltarTopo = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "25px",
  fontWeight: "bold",
  maxWidth: "100%",
};

const estatisticasStyle = {
  backgroundColor: "#1a1a1a",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: "8px",
  marginBottom: "25px",
  maxWidth: "700px",
  width: "100%",
  boxSizing: "border-box",
  margin: "0 auto 25px",
  textAlign: "center",
};

const buscaStyle = {
  marginBottom: "20px",
  textAlign: "center",
};

const inputBuscaStyle = {
  padding: "10px",
  width: "min(100%, 300px)",
  borderRadius: "8px",
  border: "none",
  boxSizing: "border-box",
  fontSize: "16px",
};

const participanteStyle = {
  backgroundColor: "#1a1a1a",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: "8px",
  marginBottom: "15px",
  textAlign: "center",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const nomeStyle = {
  color: "#ffc107",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "clamp(12px, 3vw, 20px)",
  marginTop: "20px",
  textAlign: "center",
};

const badgesStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "8px",
  marginBottom: "15px",
  maxWidth: "100%",
};

const badgeStyle = {
  backgroundColor: "#343a40",
  color: "white",
  padding: "4px 8px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "bold",
  maxWidth: "100%",
  overflowWrap: "anywhere",
};

const jogosStyle = {
  display: "grid",
  gap: "8px",
  marginTop: "8px",
};

const jogoStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "10px",
  display: "grid",
  gap: "6px",
  lineHeight: 1.35,
};

export default CentralMataMata;
