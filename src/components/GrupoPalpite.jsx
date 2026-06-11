function GrupoPalpite({
  grupo,
  selecoes,
  valores,
  alterarValor,
}) {
  const selectStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "white",
  };

  const posicoes = [
    {
      chave: "primeiro",
      label: "1º Lugar",
    },
    {
      chave: "segundo",
      label: "2º Lugar",
    },
    {
      chave: "terceiro",
      label: "3º Lugar",
    },
    {
      chave: "quarto",
      label: "4º Lugar",
    },
  ];

  const opcoesDisponiveis = (
    posicaoAtual
  ) => {
    const usadas = Object.entries(
      valores
    )
      .filter(
        ([chave]) =>
          chave !== posicaoAtual
      )
      .map(
        ([, valor]) => valor
      );

    return selecoes.filter(
      (selecao) =>
        !usadas.includes(selecao)
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      <h2>Grupo {grupo}</h2>

      {posicoes.map((posicao) => (
        <div key={posicao.chave}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            {posicao.label}
          </label>

          <select
            value={
              valores[
                posicao.chave
              ] || ""
            }
            onChange={(e) =>
              alterarValor(
                grupo,
                posicao.chave,
                e.target.value
              )
            }
            style={selectStyle}
          >
            <option value="">
              Selecione...
            </option>

            {opcoesDisponiveis(
              posicao.chave
            ).map((selecao) => (
              <option
                key={selecao}
                value={selecao}
              >
                {selecao}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default GrupoPalpite;