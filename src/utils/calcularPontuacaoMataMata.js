export function calcularPontuacaoMataMata(
  palpite,
  resultado
) {
  if (!palpite || !resultado) {
    return 0;
  }

  let pontos = 0;

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
            oficial
              .toLowerCase()
              .trim() ===
            time
              .toLowerCase()
              .trim()
        )
    ).length;
  };

  pontos +=
    contarAcertos(
      palpite.oitavas,
      resultado.oitavas
    ) * 1;

  pontos +=
    contarAcertos(
      palpite.quartas,
      resultado.quartas
    ) * 2;

  pontos +=
    contarAcertos(
      palpite.semifinal,
      resultado.semifinal
    ) * 3;

  pontos +=
    contarAcertos(
      palpite.final,
      resultado.final
    ) * 5;

  if (
    palpite.campeao &&
    resultado.campeao &&
    palpite.campeao
      .toLowerCase()
      .trim() ===
    resultado.campeao
      .toLowerCase()
      .trim()
  ) {
    pontos += 10;
  }

  return pontos;
}