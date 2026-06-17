import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import DetalheParticipante from "../components/DetalheParticipante";
import { db } from "../firebase";
import { calcularPontuacao } from "../utils/calcularPontuacao";
import {
  calcularDetalhesPontuacaoMataMata,
  calcularPontuacaoMataMata,
} from "../utils/calcularPontuacaoMataMata";

const fasesMataMata = [
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

const temJogosMataMata = (dados) =>
  dados?.jogos &&
  fasesMataMata.some((fase) =>
    Array.isArray(
      dados.jogos[fase]
    )
  );

const placarPreenchido = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "";

const calcularPontosMaximosMataMata = (
  resultadoMataMata
) => {
  if (!resultadoMataMata) return 0;

  if (temJogosMataMata(resultadoMataMata)) {
    return fasesMataMata.reduce(
      (total, fase) => {
        const jogos =
          resultadoMataMata.jogos[
            fase
          ] || [];

        return (
          total +
          jogos.reduce(
            (subtotal, jogo) => {
              let pontos = 0;

              if (placarPreenchido(jogo)) {
                pontos += 10;
                pontos += 5;
              }

              if (jogo.classificado) {
                pontos += 5;
              }

              if (
                jogo.decididoNosPenaltis ===
                true
              ) {
                pontos += 3;
              }

              if (
                placarPreenchido(jogo) &&
                jogo.classificado
              ) {
                pontos += 2;
              }

              return subtotal + pontos;
            },
            0
          )
        );
      },
      0
    );
  }

  return (
    (resultadoMataMata.oitavas?.length || 0) * 2 +
    (resultadoMataMata.quartas?.length || 0) * 4 +
    (resultadoMataMata.semifinal?.length || 0) * 6 +
    (resultadoMataMata.final?.length || 0) * 10 +
    (resultadoMataMata.campeao ? 20 : 0)
  );
};

const pontosFaseMataMata = (
  participante,
  fase
) =>
  participante
    .detalhesMataMata?.[fase] || 0;

const estiloBadgePosicao = (posicao) => {
  if (posicao === 1) {
    return posicaoPrimeiroStyle;
  }

  if (posicao === 2) {
    return posicaoSegundoStyle;
  }

  if (posicao === 3) {
    return posicaoTerceiroStyle;
  }

  return posicaoStyle;
};

const tituloPosicao = (posicao) => {
  if (posicao === 1) return "🏆 Lider";
  if (posicao === 2) return "🥈 Vice-lider";
  if (posicao === 3) return "🥉 3o lugar";
  return null;
};

const marcadorFase = (pontos) =>
  pontos > 0 ? "🟢" : "⚪";

function Ranking({ voltar }) {
  const [ranking, setRanking] = useState([]);
  const [arrecadacao, setArrecadacao] =
    useState(0);
  const [busca, setBusca] =
    useState("");
  const [modoRanking, setModoRanking] =
    useState("mataMata");
  const [
    participanteSelecionado,
    setParticipanteSelecionado,
  ] = useState(null);
  const [estatisticas, setEstatisticas] =
    useState({
      participantes: 0,
      pagos: 0,
      pendentes: 0,
      comPalpite: 0,
      semPalpite: 0,
    });
  const [
    ultimaAtualizacao,
    setUltimaAtualizacao,
  ] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      const resultadoSnapshot =
        await getDoc(
          doc(db, "resultados", "grupos")
        );

      const resultadoMataMataSnapshot =
        await getDoc(
          doc(
            db,
            "resultados",
            "mataMata"
          )
        );

      const resultadoMataMata =
        resultadoMataMataSnapshot.exists()
          ? resultadoMataMataSnapshot.data()
          : null;

      const resultados =
        resultadoSnapshot.exists()
          ? resultadoSnapshot.data()
          : {};

      const usuariosSnapshot =
        await getDocs(
          collection(db, "usuarios")
        );

      const listaRanking = [];
      let pagos = 0;
      let arrecadacaoTotal = 0;
      let comPalpite = 0;

      for (const usuarioDoc of usuariosSnapshot.docs) {
        const usuario =
          usuarioDoc.data();

        if (usuario.pagamento) {
          pagos++;
          arrecadacaoTotal += 20;
        }

        const palpiteSnapshot =
          await getDoc(
            doc(
              db,
              "palpites",
              usuarioDoc.id
            )
          );

        let pontosGrupos = 0;
        let pontosMataMata = 0;
        let detalhesMataMata = null;
        let palpiteMataMata = null;
        const palpites =
          palpiteSnapshot.exists()
            ? palpiteSnapshot.data()
            : {};

        if (palpiteSnapshot.exists()) {
          comPalpite++;

          Object.keys(resultados).forEach(
            (grupo) => {
              pontosGrupos +=
                calcularPontuacao(
                  palpites[grupo],
                  resultados[grupo]
                );
            }
          );
        }

        const mataMataSnapshot =
          await getDoc(
            doc(
              db,
              "palpitesMataMata",
              usuarioDoc.id
            )
          );

        if (
          mataMataSnapshot.exists() &&
          resultadoMataMata
        ) {
          palpiteMataMata =
            mataMataSnapshot.data();

          detalhesMataMata =
            calcularDetalhesPontuacaoMataMata(
              palpiteMataMata,
              resultadoMataMata
            );

          pontosMataMata =
            calcularPontuacaoMataMata(
              palpiteMataMata,
              resultadoMataMata
            );
        }

        const participante = {
          nome:
            usuario.apelido ||
            usuario.nome ||
            "Sem nome",
          pontos:
            pontosGrupos +
            pontosMataMata,
          pontosGrupos,
          pontosMataMata,
          detalhesMataMata,
          palpiteMataMata,
          resultadoMataMata,
          diferencaLider: 0,
          posicao: 0,
          premiacao: 0,
          detalhes: {},
          palpites,
          resultados,
          acertosExatos: 0,
          acertosParciais: 0,
          aproveitamento: 0,
          medalhas: [],
        };

        Object.keys(resultados).forEach(
          (grupo) => {
            const palpiteGrupo =
              palpites?.[grupo] || {};
            const resultadoGrupo =
              resultados?.[grupo] || {};
            let acertosExatos = 0;

            [
              "primeiro",
              "segundo",
              "terceiro",
              "quarto",
            ].forEach((posicao) => {
              if (
                palpiteGrupo[posicao] &&
                resultadoGrupo[posicao] &&
                palpiteGrupo[posicao] ===
                  resultadoGrupo[posicao]
              ) {
                acertosExatos++;
              }
            });

            const pontosGrupo =
              calcularPontuacao(
                palpiteGrupo,
                resultadoGrupo
              );

            participante.detalhes[
              grupo
            ] = {
              palpite: palpiteGrupo,
              resultado: resultadoGrupo,
              pontos: pontosGrupo,
              acertosExatos,
              acertosParciais: 0,
              acertosGrupo:
                acertosExatos,
            };

            participante.acertosExatos +=
              acertosExatos;
          }
        );

        let pontosMaximos = 0;

        Object.values(resultados || {}).forEach(
          (grupo) => {
            if (grupo?.primeiro)
              pontosMaximos += 10;
            if (grupo?.segundo)
              pontosMaximos += 10;
            if (grupo?.terceiro)
              pontosMaximos += 3;
            if (grupo?.quarto)
              pontosMaximos += 2;

            pontosMaximos += 10;
          }
        );

        if (resultadoMataMata) {
          pontosMaximos +=
            calcularPontosMaximosMataMata(
              resultadoMataMata
            );
        }

        participante.aproveitamento =
          pontosMaximos > 0
            ? (
                (participante.pontos /
                  pontosMaximos) *
                100
              ).toFixed(1)
            : 0;

        listaRanking.push(participante);
      }

      listaRanking.sort((a, b) => {
        if (b.pontos !== a.pontos) {
          return b.pontos - a.pontos;
        }

        if (
          (b.acertosExatos || 0) !==
          (a.acertosExatos || 0)
        ) {
          return (
            (b.acertosExatos || 0) -
            (a.acertosExatos || 0)
          );
        }

        if (
          Number(
            b.aproveitamento || 0
          ) !==
          Number(
            a.aproveitamento || 0
          )
        ) {
          return (
            Number(
              b.aproveitamento || 0
            ) -
            Number(
              a.aproveitamento || 0
            )
          );
        }

        return a.nome.localeCompare(
          b.nome
        );
      });

      listaRanking.forEach(
        (participante, index) => {
          participante.posicao =
            index + 1;
          participante.diferencaLider =
            listaRanking.length > 0
              ? listaRanking[0].pontos -
                participante.pontos
              : 0;

          if (index === 0) {
            participante.premiacao =
              arrecadacaoTotal * 0.5;
          } else if (index === 1) {
            participante.premiacao =
              arrecadacaoTotal * 0.3;
          } else if (index === 2) {
            participante.premiacao =
              arrecadacaoTotal * 0.2;
          }
        }
      );

      const melhorAproveitamento =
        [...listaRanking].sort(
          (a, b) =>
            Number(
              b.aproveitamento || 0
            ) -
            Number(
              a.aproveitamento || 0
            )
        )[0];

      const reiDosAcertos =
        [...listaRanking].sort(
          (a, b) =>
            (b.acertosExatos || 0) -
            (a.acertosExatos || 0)
        )[0];

      if (listaRanking[0]) {
        listaRanking[0].medalhas.push(
          "Lider Atual"
        );
      }

      if (melhorAproveitamento) {
        melhorAproveitamento.medalhas.push(
          "Melhor Aproveitamento"
        );
      }

      if (reiDosAcertos) {
        reiDosAcertos.medalhas.push(
          "Rei dos Acertos"
        );
      }

      listaRanking.forEach(
        (participante) => {
          if (participante.posicao <= 3) {
            participante.medalhas.push(
              "Em Zona de Premiacao"
            );
          }
        }
      );

      setUltimaAtualizacao(
        new Date().toLocaleString("pt-BR")
      );
      setRanking(listaRanking);
      setArrecadacao(
        arrecadacaoTotal
      );
      setEstatisticas({
        participantes:
          usuariosSnapshot.docs.length,
        pagos,
        pendentes:
          usuariosSnapshot.docs.length -
          pagos,
        comPalpite,
        semPalpite:
          usuariosSnapshot.docs.length -
          comPalpite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const premio1 = arrecadacao * 0.5;
  const premio2 = arrecadacao * 0.3;
  const premio3 = arrecadacao * 0.2;
  const lider = ranking[0];
  const liderPontos =
    ranking.length > 0
      ? ranking[0].pontos
      : 0;

  const melhorAproveitamento =
    [...ranking].sort(
      (a, b) =>
        Number(
          b.aproveitamento || 0
        ) -
        Number(
          a.aproveitamento || 0
        )
    )[0];

  const maisAcertos =
    [...ranking].sort(
      (a, b) =>
        (b.acertosExatos || 0) -
        (a.acertosExatos || 0)
    )[0];

  const mestreMataMata =
    [...ranking].sort(
      (a, b) =>
        (b.pontosMataMata || 0) -
        (a.pontosMataMata || 0)
    )[0];

  const rankingMataMata =
    [...ranking].sort((a, b) => {
      const pontos =
        (b.pontosMataMata || 0) -
        (a.pontosMataMata || 0);
      if (pontos !== 0) return pontos;

      const final =
        pontosFaseMataMata(b, "final") -
        pontosFaseMataMata(a, "final");
      if (final !== 0) return final;

      const semifinal =
        pontosFaseMataMata(b, "semifinal") -
        pontosFaseMataMata(a, "semifinal");
      if (semifinal !== 0)
        return semifinal;

      const quartas =
        pontosFaseMataMata(b, "quartas") -
        pontosFaseMataMata(a, "quartas");
      if (quartas !== 0) return quartas;

      const oitavas =
        pontosFaseMataMata(b, "oitavas") -
        pontosFaseMataMata(a, "oitavas");
      if (oitavas !== 0) return oitavas;

      return a.nome.localeCompare(
        b.nome
      );
    });

  const rankingAtual =
    modoRanking === "mataMata"
      ? rankingMataMata
      : ranking;

  const rankingExibido =
    modoRanking === "mataMata"
      ? rankingAtual
      : rankingAtual.slice(3);

  const posicaoVisual = (index) =>
    modoRanking === "mataMata"
      ? index + 1
      : index + 4;

  const diferenca = (pontos) => {
    const diff =
      liderPontos - pontos;

    if (diff === 0) {
      return "Lider";
    }

    return "(-" + diff + " pts)";
  };

  const abrirDetalheParticipante = (
    participante,
    posicaoAtual = participante?.posicao
  ) => {
    if (!participante) return;

    setParticipanteSelecionado(
      {
        ...participante,
        posicaoModal: posicaoAtual,
        emZonaPremiacao:
          posicaoAtual <= 3,
      }
    );
  };

  const renderTabs = () => (
    <div style={tabsStyle}>
      <button
        onClick={() =>
          setModoRanking("geral")
        }
        style={
          modoRanking === "geral"
            ? tabAtivaStyle
            : tabStyle
        }
      >
        🏆 Geral
      </button>

      <button
        onClick={() =>
          setModoRanking("mataMata")
        }
        style={
          modoRanking === "mataMata"
            ? tabAtivaStyle
            : tabStyle
        }
      >
        ⚽ Mata-Mata
      </button>
    </div>
  );

  const renderBreakdownMataMata = (
    participante
  ) => (
    <div style={breakdownGridStyle}>
      {[
        ["Oitavas", "oitavas"],
        ["Quartas", "quartas"],
        ["Semifinal", "semifinal"],
        ["Final", "final"],
      ].map(([label, fase]) => (
        <div
          key={fase}
          style={breakdownChipStyle}
        >
          <span style={breakdownLabelStyle}>
            {marcadorFase(
              pontosFaseMataMata(
                participante,
                fase
              )
            )}{" "}
            {label}
          </span>
          <strong>
            {pontosFaseMataMata(
              participante,
              fase
            )}{" "}
            pts
          </strong>
        </div>
      ))}
    </div>
  );

  const renderPodioCard = (
    participante,
    posicao,
    estilo,
    diferencaTexto
  ) => (
    <div
      className="ranking-v37-podium-card"
      onClick={
        participante
          ? () =>
              abrirDetalheParticipante(
                participante,
                posicao
              )
          : undefined
      }
      style={{
        ...estilo,
        cursor: participante
          ? "pointer"
          : "default",
      }}
    >
      <div
        style={estiloBadgePosicao(posicao)}
      >
        #{posicao}
      </div>

      <div style={podioInfoStyle}>
        {tituloPosicao(posicao) && (
          <span style={podioTituloStyle}>
            {tituloPosicao(posicao)}
          </span>
        )}

        <strong style={podioNomeStyle}>
          {participante?.nome || "---"}
        </strong>

        <span style={podioMetaStyle}>
          ⭐ {participante?.pontos || 0} pts
        </span>

        <span style={podioMetaStyle}>
          📉 {diferencaTexto}
        </span>
      </div>

    </div>
  );

  return (
    <div
      className="ranking-v37"
      style={paginaStyle}
    >
      <h1 style={tituloStyle}>
        {modoRanking === "mataMata"
          ? "⚽ Ranking Mata-Mata"
          : "🏆 Ranking Geral"}
      </h1>

      <p style={textoSecundarioStyle}>
        Ultima atualizacao:{" "}
        {ultimaAtualizacao}
      </p>

      <div style={acoesStyle}>
        <button
          className="ranking-v37-button"
          onClick={carregarRanking}
          style={botaoAtualizarStyle}
        >
          🔄 Atualizar Ranking
        </button>
      </div>

      {renderTabs()}

      <div style={buscaWrapperStyle}>
        <input
          className="ranking-v37-input"
          type="text"
          placeholder="🔍 Buscar participante..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          style={inputBuscaStyle}
        />
      </div>

      {modoRanking === "geral" && (
        <>
          <div style={resumoGridStyle}>
          <div
            className="ranking-v37-card"
            style={cardStyle}
          >
            <h2>📊 Estatisticas</h2>
            <p>
              👥 Participantes:{" "}
              {estatisticas.participantes}
            </p>
            <p>
              ✅ Pagos: {estatisticas.pagos}
            </p>
            <p>
              ⏳ Pendentes:{" "}
              {estatisticas.pendentes}
            </p>
            <p>
              📝 Palpites enviados:{" "}
              {estatisticas.comPalpite}
            </p>
            <p>
              ⚠️ Sem palpite:{" "}
              {estatisticas.semPalpite}
            </p>
          </div>

          <div
            className="ranking-v37-card"
            style={cardStyle}
          >
            <h2>💰 Premiacao</h2>
            <p>
              🧾 Arrecadacao: R${" "}
              {arrecadacao.toFixed(2)}
            </p>
            <p>
              🥇 1o Lugar: R${" "}
              {premio1.toFixed(2)}
            </p>
            <p>
              🥈 2o Lugar: R${" "}
              {premio2.toFixed(2)}
            </p>
            <p>
              🥉 3o Lugar: R${" "}
              {premio3.toFixed(2)}
            </p>
          </div>

          <div
            className="ranking-v37-card"
            style={cardStyle}
          >
            <h2>🔥 Destaques</h2>
            <p>
              🏆 Lider: {lider?.nome || "-"} (
              {lider?.pontos || 0} pts)
            </p>
            <p>
              📈 Melhor Aproveitamento:{" "}
              {melhorAproveitamento?.nome ||
                "-"}{" "}
              (
              {melhorAproveitamento?.aproveitamento ||
                0}
              %)
            </p>
            <p>
              🎯 Mais Acertos Exatos:{" "}
              {maisAcertos?.nome || "-"} (
              {maisAcertos?.acertosExatos ||
                0}
              )
            </p>
            <p>
              ⚽ Mestre do Mata-Mata:{" "}
              {mestreMataMata?.nome || "-"}
            </p>
            <p>
              🏆 Pontos Mata-Mata:{" "}
              {mestreMataMata
                ?.pontosMataMata || 0}
            </p>
          </div>

          </div>

          <div style={podioWrapperStyle}>
            <h2>🏆 Podio</h2>
            <div
              className="ranking-v37-podium"
              style={podioStyle}
            >
              {renderPodioCard(
                ranking[0],
                1,
                podioPrimeiroStyle,
                "Lider"
              )}

              <div style={podioMenoresStyle}>
                {renderPodioCard(
                  ranking[1],
                  2,
                  podioSegundoStyle,
                  ranking[1]
                    ? diferenca(
                        ranking[1].pontos
                      )
                    : "-"
                )}

                {renderPodioCard(
                  ranking[2],
                  3,
                  podioTerceiroStyle,
                  ranking[2]
                    ? diferenca(
                        ranking[2].pontos
                      )
                    : "-"
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className="ranking-v37-card"
        style={cardStyle}
      >
        <h2>
          {modoRanking === "mataMata"
            ? "⚽ Classificacao Mata-Mata"
            : "🏆 Classificacao Completa"}
        </h2>

        {rankingExibido
          .filter((participante) =>
            (participante.nome || "")
              .toLowerCase()
              .includes(
                busca.toLowerCase()
              )
          )
          .map(
            (participante, index) => (
              <div
                key={`${modoRanking}-${participante.nome}-${index}`}
                onClick={() =>
                  abrirDetalheParticipante(
                    participante,
                    posicaoVisual(index)
                  )
                }
                style={
                  posicaoVisual(index) === 1
                    ? itemLiderStyle
                    : itemRankingStyle
                }
              >
                <div style={itemHeaderStyle}>
                  <div
                    style={estiloBadgePosicao(
                      posicaoVisual(index)
                    )}
                  >
                    #{posicaoVisual(index)}
                  </div>

                  <div style={nomeBlocoStyle}>
                    {tituloPosicao(
                      posicaoVisual(index)
                    ) && (
                      <span
                        style={
                          destaquePosicaoStyle
                        }
                      >
                        {tituloPosicao(
                          posicaoVisual(index)
                        )}
                      </span>
                    )}

                    <strong style={nomeStyle}>
                      {participante.nome}
                    </strong>

                    {modoRanking === "geral" && (
                      <span
                        style={
                          diferencaStyle
                        }
                      >
                        📉{" "}
                        {diferenca(
                          participante.pontos
                        )}
                      </span>
                    )}
                  </div>

                  <div style={pontosStyle}>
                    <strong>
                      {modoRanking ===
                      "mataMata"
                        ? "🏆 "
                        : "⭐ "}
                      {modoRanking ===
                      "mataMata"
                        ? participante.pontosMataMata ||
                          0
                        : participante.pontos}
                    </strong>
                    <span>pts</span>
                  </div>
                </div>

                {modoRanking === "mataMata" && (
                  renderBreakdownMataMata(
                    participante
                  )
                )}
              </div>
            )
          )}
      </div>

      <DetalheParticipante
        participante={
          participanteSelecionado
        }
        fechar={() =>
          setParticipanteSelecionado(null)
        }
      />

      <button
        className="ranking-v37-button"
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
  fontFamily: "Arial, sans-serif",
  overflowWrap: "anywhere",
};

const tituloStyle = {
  textAlign: "center",
  fontSize: "clamp(24px, 5vw, 42px)",
};

const textoSecundarioStyle = {
  color: "#999",
  marginBottom: "20px",
};

const acoesStyle = {
  marginBottom: "20px",
};

const botaoAtualizarStyle = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  maxWidth: "100%",
};

const tabsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "20px",
};

const tabStyle = {
  backgroundColor: "#343a40",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  minWidth: "130px",
  flex: "1 1 130px",
  maxWidth: "220px",
};

const tabAtivaStyle = {
  ...tabStyle,
  backgroundColor: "#f5b301",
  color: "#120d00",
};

const buscaWrapperStyle = {
  marginBottom: "20px",
};

const cardStyle = {
  backgroundColor: "#181818",
  padding: "clamp(16px, 4vw, 20px)",
  borderRadius: "8px",
  marginBottom: "20px",
  maxWidth: "100%",
  boxSizing: "border-box",
  border: "1px solid #2c2c2c",
};

const resumoGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
  alignItems: "stretch",
};

const podioWrapperStyle = {
  marginBottom: "25px",
};

const podioStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
  marginTop: "20px",
  maxWidth: "100%",
  width: "100%",
};

const podioCardStyle = {
  minWidth: 0,
  padding: "12px",
  borderRadius: "8px",
  textAlign: "left",
  overflowWrap: "anywhere",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns:
    "48px minmax(0, 1fr) minmax(78px, auto)",
  alignItems: "center",
  gap: "10px",
  border: "1px solid rgba(255,255,255,0.14)",
};

const podioSegundoStyle = {
  ...podioCardStyle,
  backgroundColor: "#30343a",
};

const podioPrimeiroStyle = {
  ...podioCardStyle,
  backgroundColor: "#4c3900",
  borderColor: "#f5b301",
  padding: "14px",
};

const podioTerceiroStyle = {
  ...podioCardStyle,
  backgroundColor: "#3f2812",
};

const podioMenoresStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const podioPosicaoStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,255,255,0.16)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const podioInfoStyle = {
  minWidth: 0,
  display: "grid",
  gap: "3px",
};

const podioNomeStyle = {
  color: "white",
  lineHeight: 1.2,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const podioMetaStyle = {
  color: "#ddd",
  fontSize: "13px",
  lineHeight: 1.2,
};

const podioTituloStyle = {
  color: "#ffd76a",
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: 1.2,
};

const inputBuscaStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
};

const itemRankingStyle = {
  padding: "14px",
  border: "1px solid #333",
  borderRadius: "8px",
  backgroundColor: "#171717",
  cursor: "pointer",
  overflowWrap: "anywhere",
  lineHeight: 1.35,
  marginBottom: "12px",
  boxSizing: "border-box",
};

const itemLiderStyle = {
  ...itemRankingStyle,
  backgroundColor: "#241f10",
  borderColor: "#f5b301",
};

const itemHeaderStyle = {
  display: "grid",
  gridTemplateColumns:
    "48px minmax(0, 1fr) minmax(74px, auto)",
  alignItems: "center",
  gap: "12px",
};

const posicaoStyle = {
  width: "48px",
  minWidth: "48px",
  height: "44px",
  borderRadius: "8px",
  backgroundColor: "#242424",
  border: "1px solid #3b3b3b",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  letterSpacing: "0",
};

const posicaoPrimeiroStyle = {
  ...posicaoStyle,
  backgroundColor: "#3a2a00",
  border: "1px solid #f5b301",
  color: "#ffd76a",
};

const posicaoSegundoStyle = {
  ...posicaoStyle,
  backgroundColor: "#2f3237",
  border: "1px solid #bfc5cf",
  color: "#f1f5f9",
};

const posicaoTerceiroStyle = {
  ...posicaoStyle,
  backgroundColor: "#3a2513",
  border: "1px solid #c47a2c",
  color: "#f3c08d",
};

const nomeBlocoStyle = {
  minWidth: 0,
  display: "grid",
  gap: "4px",
  textAlign: "left",
};

const nomeStyle = {
  color: "white",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.25,
};

const destaquePosicaoStyle = {
  color: "#ffd76a",
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: 1.2,
};

const pontosStyle = {
  justifySelf: "end",
  minWidth: "84px",
  borderRadius: "8px",
  backgroundColor: "#3a2a00",
  border: "1px solid #a77a00",
  color: "#ffd76a",
  padding: "8px 10px",
  display: "grid",
  gap: "1px",
  textAlign: "center",
  lineHeight: 1.1,
};

const diferencaStyle = {
  color: "#999",
  fontSize: "13px",
};

const breakdownGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(118px, 1fr))",
  gap: "8px",
  marginTop: "12px",
};

const breakdownChipStyle = {
  backgroundColor: "#202020",
  border: "1px solid #3a3a3a",
  borderRadius: "8px",
  padding: "8px 10px",
  display: "grid",
  gap: "2px",
  textAlign: "left",
  minWidth: 0,
};

const breakdownLabelStyle = {
  color: "#bbb",
  fontSize: "12px",
  lineHeight: 1.2,
};

const botaoVoltarStyle = {
  marginTop: "20px",
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  maxWidth: "100%",
};

export default Ranking;
