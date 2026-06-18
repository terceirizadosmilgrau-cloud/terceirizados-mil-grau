import { Link } from "react-router-dom";
import { proximosJogosPublicos } from "../data/proximosJogosPublicos";
import "./LandingPage.css";

const nomesFases = {
  oitavas: "Oitavas de final",
  quartas: "Quartas de final",
  semifinal: "Semifinal",
  final: "Final",
};

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

const normalizarProximosJogos = (jogos = []) =>
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

      return {
        ...jogo,
        faseFormatada:
          nomesFases[jogo.fase] || jogo.fase,
        dataFormatada: new Intl.DateTimeFormat(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
          }
        ).format(dataJogo),
        horarioFormatado: jogo.horario,
        dataJogo,
      };
    })
    .filter(Boolean)
    .sort(
      (jogoA, jogoB) =>
        jogoA.dataJogo - jogoB.dataJogo
    )
    .slice(0, 4);

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
  const proximosJogos = normalizarProximosJogos(
    proximosJogosPublicos
  );

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

      <section className="landing-v522-jogos">
        <div className="landing-v522-section-head">
          <span>Agenda da Copa</span>
          <h2>Próximos jogos</h2>
          <p>
            Acompanhe os próximos confrontos publicados pelo
            bolão.
          </p>
        </div>

        {proximosJogos.length > 0 ? (
          <div className="landing-v522-jogos-grid">
            {proximosJogos.map((jogo) => (
              <article key={jogo.id}>
                <div className="landing-v522-jogo-meta">
                  <span>{jogo.faseFormatada}</span>
                  <strong>
                    {jogo.dataFormatada} •{" "}
                    {jogo.horarioFormatado}
                  </strong>
                </div>

                <div className="landing-v522-confronto">
                  <strong>{jogo.timeA}</strong>
                  <span aria-hidden="true">×</span>
                  <strong>{jogo.timeB}</strong>
                </div>
              </article>
            ))}
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
