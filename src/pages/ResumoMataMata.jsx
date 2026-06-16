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

function ResumoMataMata({
  usuario,
  voltar,
}) {
  const [palpite, setPalpite] =
    useState(null);
  const [jogos, setJogos] = useState({});
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

      const configSnapshot =
        await getDoc(
          doc(
            db,
            "configuracoes",
            "mataMata"
          )
        );

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
                    (jogo, index) => (
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
                      </div>
                    )
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
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const jogoStyle = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "10px",
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
