import { Link } from "react-router-dom";
import "./RegrasPage.css";

const regras = [
  {
    titulo: "Como participar",
    texto:
      "Crie sua conta, entre na area do participante e acompanhe as telas liberadas para registrar seus palpites.",
  },
  {
    titulo: "Fase de grupos",
    texto:
      "Os palpites da fase de grupos sao feitos por jogo. A pontuacao segue os criterios oficiais do bolao dentro do app.",
  },
  {
    titulo: "Mata-Mata",
    texto:
      "Na etapa decisiva, os participantes palpitam placares, classificados e campeao conforme os confrontos configurados.",
  },
  {
    titulo: "Ranking",
    texto:
      "O ranking mostra a classificacao dos participantes com base nos resultados oficiais informados pela administracao.",
  },
  {
    titulo: "Premiacao",
    texto:
      "A premiacao segue as regras combinadas do bolao e fica vinculada ao desempenho dos participantes na disputa.",
  },
];

function RegrasPage() {
  return (
    <main className="regras-v52">
      <header className="regras-v52-header">
        <Link className="regras-v52-brand" to="/">
          <span className="regras-v52-brand-mark">2026</span>
          <span>Terceirizados Mil Grau</span>
        </Link>

        <nav className="regras-v52-nav">
          <Link to="/">Inicio</Link>
          <Link to="/regras">Regras</Link>
        </nav>
      </header>

      <section className="regras-v52-hero">
        <p>Regras publicas</p>
        <h1>Como funciona o bolao</h1>
        <span>
          Um resumo simples para entrar na disputa sabendo o
          caminho: participar, palpitar, acompanhar o ranking e
          torcer ate o ultimo jogo.
        </span>

        <div className="regras-v52-actions">
          <Link className="regras-v52-primary" to="/">
            Voltar ao inicio
          </Link>
          <Link className="regras-v52-secondary" to="/login">
            Entrar
          </Link>
        </div>
      </section>

      <section className="regras-v52-list">
        {regras.map((regra, index) => (
          <article key={regra.titulo}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{regra.titulo}</h2>
            <p>{regra.texto}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default RegrasPage;
