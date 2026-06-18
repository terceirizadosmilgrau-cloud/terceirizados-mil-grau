import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./LandingPage.css";

const nomesFases = {
  oitavas: "Oitavas de final",
  quartas: "Quartas de final",
  semifinal: "Semifinal",
  final: "Final",
};

const formatadorDataAbsoluta =
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  });

const criarDataJogo = (data, horario) => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
    !/^\d{2}:\d{2}$/.test(horario)
  ) {
    return null;
  }

  const dataJogo = new Date(`${data}T${horario}:00`);

  return Number.isNaN(dataJogo.getTime())
    ? null
    : dataJogo;
};

const limparNomeTime = (nome = "") =>
  nome
    .trim()
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .trim();

const inicioDoDia = (data) =>
  new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  );

const formatarDataAmigavel = (
  dataJogo,
  agora
) => {
  const diferencaEmDias = Math.round(
    (inicioDoDia(dataJogo) -
      inicioDoDia(agora)) /
      86400000
  );

  if (diferencaEmDias === 0) {
    return "Hoje";
  }

  if (diferencaEmDias === 1) {
    return "Amanhã";
  }

  return `Em ${diferencaEmDias} dias`;
};

const formatarContagemRegressiva = (
  dataJogo,
  agora
) => {
  const diferencaEmMinutos = Math.max(
    1,
    Math.ceil(
      (dataJogo.getTime() - agora.getTime()) /
        60000
    )
  );
  const dias = Math.floor(
    diferencaEmMinutos / 1440
  );
  const horas = Math.floor(
    (diferencaEmMinutos % 1440) / 60
  );
  const minutos = diferencaEmMinutos % 60;

  if (dias > 0) {
    return `Começa em ${dias}d ${horas}h`;
  }

  if (horas > 0) {
    return `Começa em ${horas}h ${minutos}min`;
  }

  return `Começa em ${minutos}min`;
};

const normalizarProximosJogos = (
  jogos = [],
  agora = new Date()
) =>
  jogos
    .map((jogo) => {
      const dataJogo = criarDataJogo(
        jogo.data,
        jogo.horario
      );

      if (
        !jogo.id ||
        !jogo.fase ||
        !jogo.timeA?.trim() ||
        !jogo.timeB?.trim() ||
        !dataJogo
      ) {
        return null;
      }

      const timeA = limparNomeTime(
        jogo.timeA
      );
      const timeB = limparNomeTime(
        jogo.timeB
      );

      return {
        ...jogo,
        timeA,
        timeB,
        faseFormatada:
          nomesFases[jogo.fase] || jogo.fase,
        dataAmigavel: formatarDataAmigavel(
          dataJogo,
          agora
        ),
        dataFormatada:
          formatadorDataAbsoluta.format(
            dataJogo
          ),
        horarioFormatado: jogo.horario,
        contagemRegressiva:
          formatarContagemRegressiva(
            dataJogo,
            agora
          ),
        dataJogo,
      };
    })
    .filter(
      (jogo) =>
        jogo &&
        jogo.dataJogo.getTime() >
          agora.getTime()
    )
    .sort(
      (jogoA, jogoB) =>
        jogoA.dataJogo - jogoB.dataJogo
    )
    .slice(0, 4)
    .map((jogo, index) => ({
      ...jogo,
      destaque: index === 0,
    }));

const normalizarEstatisticasPublicas = (
  dados
) => {
  if (!dados) return null;

  const camposNumericos = [
    "totalParticipantes",
    "palpitesGruposEnviados",
    "palpitesMataMataEnviados",
    "jogosMataMataEncerrados",
    "jogosMataMataConfigurados",
  ];
  const numerosValidos =
    camposNumericos.every(
      (campo) =>
        Number.isInteger(dados[campo]) &&
        dados[campo] >= 0
    );
  const dataAtualizacao = new Date(
    dados.atualizadoEm
  );

  if (
    !numerosValidos ||
    Number.isNaN(
      dataAtualizacao.getTime()
    )
  ) {
    return null;
  }

  return {
    totalParticipantes:
      dados.totalParticipantes,
    palpitesGruposEnviados:
      dados.palpitesGruposEnviados,
    palpitesMataMataEnviados:
      dados.palpitesMataMataEnviados,
    jogosMataMataEncerrados:
      dados.jogosMataMataEncerrados,
    jogosMataMataConfigurados:
      dados.jogosMataMataConfigurados,
    atualizadoEm:
      dataAtualizacao.toLocaleString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
  };
};

const normalizarRankingPublico = (
  dados
) => {
  if (
    !dados ||
    dados.modalidade !== "geral" ||
    !Array.isArray(dados.podio)
  ) {
    return null;
  }

  const podio = dados.podio
    .slice(0, 3)
    .map((participante) => {
      const posicao =
        participante?.posicao;
      const nomeExibicao = String(
        participante?.nomeExibicao || ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 40);

      if (
        !Number.isInteger(posicao) ||
        posicao < 1 ||
        posicao > 3 ||
        !nomeExibicao
      ) {
        return null;
      }

      return {
        posicao,
        nomeExibicao,
      };
    })
    .filter(Boolean)
    .sort(
      (participanteA, participanteB) =>
        participanteA.posicao -
        participanteB.posicao
    );
  const posicoesUnicas =
    new Set(
      podio.map(
        (participante) =>
          participante.posicao
      )
    ).size === podio.length;
  const dataAtualizacao = new Date(
    dados.atualizadoEm
  );

  if (
    !posicoesUnicas ||
    Number.isNaN(
      dataAtualizacao.getTime()
    )
  ) {
    return null;
  }

  return {
    podio,
    atualizadoEm:
      dataAtualizacao.toLocaleString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
  };
};

const etapas = [
  {
    numero: "01",
    titulo: "Crie sua conta",
    texto:
      "Cadastre-se e acesse a área do participante.",
  },
  {
    numero: "02",
    titulo: "Envie seus palpites",
    texto:
      "Registre suas escolhas nas fases disponíveis.",
  },
  {
    numero: "03",
    titulo: "Acompanhe a disputa",
    texto:
      "Veja seus pontos e sua posição no ranking.",
  },
];

const diferenciais = [
  {
    titulo: "Palpites por fase",
    texto:
      "Fase de grupos e mata-mata organizados em jornadas claras.",
  },
  {
    titulo: "Confrontos completos",
    texto:
      "Placares, classificados e decisões nos pênaltis em um só lugar.",
  },
  {
    titulo: "Ranking atualizado",
    texto:
      "Classificação geral e desempenho no mata-mata sempre acessíveis.",
  },
  {
    titulo: "Comparador de palpites",
    texto:
      "Visualização lado a lado das escolhas dos participantes.",
  },
];

const beneficios = [
  "Palpites organizados",
  "Resultados oficiais",
  "Ranking atualizado",
  "Comparação lado a lado",
];

const perguntasFrequentes = [
  {
    pergunta: "Como faço para participar?",
    resposta:
      "Crie sua conta, entre na área do participante e registre seus palpites nas fases disponíveis.",
  },
  {
    pergunta: "Como funciona a pontuação?",
    resposta:
      "Os pontos são calculados a partir dos resultados oficiais. Os critérios completos estão disponíveis na página de regras.",
  },
  {
    pergunta: "Posso alterar meus palpites?",
    resposta:
      "Sim, enquanto os palpites estiverem liberados e dentro do prazo definido para a fase.",
  },
  {
    pergunta: "Onde acompanho meu desempenho?",
    resposta:
      "Na área do participante, pelo ranking e pelas telas de resumo e comparação de palpites.",
  },
  {
    pergunta: "Posso acessar pelo celular?",
    resposta:
      "Sim. A experiência é responsiva e se adapta a celulares, tablets e computadores.",
  },
];

function LandingPage() {
  const [
    jogosPublicos,
    setJogosPublicos,
  ] = useState([]);
  const [
    estatisticasPublicas,
    setEstatisticasPublicas,
  ] = useState(null);
  const [
    rankingPublico,
    setRankingPublico,
  ] = useState(null);
  const [agora, setAgora] = useState(
    () => new Date()
  );

  useEffect(() => {
    let ativo = true;

    const carregarProximosJogos =
      async () => {
        try {
          const snapshot = await getDoc(
            doc(
              db,
              "publico",
              "proximosJogos"
            )
          );

          if (!ativo) return;

          const jogos =
            snapshot.exists() &&
            Array.isArray(
              snapshot.data().jogos
            )
              ? snapshot.data().jogos
              : [];

          setJogosPublicos(jogos);
        } catch (error) {
          if (ativo) {
            setJogosPublicos([]);
            console.error(
              "Erro ao carregar próximos jogos públicos.",
              error
            );
          }
        }
      };

    carregarProximosJogos();

    const carregarEstatisticas =
      async () => {
        try {
          const snapshot = await getDoc(
            doc(
              db,
              "publico",
              "estatisticas"
            )
          );

          if (!ativo) return;

          setEstatisticasPublicas(
            snapshot.exists()
              ? normalizarEstatisticasPublicas(
                  snapshot.data()
                )
              : null
          );
        } catch {
          if (ativo) {
            setEstatisticasPublicas(null);
          }
        }
      };

    carregarEstatisticas();

    const carregarRankingPublico =
      async () => {
        try {
          const snapshot = await getDoc(
            doc(
              db,
              "publico",
              "rankingResumo"
            )
          );

          if (!ativo) return;

          setRankingPublico(
            snapshot.exists()
              ? normalizarRankingPublico(
                  snapshot.data()
                )
              : null
          );
        } catch {
          if (ativo) {
            setRankingPublico(null);
          }
        }
      };

    carregarRankingPublico();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const intervalo = window.setInterval(
      () => setAgora(new Date()),
      60000
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const proximosJogos = normalizarProximosJogos(
    jogosPublicos,
    agora
  );
  const proximoJogo = proximosJogos[0];
  const jogosSeguintes =
    proximosJogos.slice(1);

  return (
    <main className="landing-v522" id="inicio">
      <header className="landing-v522-header">
        <Link className="landing-v522-brand" to="/">
          <span className="landing-v522-brand-badge">2026</span>
          <span>Terceirizados Mil Grau</span>
        </Link>

        <nav className="landing-v522-nav">
          <a href="#inicio">Início</a>
          <a href="#como-funciona">Como Funciona</a>
          <Link to="/regras">Regras</Link>
          <a href="#premiacao">Premiação</a>
        </nav>

        <div className="landing-v522-header-actions">
          <Link className="landing-v522-login" to="/login">
            Entrar
          </Link>
          <Link
            className="landing-v522-create"
            to="/cadastro"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="landing-v522-hero">
        <div className="landing-v522-copy">
          <p className="landing-v522-kicker">
            Copa do Mundo 2026
          </p>

          <h1>
            Palpite. Dispute. Conquiste o topo.
          </h1>

          <p className="landing-v522-lead">
            Faça seus palpites da Copa do Mundo 2026,
            acompanhe sua pontuação e dispute o topo do ranking
            do Terceirizados Mil Grau.
          </p>

          <div className="landing-v522-actions">
            <Link
              className="landing-v522-primary"
              to="/cadastro"
            >
              Criar conta
            </Link>
            <Link
              className="landing-v522-secondary"
              to="/login"
            >
              Entrar
            </Link>
          </div>

          <div className="landing-v522-trust">
            <span>Acesso seguro</span>
            <span>Experiência responsiva</span>
            <span>Disputa entre amigos</span>
          </div>
        </div>

        <aside
          className="landing-v522-panel"
          aria-label="Painel demonstrativo do participante"
        >
          <div className="landing-v522-panel-head">
            <div>
              <span>Painel do Participante</span>
              <strong>Controle completo do bolão</strong>
            </div>
            <em>público</em>
          </div>

          <div className="landing-v522-panel-grid">
            {beneficios.map((beneficio) => (
              <article key={beneficio}>
                <span aria-hidden="true">✓</span>
                <strong>{beneficio}</strong>
              </article>
            ))}
          </div>

        </aside>
      </section>

      <section
        className="landing-v522-como"
        id="como-funciona"
      >
        <div className="landing-v522-section-head">
          <span>Como funciona</span>
          <h2>Entre na disputa em três passos</h2>
          <p>
            Da inscrição ao ranking, o caminho é simples.
          </p>
        </div>

        <div className="landing-v522-etapas">
          {etapas.map((etapa) => (
            <article key={etapa.numero}>
              <span>{etapa.numero}</span>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-v522-diferenciais">
        <div className="landing-v522-section-head">
          <span>Diferenciais do bolão</span>
          <h2>Recursos para acompanhar cada fase</h2>
          <p>
            Uma experiência organizada para palpitar, comparar
            escolhas e acompanhar resultados.
          </p>
        </div>

        <div className="landing-v522-cards">
          {diferenciais.map((diferencial) => (
            <article key={diferencial.titulo}>
              <h3>{diferencial.titulo}</h3>
              <p>{diferencial.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {estatisticasPublicas && (
        <section className="landing-v522-estatisticas">
          <div className="landing-v522-section-head">
            <span>Bolão em números</span>
            <h2>A disputa até agora</h2>
            <p>
              Números públicos e agregados, atualizados pelo
              administrador do bolão.
            </p>
          </div>

          <div className="landing-v522-estatisticas-grid">
            <article>
              <span>Participantes</span>
              <strong>
                {
                  estatisticasPublicas
                    .totalParticipantes
                }
              </strong>
              <p>Participantes ativos</p>
            </article>

            <article>
              <span>Palpites grupos</span>
              <strong>
                {
                  estatisticasPublicas
                    .palpitesGruposEnviados
                }
              </strong>
              <p>
                {estatisticasPublicas
                  .palpitesGruposEnviados === 0
                  ? "Aguardando envios"
                  : "Palpites registrados"}
              </p>
            </article>

            <article>
              <span>Palpites mata-mata</span>
              <strong>
                {
                  estatisticasPublicas
                    .palpitesMataMataEnviados
                }
              </strong>
              <p>Palpites preenchidos</p>
            </article>

            <article>
              <span>Jogos encerrados</span>
              <strong>
                {
                  estatisticasPublicas
                    .jogosMataMataEncerrados
                }{" "}
                <small>/</small>{" "}
                {
                  estatisticasPublicas
                    .jogosMataMataConfigurados
                }
              </strong>
              <p>Concluídos</p>
            </article>
          </div>

          <p className="landing-v522-estatisticas-atualizacao">
            Última atualização:{" "}
            {estatisticasPublicas.atualizadoEm}
          </p>
        </section>
      )}

      {rankingPublico && (
        <section className="landing-v522-ranking-publico">
          <div className="landing-v522-section-head">
            <span>Pódio atual</span>
            <h2>Quem está no topo</h2>
            <p>
              As primeiras posições do ranking geral,
              publicadas pelo administrador do bolão.
            </p>
          </div>

          {rankingPublico.podio.length > 0 ? (
            <div className="landing-v522-podio-grid">
              {rankingPublico.podio.map(
                (participante) => (
                  <article
                    key={participante.posicao}
                    className={`landing-v522-podio-posicao-${participante.posicao}`}
                  >
                    <span>
                      {participante.posicao}º lugar
                    </span>
                    <strong>
                      {participante.nomeExibicao}
                    </strong>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="landing-v522-podio-vazio">
              O pódio será publicado em breve.
            </div>
          )}

          <p className="landing-v522-ranking-atualizacao">
            Última atualização:{" "}
            {rankingPublico.atualizadoEm}
          </p>
        </section>
      )}

      <section className="landing-v522-jogos">
        <div className="landing-v522-section-head">
          <span>Agenda da Copa</span>
          <h2>Próximos jogos</h2>
          <p>
            Acompanhe os próximos confrontos publicados pelo
            bolão.
          </p>
        </div>

        {proximoJogo ? (
          <div className="landing-v522-agenda">
            <article className="landing-v522-jogo-destaque">
              <div className="landing-v522-destaque-topo">
                <span className="landing-v522-jogo-selo">
                  Próximo jogo
                </span>
                <span>
                  {proximoJogo.faseFormatada}
                </span>
              </div>

              <div className="landing-v522-destaque-data">
                <strong>
                  {proximoJogo.dataAmigavel}
                </strong>
                <span>
                  {proximoJogo.dataFormatada}
                </span>
              </div>

              <div className="landing-v522-destaque-confronto">
                <div className="landing-v522-time">
                  <strong>{proximoJogo.timeA}</strong>
                </div>

                <div className="landing-v522-destaque-centro">
                  <span aria-hidden="true">×</span>
                  <strong>
                    {
                      proximoJogo.horarioFormatado
                    }
                  </strong>
                </div>

                <div className="landing-v522-time landing-v522-time-direita">
                  <strong>{proximoJogo.timeB}</strong>
                </div>
              </div>

              <p className="landing-v522-contagem">
                {proximoJogo.contagemRegressiva}
              </p>
            </article>

            {jogosSeguintes.length > 0 && (
              <div className="landing-v522-jogos-seguintes">
                {jogosSeguintes.map((jogo) => (
                  <article key={jogo.id}>
                    <div className="landing-v522-jogo-meta">
                      <span>
                        {jogo.faseFormatada}
                      </span>
                      <strong>
                        {jogo.dataAmigavel} •{" "}
                        {jogo.horarioFormatado}
                      </strong>
                    </div>

                    <p className="landing-v522-jogo-data-absoluta">
                      {jogo.dataFormatada}
                    </p>

                    <div className="landing-v522-confronto">
                      <strong>{jogo.timeA}</strong>
                      <span aria-hidden="true">×</span>
                      <strong>{jogo.timeB}</strong>
                    </div>

                    <p className="landing-v522-contagem landing-v522-contagem-menor">
                      {jogo.contagemRegressiva}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="landing-v522-jogos-vazio">
            <span aria-hidden="true">2026</span>
            <div>
              <strong>
                Os próximos confrontos serão divulgados em
                breve.
              </strong>
              <p>
                Assim que a agenda oficial estiver definida,
                os jogos aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        className="landing-v522-premios"
        id="premiacao"
      >
        <div className="landing-v522-premios-copy">
          <span>Copa do Mundo 2026</span>
          <h2>Premiação do bolão</h2>
          <p>Divisão da arrecadação final entre os três primeiros colocados.</p>
        </div>

        <div className="landing-v522-premios-grid">
          <article>
            <span>🥇 1º Lugar</span>
            <strong>50%</strong>
            <p>da arrecadação</p>
          </article>
          <article>
            <span>🥈 2º Lugar</span>
            <strong>30%</strong>
            <p>da arrecadação</p>
          </article>
          <article>
            <span>🥉 3º Lugar</span>
            <strong>20%</strong>
            <p>da arrecadação</p>
          </article>
        </div>
      </section>

      <section className="landing-v522-faq">
        <div className="landing-v522-section-head">
          <span>Perguntas frequentes</span>
          <h2>Respostas rápidas antes de começar</h2>
          <p>
            Para critérios detalhados, consulte a página pública
            de regras.
          </p>
        </div>

        <div className="landing-v522-faq-list">
          {perguntasFrequentes.map((item) => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </div>

        <Link className="landing-v522-faq-link" to="/regras">
          Ver regras completas
        </Link>
      </section>

      <section className="landing-v522-final">
        <div>
          <span>Pronto para competir?</span>
          <h2>Faça seu palpite e entre na disputa pelo topo.</h2>
          <p>
            Crie sua conta para participar ou entre para
            acompanhar seus palpites e sua posição no ranking.
          </p>
        </div>

        <div className="landing-v522-final-actions">
          <Link
            className="landing-v522-primary"
            to="/cadastro"
          >
            Criar conta
          </Link>
          <Link
            className="landing-v522-secondary"
            to="/login"
          >
            Entrar
          </Link>
        </div>
      </section>

      <footer className="landing-v522-footer">
        <Link className="landing-v522-brand" to="/">
          <span className="landing-v522-brand-badge">2026</span>
          <span>Terceirizados Mil Grau</span>
        </Link>
        <p>
          © 2026 Terceirizados Mil Grau. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}

export default LandingPage;
