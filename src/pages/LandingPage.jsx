import { Link } from "react-router-dom";
import "./LandingPage.css";

const cards = [
  {
    titulo: "Fase de Grupos",
    texto:
      "Organize seus palpites por partida e acompanhe a primeira fase com uma visão clara da disputa.",
  },
  {
    titulo: "Mata-Mata",
    texto:
      "Registre placares, classificados e campeão nos confrontos mais decisivos do bolão.",
  },
  {
    titulo: "Ranking",
    texto:
      "Acompanhe a classificação oficial e veja a briga pelo topo evoluir rodada a rodada.",
  },
  {
    titulo: "Comparação",
    texto:
      "Compare palpites lado a lado e entenda onde cada participante arriscou diferente.",
  },
  {
    titulo: "Premiação",
    texto:
      "Consulte a divisão dos prêmios e mantenha a disputa transparente até o fim.",
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
            Registre seus palpites, acompanhe o ranking e veja
            quem manda melhor na fase de grupos e no mata-mata.
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
            <span>Ranking atualizado</span>
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
              <strong>Controle completo do bolao</strong>
            </div>
            <em>publico</em>
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
              <strong>Palpites organizados por jogo</strong>
            </div>
            <div>
              <span>Mata-Mata</span>
              <strong>Confrontos e campeao em um so lugar</strong>
            </div>
            <div>
              <span>Disputa</span>
              <strong>Ranking, comparacao e premiacao</strong>
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
          <h2>Premiacao do bolao</h2>
          <p>
            A premiacao e calculada automaticamente com base
            no total arrecadado pelos participantes.
          </p>
        </div>

        <div className="landing-v522-premios-grid">
          <article>
            <span>1o Lugar</span>
            <strong>50%</strong>
            <p>da arrecadacao</p>
          </article>
          <article>
            <span>2o Lugar</span>
            <strong>30%</strong>
            <p>da arrecadacao</p>
          </article>
          <article>
            <span>3o Lugar</span>
            <strong>20%</strong>
            <p>da arrecadacao</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
