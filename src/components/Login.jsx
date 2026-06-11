import { useState } from "react";

function Login() {
  const [apelido, setApelido] = useState("");
  const [senha, setSenha] = useState("");

  const entrar = () => {
    alert(`Login: ${apelido}`);
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
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>
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

          <h3 style={{ marginTop: "10px" }}>
            Bolão Copa 2026
          </h3>
        </div>

        <input
          type="text"
          placeholder="Apelido"
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={entrar}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "8px",
            color: "white",
          }}
        >
          Entrar
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Criar Conta
        </p>
      </div>
    </div>
  );
}

export default Login;