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
            Bolao Copa 2026
          </p>

          <h1>Terceirizados Mil Grau</h1>

          <p className="landing-v50-hero-text">
            O bolao da galera para acompanhar a Copa,
            disputar rodada por rodada e ver quem chega
            inteiro ate a final.
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
        </div>

        <div
          className="landing-v50-scoreboard"
          aria-label="Resumo do bolao"
        >
          <div className="landing-v50-scoreboard-top">
            <span>COPA</span>
            <strong>2026</strong>
          </div>

          <div className="landing-v50-match">
            <span>Fase de Grupos</span>
            <strong>Palpites</strong>
          </div>

          <div className="landing-v50-match">
            <span>Mata-Mata</span>
            <strong>Decisao</strong>
          </div>

          <div className="landing-v50-scoreboard-footer">
            Ranking oficial atualizado no app
          </div>
        </div>
      </section>

      <section className="landing-v50-sections">
        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">01</span>
          <h2>Como funciona</h2>
          <p>
            Crie sua conta, registre seus palpites e acompanhe
            sua disputa dentro da area autenticada do bolao.
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
          <h2>Ranking</h2>
          <p>
            A classificacao oficial fica protegida no app e
            mostra a pontuacao dos participantes logados.
          </p>
        </article>

        <article className="landing-v50-card">
          <span className="landing-v50-card-icon">04</span>
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
