import { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase";
import ParticipantesTable from "../components/admin/ParticipantesTable";

const destaquesMataMataPadrao = {
  palpitesEnviados: 0,
  jogosEncerrados: 0,
  totalJogosConfigurados: 0,
  proximoJogo: null,
  campeaoMaisApostado: null,
};

const fasesMataMata = [
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

const textoPreenchido = (valor) =>
  String(valor || "").trim();

const valorValido = (valor) => {
  const texto = textoPreenchido(valor);

  return texto && texto !== "-";
};

const jogoEncerrado = (jogo) =>
  jogo?.placarA !== undefined &&
  jogo?.placarA !== "" &&
  jogo?.placarB !== undefined &&
  jogo?.placarB !== "" &&
  Boolean(
    textoPreenchido(jogo?.classificado)
  );

const listarJogos = (dados = {}) =>
  fasesMataMata.flatMap((fase) =>
    Array.isArray(dados.jogos?.[fase])
      ? dados.jogos[fase].map(
          (jogo, index) => ({
            ...jogo,
            fase,
            index,
          })
        )
      : []
  );

const palpiteMataMataPreenchido = (
  dados = {}
) => {
  if (valorValido(dados.campeao)) {
    return true;
  }

  return fasesMataMata.some((fase) =>
    (dados.jogos?.[fase] || []).some(
      (jogo) =>
        valorValido(jogo?.placarA) ||
        valorValido(jogo?.placarB) ||
        valorValido(jogo?.classificado)
    )
  );
};

const obterDataDoJogo = (jogo) => {
  if (!jogo?.data || !jogo?.horario) {
    return null;
  }

  const data = new Date(
    `${jogo.data}T${jogo.horario}:00`
  );

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return data;
};

const formatarProximoJogo = (jogo) => {
  if (!jogo) return "A definir";

  const data = obterDataDoJogo(jogo);
  const quando = data
    ? data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data a definir";

  return `${jogo.timeA || "Time A"} x ${
    jogo.timeB || "Time B"
  } - ${quando}`;
};

const contarCampeoes = (docs = []) => {
  const contagem = {};

  docs.forEach((palpiteDoc) => {
    const campeao = textoPreenchido(
      palpiteDoc.data().campeao
    );

    if (!valorValido(campeao)) return;

    const chave = campeao.toLowerCase();

    if (!contagem[chave]) {
      contagem[chave] = {
        nome: campeao,
        quantidade: 0,
      };
    }

    contagem[chave].quantidade += 1;
  });

  return (
    Object.values(contagem).sort((a, b) => {
      if (
        b.quantidade !== a.quantidade
      ) {
        return (
          b.quantidade - a.quantidade
        );
      }

      return a.nome.localeCompare(b.nome);
    })[0] || null
  );
};

function Dashboard({
  usuario,
  sair,
  abrirPalpites,
  abrirMataMata,
  abrirResultados,
  abrirRanking,
  abrirCentralPalpites,
  abrirCentralMataMata,
  abrirResumo,
  abrirResumoMataMata,
  abrirEstatisticasMataMata,
  abrirComparacaoPalpites,
}) {
  const [participantes, setParticipantes] = useState([]);
  const [palpitesLiberados, setPalpitesLiberados] =
    useState(true);
  const [
    destaquesMataMata,
    setDestaquesMataMata,
  ] = useState(destaquesMataMataPadrao);

    const [busca, setBusca] =
  useState("");

const [filtro, setFiltro] =
  useState("todos");

  const isSuperAdmin =
    usuario?.tipoUsuario === "superadmin";
    const isAdmin =
  usuario?.tipoUsuario === "admin";

  useEffect(() => {
    window.scrollTo(0, 0);

    carregarConfiguracoes();
    carregarDestaquesMataMata();

    const unsubscribe = onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setParticipantes(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  const participantesFiltrados =
  participantes.filter((p) => {
    const nome =
      (
        p.apelido ||
        p.nome ||
        ""
      ).toLowerCase();

    const buscaOk =
      nome.includes(
        busca.toLowerCase()
      );

    let filtroOk = true;

    if (filtro === "pagos") {
      filtroOk = p.pagamento;
    }

    if (
      filtro === "pendentes"
    ) {
      filtroOk = !p.pagamento;
    }

    if (
      filtro === "admins"
    ) {
      filtroOk =
        p.tipoUsuario ===
        "admin" ||
        p.tipoUsuario ===
        "superadmin";
    }

    if (
      filtro ===
      "participantes"
    ) {
      filtroOk =
        p.tipoUsuario ===
        "participante";
    }

    return (
      buscaOk && filtroOk
    );
  });

  const carregarConfiguracoes =
    async () => {
      try {
        const snapshot = await getDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          )
        );

        if (snapshot.exists()) {
          setPalpitesLiberados(
            snapshot.data()
              .palpitesLiberados
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const carregarDestaquesMataMata =
    async () => {
      try {
        const [
          palpitesSnapshot,
          resultadoSnapshot,
          configuracaoSnapshot,
        ] = await Promise.all([
          getDocs(
            collection(
              db,
              "palpitesMataMata"
            )
          ),
          getDoc(
            doc(
              db,
              "resultados",
              "mataMata"
            )
          ),
          getDoc(
            doc(
              db,
              "configuracoes",
              "mataMata"
            )
          ),
        ]);

        const jogosResultados =
          resultadoSnapshot.exists()
            ? listarJogos(
                resultadoSnapshot.data()
              )
            : [];

        const jogosConfigurados =
          configuracaoSnapshot.exists()
            ? listarJogos(
                configuracaoSnapshot.data()
              ).filter(
                (jogo) =>
                  jogo.timeA ||
                  jogo.timeB ||
                  jogo.data ||
                  jogo.horario
              )
            : [];

        const agora = new Date();
        const proximoJogo =
          jogosConfigurados
            .map((jogo) => ({
              ...jogo,
              inicio:
                obterDataDoJogo(jogo),
            }))
            .filter(
              (jogo) =>
                jogo.inicio &&
                jogo.inicio > agora
            )
            .sort(
              (a, b) =>
                a.inicio - b.inicio
            )[0] || null;

        setDestaquesMataMata({
          palpitesEnviados:
            palpitesSnapshot.docs.filter(
              (palpiteDoc) =>
                palpiteMataMataPreenchido(
                  palpiteDoc.data()
                )
            ).length,
          jogosEncerrados:
            jogosResultados.filter(
              jogoEncerrado
            ).length,
          totalJogosConfigurados:
            jogosConfigurados.length,
          proximoJogo,
          campeaoMaisApostado:
            contarCampeoes(
              palpitesSnapshot.docs
            ),
        });
      } catch (error) {
        console.error(error);
        setDestaquesMataMata(
          destaquesMataMataPadrao
        );
      }
    };

  const alterarStatusPalpites =
    async (status) => {
      try {
        await updateDoc(
          doc(
            db,
            "configuracoes",
            "geral"
          ),
          {
            palpitesLiberados: status,
          }
        );

        setPalpitesLiberados(status);

        alert(
          status
            ? "Palpites liberados."
            : "Palpites encerrados."
        );
      } catch (error) {
        console.error(error);
      }
    };

  const confirmarPagamento = async (
    id,
    status
  ) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          pagamento: status,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const tornarAdmin = async (id) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          tipoUsuario: "admin",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removerAdmin = async (id) => {
    try {
      await updateDoc(
        doc(db, "usuarios", id),
        {
          tipoUsuario: "participante",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const apagarColecaoEmBatches = async (
    nomeColecao
  ) => {
    const snapshot = await getDocs(
      collection(db, nomeColecao)
    );

    const tamanhoBatch = 450;

    for (
      let inicio = 0;
      inicio < snapshot.docs.length;
      inicio += tamanhoBatch
    ) {
      const batch = writeBatch(db);

      snapshot.docs
        .slice(
          inicio,
          inicio + tamanhoBatch
        )
        .forEach((documento) => {
          batch.delete(documento.ref);
        });

      await batch.commit();
    }

    return snapshot.docs.length;
  };

  const zerarTodosPalpites = async () => {
    if (!isSuperAdmin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja apagar TODOS os palpites de Grupos e Mata-Mata? Essa acao nao apaga usuarios, resultados, configuracoes ou pagamentos."
    );

    if (!confirmar) return;

    try {
      const [
        totalGrupos,
        totalMataMata,
      ] = await Promise.all([
        apagarColecaoEmBatches(
          "palpites"
        ),
        apagarColecaoEmBatches(
          "palpitesMataMata"
        ),
      ]);

      await carregarDestaquesMataMata();

      alert(
        `Palpites apagados com sucesso. Grupos: ${totalGrupos}. Mata-Mata: ${totalMataMata}.`
      );
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao apagar todos os palpites."
      );
    }
  };

  const excluirParticipante = async (
    id,
    nome
  ) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir ${nome}?`
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(db, "usuarios", id)
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir participante.");
    }
  };

  const pagos = participantes.filter(
    (p) => p.pagamento
  ).length;

  const pendentes =
    participantes.length - pagos;

  const arrecadacaoPrevista =
    participantes.length * 20;

  const arrecadacaoConfirmada =
    pagos * 20;

  const lider =
participantes.length > 0
  ? participantes[0]
  : null;

  return (
    <div
      className="dashboard-v37"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "white",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
  className="dashboard-v37-header"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  }}
>
        <h1
  className="dashboard-v37-title"
  style={{
    textAlign: "center",
    margin: 0,
    gridColumn: "2",
  }}
>
  🏆 Terceirizados Mil Grau
</h1>

        <button
          className="dashboard-v37-button dashboard-v37-logout"
          onClick={sair}
          style={botaoSairTopoStyle}
        >
          Sair
        </button>

        <div
          className="dashboard-v37-actions"
          style={navegacaoPrincipalStyle}
        >
          <section style={secaoNavegacaoPrincipalStyle}>
            <h2 style={secaoNavegacaoTituloStyle}>
              ⚽ Mata-Mata
            </h2>

            <div style={grupoBotoesStyle}>
              <button
                className="dashboard-v37-button"
                onClick={abrirMataMata}
                style={botaoDourado}
              >
                Palpites Mata-Mata
              </button>

              <button
                className="dashboard-v37-button"
                onClick={abrirResumoMataMata}
                style={botaoCinza}
              >
                Resumo Mata-Mata
              </button>

              <button
                className="dashboard-v37-button"
                onClick={
                  abrirEstatisticasMataMata
                }
                style={botaoVerde}
              >
                Estatisticas Mata-Mata
              </button>

              <button
                className="dashboard-v37-button"
                onClick={
                  abrirComparacaoPalpites
                }
                style={botaoAzul}
              >
                Comparar Palpites
              </button>

              {isSuperAdmin && (
                <>
                  <button
                    className="dashboard-v37-button"
                    onClick={
                      abrirCentralMataMata
                    }
                    style={botaoRoxo}
                  >
                    Central Mata-Mata
                  </button>

                  <button
                    className="dashboard-v37-button"
                    onClick={() =>
                      abrirResultados(
                        "mataMata"
                      )
                    }
                    style={botaoLaranja}
                  >
                    Resultados Mata-Mata
                  </button>
                </>
              )}
            </div>
          </section>

          <section style={secaoNavegacaoSecundariaStyle}>
            <h2 style={secaoNavegacaoTituloStyle}>
              📦 Fase de Grupos
            </h2>

            <div style={grupoBotoesStyle}>
              <button
                className="dashboard-v37-button"
                onClick={abrirPalpites}
                style={botaoAzul}
              >
                Palpites de Grupos
              </button>

              <button
                className="dashboard-v37-button"
                onClick={abrirResumo}
                style={botaoCinza}
              >
                Resumo de Palpites
              </button>

              {isSuperAdmin && (
                <>
                  <button
                    className="dashboard-v37-button"
                    onClick={
                      abrirCentralPalpites
                    }
                    style={botaoRoxo}
                  >
                    Central de Palpites
                  </button>

                  <button
                    className="dashboard-v37-button"
                    onClick={() =>
                      abrirResultados(
                        "grupos"
                      )
                    }
                    style={botaoLaranja}
                  >
                    Resultados de Grupos
                  </button>
                </>
              )}
            </div>
          </section>

        </div>
      </div>

      <section style={rankingOficialStyle}>
        <div>
          <h2 style={rankingTituloStyle}>
            🏆 RANKING OFICIAL
          </h2>

          <p style={rankingTextoStyle}>
            Acompanhe a classificação e veja
            quem está liderando o bolão.
          </p>
        </div>

        <button
          className="dashboard-v37-button"
          onClick={abrirRanking}
          style={botaoRankingOficialStyle}
        >
          Ver Ranking
        </button>
      </section>

      <section style={destaquesMataMataStyle}>
        <h2 style={destaquesTituloStyle}>
          Destaques Mata-Mata
        </h2>

        <div style={destaquesGridStyle}>
          <div style={destaqueCardStyle}>
            <span style={destaqueLabelStyle}>
              Palpites enviados
            </span>
            <strong style={destaqueNumeroStyle}>
              {
                destaquesMataMata
                  .palpitesEnviados
              }
            </strong>
            <small style={destaqueTextoStyle}>
              Palpites Mata-Mata registrados
            </small>
          </div>

          <div style={destaqueCardStyle}>
            <span style={destaqueLabelStyle}>
              Jogos encerrados
            </span>
            <strong style={destaqueNumeroStyle}>
              {
                destaquesMataMata
                  .jogosEncerrados
              }
            </strong>
            <small style={destaqueTextoStyle}>
              de{" "}
              {
                destaquesMataMata
                  .totalJogosConfigurados
              }{" "}
              jogos configurados
            </small>
          </div>

          <div style={destaqueCardStyle}>
            <span style={destaqueLabelStyle}>
              Proximo jogo
            </span>
            <strong style={destaqueNomeStyle}>
              {formatarProximoJogo(
                destaquesMataMata.proximoJogo
              )}
            </strong>
            <small style={destaqueTextoStyle}>
              Pela configuracao do Mata-Mata
            </small>
          </div>

          <div style={destaqueCardStyle}>
            <span style={destaqueLabelStyle}>
              Campeao mais apostado
            </span>
            <strong style={destaqueNomeStyle}>
              {destaquesMataMata
                .campeaoMaisApostado
                ? destaquesMataMata
                    .campeaoMaisApostado.nome
                : "Sem dados"}
            </strong>
            <small style={destaqueTextoStyle}>
              {destaquesMataMata
                .campeaoMaisApostado
                ? `${destaquesMataMata.campeaoMaisApostado.quantidade} aposta(s)`
                : "Nenhum campeao informado"}
            </small>
          </div>
        </div>
      </section>

      <div
        className="dashboard-v37-card"
        style={{
          backgroundColor: "#1a1a1a",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2>Bem-vindo!</h2>

        <p>
          <strong>Usuário:</strong>{" "}
          {usuario?.email}
        </p>

        <p>
          <strong>Participantes:</strong>{" "}
          {participantes.length}
        </p>

        <p>
          <strong>Pagos:</strong>{" "}
          {pagos}
        </p>

        <p>
          <strong>Pendentes:</strong>{" "}
          {pendentes}
        </p>

        <p>
          <strong>Arrecadação prevista:</strong>{" "}
          R$ {arrecadacaoPrevista.toFixed(2)}
        </p>

        <p>
          <strong>Arrecadação confirmada:</strong>{" "}
          R$ {arrecadacaoConfirmada.toFixed(2)}
        </p>

        {isSuperAdmin && (
          <>
            <p>👑 Super Admin</p>

            <p>
              <strong>
                Status dos Palpites:
              </strong>{" "}
              {palpitesLiberados
                ? "🟢 Aberto"
                : "🔴 Encerrado"}
            </p>

            <div
  style={{
    marginTop: "15px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  }}
>
              <button
                className="dashboard-v37-button"
                onClick={() =>
                  alterarStatusPalpites(
                    true
                  )
                }
                style={botaoLiberar}
              >
                🔓 Liberar Palpites
              </button>

              <button
                className="dashboard-v37-button"
                onClick={() =>
                  alterarStatusPalpites(
                    false
                  )
                }
                style={botaoEncerrar}
              >
                🔒 Encerrar Palpites
              </button>
            </div>

            <div style={adminDangerZoneStyle}>
              <button
                className="dashboard-v37-button"
                onClick={zerarTodosPalpites}
                style={botaoZerarPalpites}
              >
                Zerar todos os palpites
              </button>
            </div>
          </>
        )}
      </div>

      <div
  className="dashboard-v37-card"
  style={{
    backgroundColor:
      "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h2>
    🔎 Buscar Participantes
  </h2>

  <input
    className="dashboard-v37-input"
    type="text"
    placeholder="Buscar por nome ou apelido..."
    value={busca}
    onChange={(e) =>
      setBusca(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      marginBottom: "15px",
    }}
  />

  <div
  className="dashboard-v37-filters"
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "10px",
  }}
>
    <button
  className="dashboard-v37-filter-button"
  onClick={() =>
    setFiltro("todos")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "todos"
        ? "#0d6efd"
        : "#343a40",
  }}
>
  Todos
</button>

<button
  className="dashboard-v37-filter-button"
  onClick={() =>
    setFiltro("pagos")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "pagos"
        ? "#198754"
        : "#343a40",
  }}
>
  Pagos
</button>

<button
  className="dashboard-v37-filter-button"
  onClick={() =>
    setFiltro("pendentes")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "pendentes"
        ? "#dc3545"
        : "#343a40",
  }}
>
  Pendentes
</button>

<button
  className="dashboard-v37-filter-button"
  onClick={() =>
    setFiltro("admins")
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro === "admins"
        ? "#6f42c1"
        : "#343a40",
  }}
>
  Admins
</button>

<button
  className="dashboard-v37-filter-button"
  onClick={() =>
    setFiltro(
      "participantes"
    )
  }
  style={{
    ...botaoFiltro,
    backgroundColor:
      filtro ===
      "participantes"
        ? "#fd7e14"
        : "#343a40",
  }}
>
  Participantes
</button>
  </div>

  <p
  style={{
    marginTop: "15px",
    textAlign: "center",
    fontSize: "18px",
  }}
>
  👥 Exibindo: {participantesFiltrados.length} participantes
</p>
</div>

      <ParticipantesTable
  participantes={
    participantesFiltrados
  }
  isSuperAdmin={isSuperAdmin}
  isAdmin={isAdmin}
  confirmarPagamento={confirmarPagamento}
  tornarAdmin={tornarAdmin}
  removerAdmin={removerAdmin}
  excluirParticipante={excluirParticipante}
/>
    </div>
  );
}

const botaoAzul = {
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoVerde = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoDourado = {
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoRoxo = {
  backgroundColor: "#6f42c1",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoLaranja = {
  backgroundColor: "#fd7e14",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoVermelho = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const botaoSairTopoStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  justifySelf: "end",
};

const botaoCinza = {
  backgroundColor: "#495057",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "180px",
};

const navegacaoPrincipalStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
  width: "min(100%, 980px)",
};

const secaoNavegacaoPrincipalStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #3d3100",
  borderRadius: "8px",
  padding: "16px",
};

const secaoNavegacaoSecundariaStyle = {
  backgroundColor: "#151515",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "16px",
};

const secaoNavegacaoTituloStyle = {
  margin: "0 0 12px",
  fontSize: "20px",
  textAlign: "left",
};

const grupoBotoesStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const rankingOficialStyle = {
  backgroundColor: "#211a05",
  border: "1px solid #ffc107",
  borderRadius: "8px",
  padding: "clamp(18px, 4vw, 24px)",
  margin: "0 auto 20px",
  width: "min(100%, 980px)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const rankingTituloStyle = {
  margin: "0 0 8px",
  color: "#ffd76a",
  fontSize: "clamp(22px, 5vw, 32px)",
};

const rankingTextoStyle = {
  margin: 0,
  color: "#f1f1f1",
  lineHeight: 1.4,
};

const botaoRankingOficialStyle = {
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  minWidth: "180px",
};

const destaquesMataMataStyle = {
  backgroundColor: "#181818",
  border: "1px solid #2c2c2c",
  borderRadius: "8px",
  padding: "clamp(16px, 4vw, 20px)",
  margin: "0 auto 20px",
  width: "min(100%, 980px)",
  boxSizing: "border-box",
};

const destaquesTituloStyle = {
  margin: "0 0 14px",
  color: "#ffd76a",
  fontSize: "22px",
  textAlign: "left",
};

const destaquesGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const destaqueCardStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "14px",
  display: "grid",
  gap: "6px",
  minWidth: 0,
  textAlign: "left",
};

const destaqueLabelStyle = {
  color: "#cfcfcf",
  fontSize: "13px",
};

const destaqueNumeroStyle = {
  color: "#ffd76a",
  fontSize: "clamp(26px, 5vw, 34px)",
  lineHeight: 1,
};

const destaqueNomeStyle = {
  color: "white",
  fontSize: "16px",
  lineHeight: 1.3,
  overflowWrap: "anywhere",
};

const destaqueTextoStyle = {
  color: "#999",
  lineHeight: 1.35,
};

const botaoLiberar = {
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const botaoEncerrar = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
};

const adminDangerZoneStyle = {
  marginTop: "14px",
  paddingTop: "14px",
  borderTop: "1px solid #3a1d1d",
  display: "flex",
  justifyContent: "center",
};

const botaoZerarPalpites = {
  backgroundColor: "#7f1d1d",
  color: "white",
  border: "1px solid #dc3545",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  maxWidth: "100%",
};

const botaoFiltro = {
  backgroundColor: "#343a40",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Dashboard;
