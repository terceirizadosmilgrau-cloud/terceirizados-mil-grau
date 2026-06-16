import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  deleteDoc,
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

const obterInicioDoJogo = (jogo) => {
  if (!jogo?.data || !jogo?.horario) {
    return null;
  }

  const inicio = new Date(
    `${jogo.data}T${jogo.horario}:00`
  );

  if (Number.isNaN(inicio.getTime())) {
    return null;
  }

  return inicio;
};

const jogoIniciado = (
  jogo,
  agora = new Date()
) => {
  const inicio = obterInicioDoJogo(jogo);

  if (!inicio) return false;

  return agora >= inicio;
};

const formatarTempoAteTravamento = (
  jogo,
  agora = new Date()
) => {
  const inicio = obterInicioDoJogo(jogo);

  if (!inicio || agora >= inicio) {
    return "";
  }

  const diferenca = inicio - agora;
  const totalMinutos = Math.ceil(
    diferenca / (1000 * 60)
  );
  const dias = Math.floor(
    totalMinutos / (60 * 24)
  );
  const horas = Math.floor(
    (totalMinutos % (60 * 24)) / 60
  );
  const minutos = totalMinutos % 60;

  if (totalMinutos < 60) {
    return `${totalMinutos}min`;
  }

  if (dias > 0) {
    return `${dias}d ${String(
      horas
    ).padStart(2, "0")}h ${String(
      minutos
    ).padStart(2, "0")}min`;
  }

  return `${String(horas).padStart(
    2,
    "0"
  )}h ${String(minutos).padStart(
    2,
    "0"
  )}min`;
};

const mesclarJogosPreservandoTravados = (
  jogosAtuais = {},
  jogosPersistidos = {},
  agora = new Date()
) =>
  fases.reduce((acc, fase) => {
    const jogosDaFase =
      Array.isArray(
        jogosAtuais[fase.chave]
      )
        ? jogosAtuais[fase.chave]
        : [];

    const persistidosDaFase =
      Array.isArray(
        jogosPersistidos[fase.chave]
      )
        ? jogosPersistidos[fase.chave]
        : [];

    acc[fase.chave] = jogosDaFase.map(
      (jogo, index) =>
        jogoIniciado(jogo, agora)
          ? persistidosDaFase[index] ||
            jogo
          : jogo
    );

    return acc;
  }, {});

const algumJogoIniciado = (
  jogos = {},
  agora = new Date()
) =>
  fases.some((fase) =>
    (jogos[fase.chave] || []).some(
      (jogo) =>
        jogoIniciado(jogo, agora)
    )
  );

const limparJogoEditavel = (
  jogo,
  temConfrontosOficiais
) => ({
  ...jogo,
  timeA: temConfrontosOficiais
    ? jogo.timeA
    : "",
  timeB: temConfrontosOficiais
    ? jogo.timeB
    : "",
  placarA: "",
  placarB: "",
  classificado: "",
  decididoNosPenaltis: false,
});

const limparJogosPreservandoTravados = (
  jogosAtuais = {},
  jogosPersistidos = {},
  temConfrontosOficiais = false,
  agora = new Date()
) =>
  fases.reduce((acc, fase) => {
    const jogosDaFase =
      Array.isArray(
        jogosAtuais[fase.chave]
      )
        ? jogosAtuais[fase.chave]
        : [];

    const persistidosDaFase =
      Array.isArray(
        jogosPersistidos[fase.chave]
      )
        ? jogosPersistidos[fase.chave]
        : [];

    acc[fase.chave] = jogosDaFase.map(
      (jogo, index) =>
        jogoIniciado(jogo, agora)
          ? persistidosDaFase[index] ||
            jogo
          : limparJogoEditavel(
              jogo,
              temConfrontosOficiais
            )
    );

    return acc;
  }, {});

function PalpitesMataMata({
  usuario,
  voltar,
}) {
  const [jogos, setJogos] =
    useState(criarJogosVazios);

  const [
    jogosPersistidos,
    setJogosPersistidos,
  ] = useState(criarJogosVazios);

  const [
    temConfrontosOficiais,
    setTemConfrontosOficiais,
  ] = useState(false);

  const [agora, setAgora] = useState(
    () => new Date()
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    carregarPalpite();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(
      () => setAgora(new Date()),
      60000
    );

    return () =>
      clearInterval(intervalo);
  }, []);

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
          const jogosCarregados =
            possuiConfrontos
              ? mesclarJogosComConfrontos(
                  confrontos,
                  dadosPalpite
                )
              : normalizarJogos(
                  dadosPalpite
                );

          setJogos(jogosCarregados);
          setJogosPersistidos(
            jogosCarregados
          );

          return;
        }

        if (palpiteSnapshot.exists()) {
          const jogosCarregados =
            normalizarJogos(
              dadosPalpite
            );

          setJogos(jogosCarregados);
          setJogosPersistidos(
            jogosCarregados
          );
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
    try {
      const jogosParaSalvar =
        mesclarJogosPreservandoTravados(
          jogos,
          jogosPersistidos,
          new Date()
        );

      const classificados =
        fases.reduce((acc, fase) => {
          acc[fase.chave] =
            listarClassificados(
              jogosParaSalvar[
                fase.chave
              ]
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
          jogos: jogosParaSalvar,
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
      setJogos(jogosParaSalvar);
      setJogosPersistidos(
        jogosParaSalvar
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  const limparPalpites = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar seus palpites do Mata-Mata? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    try {
      if (!temConfrontosOficiais) {
        await deleteDoc(
          doc(
            db,
            "palpitesMataMata",
            usuario.uid
          )
        );

        setJogos(criarJogosVazios());
        setJogosPersistidos(
          criarJogosVazios()
        );

        alert(
          "Palpites do Mata-Mata apagados."
        );
        return;
      }

      const agoraLimpeza = new Date();
      const temJogosTravados =
        algumJogoIniciado(
          jogos,
          agoraLimpeza
        );

      const jogosLimpos =
        limparJogosPreservandoTravados(
          jogos,
          jogosPersistidos,
          temConfrontosOficiais,
          agoraLimpeza
        );

      const classificados =
        fases.reduce((acc, fase) => {
          acc[fase.chave] =
            listarClassificados(
              jogosLimpos[fase.chave]
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
          jogos: jogosLimpos,
          ...classificados,
          campeao:
            classificados.final[0] ||
            "",
          atualizadoEm:
            new Date().toISOString(),
        }
      );

      setJogos(jogosLimpos);
      setJogosPersistidos(
        jogosLimpos
      );

      alert(
        temJogosTravados
          ? "Palpites editaveis apagados. Jogos iniciados foram preservados."
          : "Palpites do Mata-Mata apagados."
      );
    } catch (error) {
      console.error(
        "Erro ao limpar palpites:",
        error
      );
      alert(
        "Erro ao limpar palpites."
      );
    }
  };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        Mata-Mata
      </h1>

      {temConfrontosOficiais && (
        <div style={avisoAbertoStyle}>
          Os jogos sao travados automaticamente
          no horario de inicio.
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
              (jogo, index) => {
                const iniciado =
                  jogoIniciado(
                    jogo,
                    agora
                  );
                const tempoAteTravamento =
                  formatarTempoAteTravamento(
                    jogo,
                    agora
                  );
                const travamentoProximo =
                  tempoAteTravamento &&
                  !tempoAteTravamento.includes(
                    "h"
                  ) &&
                  !tempoAteTravamento.includes(
                    "d"
                  );

                return (
                  <div
                    key={jogo.id}
                    style={{
                      ...jogoStyle,
                      ...(iniciado
                        ? jogoTravadoStyle
                        : {}),
                    }}
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

                  {iniciado && (
                    <div
                      style={avisoJogoTravadoStyle}
                    >
                      Jogo iniciado - palpite travado.
                    </div>
                  )}

                  {!iniciado &&
                    tempoAteTravamento && (
                      <div
                        style={{
                          ...avisoContagemStyle,
                          ...(travamentoProximo
                            ? avisoContagemProximaStyle
                            : {}),
                        }}
                      >
                        Trava em:{" "}
                        {tempoAteTravamento}
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
                        disabled={iniciado}
                        onChange={(e) =>
                          alterarJogo(
                            fase.chave,
                            index,
                            "timeA",
                            e.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          ...(iniciado
                            ? inputDesabilitadoStyle
                            : {}),
                        }}
                      />
                    )}

                    <input
                      inputMode="numeric"
                      placeholder="0"
                      value={jogo.placarA}
                      disabled={iniciado}
                      onChange={(e) =>
                        alterarJogo(
                          fase.chave,
                          index,
                          "placarA",
                          e.target.value
                        )
                      }
                      style={{
                        ...placarStyle,
                        ...(iniciado
                          ? inputDesabilitadoStyle
                          : {}),
                      }}
                    />

                    <span>X</span>

                    <input
                      inputMode="numeric"
                      placeholder="0"
                      value={jogo.placarB}
                      disabled={iniciado}
                      onChange={(e) =>
                        alterarJogo(
                          fase.chave,
                          index,
                          "placarB",
                          e.target.value
                        )
                      }
                      style={{
                        ...placarStyle,
                        ...(iniciado
                          ? inputDesabilitadoStyle
                          : {}),
                      }}
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
                        disabled={iniciado}
                        onChange={(e) =>
                          alterarJogo(
                            fase.chave,
                            index,
                            "timeB",
                            e.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          ...(iniciado
                            ? inputDesabilitadoStyle
                            : {}),
                        }}
                      />
                    )}
                  </div>

                  <input
                    placeholder="Classificado"
                    value={
                      jogo.classificado
                    }
                    disabled={iniciado}
                    onChange={(e) =>
                      alterarJogo(
                        fase.chave,
                        index,
                        "classificado",
                        e.target.value
                      )
                    }
                    style={{
                      ...inputStyle,
                      ...(iniciado
                        ? inputDesabilitadoStyle
                        : {}),
                    }}
                  />

                  <label
                    style={checkboxLabelStyle}
                  >
                    <input
                      type="checkbox"
                      disabled={iniciado}
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
                );
              }
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
        onClick={limparPalpites}
        style={botaoLimpar}
      >
        🗑 Limpar meus palpites Mata-Mata
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

const jogoTravadoStyle = {
  borderColor: "#7f1d1d",
  backgroundColor: "#171111",
};

const avisoJogoTravadoStyle = {
  backgroundColor: "#7f1d1d",
  border: "1px solid #dc3545",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  fontWeight: "bold",
};

const avisoContagemStyle = {
  backgroundColor: "#18202b",
  border: "1px solid #2f4056",
  color: "#d7e6f7",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "bold",
};

const avisoContagemProximaStyle = {
  backgroundColor: "#2b2412",
  borderColor: "#8a6d1f",
  color: "#ffe8a3",
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

const inputDesabilitadoStyle = {
  opacity: 0.75,
  cursor: "not-allowed",
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

const botaoLimpar = {
  backgroundColor: "#7f1d1d",
  color: "white",
  border: "1px solid #dc3545",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  width: "min(100%, 300px)",
  marginRight: "10px",
  marginBottom: "10px",
};

export default PalpitesMataMata;
