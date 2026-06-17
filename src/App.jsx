import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import { db } from "./firebase";

import LandingPage from "./pages/LandingPage";
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
import ComparacaoPalpites from "./pages/ComparacaoPalpites";

function AreaAutenticada({
  usuario,
  sair,
}) {
  const [tela, setTela] = useState("dashboard");
  const [origemResumo, setOrigemResumo] =
    useState("palpites");
  const [
    contextoResultados,
    setContextoResultados,
  ] = useState("mataMata");

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

  if (tela === "comparacaoPalpites") {
    return (
      <ComparacaoPalpites
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

  abrirComparacaoPalpites={() =>
    setTela("comparacaoPalpites")
  }
/>
    );
  }

  

  return <Navigate to="/app" replace />;
}

function AppRoutes() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const loginSucesso = (user) => {
    setUsuario(user);
    navigate("/app");
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
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <Login
            abrirCadastro={() =>
              navigate("/cadastro")
            }
            loginSucesso={loginSucesso}
          />
        }
      />
      <Route
        path="/cadastro"
        element={
          <Cadastro
            voltarLogin={() =>
              navigate("/login")
            }
          />
        }
      />
      <Route
        path="/app"
        element={
          usuario ? (
            <AreaAutenticada
              usuario={usuario}
              sair={sair}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
