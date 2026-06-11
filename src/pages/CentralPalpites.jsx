import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function CentralPalpites({ voltar }) {
  const [palpites, setPalpites] = useState([]);

  useEffect(() => {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>📊 Central de Palpites</h1>

      <button
        onClick={voltar}
        style={botaoVoltar}
      >
        Voltar
      </button>

      {palpites.map((p) => (
        <div
          key={p.id}
          style={card}
        >
          <h2>
            👤 {p.usuario}
          </h2>

          {Object.keys(p)
            .filter(
              (campo) =>
                campo !== "usuario" &&
                campo !== "id" &&
                campo !== "atualizadoEm"
            )
            .map((grupo) => (
              <div
                key={grupo}
                style={{
                  marginTop: "15px",
                }}
              >
                <h3>
                  Grupo {grupo}
                </h3>

                <p>
                  1º {p[grupo]?.primeiro}
                </p>

                <p>
                  2º {p[grupo]?.segundo}
                </p>

                <p>
                  3º {p[grupo]?.terceiro}
                </p>

                <p>
                  4º {p[grupo]?.quarto}
                </p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

const card = {
  backgroundColor: "#1a1a1a",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
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