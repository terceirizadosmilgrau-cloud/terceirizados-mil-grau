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

function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);

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

  abrirMataMata={() =>
    setTela("mataMata")
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

  abrirCentralMataMata={() =>
  setTela(
    "centralMataMata"
  )
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
