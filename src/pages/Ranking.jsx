import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { calcularPontuacao } from "../utils/calcularPontuacao";
import DetalheParticipante from "../components/DetalheParticipante";
import { calcularPontuacaoMataMata }
  from "../utils/calcularPontuacaoMataMata";

function Ranking({ voltar }) {
  const [ranking, setRanking] = useState([]);

  const [arrecadacao, setArrecadacao] =
  useState(0);

  const [busca, setBusca] =
  useState("");

  const [
  participanteSelecionado,
  setParticipanteSelecionado,
] = useState(null);

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

      const resultadoMataMataSnapshot =
  await getDoc(
    doc(
      db,
      "resultados",
      "mataMata"
    )
  );

const resultadoMataMata =
  resultadoMataMataSnapshot.exists()
    ? resultadoMataMataSnapshot.data()
    : null;

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

let pontos = 0;
let pontosGrupos = 0;
let pontosMataMata = 0;
let detalhesMataMata = null;

if (palpiteSnapshot.exists()) {
  comPalpite++;

  const palpites =
    palpiteSnapshot.data();

  Object.keys(resultados).forEach(
  (grupo) => {
    const pontosGrupo =
  calcularPontuacao(
    palpites[grupo],
    resultados[grupo]
  );

pontosGrupos += pontosGrupo;
pontos += pontosGrupo;
  }
);
}

const mataMataSnapshot =
  await getDoc(
    doc(
      db,
      "palpitesMataMata",
      usuarioDoc.id
    )
  );

  console.log(
  "USUARIO:",
  usuario.nome
);

console.log(
  "TEM PALPITE MATA MATA:",
  mataMataSnapshot.exists()
);

console.log(
  "TEM RESULTADO MATA MATA:",
  !!resultadoMataMata
);


if (
  mataMataSnapshot.exists() &&
  resultadoMataMata
) {
  const palpiteMataMata =
    mataMataSnapshot.data();

    console.log(
  "PALPITE MATA MATA:",
  palpiteMataMata
);

  const contarAcertos = (
    palpites,
    oficiais
  ) => {
    if (
      !Array.isArray(palpites) ||
      !Array.isArray(oficiais)
    ) {
      return 0;
    }

    return palpites.filter(
      (time) =>
        oficiais.some(
          (oficial) =>
            oficial
              ?.toLowerCase()
              .trim() ===
            time
              ?.toLowerCase()
              .trim()
        )
    ).length;
  };

  const acertosOitavas =
    contarAcertos(
      palpiteMataMata.oitavas,
      resultadoMataMata.oitavas
    );

  const acertosQuartas =
    contarAcertos(
      palpiteMataMata.quartas,
      resultadoMataMata.quartas
    );

  const acertosSemi =
    contarAcertos(
      palpiteMataMata.semifinal,
      resultadoMataMata.semifinal
    );

  const acertosFinal =
    contarAcertos(
      palpiteMataMata.final,
      resultadoMataMata.final
    );

  const campeaoCorreto =
    palpiteMataMata.campeao
      ?.toLowerCase()
      .trim() ===
    resultadoMataMata.campeao
      ?.toLowerCase()
      .trim();

  detalhesMataMata = {
  oitavas: acertosOitavas * 2,

  quartas: acertosQuartas * 4,

  semifinal: acertosSemi * 6,

  final: acertosFinal * 10,

  campeao: campeaoCorreto
    ? 20
    : 0,
};

  pontosMataMata =
  calcularPontuacaoMataMata(
    palpiteMataMata,
    resultadoMataMata
  );

  pontos += pontosMataMata;

console.log(
  "PONTOS MATA-MATA:",
  usuario.nome,
  pontosMataMata
);

console.log(
  "PALPITE:",
  palpiteMataMata
);

console.log(
  "RESULTADO:",
  resultadoMataMata
);
}

listaRanking.push({
  nome:
    usuario.apelido ||
    usuario.nome,

  pontos:
    pontosGrupos +
    pontosMataMata,

  pontosGrupos,
  pontosMataMata,

  detalhesMataMata,

  diferencaLider: 0,
  posicao: 0,
  premiacao: 0,

  detalhes: {},

  palpites:
    palpiteSnapshot.exists()
      ? palpiteSnapshot.data()
      : {},

  resultados,
});
      }

      listaRanking.sort(
  (a, b) => b.pontos - a.pontos
);

listaRanking.forEach(
  (participante, index) => {

    participante.detalhes = {};

    Object.keys(
      participante.resultados || {}
    ).forEach((grupo) => {
     const palpiteGrupo =
  participante.palpites?.[
    grupo
  ] || {};

const resultadoGrupo =
  participante.resultados?.[
    grupo
  ] || {};

let acertosExatos = 0;

[
  "primeiro",
  "segundo",
  "terceiro",
  "quarto",
].forEach((posicao) => {
  const palpite =
    palpiteGrupo[posicao];

  const resultado =
    resultadoGrupo[posicao];

  if (
    palpite &&
    resultado &&
    palpite === resultado
  ) {
    acertosExatos++;
  }
});

const acertosParciais = 0;

const acertosGrupo =
  acertosExatos;

participante.detalhes[
  grupo
] = {
  palpite: palpiteGrupo,
  resultado: resultadoGrupo,

  pontos: calcularPontuacao(
    palpiteGrupo,
    resultadoGrupo
  ),

  acertosExatos,
  acertosParciais,
  acertosGrupo,
};
    });

    participante.posicao =
      index + 1;

    participante.diferencaLider =
  listaRanking.length > 0
    ? listaRanking[0].pontos -
      participante.pontos
    : 0;

participante.acertosExatos = 0;
participante.acertosParciais = 0;

Object.values(
  participante.detalhes
).forEach((grupo) => {
  participante.acertosExatos +=
    grupo.acertosExatos || 0;

  participante.acertosParciais +=
    grupo.acertosParciais || 0;
});

let pontosMaximos = 0;

Object.values(
  participante.resultados || {}
).forEach((grupo) => {

  if (grupo?.primeiro)
    pontosMaximos += 10;

  if (grupo?.segundo)
    pontosMaximos += 10;

  if (grupo?.terceiro)
    pontosMaximos += 3;

  if (grupo?.quarto)
    pontosMaximos += 2;

  pontosMaximos += 10; // bônus grupo perfeito
});

if (resultadoMataMata) {
  pontosMaximos +=
  (resultadoMataMata.oitavas?.length || 0) * 2 +
  (resultadoMataMata.quartas?.length || 0) * 4 +
  (resultadoMataMata.semifinal?.length || 0) * 6 +
  (resultadoMataMata.final?.length || 0) * 10 +
  (resultadoMataMata.campeao ? 20 : 0);
}

participante.aproveitamento =
  pontosMaximos > 0
    ? (
        (participante.pontos /
          pontosMaximos) *
        100
      ).toFixed(1)
    : 0;

    participante.medalhas = [];
  }
);
listaRanking.sort((a, b) => {

  if (b.pontos !== a.pontos) {
    return b.pontos - a.pontos;
  }

  if (
    (b.acertosExatos || 0) !==
    (a.acertosExatos || 0)
  ) {
    return (
      (b.acertosExatos || 0) -
      (a.acertosExatos || 0)
    );
  }

  if (
    Number(
      b.aproveitamento || 0
    ) !==
    Number(
      a.aproveitamento || 0
    )
  ) {
    return (
      Number(
        b.aproveitamento || 0
      ) -
      Number(
        a.aproveitamento || 0
      )
    );
  }

  return a.nome.localeCompare(
    b.nome
  );
});

listaRanking.forEach(
  (participante, index) => {

    participante.posicao =
      index + 1;

    participante.diferencaLider =
      listaRanking.length > 0
        ? listaRanking[0].pontos -
          participante.pontos
        : 0;

    if (index === 0) {
      participante.premiacao =
        arrecadacaoTotal * 0.5;
    } else if (index === 1) {
      participante.premiacao =
        arrecadacaoTotal * 0.3;
    } else if (index === 2) {
      participante.premiacao =
        arrecadacaoTotal * 0.2;
    } else {
      participante.premiacao = 0;
    }
  }
);


const melhorAproveitamento =
  [...listaRanking].sort(
    (a, b) =>
      Number(
        b.aproveitamento || 0
      ) -
      Number(
        a.aproveitamento || 0
      )
  )[0];

const reiDosAcertos =
  [...listaRanking].sort(
    (a, b) =>
      (b.acertosExatos || 0) -
      (a.acertosExatos || 0)
  )[0];

if (listaRanking[0]) {
  listaRanking[0].medalhas.push(
    "🥇 Líder Atual"
  );
}

if (melhorAproveitamento) {
  melhorAproveitamento.medalhas.push(
    "📈 Melhor Aproveitamento"
  );
}

if (reiDosAcertos) {
  reiDosAcertos.medalhas.push(
    "🎯 Rei dos Acertos"
  );
}

listaRanking.forEach(
  (participante) => {
    if (
      participante.posicao <= 3
    ) {
      participante.medalhas.push(
        "💰 Em Zona de Premiação"
      );
    }
  }
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

    const lider = ranking[0];

const melhorAproveitamento =
  [...ranking].sort(
    (a, b) =>
      Number(
        b.aproveitamento || 0
      ) -
      Number(
        a.aproveitamento || 0
      )
  )[0];

const maisAcertos =
  [...ranking].sort(
    (a, b) =>
      (b.acertosExatos || 0) -
      (a.acertosExatos || 0)
  )[0];

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
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}

  
>
  <h2>
    🔥 Destaques
  </h2>

  <p>
    🥇 Líder:
    {" "}
    {lider?.nome || "-"}
    {" "}
    ({lider?.pontos || 0}
    pts)
  </p>

  <p>
    📈 Melhor Aproveitamento:
    {" "}
    {melhorAproveitamento?.nome ||
      "-"}
    {" "}
    (
    {melhorAproveitamento?.aproveitamento ||
      0}
    %)
  </p>

  <p>
    🎯 Mais Acertos Exatos:
    {" "}
    {maisAcertos?.nome || "-"}
    {" "}
    (
    {maisAcertos?.acertosExatos ||
      0}
    )
  </p>

  <p>
    💰 Premiação Atual:
    {" "}
    R$
    {" "}
    {premio1.toFixed(2)}
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

        <input
  type="text"
  placeholder="🔎 Buscar participante..."
  value={busca}
  onChange={(e) =>
    setBusca(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  }}
/>

        {ranking
  .filter((participante) =>
    participante.nome
      ?.toLowerCase()
      .includes(
        busca.toLowerCase()
      )
  )
  .map(
    (
      participante,
      index
    ) => (
            <div
  key={index}
  onClick={() =>
    setParticipanteSelecionado(
      participante
    )
  }
  style={{
                padding: "12px",
                borderBottom:
                  "1px solid #333",
                backgroundColor:
                  index === 0
                    ? "#2b2b2b"
                    : "transparent",

                    cursor: "pointer",
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

<DetalheParticipante
  participante={
    participanteSelecionado
  }
  fechar={() =>
    setParticipanteSelecionado(
      null
    )
  }
/>
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