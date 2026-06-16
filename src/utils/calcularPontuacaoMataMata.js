const fases = [
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

const normalizarTexto = (valor) =>
  String(valor || "")
    .toLowerCase()
    .trim();

const temJogos = (dados) =>
  dados?.jogos &&
  fases.some((fase) =>
    Array.isArray(
      dados.jogos[fase]
    )
  );

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const resultadoDoJogo = (jogo) => {
  if (!placarPreenchido(jogo)) {
    return "";
  }

  const placarA = Number(jogo.placarA);
  const placarB = Number(jogo.placarB);

  if (
    Number.isNaN(placarA) ||
    Number.isNaN(placarB)
  ) {
    return "";
  }

  if (placarA > placarB) {
    return "timeA";
  }

  if (placarB > placarA) {
    return "timeB";
  }

  return "empate";
};

const calcularDetalhesPorJogo = (
  palpite,
  resultado
) => {
  const detalhes = {
    oitavas: 0,
    quartas: 0,
    semifinal: 0,
    final: 0,
    campeao: 0,
  };

  fases.forEach((fase) => {
    const palpitesDaFase =
      palpite.jogos[fase] || [];

    const resultadosDaFase =
      resultado.jogos[fase] || [];

    palpitesDaFase.forEach(
      (jogoPalpite, index) => {
        const jogoResultado =
          resultadosDaFase[index];

        if (!jogoResultado) return;

        const placarExato =
          placarPreenchido(
            jogoPalpite
          ) &&
          placarPreenchido(
            jogoResultado
          ) &&
          String(
            jogoPalpite.placarA
          ).trim() ===
            String(
              jogoResultado.placarA
            ).trim() &&
          String(
            jogoPalpite.placarB
          ).trim() ===
            String(
              jogoResultado.placarB
            ).trim();

        const classificadoCorreto =
          normalizarTexto(
            jogoPalpite.classificado
          ) &&
          normalizarTexto(
            jogoPalpite.classificado
          ) ===
            normalizarTexto(
              jogoResultado.classificado
            );

        const resultadoCorreto =
          resultadoDoJogo(
            jogoPalpite
          ) &&
          resultadoDoJogo(
            jogoPalpite
          ) ===
            resultadoDoJogo(
              jogoResultado
            );

        const penaltisCorreto =
          jogoResultado.decididoNosPenaltis ===
            true &&
          jogoPalpite.decididoNosPenaltis ===
            true;

        const acertoTotal =
          placarExato &&
          resultadoCorreto &&
          classificadoCorreto &&
          (!jogoResultado.decididoNosPenaltis ||
            penaltisCorreto);

        if (placarExato) {
          detalhes[fase] += 10;
        }

        if (resultadoCorreto) {
          detalhes[fase] += 5;
        }

        if (classificadoCorreto) {
          detalhes[fase] += 5;
        }

        if (penaltisCorreto) {
          detalhes[fase] += 3;
        }

        if (acertoTotal) {
          detalhes[fase] += 2;
        }
      }
    );
  });

  return detalhes;
};

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
      time &&
      oficiais.some(
        (oficial) =>
          oficial &&
          normalizarTexto(oficial) ===
            normalizarTexto(time)
      )
  ).length;
};

const calcularDetalhesAntigos = (
  palpite,
  resultado
) => {
  const campeaoCorreto =
    palpite.campeao &&
    resultado.campeao &&
    normalizarTexto(
      palpite.campeao
    ) ===
      normalizarTexto(
        resultado.campeao
      );

  return {
    oitavas:
      contarAcertos(
        palpite.oitavas,
        resultado.oitavas
      ) * 2,

    quartas:
      contarAcertos(
        palpite.quartas,
        resultado.quartas
      ) * 4,

    semifinal:
      contarAcertos(
        palpite.semifinal,
        resultado.semifinal
      ) * 6,

    final:
      contarAcertos(
        palpite.final,
        resultado.final
      ) * 10,

    campeao: campeaoCorreto
      ? 20
      : 0,
  };
};

export function calcularDetalhesPontuacaoMataMata(
  palpite,
  resultado
) {
  if (!palpite || !resultado) {
    return null;
  }

  if (
    temJogos(palpite) &&
    temJogos(resultado)
  ) {
    return calcularDetalhesPorJogo(
      palpite,
      resultado
    );
  }

  return calcularDetalhesAntigos(
    palpite,
    resultado
  );
}

export function calcularPontuacaoMataMata(
  palpite,
  resultado
) {
  const detalhes =
    calcularDetalhesPontuacaoMataMata(
      palpite,
      resultado
    );

  if (!detalhes) {
    return 0;
  }

  return Object.values(detalhes).reduce(
    (total, pontos) =>
      total + pontos,
    0
  );
}
