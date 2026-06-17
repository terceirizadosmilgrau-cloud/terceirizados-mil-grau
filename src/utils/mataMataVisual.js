const normalizarTexto = (valor) =>
  String(valor ?? "")
    .toLowerCase()
    .trim();

export const textoPreenchido = (valor) =>
  String(valor ?? "").trim();

export const valorPreenchido = (valor) =>
  textoPreenchido(valor) !== "";

export const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== null &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== null &&
  jogo?.placarB !== "";

export const jogoEncerrado = (jogo) =>
  placarPreenchido(jogo) &&
  valorPreenchido(jogo?.classificado);

export const formatarPlacar = (
  jogo,
  fallback = "-"
) =>
  placarPreenchido(jogo)
    ? `${jogo.placarA} x ${jogo.placarB}`
    : fallback;

export const formatarConfronto = (jogo) =>
  `${jogo?.timeA || "Time A"} x ${
    jogo?.timeB || "Time B"
  }`;

export const formatarResultadoOficial = (
  jogo
) =>
  jogoEncerrado(jogo)
    ? `${formatarPlacar(jogo)} | ${
        jogo.classificado
      }`
    : "";

export const placarCorreto = (
  palpite,
  resultado
) =>
  placarPreenchido(palpite) &&
  jogoEncerrado(resultado) &&
  String(palpite.placarA).trim() ===
    String(resultado.placarA).trim() &&
  String(palpite.placarB).trim() ===
    String(resultado.placarB).trim();

export const classificadoCorreto = (
  palpite,
  resultado
) =>
  valorPreenchido(palpite?.classificado) &&
  jogoEncerrado(resultado) &&
  normalizarTexto(palpite.classificado) ===
    normalizarTexto(resultado.classificado);

export const resultadoTemPenaltis = (
  resultado
) =>
  resultado?.decididoNosPenaltis === true;

export const penaltisCorreto = (
  palpite,
  resultado
) =>
  resultadoTemPenaltis(resultado) &&
  palpite?.decididoNosPenaltis === true;

export const obterIndicadoresJogo = (
  palpite,
  resultado
) => {
  const encerrado = jogoEncerrado(resultado);

  return {
    encerrado,
    pendente: !encerrado,
    placar: encerrado
      ? placarCorreto(palpite, resultado)
      : false,
    classificado: encerrado
      ? classificadoCorreto(
          palpite,
          resultado
        )
      : false,
    compararPenaltis:
      resultadoTemPenaltis(resultado),
    penaltis: encerrado
      ? penaltisCorreto(palpite, resultado)
      : false,
  };
};
