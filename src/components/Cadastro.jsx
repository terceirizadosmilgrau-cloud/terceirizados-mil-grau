import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function Cadastro({ voltarLogin }) {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const cadastrar = async () => {
    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      await setDoc(
        doc(db, "usuarios", credencial.user.uid),
        {
          nome,
          apelido,
          email,
          tipoUsuario: "participante",
          pagamento: false,
          pontos: 0,
          dataCadastro: new Date().toISOString(),
        }
      );

      alert("Conta criada com sucesso!");

      setNome("");
      setApelido("");
      setEmail("");
      setSenha("");

      if (voltarLogin) {
        voltarLogin();
      }
    } catch (error) {
      alert(error.message);
    }
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

          <h1 style={{ margin: "0", fontSize: "32px" }}>
            Terceirizados Mil Grau
          </h1>

          <h3 style={{ marginTop: "15px" }}>
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

        <button onClick={cadastrar} style={buttonStyle}>
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
          onClick={voltarLogin}
          style={{
            textAlign: "center",
            color: "#28a745",
            cursor: "pointer",
          }}
        >
          Voltar ao Login
        </p>

        <Link
          to="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "12px",
            color: "#ffc107",
            textDecoration: "none",
          }}
        >
          Voltar para inicio
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;
