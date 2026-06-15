function GrupoPalpite({
  grupo,
  selecoes,
  valores,
  alterarValor,
}) {
  const selectStyle = {
    width: "100%",
    maxWidth: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "white",
    boxSizing: "border-box",
    fontSize: "16px",
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
        width: "100%",
        maxWidth: "100%",
        padding: "clamp(16px, 4vw, 20px)",
        borderRadius: "12px",
        marginBottom: "20px",
        boxSizing: "border-box",
        overflowWrap: "anywhere",
      }}
    >
      <h2
        style={{
          overflowWrap: "anywhere",
        }}
      >
        Grupo {grupo}
      </h2>

      {posicoes.map((posicao) => (
        <div
          key={posicao.chave}
          style={{
            maxWidth: "100%",
          }}
        >
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
