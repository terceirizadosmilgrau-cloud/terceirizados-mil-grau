import { Link } from "react-router-dom";
import "./LandingPage.css";

const cards = [
  {
    titulo: "Fase de Grupos",
    texto:
      "Faça seus palpites por partida e acompanhe cada rodada da fase de grupos.",
  },
  {
    titulo: "Mata-Mata",
    texto:
      "Acerte placares, classificados e decisões nos pênaltis nos jogos decisivos da Copa.",
  },
  {
    titulo: "Ranking",
    texto:
      "Acompanhe sua posição e dispute cada rodada até a grande final.",
  },
  {
    titulo: "Comparação",
    texto:
      "Compare palpites lado a lado e descubra onde cada participante fez escolhas diferentes.",
  },
  {
    titulo: "Premiação",
    texto:
      "Consulte a divisão dos prêmios e acompanhe uma disputa transparente até o fim.",
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
    <main className="landing-v522">
      <header className="landing-v522-header">
        <Link className="landing-v522-brand" to="/">
          <span className="landing-v522-brand-badge">2026</span>
          <span>Terceirizados Mil Grau</span>
        </Link>

        <nav className="landing-v522-nav">
          <Link to="/">Início</Link>
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
        className="landing-v522-cards"
        id="como-funciona"
      >
        {cards.map((card) => (
          <article key={card.titulo}>
            <h2>{card.titulo}</h2>
            <p>{card.texto}</p>
          </article>
        ))}
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
            da competição. Quanto maior a disputa, maior a
            emoção até a final.
          </p>
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
    </main>
  );
}

export default LandingPage;
