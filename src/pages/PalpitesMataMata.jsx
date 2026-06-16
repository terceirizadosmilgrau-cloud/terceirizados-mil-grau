import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const fases = [
  {
    chave: "oitavas",
    titulo: "Oitavas",
    quantidade: 8,
  },
  {
    chave: "quartas",
    titulo: "Quartas",
    quantidade: 4,
  },
  {
    chave: "semifinal",
    titulo: "Semifinal",
    quantidade: 2,
  },
  {
    chave: "final",
    titulo: "Final",
    quantidade: 1,
  },
];

const criarJogo = (fase, numero) => ({
  id: `${fase}-${numero}`,
  fase,
  timeA: "",
  timeB: "",
  data: "",
  horario: "",
  placarA: "",
  placarB: "",
  classificado: "",
  decididoNosPenaltis: false,
});

const criarJogosVazios = () =>
  fases.reduce((acc, fase) => {
    acc[fase.chave] = Array.from(
      { length: fase.quantidade },
      (_, index) =>
        criarJogo(
          fase.chave,
          index + 1
        )
    );

    return acc;
  }, {});

const normalizarJogos = (
  dadosFirebase = {}
) => {
  const jogosSalvos =
    dadosFirebase.jogos || {};

  return fases.reduce((acc, fase) => {
    const jogosDaFase =
      Array.isArray(
        jogosSalvos[fase.chave]
      )
        ? jogosSalvos[fase.chave]
        : [];

    const classificadosAntigos =
      Array.isArray(
        dadosFirebase[fase.chave]
      )
        ? dadosFirebase[fase.chave]
        : [];

    acc[fase.chave] = Array.from(
      { length: fase.quantidade },
      (_, index) => {
        const jogoSalvo =
          jogosDaFase[index] || {};

        return {
          ...criarJogo(
            fase.chave,
            index + 1
          ),
          ...jogoSalvo,
          fase: fase.chave,
          decididoNosPenaltis: Boolean(
            jogoSalvo.decididoNosPenaltis
          ),
          classificado:
            jogoSalvo.classificado ||
            classificadosAntigos[index] ||
            "",
        };
      }
    );

    return acc;
  }, {});
};

const normalizarConfrontosOficiais = (
  dados = {}
) => {
  const jogosSalvos =
    dados.jogos || {};

  return fases.reduce((acc, fase) => {
    const jogosDaFase =
      Array.isArray(
        jogosSalvos[fase.chave]
      )
        ? jogosSalvos[fase.chave]
        : [];

    acc[fase.chave] = Array.from(
      { length: fase.quantidade },
      (_, index) => {
        const jogoSalvo =
          jogosDaFase[index] || {};

        return {
          ...criarJogo(
            fase.chave,
            index + 1
          ),
          timeA:
            jogoSalvo.timeA || "",
          timeB:
            jogoSalvo.timeB || "",
          data:
            jogoSalvo.data || "",
          horario:
            jogoSalvo.horario || "",
        };
      }
    );

    return acc;
  }, {});
};

const existemConfrontosOficiais = (
  jogos = {}
) =>
  fases.some((fase) =>
    (jogos[fase.chave] || []).some(
      (jogo) =>
        jogo.timeA ||
        jogo.timeB ||
        jogo.data ||
        jogo.horario
    )
  );

const mesclarJogosComConfrontos = (
  confrontos,
  dadosSalvos = {}
) => {
  const jogosSalvos =
    dadosSalvos.jogos || {};

  return fases.reduce((acc, fase) => {
    const baseDaFase =
      Array.isArray(
        confrontos[fase.chave]
      )
        ? confrontos[fase.chave]
        : [];

    const jogosDaFase =
      Array.isArray(
        jogosSalvos[fase.chave]
      )
        ? jogosSalvos[fase.chave]
        : [];

    const classificadosAntigos =
      Array.isArray(
        dadosSalvos[fase.chave]
      )
        ? dadosSalvos[fase.chave]
        : [];

    acc[fase.chave] = baseDaFase.map(
      (jogoBase, index) => {
        const jogoSalvo =
          jogosDaFase[index] || {};

        return {
          ...jogoBase,
          placarA:
            jogoSalvo.placarA || "",
          placarB:
            jogoSalvo.placarB || "",
          decididoNosPenaltis: Boolean(
            jogoSalvo.decididoNosPenaltis
          ),
          classificado:
            jogoSalvo.classificado ||
            classificadosAntigos[index] ||
            "",
        };
      }
    );

    return acc;
  }, {});
};

const listarClassificados = (
  jogos = []
) =>
  jogos
    .map((jogo) =>
      jogo.classificado.trim()
    )
    .filter(Boolean);

function PalpitesMataMata({
  usuario,
  voltar,
}) {
  const [jogos, setJogos] =
    useState(criarJogosVazios);

  const [
    temConfrontosOficiais,
    setTemConfrontosOficiais,
  ] = useState(false);

  const [encerrado, setEncerrado] =
    useState(false);

  const [dataLimite, setDataLimite] =
    useState(null);

  const [tempoRestante, setTempoRestante] =
    useState("");

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  useEffect(() => {
    carregarPalpite();
  }, []);

  useEffect(() => {
    if (!dataLimite) return;

    const atualizarTempo = () => {
      const agora = new Date();
      const limite = new Date(dataLimite);
      const diferenca = limite - agora;

      if (diferenca <= 0) {
        setTempoRestante("Encerrado");
        return;
      }

      const dias = Math.floor(
        diferenca /
          (1000 * 60 * 60 * 24)
      );

      const horas = Math.floor(
        (diferenca %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutos = Math.floor(
        (diferenca %
          (1000 * 60 * 60)) /
          (1000 * 60)
      );

      setTempoRestante(
        `${dias}d ${horas}h ${minutos}min`
      );
    };

    atualizarTempo();

    const intervalo = setInterval(
      atualizarTempo,
      60000
    );

    return () =>
      clearInterval(intervalo);
  }, [dataLimite]);

  const carregarPalpite =
    async () => {
      try {
        const configSnapshot =
          await getDoc(
            doc(
              db,
              "configuracoes",
              "mataMata"
            )
          );

        const palpiteSnapshot =
          await getDoc(
            doc(
              db,
              "palpitesMataMata",
              usuario.uid
            )
          );

        const dadosPalpite =
          palpiteSnapshot.exists()
            ? palpiteSnapshot.data()
            : {};

        if (configSnapshot.exists()) {
          const confrontos =
            normalizarConfrontosOficiais(
              configSnapshot.data()
            );

          const possuiConfrontos =
            existemConfrontosOficiais(
              confrontos
            );

          setTemConfrontosOficiais(
            possuiConfrontos
          );
          setJogos(
            possuiConfrontos
              ? mesclarJogosComConfrontos(
                  confrontos,
                  dadosPalpite
                )
              : normalizarJogos(
                  dadosPalpite
                )
          );

          return;
        }

        if (palpiteSnapshot.exists()) {
          setJogos(
            normalizarJogos(
              dadosPalpite
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const carregarConfiguracoes =
    async () => {
      try {
        const snapshot =
          await getDoc(
            doc(
              db,
              "configuracoes",
              "geral"
            )
          );

        if (snapshot.exists()) {
          const config =
            snapshot.data();

          const limite =
            config.dataLimitePalpites;

          setDataLimite(limite);

          if (
            limite &&
            new Date() >
              new Date(limite)
          ) {
            setEncerrado(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

  const alterarJogo = (
    fase,
    index,
    campo,
    valor
  ) => {
    setJogos((anterior) => ({
      ...anterior,
      [fase]: anterior[fase].map(
        (jogo, jogoIndex) =>
          jogoIndex === index
            ? {
                ...jogo,
                [campo]: valor,
              }
            : jogo
      ),
    }));
  };

  const salvar = async () => {
    if (encerrado) {
      alert(
        "Os palpites estao encerrados."
      );
      return;
    }

    try {
      const classificados =
        fases.reduce((acc, fase) => {
          acc[fase.chave] =
            listarClassificados(
              jogos[fase.chave]
            );

          return acc;
        }, {});

      await setDoc(
        doc(
          db,
          "palpitesMataMata",
          usuario.uid
        ),
        {
          jogos,
          ...classificados,
          campeao:
            classificados.final[0] ||
            "",
          atualizadoEm:
            new Date().toISOString(),
        }
      );

      alert(
        "Palpite do Mata-Mata salvo!"
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Mata-Mata
      </h1>

      {dataLimite &&
        !encerrado && (
          <div style={avisoAbertoStyle}>
            Encerramento dos palpites em:{" "}
            {tempoRestante}
          </div>
        )}

      {encerrado && (
        <div style={avisoEncerradoStyle}>
          Os palpites do Mata-Mata estao
          encerrados.
        </div>
      )}

      <p style={textoApoioStyle}>
        {temConfrontosOficiais
          ? "Confrontos oficiais definidos. Informe apenas o placar previsto e o classificado."
          : "Preencha cada jogo com os times, placar previsto e classificado."}
      </p>

      {fases.map((fase) => (
        <section
          key={fase.chave}
          style={secaoStyle}
        >
          <h2>{fase.titulo}</h2>

          <div style={listaJogosStyle}>
            {jogos[fase.chave].map(
              (jogo, index) => (
                <div
                  key={jogo.id}
                  style={jogoStyle}
                >
                  <strong>
                    Jogo {index + 1}
                  </strong>

                  {temConfrontosOficiais && (
                    <div
                      style={dadosJogoStyle}
                    >
                      <span>
                        {jogo.data ||
                          "Data a definir"}
                      </span>

                      <span>
                        {jogo.horario ||
                          "Horario a definir"}
                      </span>
                    </div>
                  )}

                  <div
                    style={
                      confrontoStyle
                    }
                  >
                    {temConfrontosOficiais ? (
                      <strong
                        style={
                          nomeTimeStyle
                        }
                      >
                        {jogo.timeA ||
                          "Time A"}
                      </strong>
                    ) : (
                      <input
                        placeholder="Time A"
                        value={jogo.timeA}
                        onChange={(e) =>
                          alterarJogo(
                            fase.chave,
                            index,
                            "timeA",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />
                    )}

                    <input
                      inputMode="numeric"
                      placeholder="0"
                      value={jogo.placarA}
                      onChange={(e) =>
                        alterarJogo(
                          fase.chave,
                          index,
                          "placarA",
                          e.target.value
                        )
                      }
                      style={
                        placarStyle
                      }
                    />

                    <span>X</span>

                    <input
                      inputMode="numeric"
                      placeholder="0"
                      value={jogo.placarB}
                      onChange={(e) =>
                        alterarJogo(
                          fase.chave,
                          index,
                          "placarB",
                          e.target.value
                        )
                      }
                      style={
                        placarStyle
                      }
                    />

                    {temConfrontosOficiais ? (
                      <strong
                        style={
                          nomeTimeStyle
                        }
                      >
                        {jogo.timeB ||
                          "Time B"}
                      </strong>
                    ) : (
                      <input
                        placeholder="Time B"
                        value={jogo.timeB}
                        onChange={(e) =>
                          alterarJogo(
                            fase.chave,
                            index,
                            "timeB",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />
                    )}
                  </div>

                  <input
                    placeholder="Classificado"
                    value={
                      jogo.classificado
                    }
                    onChange={(e) =>
                      alterarJogo(
                        fase.chave,
                        index,
                        "classificado",
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  />

                  <label
                    style={checkboxLabelStyle}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(
                        jogo.decididoNosPenaltis
                      )}
                      onChange={(e) =>
                        alterarJogo(
                          fase.chave,
                          index,
                          "decididoNosPenaltis",
                          e.target.checked
                        )
                      }
                    />
                    Decidido nos penaltis
                  </label>
                </div>
              )
            )}
          </div>
        </section>
      ))}

      <button
        onClick={salvar}
        style={botaoSalvar}
      >
        Salvar
      </button>

      <button
        onClick={voltar}
        style={botaoVoltar}
      >
        Voltar
      </button>
    </div>
  );
}

const paginaStyle = {
  minHeight: "100vh",
  backgroundColor: "#0d0d0d",
  color: "white",
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  padding: "clamp(16px, 4vw, 30px)",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const tituloStyle = {
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1.15,
};

const textoApoioStyle = {
  color: "#ddd",
  maxWidth: "720px",
};

const avisoAbertoStyle = {
  backgroundColor: "#0d6efd",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontWeight: "bold",
  maxWidth: "100%",
  overflowWrap: "anywhere",
};

const avisoEncerradoStyle = {
  backgroundColor: "#dc3545",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontWeight: "bold",
  maxWidth: "100%",
  overflowWrap: "anywhere",
};

const secaoStyle = {
  backgroundColor: "#1a1a1a",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: "8px",
  marginBottom: "20px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const listaJogosStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "14px",
};

const jogoStyle = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "10px",
};

const confrontoStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) 56px 20px 56px minmax(0, 1fr)",
  alignItems: "center",
  gap: "8px",
};

const dadosJogoStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  color: "#ccc",
  fontSize: "14px",
};

const nomeTimeStyle = {
  minWidth: 0,
  overflowWrap: "anywhere",
};

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px",
};

const placarStyle = {
  ...inputStyle,
  textAlign: "center",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#ddd",
  fontSize: "14px",
};

const botaoSalvar = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  width: "min(100%, 180px)",
  marginRight: "10px",
  marginBottom: "10px",
};

const botaoVoltar = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  width: "min(100%, 140px)",
  marginBottom: "10px",
};

export default PalpitesMataMata;
