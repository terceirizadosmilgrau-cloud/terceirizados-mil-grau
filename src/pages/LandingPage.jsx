import { Link } from "react-router-dom";
import "./LandingPage.css";

const etapas = [
  {
    numero: "01",
    titulo: "Faça seus palpites",
    texto:
      "Escolha os resultados dos jogos e avance pelas fases da Copa do Mundo 2026.",
  },
  {
    numero: "02",
    titulo: "Ganhe pontos",
    texto:
      "Acerte placares, resultados, classificados e decisões nos pênaltis para somar pontos.",
  },
  {
    numero: "03",
    titulo: "Suba no ranking",
    texto:
      "Acompanhe sua posição e dispute cada rodada até a grande final.",
  },
];

const diferenciais = [
  {
    titulo: "Fase de Grupos",
    texto:
      "Palpites organizados por partida para acompanhar a primeira fase com clareza.",
  },
  {
    titulo: "Mata-Mata completo",
    texto:
      "Placares, classificados e decisões nos pênaltis reunidos nos confrontos decisivos.",
  },
  {
    titulo: "Ranking atualizado",
    texto:
      "Classificação geral e desempenho no mata-mata para acompanhar a disputa rodada a rodada.",
  },
  {
    titulo: "Comparação",
    texto:
      "Compare palpites lado a lado e descubra onde cada participante fez escolhas diferentes.",
  },
  {
    titulo: "Disputa transparente",
    texto:
      "Regras, pontuação e divisão dos prêmios apresentadas de forma simples e objetiva.",
  },
];

const beneficios = [
  "Ranking ao vivo",
  "Mata-Mata completo",
  "Comparação de palpites",
  "Premiação automática",
];

function LandingPage() {
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
            <span>Pontuação atualizada</span>
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

          <div className="landing-v522-panel-note">
            <div>
              <span>Fase de grupos</span>
              <strong>Palpites organizados por partida</strong>
            </div>
            <div>
              <span>Mata-Mata</span>
              <strong>Confrontos e campeão em um só lugar</strong>
            </div>
            <div>
              <span>Disputa</span>
              <strong>Ranking, comparação e premiação</strong>
            </div>
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
            Crie sua conta, registre seus palpites e acompanhe
            sua evolução durante toda a Copa do Mundo 2026.
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
          <h2>Uma experiência completa do primeiro palpite à final</h2>
          <p>
            Tudo o que você precisa para competir, acompanhar
            seus resultados e viver cada rodada com mais emoção.
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

      <section
        className="landing-v522-premios"
        id="premiacao"
      >
        <div className="landing-v522-premios-copy">
          <span>Copa do Mundo 2026</span>
          <h2>Premiação do bolão</h2>
          <p>
            Os melhores participantes serão premiados ao final
            da competição, conforme a divisão da arrecadação
            apresentada ao lado.
          </p>
          <strong>
            Quanto maior a disputa, maior a emoção até a final.
          </strong>
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
