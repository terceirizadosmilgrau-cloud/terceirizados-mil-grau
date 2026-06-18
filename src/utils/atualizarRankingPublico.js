import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { calcularPontuacao } from "./calcularPontuacao";
import { calcularPontuacaoMataMata } from "./calcularPontuacaoMataMata";

const fasesMataMata = [
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

const temJogosMataMata = (dados) =>
  dados?.jogos &&
  fasesMataMata.some((fase) =>
    Array.isArray(dados.jogos[fase])
  );

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const calcularPontosMaximosMataMata = (
  resultadoMataMata
) => {
  if (!resultadoMataMata) return 0;

  if (temJogosMataMata(resultadoMataMata)) {
    return fasesMataMata.reduce(
      (total, fase) =>
        total +
        (
          resultadoMataMata.jogos[
            fase
          ] || []
        ).reduce((subtotal, jogo) => {
          let pontos = 0;

          if (placarPreenchido(jogo)) {
            pontos += 15;
          }

          if (jogo.classificado) {
            pontos += 5;
          }

          if (
            jogo.decididoNosPenaltis ===
            true
          ) {
            pontos += 3;
          }

          if (
            placarPreenchido(jogo) &&
            jogo.classificado
          ) {
            pontos += 2;
          }

          return subtotal + pontos;
        }, 0),
      0
    );
  }

  return (
    (resultadoMataMata.oitavas?.length || 0) *
      2 +
    (resultadoMataMata.quartas?.length || 0) *
      4 +
    (resultadoMataMata.semifinal?.length || 0) *
      6 +
    (resultadoMataMata.final?.length || 0) *
      10 +
    (resultadoMataMata.campeao ? 20 : 0)
  );
};

const normalizarNomePublico = (
  apelido
) => {
  const nome = String(apelido || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

  if (
    !nome ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      nome
    )
  ) {
    return "Participante";
  }

  return nome;
};

export const atualizarRankingPublico =
  async () => {
    const [
      resultadoGruposSnapshot,
      resultadoMataMataSnapshot,
      usuariosSnapshot,
      palpitesSnapshot,
      palpitesMataMataSnapshot,
    ] = await Promise.all([
      getDoc(
        doc(db, "resultados", "grupos")
      ),
      getDoc(
        doc(db, "resultados", "mataMata")
      ),
      getDocs(collection(db, "usuarios")),
      getDocs(collection(db, "palpites")),
      getDocs(
        collection(db, "palpitesMataMata")
      ),
    ]);

    const resultados =
      resultadoGruposSnapshot.exists()
        ? resultadoGruposSnapshot.data()
        : {};
    const resultadoMataMata =
      resultadoMataMataSnapshot.exists()
        ? resultadoMataMataSnapshot.data()
        : null;
    const palpitesPorUid = new Map(
      palpitesSnapshot.docs.map(
        (palpiteDoc) => [
          palpiteDoc.id,
          palpiteDoc.data(),
        ]
      )
    );
    const palpitesMataMataPorUid =
      new Map(
        palpitesMataMataSnapshot.docs.map(
          (palpiteDoc) => [
            palpiteDoc.id,
            palpiteDoc.data(),
          ]
        )
      );
    const pontosMaximosGrupos =
      Object.values(resultados).reduce(
        (total, grupo) => {
          let pontos = 0;

          if (grupo?.primeiro) pontos += 10;
          if (grupo?.segundo) pontos += 10;
          if (grupo?.terceiro) pontos += 3;
          if (grupo?.quarto) pontos += 2;

          return total + pontos + 10;
        },
        0
      );
    const pontosMaximos =
      pontosMaximosGrupos +
      calcularPontosMaximosMataMata(
        resultadoMataMata
      );
    const rankingCalculado =
      usuariosSnapshot.docs.map(
        (usuarioDoc) => {
          const usuario =
            usuarioDoc.data();
          const palpites =
            palpitesPorUid.get(
              usuarioDoc.id
            ) || {};
          const palpiteMataMata =
            palpitesMataMataPorUid.get(
              usuarioDoc.id
            ) || null;
          let pontosGrupos = 0;
          let acertosExatos = 0;

          Object.keys(resultados).forEach(
            (grupo) => {
              const palpiteGrupo =
                palpites[grupo] || {};
              const resultadoGrupo =
                resultados[grupo] || {};

              pontosGrupos +=
                calcularPontuacao(
                  palpiteGrupo,
                  resultadoGrupo
                );

              [
                "primeiro",
                "segundo",
                "terceiro",
                "quarto",
              ].forEach((posicao) => {
                if (
                  palpiteGrupo[posicao] &&
                  resultadoGrupo[posicao] &&
                  palpiteGrupo[posicao] ===
                    resultadoGrupo[posicao]
                ) {
                  acertosExatos++;
                }
              });
            }
          );

          const pontosMataMata =
            palpiteMataMata &&
            resultadoMataMata
              ? calcularPontuacaoMataMata(
                  palpiteMataMata,
                  resultadoMataMata
                )
              : 0;
          const pontos =
            pontosGrupos + pontosMataMata;

          return {
            nomeOrdenacao:
              usuario.apelido ||
              usuario.nome ||
              "Sem nome",
            nomeExibicao:
              normalizarNomePublico(
                usuario.apelido
              ),
            pontos,
            acertosExatos,
            aproveitamento:
              pontosMaximos > 0
                ? Number(
                    (
                      (pontos /
                        pontosMaximos) *
                      100
                    ).toFixed(1)
                  )
                : 0,
          };
        }
      );

    rankingCalculado.sort((a, b) => {
      if (b.pontos !== a.pontos) {
        return b.pontos - a.pontos;
      }

      if (
        b.acertosExatos !== a.acertosExatos
      ) {
        return (
          b.acertosExatos -
          a.acertosExatos
        );
      }

      if (
        b.aproveitamento !==
        a.aproveitamento
      ) {
        return (
          b.aproveitamento -
          a.aproveitamento
        );
      }

      return a.nomeOrdenacao.localeCompare(
        b.nomeOrdenacao
      );
    });

    const rankingPublico = {
      modalidade: "geral",
      podio: rankingCalculado
        .slice(0, 3)
        .map((participante, index) => ({
          posicao: index + 1,
          nomeExibicao:
            participante.nomeExibicao,
        })),
      atualizadoEm: new Date().toISOString(),
    };

    await setDoc(
      doc(db, "publico", "rankingResumo"),
      rankingPublico
    );

    return rankingPublico;
  };
