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

  posicoes.forEach((posicao) => {
    const palpiteValor =
      palpite?.[posicao];

    const resultadoValor =
      resultado?.[posicao];

    if (
      palpiteValor === resultadoValor
    ) {
      pontos += 10;
    } else {
      const existeNoGrupo =
        posicoes.some(
          (p) =>
            resultado?.[p] ===
            palpiteValor
        );

      if (existeNoGrupo) {
        pontos += 5;
      }
    }
  });

  return pontos;
}