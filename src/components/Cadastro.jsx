import { useState } from "react";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const cadastrar = () => {
    alert(`Usuário ${apelido} cadastrado!`);
  };

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
          width: "450px",
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
              marginBottom: "15px",
            }}
          >
            🏆
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "32px",
              lineHeight: "1.2",
            }}
          >
            Terceirizados Mil Grau
          </h1>

          <h3
            style={{
              marginTop: "15px",
              color: "#d9d9d9",
              fontWeight: "normal",
            }}
          >
            Cadastro de Participante
          </h3>
        </div>

        <input
          type="text"
          placeholder="Nome Completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Apelido"
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          style={inputStyle}
        />

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
          onClick={cadastrar}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Criar Conta
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#cccccc",
          }}
        >
          Já possui uma conta?
        </p>

        <p
          style={{
            textAlign: "center",
            color: "#28a745",
            cursor: "pointer",
          }}
        >
          Voltar ao Login
        </p>
      </div>
    </div>
  );
}

export default Cadastro;