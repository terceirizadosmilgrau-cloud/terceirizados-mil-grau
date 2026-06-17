import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const finalCopa2026 = new Date(
  "2026-07-19T16:00:00-03:00"
);

const calcularContagem = () => {
  const distancia =
    finalCopa2026.getTime() - Date.now();
  const restante = Math.max(0, distancia);

  const dias = Math.floor(
    restante / (1000 * 60 * 60 * 24)
  );
  const horas = Math.floor(
    (restante / (1000 * 60 * 60)) % 24
  );
  const minutos = Math.floor(
    (restante / (1000 * 60)) % 60
  );
  const segundos = Math.floor(
    (restante / 1000) % 60
  );

  return { dias, horas, minutos, segundos };
};

const cards = [
  {
    sigla: "FG",
    titulo: "Fase de Grupos",
    texto:
      "Palpite todos os jogos da primeira fase e some pontos importantes logo no comeco.",
  },
  {
    sigla: "MM",
    titulo: "Mata-Mata",
    texto:
      "Acerte placares, classificados e avance na disputa pelos jogos decisivos.",
  },
  {
    sigla: "RK",
    titulo: "Ranking ao Vivo",
    texto:
      "Acompanhe a classificacao oficial e veja sua posicao na briga pelo topo.",
  },
  {
    sigla: "CP",
    titulo: "Compare",
    texto:
      "Veja diferencas entre palpites e acompanhe onde cada participante arriscou.",
  },
  {
    sigla: "PR",
    titulo: "Premiacao",
    texto:
      "Os melhores colocados seguem na disputa pela premiacao combinada do bolao.",
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
    <main className="landing-v521">
      <header className="landing-v521-header">
        <Link className="landing-v521-brand" to="/">
          <span className="landing-v521-shield">
            TMG
          </span>
          <span>
            Terceirizados
            <strong>Mil Grau</strong>
          </span>
        </Link>

        <nav className="landing-v521-nav">
          <Link to="/">Inicio</Link>
          <a href="#como-funciona">Como funciona</a>
          <Link to="/regras">Regras</Link>
          <a href="#premiacao">Premiacao</a>
        </nav>

        <div className="landing-v521-header-actions">
          <Link className="landing-v521-login" to="/login">
            Entrar
          </Link>
          <Link
            className="landing-v521-create"
            to="/cadastro"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="landing-v521-hero">
        <div className="landing-v521-copy">
          <p className="landing-v521-kicker">
            Copa do Mundo 2026
          </p>

          <h1>
            O bolao mais emocionante da
            <span>Copa 2026</span>
          </h1>

          <p className="landing-v521-lead">
            Participe, envie seus palpites e dispute com
            amigos o titulo de campeao do bolao Terceirizados
            Mil Grau.
          </p>

          <div className="landing-v521-actions">
            <Link
              className="landing-v521-primary"
              to="/cadastro"
            >
              Criar conta e participar
            </Link>
            <Link
              className="landing-v521-secondary"
              to="/login"
            >
              Ja tenho conta
            </Link>
          </div>

          <div className="landing-v521-trust">
            <span>Acesso seguro</span>
            <span>Ranking atualizado</span>
            <span>Disputa entre amigos</span>
          </div>
        </div>

        <div
          className="landing-v521-visual"
          aria-label="Ilustracao generica de bola e estadio"
        >
          <div className="landing-v521-lights" />
          <div className="landing-v521-trophy">
            <span />
          </div>
          <div className="landing-v521-ball">
            <span />
          </div>
          <div className="landing-v521-field">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section
        className="landing-v521-cards"
        id="como-funciona"
      >
        {cards.map((card) => (
          <article key={card.titulo}>
            <span className="landing-v521-card-icon">
              {card.sigla}
            </span>
            <h2>{card.titulo}</h2>
            <p>{card.texto}</p>
          </article>
        ))}
      </section>

      <section
        className="landing-v521-countdown"
        id="premiacao"
      >
        <div className="landing-v521-countdown-copy">
          <span>Copa do Mundo 2026</span>
          <h2>
            A maior competicao do planeta esta chegando!
          </h2>
          <p>
            Prepare seus palpites, chame os amigos e venha
            ser Mil Grau nessa disputa.
          </p>
        </div>

        <div className="landing-v521-time">
          <div>
            <strong>{contagem.dias}</strong>
            <span>Dias</span>
          </div>
          <div>
            <strong>{contagem.horas}</strong>
            <span>Horas</span>
          </div>
          <div>
            <strong>{contagem.minutos}</strong>
            <span>Minutos</span>
          </div>
          <div>
            <strong>{contagem.segundos}</strong>
            <span>Segundos</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
