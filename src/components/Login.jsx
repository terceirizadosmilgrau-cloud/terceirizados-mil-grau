import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login({ abrirCadastro, loginSucesso }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const entrar = async () => {
    try {
      const credencial = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      loginSucesso(credencial.user);
    } catch (error) {
      alert("E-mail ou senha inválidos.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "#1a1a1a",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            🏆
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "32px",
            }}
          >
            Terceirizados Mil Grau
          </h1>

          <h3
            style={{
              marginTop: "10px",
            }}
          >
            Bolão Copa 2026
          </h3>
        </div>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={entrar}
          style={buttonStyle}
        >
          Entrar
        </button>

        <p
          onClick={abrirCadastro}
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#28a745",
            cursor: "pointer",
          }}
        >
          Criar Conta
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Terceirizados Mil Grau © 2026
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  boxSizing: "border-box",
  borderRadius: "8px",
  border: "1px solid #555",
  backgroundColor: "#333",
  color: "white",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
};

export default Login;