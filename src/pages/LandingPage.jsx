import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <main className="landing-v50">
      <header className="landing-v50-header">
        <Link className="landing-v50-brand" to="/">
          <span className="landing-v50-brand-mark">
            2026
          </span>
          <span>Terceirizados Mil Grau</span>
        </Link>

        <nav className="landing-v50-nav">
          <Link className="landing-v50-nav-link" to="/login">
            Entrar
          </Link>
          <Link
            className="landing-v50-nav-button"
            to="/cadastro"
          >
            Criar Conta
          </Link>
        </nav>
      </header>

      <section className="landing-v50-hero">
        <div className="landing-v50-hero-content">
          <p className="landing-v50-kicker">
            Bolao Copa do Mundo 2026
          </p>

          <h1>Terceirizados Mil Grau</h1>

          <h2>Bolao Copa do Mundo 2026</h2>

          <p className="landing-v50-hero-text">
            Entre na disputa, registre seus palpites e
            acompanhe cada fase da Copa com ranking,
            mata-mata e comparacoes entre participantes.
          </p>

          <div className="landing-v50-actions">
            <Link
              className="landing-v50-primary"
              to="/login"
            >
              Entrar
            </Link>
            <Link
              className="landing-v50-secondary"
              to="/cadastro"
            >
              Criar Conta
            </Link>
          </div>

          <div className="landing-v50-hero-notes">
            <span>Fase de grupos</span>
            <span>Mata-Mata</span>
            <span>Ranking oficial</span>
          </div>
        </div>

        <div
          className="landing-v50-hero-panel"
          aria-label="Destaques do bolao"
        >
          <div className="landing-v50-cup-card">
            <span className="landing-v50-cup-label">
              Copa 2026
            </span>
            <strong>Palpite ate o apito final</strong>
            <p>
              Da primeira rodada aos jogos decisivos, tudo
              centralizado na area do participante.
            </p>
          </div>

          <div className="landing-v50-mini-grid">
            <div>
              <span>Modo</span>
              <strong>Grupos</strong>
            </div>
            <div>
              <span>Fase</span>
              <strong>Mata-Mata</strong>
            </div>
            <div>
              <span>Disputa</span>
              <strong>Ranking</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Ao vivo</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-v50-sections">
        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">01</span>
          <h2>Fase de grupos</h2>
          <p>
            Palpites organizados por jogo para acompanhar o
            comeco da Copa sem bagunca.
          </p>
        </article>

        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">02</span>
          <h2>Mata-Mata</h2>
          <p>
            Os confrontos decisivos ganham uma area propria,
            com placares, classificados e campeao apostado.
          </p>
        </article>

        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">03</span>
          <h2>Ranking ao vivo</h2>
          <p>
            A classificacao oficial mostra quem esta subindo,
            tropecando e brigando pelo topo.
          </p>
        </article>

        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">04</span>
          <h2>Comparacao</h2>
          <p>
            Compare palpites lado a lado e veja onde cada
            participante apostou diferente.
          </p>
        </article>

        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">05</span>
          <h2>Premiacao</h2>
          <p>
            A premiacao acompanha as regras do bolao e sera
            consultada pelos participantes na area privada.
          </p>
        </article>
      </section>
    </main>
  );
}

export default LandingPage;
