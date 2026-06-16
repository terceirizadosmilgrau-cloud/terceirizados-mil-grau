import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function CentralPalpites({ voltar }) {
  const [palpites, setPalpites] = useState([]);
  const [busca, setBusca] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] =
    useState("TODOS");
  const [ordem, setOrdem] = useState("AZ");
  const [expandidos, setExpandidos] =
    useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    carregarPalpites();
  }, []);

  const carregarPalpites = async () => {
    try {
      const usuariosSnapshot =
        await getDocs(
          collection(db, "usuarios")
        );

      const palpitesSnapshot =
        await getDocs(
          collection(db, "palpites")
        );

      const usuarios = {};

      usuariosSnapshot.docs.forEach(
        (doc) => {
          usuarios[doc.id] = doc.data();
        }
      );

      const lista = palpitesSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          usuario:
            usuarios[doc.id]?.apelido ||
            usuarios[doc.id]?.nome ||
            "Desconhecido",
          ...doc.data(),
        })
      );

      setPalpites(lista);
    } catch (error) {
      console.error(error);
    }
  };

  const alternarExpandido = (id) => {
    setExpandidos((anterior) => ({
      ...anterior,
      [id]: !anterior[id],
    }));
  };

  let listaFiltrada = [...palpites];

  if (busca.trim() !== "") {
    listaFiltrada = listaFiltrada.filter(
      (p) =>
        p.usuario
          ?.toLowerCase()
          .includes(
            busca.toLowerCase()
          )
    );
  }

  if (
    grupoSelecionado !== "TODOS"
  ) {
    listaFiltrada =
      listaFiltrada.filter(
        (p) =>
          p[grupoSelecionado]
      );
  }

  listaFiltrada.sort((a, b) => {
    if (ordem === "AZ") {
      return a.usuario.localeCompare(
        b.usuario
      );
    }

    return b.usuario.localeCompare(
      a.usuario
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>
        📊 Central de Palpites
      </h1>

      <button
        onClick={voltar}
        style={botaoVoltar}
      >
        Voltar
      </button>

      <div style={filtros}>
        <input
          type="text"
          placeholder="Buscar participante..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          style={input}
        />

        <select
          value={grupoSelecionado}
          onChange={(e) =>
            setGrupoSelecionado(
              e.target.value
            )
          }
          style={select}
        >
          <option value="TODOS">
            Todos os grupos
          </option>

          <option value="A">
            Grupo A
          </option>

          <option value="B">
            Grupo B
          </option>

          <option value="C">
            Grupo C
          </option>

          <option value="D">
            Grupo D
          </option>

          <option value="E">
            Grupo E
          </option>

          <option value="F">
            Grupo F
          </option>
        </select>

        <select
          value={ordem}
          onChange={(e) =>
            setOrdem(
              e.target.value
            )
          }
          style={select}
        >
          <option value="AZ">
            Nome A → Z
          </option>

          <option value="ZA">
            Nome Z → A
          </option>
        </select>
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        👥 Participantes exibidos:{" "}
        {listaFiltrada.length}
      </div>

      {listaFiltrada.map((p) => (
        <div
          key={p.id}
          style={card}
        >
          <div
            style={cabecalhoParticipante}
          >
            <h2>
              👤 {p.usuario}
            </h2>

            <button
              onClick={() =>
                alternarExpandido(
                  p.id
                )
              }
              style={
                botaoExpandir
              }
            >
              {expandidos[p.id]
                ? "Recolher"
                : "Expandir"}
            </button>
          </div>

          {expandidos[p.id] && (
            <>
              {Object.keys(p)
                .filter(
                  (campo) =>
                    campo !==
                      "usuario" &&
                    campo !== "id" &&
                    campo !==
                      "atualizadoEm" &&
                    (grupoSelecionado ===
                      "TODOS" ||
                      campo ===
                        grupoSelecionado)
                )
                .map((grupo) => (
                  <div
                    key={grupo}
                    style={{
                      marginTop:
                        "15px",
                    }}
                  >
                    <h3>
                      Grupo {grupo}
                    </h3>

                    <p>
                      1º{" "}
                      {
                        p[grupo]
                          ?.primeiro
                      }
                    </p>

                    <p>
                      2º{" "}
                      {
                        p[grupo]
                          ?.segundo
                      }
                    </p>

                    <p>
                      3º{" "}
                      {
                        p[grupo]
                          ?.terceiro
                      }
                    </p>

                    <p>
                      4º{" "}
                      {
                        p[grupo]
                          ?.quarto
                      }
                    </p>
                  </div>
                ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const filtros = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  minWidth: "250px",
};

const select = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const card = {
  backgroundColor: "#1a1a1a",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
};

const cabecalhoParticipante = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: "10px",
};

const botaoExpandir = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 15px",
  cursor: "pointer",
};

const botaoVoltar = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  cursor: "pointer",
};

export default CentralPalpites;
