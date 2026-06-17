import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const inicioCopa2026 = new Date(
  "2026-06-11T16:00:00-03:00"
);

const calcularContagem = () => {
  const distancia =
    inicioCopa2026.getTime() - Date.now();
  const restante = Math.max(0, distancia);

  return {
    dias: Math.floor(restante / (1000 * 60 * 60 * 24)),
    horas: Math.floor((restante / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((restante / (1000 * 60)) % 60),
    segundos: Math.floor((restante / 1000) % 60),
  };
};

const cards = [
  {
    sigla: "FG",
    titulo: "Fase de Grupos",
    texto:
      "Registre seus palpites jogo a jogo e comece a somar pontos desde a primeira rodada.",
  },
  {
    sigla: "MM",
    titulo: "Mata-Mata",
    texto:
      "Acompanhe os confrontos decisivos, classificados e campeao apostado.",
  },
  {
    sigla: "RK",
    titulo: "Ranking",
    texto:
      "Veja a classificacao oficial e acompanhe quem esta liderando a disputa.",
  },
  {
    sigla: "CP",
    titulo: "Comparacao",
    texto:
      "Compare palpites lado a lado e descubra onde cada participante arriscou.",
  },
  {
    sigla: "PR",
    titulo: "Premiacao",
    texto:
      "Mantenha a disputa organizada do primeiro palpite ate a premiacao final.",
  },
];

function LandingPage() {
  const [contagem, setContagem] = useState(
    calcularContagem
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setContagem(calcularContagem());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="landing-v522">
      <header className="landing-v522-header">
        <Link className="landing-v522-brand" to="/">
          <span className="landing-v522-brand-badge">2026</span>
          <span>Terceirizados Mil Grau</span>
        </Link>

        <nav className="landing-v522-nav">
          <Link to="/">Inicio</Link>
          <Link to="/regras">Regras</Link>
          <a href="#premiacao">Premiacao</a>
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
            O bolao da Copa 2026 para disputar com os amigos
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
              <strong>Bolao Copa 2026</strong>
            </div>
            <em>ao vivo</em>
          </div>

          <div className="landing-v522-score">
            <div>
              <span>Voce</span>
              <strong>128 pts</strong>
            </div>
            <div>
              <span>Lider</span>
              <strong>142 pts</strong>
            </div>
          </div>

          <div className="landing-v522-panel-grid">
            <article>
              <span>01</span>
              <strong>Ranking ao vivo</strong>
              <div className="landing-v522-bar">
                <i style={{ width: "82%" }} />
              </div>
            </article>
            <article>
              <span>02</span>
              <strong>Mata-Mata</strong>
              <div className="landing-v522-bar">
                <i style={{ width: "64%" }} />
              </div>
            </article>
            <article>
              <span>03</span>
              <strong>Comparacao</strong>
              <div className="landing-v522-bar">
                <i style={{ width: "74%" }} />
              </div>
            </article>
            <article>
              <span>04</span>
              <strong>Premiacao</strong>
              <div className="landing-v522-bar">
                <i style={{ width: "58%" }} />
              </div>
            </article>
          </div>

          <div className="landing-v522-mini-ranking">
            <div>
              <span>1</span>
              <strong>Campeao da rodada</strong>
              <em>142</em>
            </div>
            <div>
              <span>2</span>
              <strong>Voce</strong>
              <em>128</em>
            </div>
            <div>
              <span>3</span>
              <strong>Briga pelo topo</strong>
              <em>121</em>
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
            <span>{card.sigla}</span>
            <h2>{card.titulo}</h2>
            <p>{card.texto}</p>
          </article>
        ))}
      </section>

      <section
        className="landing-v522-countdown"
        id="premiacao"
      >
        <div>
          <span>Copa do Mundo 2026</span>
          <h2>
            A maior competicao do planeta esta chegando!
          </h2>
          <p>
            Prepare seus palpites e entre na disputa do
            Terceirizados Mil Grau.
          </p>
        </div>

        <div className="landing-v522-time">
          <article>
            <strong>{contagem.dias}</strong>
            <span>Dias</span>
          </article>
          <article>
            <strong>{contagem.horas}</strong>
            <span>Horas</span>
          </article>
          <article>
            <strong>{contagem.minutos}</strong>
            <span>Minutos</span>
          </article>
          <article>
            <strong>{contagem.segundos}</strong>
            <span>Segundos</span>
          </article>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
