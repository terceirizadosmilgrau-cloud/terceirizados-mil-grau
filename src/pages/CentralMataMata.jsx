import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

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
  lista = []
) => (
  <div
    style={{
      display: "flex",
justifyContent: "center",
flexWrap: "wrap",
gap: "8px",
marginTop: "8px",
marginBottom: "15px",
    }}
  >
    {lista.map(
      (item, index) => (
        <span
          key={index}
          style={{
            backgroundColor:
              "#343a40",
            color: "white",
            padding:
              "4px 8px",
            borderRadius:
              "20px",
            fontSize: "11px",
            fontWeight:
              "bold",
          }}
        >
          {item.toUpperCase()}
        </span>
      )
    )}
  </div>
);

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
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "25px",
    fontWeight: "bold",
  }}
>
  ← Voltar ao Dashboard
</button>

     <div
  style={{
    backgroundColor:
      "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    maxWidth: "700px",
    margin:
      "0 auto 25px",
      textAlign: "center",
  }}
>
  <h2>
    📈 Estatísticas Gerais
  </h2>

  <h3>
    🏆 Campeões Mais Apostados
  </h3>

  {estatisticas.campeao.map(
    ([nome, qtd], i) => (
      <p key={nome}>
  <strong>
    {i + 1}º
  </strong>{" "}
  {nome.toUpperCase()}
  {" "}
  ({qtd})
</p>
    )
  )}

  <h3>
    ⚽ Oitavas
  </h3>

  {estatisticas.oitavas.map(
    ([nome, qtd], i) => (
      <p key={nome}>
        <strong>
  {i + 1}º
</strong>{" "}
{nome.toUpperCase()}
{" "}
({qtd})
      </p>
    )
  )}

  <h3>
    ⚽ Quartas
  </h3>

  {estatisticas.quartas.map(
    ([nome, qtd], i) => (
      <p key={nome}>
        <strong>
  {i + 1}º
</strong>{" "}
{nome.toUpperCase()}
{" "}
({qtd})
      </p>
    )
  )}

  <h3>
    ⚽ Semifinal
  </h3>

  {estatisticas.semifinal.map(
    ([nome, qtd], i) => (
      <p key={nome}>
        <strong>
  {i + 1}º
</strong>{" "}
{nome.toUpperCase()}
{" "}
({qtd})
      </p>
    )
  )}

  <h3>
    ⚽ Final
  </h3>

  {estatisticas.final.map(
    ([nome, qtd], i) => (
      <p key={nome}>
        <strong>
  {i + 1}º
</strong>{" "}
{nome.toUpperCase()}
{" "}
({qtd})
      </p>
    )
  )}
</div>

      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar participante..."
          value={busca}
          onChange={(e) =>
            setBusca(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            width: "300px",
            borderRadius:
              "8px",
            border: "none",
          }}
        />

        <p
          style={{
            marginTop: "10px",
          }}
        >
          👥 Participantes:{" "}
          {
            listaFiltrada.length
          }
        </p>
      </div>

      {listaFiltrada.map(
        (p) => (
          <div
            key={p.id}
            style={{
  backgroundColor:
    "#1a1a1a",
  padding: "20px",
  borderRadius:
    "12px",
  marginBottom:
    "15px",
  textAlign: "center",
}}
          >
            <h2
  style={{
    color: "#ffc107",
    marginBottom: "20px",
  }}
>
  👤 {p.nome}
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
  "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    textAlign: "center",
  }}
>
  <div>
    <h3>🏆 Campeão</h3>
    {renderBadges([p.campeao])}
  </div>

  <div>
    <h3>⚽ Oitavas</h3>
    {renderBadges(p.oitavas || [])}
  </div>

  <div>
    <h3>⚽ Quartas</h3>
    {renderBadges(p.quartas || [])}
  </div>

  <div>
    <h3>⚽ Semifinal</h3>
    {renderBadges(p.semifinal || [])}
  </div>

  <div>
    <h3>⚽ Final</h3>
    {renderBadges(p.final || [])}
  </div>
</div>

          </div>
        )
      )}

    </div>
  );
}

export default CentralMataMata;