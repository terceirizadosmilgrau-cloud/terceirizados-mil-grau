import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import { db } from "./firebase";

import Dashboard from "./pages/Dashboard";
import Palpites from "./pages/Palpites";
import ResumoPalpites from "./pages/ResumoPalpites";
import Resultados from "./pages/Resultados";
import Ranking from "./pages/Ranking";
import CentralPalpites from "./pages/CentralPalpites";
import PalpitesMataMata from "./pages/PalpitesMataMata";
import CentralMataMata from "./pages/CentralMataMata";
import ResumoMataMata from "./pages/ResumoMataMata";
import EstatisticasMataMata from "./pages/EstatisticasMataMata";

function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [origemResumo, setOrigemResumo] =
    useState("palpites");
  const [
    contextoResultados,
    setContextoResultados,
  ] = useState("mataMata");

  const loginSucesso = (user) => {
    setUsuario(user);
    setTela("dashboard");
  };

  useEffect(() => {
    if (!usuario?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "usuarios", usuario.uid),
      (snapshot) => {
        if (!snapshot.exists()) return;

        setUsuario((usuarioAtual) => {
          if (
            !usuarioAtual ||
            usuarioAtual.uid !== usuario.uid
          ) {
            return usuarioAtual;
          }

          return {
            ...snapshot.data(),
            uid: usuarioAtual.uid,
            email:
              usuarioAtual.email ||
              snapshot.data().email,
          };
        });
      }
    );

    return () => unsubscribe();
  }, [usuario?.uid]);

  const sair = () => {
    setUsuario(null);
    setTela("login");
  };

  const isSuperAdmin =
    usuario?.tipoUsuario === "superadmin";

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

  if (
  tela === "centralMataMata" &&
  isSuperAdmin
) {
  return (
    <CentralMataMata
      voltar={() =>
        setTela(
          "dashboard"
        )
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
        usuario={usuario}
        contextoInicial={
          contextoResultados
        }
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
          setTela(origemResumo)
        }
      />
    );
  }

  if (tela === "resumoMataMata") {
    return (
      <ResumoMataMata
        usuario={usuario}
        voltar={() =>
          setTela("dashboard")
        }
      />
    );
  }

  if (tela === "estatisticasMataMata") {
    return (
      <EstatisticasMataMata
        voltar={() =>
          setTela("dashboard")
        }
      />
    );
  }

  if (tela === "mataMata") {
  return (
    <PalpitesMataMata
      usuario={usuario}
      voltar={() =>
        setTela("dashboard")
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
          {
            setOrigemResumo("palpites");
            setTela("resumo");
          }
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

  abrirMataMata={() =>
    setTela("mataMata")
  }

  abrirResultados={(contexto) => {
    setContextoResultados(
      contexto || "mataMata"
    );
    setTela("resultados");
  }}

  abrirRanking={() =>
    setTela("ranking")
  }

  abrirCentralPalpites={() =>
    setTela("centralPalpites")
  }

  abrirCentralMataMata={() =>
  setTela(
    "centralMataMata"
  )
}
  abrirResumo={() => {
    setOrigemResumo("dashboard");
    setTela("resumo");
  }}

  abrirResumoMataMata={() =>
    setTela("resumoMataMata")
  }

  abrirEstatisticasMataMata={() =>
    setTela("estatisticasMataMata")
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
