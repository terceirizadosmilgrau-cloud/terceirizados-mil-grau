export function calcularPontuacao(
  palpite,
  resultado
) {
  let pontos = 0;

  const posicoes = [
    "primeiro",
    "segundo",
    "terceiro",
    "quarto",
  ];

  let grupoCompleto = true;

  posicoes.forEach((posicao) => {
    const palpiteValor =
      palpite?.[posicao];

    const resultadoValor =
      resultado?.[posicao];

    // Acerto exato
    if (
      resultadoValor &&
      palpiteValor === resultadoValor
    ) {
      if (
        posicao === "primeiro" ||
        posicao === "segundo"
      ) {
        pontos += 10;
      } else if (
        posicao === "terceiro"
      ) {
        pontos += 3;
      } else if (
        posicao === "quarto"
      ) {
        pontos += 2;
      }
    } else {
      grupoCompleto = false;
    }
  });

  // Bônus grupo completo
  if (grupoCompleto) {
    pontos += 10;
  }

  return pontos;
}