import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";

function ResumoPalpites({
  usuario,
  voltar,
}) {
  const [palpites, setPalpites] = useState({});

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, "palpites", usuario.uid)
      );

      if (snapshot.exists()) {
        setPalpites(snapshot.data());
      }
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
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <h1>📋 Meus Palpites</h1>

      {Object.entries(palpites)
        .filter(
          ([chave]) =>
            chave !== "atualizadoEm"
        )
        .map(([grupo, dados]) => (
          <div
            key={grupo}
            style={{
              backgroundColor: "#1a1a1a",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>
              Grupo {grupo}
            </h2>

            <p>
              🥇 {dados.primeiro}
            </p>

            <p>
              🥈 {dados.segundo}
            </p>

            <p>
              🥉 {dados.terceiro}
            </p>

            <p>
              4º {dados.quarto}
            </p>
          </div>
        ))}

      <button
        onClick={voltar}
        style={{
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Voltar
      </button>
    </div>
  );
}

export default ResumoPalpites;