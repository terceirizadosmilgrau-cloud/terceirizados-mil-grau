import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  jogoEncerrado,
  textoPreenchido,
  valorPreenchido,
} from "./mataMataVisual";

const fasesMataMata = [
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

const valorValido = (valor) => {
  const texto = textoPreenchido(valor);

  return valorPreenchido(texto) && texto !== "-";
};

const listarJogos = (dados = {}) =>
  fasesMataMata.flatMap((fase) =>
    Array.isArray(dados.jogos?.[fase])
      ? dados.jogos[fase]
      : []
  );

const palpiteMataMataPreenchido = (
  dados = {}
) => {
  if (valorValido(dados.campeao)) {
    return true;
  }

  return fasesMataMata.some((fase) =>
    (dados.jogos?.[fase] || []).some(
      (jogo) =>
        valorValido(jogo?.placarA) ||
        valorValido(jogo?.placarB) ||
        valorValido(jogo?.classificado)
    )
  );
};

const jogoConfigurado = (jogo = {}) =>
  Boolean(
    jogo.timeA ||
      jogo.timeB ||
      jogo.data ||
      jogo.horario
  );

export const atualizarEstatisticasPublicas =
  async () => {
    const [
      usuariosSnapshot,
      palpitesSnapshot,
      palpitesMataMataSnapshot,
      resultadosSnapshot,
      configuracaoSnapshot,
    ] = await Promise.all([
      getDocs(collection(db, "usuarios")),
      getDocs(collection(db, "palpites")),
      getDocs(
        collection(db, "palpitesMataMata")
      ),
      getDoc(
        doc(db, "resultados", "mataMata")
      ),
      getDoc(
        doc(db, "configuracoes", "mataMata")
      ),
    ]);

    const jogosResultados =
      resultadosSnapshot.exists()
        ? listarJogos(
            resultadosSnapshot.data()
          )
        : [];
    const jogosConfigurados =
      configuracaoSnapshot.exists()
        ? listarJogos(
            configuracaoSnapshot.data()
          ).filter(jogoConfigurado)
        : [];

    const estatisticasPublicas = {
      totalParticipantes:
        usuariosSnapshot.docs.filter(
          (usuarioDoc) =>
            usuarioDoc.data()
              .tipoUsuario ===
            "participante"
        ).length,
      palpitesGruposEnviados:
        palpitesSnapshot.size,
      palpitesMataMataEnviados:
        palpitesMataMataSnapshot.docs.filter(
          (palpiteDoc) =>
            palpiteMataMataPreenchido(
              palpiteDoc.data()
            )
        ).length,
      jogosMataMataEncerrados:
        jogosResultados.filter(
          jogoEncerrado
        ).length,
      jogosMataMataConfigurados:
        jogosConfigurados.length,
      atualizadoEm: new Date().toISOString(),
    };

    await setDoc(
      doc(db, "publico", "estatisticas"),
      estatisticasPublicas
    );

    return estatisticasPublicas;
  };
