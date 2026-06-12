import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function CentralMataMata({ voltar }) {
  const [lista, setLista] =
    useState([]);

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

      setLista(dados);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#0d0d0d",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>
        📊 Central Mata-Mata
      </h1>

      <button
        onClick={voltar}
        style={{
          marginBottom: "20px",
        }}
      >
        Voltar
      </button>

      {lista.map((p) => (
        <div
          key={p.id}
          style={{
            backgroundColor:
              "#1a1a1a",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "15px",
          }}
        >
          <h2>
            👤 {p.nome}
          </h2>

          <p>
            🏆 Campeão:
            {" "}
            {p.campeao}
          </p>

          <p>
            ⚽ Oitavas:
            {" "}
            {p.oitavas?.join(
              ", "
            )}
          </p>

          <p>
            ⚽ Quartas:
            {" "}
            {p.quartas?.join(
              ", "
            )}
          </p>

          <p>
            ⚽ Semifinal:
            {" "}
            {p.semifinal?.join(
              ", "
            )}
          </p>

          <p>
            ⚽ Final:
            {" "}
            {p.final?.join(
              ", "
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CentralMataMata;