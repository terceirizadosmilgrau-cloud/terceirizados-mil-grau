import {
  useEffect,
  useState,
} from "react";
import { doc, getDoc } from "firebase/firestore";

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

const normalizarJogos = (dados = {}) => {
  const jogosSalvos = dados.jogos || {};

  return fases.reduce((acc, fase) => {
    const jogosDaFase = Array.isArray(
      jogosSalvos[fase.chave]
    )
      ? jogosSalvos[fase.chave]
      : [];

    const classificadosAntigos =
      Array.isArray(dados[fase.chave])
        ? dados[fase.chave]
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
  const jogosSalvos = dados.jogos || {};

  return fases.reduce((acc, fase) => {
    const jogosDaFase = Array.isArray(
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
          timeA: jogoSalvo.timeA || "",
          timeB: jogoSalvo.timeB || "",
          data: jogoSalvo.data || "",
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
  const jogosSalvos = dadosSalvos.jogos || {};

  return fases.reduce((acc, fase) => {
    const baseDaFase = Array.isArray(
      confrontos[fase.chave]
    )
      ? confrontos[fase.chave]
      : [];

    const jogosDaFase = Array.isArray(
      jogosSalvos[fase.chave]
    )
      ? jogosSalvos[fase.chave]
      : [];

    const classificadosAntigos =
      Array.isArray(dadosSalvos[fase.chave])
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

const normalizarTexto = (valor) =>
  String(valor || "")
    .toLowerCase()
    .trim();

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const jogoEncerrado = (jogo) =>
  placarPreenchido(jogo) &&
  Boolean(
    normalizarTexto(jogo?.classificado)
  );

const placarExato = (
  palpite,
  resultado
) =>
  placarPreenchido(palpite) &&
  jogoEncerrado(resultado) &&
  String(palpite.placarA).trim() ===
    String(resultado.placarA).trim() &&
  String(palpite.placarB).trim() ===
    String(resultado.placarB).trim();

const classificadoCorreto = (
  palpite,
  resultado
) =>
  Boolean(
    normalizarTexto(palpite?.classificado)
  ) &&
  jogoEncerrado(resultado) &&
  normalizarTexto(palpite.classificado) ===
    normalizarTexto(
      resultado.classificado
    );

const penaltisCorreto = (
  palpite,
  resultado
) =>
  resultado?.decididoNosPenaltis === true &&
  palpite?.decididoNosPenaltis === true;

function ResumoMataMata({
  usuario,
  voltar,
}) {
  const [palpite, setPalpite] =
    useState(null);
  const [jogos, setJogos] = useState({});
  const [
    resultadosJogos,
    setResultadosJogos,
  ] = useState({});
  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      const palpiteSnapshot =
        await getDoc(
          doc(
            db,
            "palpitesMataMata",
            usuario.uid
          )
        );

      if (!palpiteSnapshot.exists()) {
        setPalpite(null);
        return;
      }

      const dadosPalpite =
        palpiteSnapshot.data();

      const [
        configSnapshot,
        resultadoSnapshot,
      ] = await Promise.all([
        getDoc(
          doc(
            db,
            "configuracoes",
            "mataMata"
          )
        ),
        getDoc(
          doc(
            db,
            "resultados",
            "mataMata"
          )
        ),
      ]);

      if (configSnapshot.exists()) {
        const confrontos =
          normalizarConfrontosOficiais(
            configSnapshot.data()
          );

        setJogos(
          existemConfrontosOficiais(
            confrontos
          )
            ? mesclarJogosComConfrontos(
                confrontos,
                dadosPalpite
              )
            : normalizarJogos(
                dadosPalpite
              )
        );
      } else {
        setJogos(
          normalizarJogos(dadosPalpite)
        );
      }

      if (resultadoSnapshot.exists()) {
        setResultadosJogos(
          normalizarJogos(
            resultadoSnapshot.data()
          )
        );
      } else {
        setResultadosJogos({});
      }

      setPalpite(dadosPalpite);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const temJogos = fases.some((fase) =>
    (jogos[fase.chave] || []).some(
      (jogo) =>
        jogo.timeA ||
        jogo.timeB ||
        jogo.placarA ||
        jogo.placarB ||
        jogo.classificado
    )
  );

  const renderBadge = (
    texto,
    estilo
  ) => (
    <span style={estilo}>
      {texto}
    </span>
  );

  const renderIndicadores = (
    jogo,
    resultado
  ) => {
    if (!jogoEncerrado(resultado)) {
      return (
        <div style={statusLinhaStyle}>
          {renderBadge(
            "Pendente",
            statusPendenteStyle
          )}
        </div>
      );
    }

    const acertouPlacar =
      placarExato(jogo, resultado);
    const acertouClassificado =
      classificadoCorreto(
        jogo,
        resultado
      );
    const deveCompararPenaltis =
      resultado.decididoNosPenaltis ===
      true;
    const acertouPenaltis =
      penaltisCorreto(jogo, resultado);

    return (
      <div style={indicadoresStyle}>
        <div style={statusLinhaStyle}>
          {renderBadge(
            "Encerrado",
            statusEncerradoStyle
          )}
        </div>

        <div style={resultadoOficialStyle}>
          Resultado oficial:{" "}
          <strong>
            {resultado.placarA} x{" "}
            {resultado.placarB}
          </strong>{" "}
          |{" "}
          <strong>
            {resultado.classificado}
          </strong>
        </div>

        <div style={chipsStyle}>
          {renderBadge(
            `${acertouPlacar ? "OK" : "X"} Placar`,
            acertouPlacar
              ? chipAcertoStyle
              : chipErroStyle
          )}

          {renderBadge(
            `${
              acertouClassificado
                ? "OK"
                : "X"
            } Classificado`,
            acertouClassificado
              ? chipAcertoStyle
              : chipErroStyle
          )}

          {deveCompararPenaltis &&
            renderBadge(
              `${
                acertouPenaltis
                  ? "OK"
                  : "X"
              } Penaltis`,
              acertouPenaltis
                ? chipAcertoStyle
                : chipErroStyle
            )}
        </div>
      </div>
    );
  };

  return (
    <div style={paginaStyle}>
      <h1 style={tituloStyle}>
        ⚽ Resumo Mata-Mata
      </h1>

      {carregando && (
        <div style={cardStyle}>
          Carregando resumo...
        </div>
      )}

      {!carregando &&
        (!palpite || !temJogos) && (
          <div style={cardStyle}>
            Nenhum palpite Mata-Mata
            encontrado.
          </div>
        )}

      {!carregando &&
        palpite &&
        temJogos && (
          <>
            {palpite.campeao && (
              <div style={destaqueStyle}>
                <span style={labelStyle}>
                  Campeão escolhido
                </span>
                <strong>
                  {palpite.campeao}
                </strong>
              </div>
            )}

            {fases.map((fase) => (
              <section
                key={fase.chave}
                style={cardStyle}
              >
                <h2 style={faseTituloStyle}>
                  {fase.titulo}
                </h2>

                <div style={jogosGridStyle}>
                  {(jogos[fase.chave] || []).map(
                    (jogo, index) => {
                      const resultado =
                        resultadosJogos[
                          fase.chave
                        ]?.[index] || {};

                      return (
                        <div
                          key={
                            jogo.id ||
                            `${fase.chave}-${index}`
                          }
                          style={jogoStyle}
                        >
                          <strong>
                            Jogo {index + 1}
                          </strong>

                          <div
                            style={
                              confrontoStyle
                            }
                          >
                            <span>
                              {jogo.timeA ||
                                "Time A"}
                            </span>
                            <strong>
                              {jogo.placarA ||
                                "0"}{" "}
                              x{" "}
                              {jogo.placarB ||
                                "0"}
                            </strong>
                            <span>
                              {jogo.timeB ||
                                "Time B"}
                            </span>
                          </div>

                          <span>
                            Classificado:{" "}
                            <strong>
                              {jogo.classificado ||
                                "-"}
                            </strong>
                          </span>

                          {jogo.decididoNosPenaltis && (
                            <span
                              style={penaltisStyle}
                            >
                              Decidido nos pênaltis
                            </span>
                          )}

                          {renderIndicadores(
                            jogo,
                            resultado
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            ))}
          </>
        )}

      <button
        onClick={voltar}
        style={botaoVoltarStyle}
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
  fontFamily: "Arial, sans-serif",
};

const tituloStyle = {
  fontSize: "clamp(28px, 6vw, 42px)",
  lineHeight: 1.15,
};

const cardStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "clamp(16px, 4vw, 20px)",
  marginBottom: "18px",
  boxSizing: "border-box",
};

const destaqueStyle = {
  ...cardStyle,
  borderColor: "#ffc107",
  display: "grid",
  gap: "6px",
};

const labelStyle = {
  color: "#cfcfcf",
  fontSize: "14px",
};

const faseTituloStyle = {
  marginTop: 0,
};

const jogosGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const jogoStyle = {
  border: "1px solid #2b2b2b",
  borderRadius: "8px",
  padding: "16px",
  display: "grid",
  gap: "12px",
  backgroundColor: "#111",
};

const confrontoStyle = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) auto minmax(0, 1fr)",
  gap: "8px",
  alignItems: "center",
  textAlign: "center",
};

const penaltisStyle = {
  color: "#ffc107",
  fontWeight: "bold",
  fontSize: "14px",
};

const indicadoresStyle = {
  borderTop: "1px solid #242424",
  paddingTop: "12px",
  display: "grid",
  gap: "9px",
};

const statusLinhaStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  alignItems: "center",
};

const badgeBaseStyle = {
  borderRadius: "6px",
  padding: "4px 7px",
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: 1.2,
};

const statusPendenteStyle = {
  ...badgeBaseStyle,
  backgroundColor: "#262626",
  border: "1px solid #3a3a3a",
  color: "#cfcfcf",
};

const statusEncerradoStyle = {
  ...badgeBaseStyle,
  backgroundColor: "#1d2a22",
  border: "1px solid #34513c",
  color: "#bfe7c9",
};

const chipsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
};

const chipBaseStyle = {
  borderRadius: "6px",
  padding: "4px 7px",
  fontSize: "12px",
  lineHeight: 1.2,
};

const chipAcertoStyle = {
  ...chipBaseStyle,
  backgroundColor: "#17251b",
  border: "1px solid #2d5a38",
  color: "#a9d8b5",
};

const chipErroStyle = {
  ...chipBaseStyle,
  backgroundColor: "#2a1719",
  border: "1px solid #5b3035",
  color: "#e6a8ae",
};

const resultadoOficialStyle = {
  color: "#cfcfcf",
  fontSize: "13px",
  lineHeight: 1.4,
};

const botaoVoltarStyle = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  width: "min(100%, 140px)",
};

export default ResumoMataMata;
