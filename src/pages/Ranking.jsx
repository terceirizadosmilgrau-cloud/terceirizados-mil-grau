import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { calcularPontuacao } from "../utils/calcularPontuacao";

function Ranking({ voltar }) {
  const [ranking, setRanking] = useState([]);
  const [arrecadacao, setArrecadacao] =
    useState(0);

  const [estatisticas, setEstatisticas] =
    useState({
      participantes: 0,
      pagos: 0,
      pendentes: 0,
      comPalpite: 0,
      semPalpite: 0,
    });

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      const resultadoSnapshot =
        await getDoc(
          doc(db, "resultados", "grupos")
        );

      if (!resultadoSnapshot.exists())
        return;

      const resultados =
        resultadoSnapshot.data();

      const usuariosSnapshot =
        await getDocs(
          collection(db, "usuarios")
        );

      const listaRanking = [];

      let pagos = 0;
      let arrecadacaoTotal = 0;
      let comPalpite = 0;

      for (const usuarioDoc of usuariosSnapshot.docs) {
        const usuario =
          usuarioDoc.data();

        if (usuario.pagamento) {
          pagos++;
          arrecadacaoTotal += 20;
        }

        const palpiteSnapshot =
          await getDoc(
            doc(
              db,
              "palpites",
              usuarioDoc.id
            )
          );

        if (!palpiteSnapshot.exists())
          continue;

        comPalpite++;

        const palpites =
          palpiteSnapshot.data();

        let pontos = 0;

        Object.keys(resultados).forEach(
          (grupo) => {
            pontos += calcularPontuacao(
              palpites[grupo],
              resultados[grupo]
            );
          }
        );

        listaRanking.push({
          nome:
            usuario.apelido ||
            usuario.nome,
          pontos,
        });
      }

      listaRanking.sort(
        (a, b) => b.pontos - a.pontos
      );

      setRanking(listaRanking);

      setArrecadacao(
        arrecadacaoTotal
      );

      setEstatisticas({
        participantes:
          usuariosSnapshot.docs.length,
        pagos,
        pendentes:
          usuariosSnapshot.docs.length -
          pagos,
        comPalpite,
        semPalpite:
          usuariosSnapshot.docs.length -
          comPalpite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const premio1 =
    arrecadacao * 0.5;

  const premio2 =
    arrecadacao * 0.3;

  const premio3 =
    arrecadacao * 0.2;

  const liderPontos =
    ranking.length > 0
      ? ranking[0].pontos
      : 0;

  const diferenca = (pontos) => {
    const diff =
      liderPontos - pontos;

    if (diff === 0) {
      return "👑 Líder";
    }

    return "(-" + diff + " pts)";
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
      <h1>🏆 Ranking Geral</h1>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>📊 Estatísticas</h2>

        <p>
          Participantes:{" "}
          {estatisticas.participantes}
        </p>

        <p>
          ✅ Pagos:{" "}
          {estatisticas.pagos}
        </p>

        <p>
          ❌ Pendentes:{" "}
          {estatisticas.pendentes}
        </p>

        <p>
          📝 Palpites enviados:{" "}
          {estatisticas.comPalpite}
        </p>

        <p>
          ⚠️ Sem palpite:{" "}
          {estatisticas.semPalpite}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>💰 Premiação</h2>

        <p>
          Arrecadação: R${" "}
          {arrecadacao.toFixed(2)}
        </p>

        <p>
          🥇 1º Lugar: R${" "}
          {premio1.toFixed(2)}
        </p>

        <p>
          🥈 2º Lugar: R${" "}
          {premio2.toFixed(2)}
        </p>

        <p>
          🥉 3º Lugar: R${" "}
          {premio3.toFixed(2)}
        </p>
      </div>

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h2>🏆 Pódio</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: "180px",
              backgroundColor: "#6c757d",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h1>🥈</h1>

            <h3>
              {ranking[1]?.nome ||
                "---"}
            </h3>

            <p>
              {ranking[1]?.pontos ||
                0} pts
            </p>

            <p>
              {ranking[1]
                ? diferenca(
                    ranking[1].pontos
                  )
                : ""}
            </p>

            <strong>
              R$ {premio2.toFixed(2)}
            </strong>
          </div>

          <div
            style={{
              width: "220px",
              backgroundColor: "#ffc107",
              color: "#000",
              padding: "25px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h1>🥇</h1>

            <h2>
              {ranking[0]?.nome ||
                "---"}
            </h2>

            <p>
              {ranking[0]?.pontos ||
                0} pts
            </p>

            <p>👑 Líder</p>

            <strong>
              R$ {premio1.toFixed(2)}
            </strong>
          </div>

          <div
            style={{
              width: "180px",
              backgroundColor: "#cd7f32",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h1>🥉</h1>

            <h3>
              {ranking[2]?.nome ||
                "---"}
            </h3>

            <p>
              {ranking[2]?.pontos ||
                0} pts
            </p>

            <p>
              {ranking[2]
                ? diferenca(
                    ranking[2].pontos
                  )
                : ""}
            </p>

            <strong>
              R$ {premio3.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>
          📋 Classificação Completa
        </h2>

        {ranking.map(
          (
            participante,
            index
          ) => (
            <div
              key={index}
              style={{
                padding: "12px",
                borderBottom:
                  "1px solid #333",
                backgroundColor:
                  index === 0
                    ? "#2b2b2b"
                    : "transparent",
              }}
            >
              <strong>
                {index + 1}º
              </strong>{" "}
              {participante.nome}
              {" - "}
              {participante.pontos}
              pts{" "}
              <span
                style={{
                  color: "#999",
                }}
              >
                {diferenca(
                  participante.pontos
                )}
              </span>
            </div>
          )
        )}
      </div>

      <button
        onClick={voltar}
        style={{
          marginTop: "20px",
          backgroundColor:
            "#6c757d",
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

export default Ranking;