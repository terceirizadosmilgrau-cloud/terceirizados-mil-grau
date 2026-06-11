import { useState } from "react";

import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

import Dashboard from "./pages/Dashboard";
import Palpites from "./pages/Palpites";
import ResumoPalpites from "./pages/ResumoPalpites";
import Resultados from "./pages/Resultados";
import Ranking from "./pages/Ranking";
import CentralPalpites from "./pages/CentralPalpites";

function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);

  const loginSucesso = (user) => {
    setUsuario(user);
    setTela("dashboard");
  };

  const sair = () => {
    setUsuario(null);
    setTela("login");
  };

  const isSuperAdmin =
    usuario?.email === "ardcost4@icloud.com";

  if (
    tela === "centralPalpites" &&
    isSuperAdmin
  ) {
    return (
      <CentralPalpites
        voltar={() =>
          setTela("dashboard")
        }
      />
    );
  }

  if (tela === "ranking") {
    return (
      <Ranking
        voltar={() =>
          setTela("dashboard")
        }
      />
    );
  }

  if (
    tela === "resultados" &&
    isSuperAdmin
  ) {
    return (
      <Resultados
        voltar={() =>
          setTela("dashboard")
        }
      />
    );
  }

  if (tela === "resumo") {
    return (
      <ResumoPalpites
        usuario={usuario}
        voltar={() =>
          setTela("palpites")
        }
      />
    );
  }

  if (tela === "palpites") {
    return (
      <Palpites
        usuario={usuario}
        voltar={() =>
          setTela("dashboard")
        }
        abrirResumo={() =>
          setTela("resumo")
        }
      />
    );
  }

  if (tela === "dashboard") {
    return (
      <Dashboard
        usuario={usuario}
        sair={sair}
        abrirPalpites={() =>
          setTela("palpites")
        }
        abrirResultados={() =>
          setTela("resultados")
        }
        abrirRanking={() =>
          setTela("ranking")
        }
        abrirCentralPalpites={() =>
          setTela("centralPalpites")
        }
      />
    );
  }

  if (tela === "cadastro") {
    return (
      <Cadastro
        voltarLogin={() =>
          setTela("login")
        }
      />
    );
  }

  return (
    <Login
      abrirCadastro={() =>
        setTela("cadastro")
      }
      loginSucesso={loginSucesso}
    />
  );
}

export default App;