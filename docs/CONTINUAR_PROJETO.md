# CONTINUAR PROJETO - TERCEIRIZADOS MIL GRAU

Este arquivo serve para continuar o projeto em um novo chat com contexto suficiente para seguir com seguranca.

---

## Projeto

Nome: Terceirizados Mil Grau

Tipo: Bolao da Copa 2026

Status atual:

* Versao atual: V49.2.5.
* Nucleo do bolao privado praticamente concluido.
* Foco atual: Mata-Mata.
* Build passando.
* Deploy autorizado apos salvar Git, mas nao fazer deploy automaticamente.
* Proxima fase: FASE 2 - Landing Page Publica.
* Proxima versao planejada: V50 Landing Page Publica.

---

## Stack

* React
* Vite
* Firebase Authentication
* Firestore
* Firebase Hosting
* GitHub

Comando obrigatorio apos implementacoes:

```bash
npm.cmd run build
```

Nao executar deploy sem pedido explicito:

```bash
firebase deploy
```

---

## Estrutura Atual

Arquivos principais:

* `src/App.jsx`
* `src/components/Login.jsx`
* `src/components/Cadastro.jsx`
* `src/pages/Dashboard.jsx`
* `src/components/admin/ParticipantesTable.jsx`
* `src/pages/Palpites.jsx`
* `src/pages/ResumoPalpites.jsx`
* `src/pages/ResumoMataMata.jsx`
* `src/pages/ComparacaoPalpites.jsx`
* `src/pages/Ranking.jsx`
* `src/components/DetalheParticipante.jsx`
* `src/pages/PalpitesMataMata.jsx`
* `src/pages/CentralPalpites.jsx`
* `src/pages/CentralMataMata.jsx`
* `src/pages/Resultados.jsx`
* `src/utils/calcularPontuacao.js`
* `src/utils/calcularPontuacaoMataMata.js`
* `src/utils/mataMataVisual.js`
* `src/firebase.js`
* `src/index.css`
* `firestore.rules`
* `firebase.json`
* `docs/PROJECT_STATUS.md`
* `docs/CONTINUAR_PROJETO.md`
* `docs/CODEX_CONTEXT.md`

---

## Colecoes Firestore

### `usuarios/{uid}`

Campos conhecidos:

* `nome`
* `apelido`
* `email`
* `tipoUsuario`
* `pagamento`
* `pontos`
* `dataCadastro`

Valores validos de `tipoUsuario`:

* `participante`
* `admin`
* `superadmin`

### `palpites/{uid}`

Uso:

* palpites da fase de grupos;
* resumo dos palpites;
* ranking;
* central de palpites.

### `palpitesMataMata/{uid}`

Uso:

* palpites do Mata-Mata;
* resumo Mata-Mata;
* comparacao de palpites;
* ranking;
* central Mata-Mata.

Campos atuais:

* `jogos`
* `oitavas`
* `quartas`
* `semifinal`
* `final`
* `campeao`
* `atualizadoEm`

Cada jogo em `jogos` contem:

* `id`
* `fase`
* `timeA`
* `timeB`
* `placarA`
* `placarB`
* `classificado`
* `decididoNosPenaltis`

### `resultados/grupos`

Uso:

* resultados oficiais da fase de grupos;
* calculo do ranking geral.

O Ranking deve funcionar mesmo se este documento nao existir.

### `resultados/mataMata`

Uso:

* resultados oficiais do Mata-Mata;
* indicadores visuais;
* calculo do ranking.

Jogo encerrado visualmente apenas quando possui:

* `placarA` preenchido;
* `placarB` preenchido;
* `classificado` preenchido.

### `configuracoes/mataMata`

Uso:

* confrontos oficiais do Mata-Mata;
* datas e horarios dos jogos;
* travamento automatico.

### `configuracoes/geral`

Uso:

* liberar/encerrar palpites;
* data limite de palpites.

---

## Permissoes

### Participante

Pode:

* fazer seus proprios palpites;
* ver seus palpites;
* ver ranking;
* ver comparacao de palpites.

Nao pode:

* alterar pagamento;
* alterar perfil;
* alterar resultados;
* alterar configuracoes;
* alterar dados de outros usuarios.

### Admin

Pode:

* ver participantes;
* confirmar pagamento;
* marcar pagamento como pendente.

Nao pode:

* promover Admin;
* remover Admin;
* excluir participante;
* alterar resultados;
* alterar configuracoes.

### SuperAdmin

Pode:

* controle administrativo completo;
* confirmar e marcar pagamento pendente;
* tornar participante Admin;
* remover Admin;
* excluir participante;
* alterar resultados oficiais;
* alterar configuracoes do bolao;
* zerar todos os documentos de `palpites` e `palpitesMataMata`.

Padrao atual:

```js
tipoUsuario: "superadmin"
```

Nao usar e-mail hardcoded para permissao.

---

## Pontuacao Oficial

Nao alterar sem aprovacao explicita.

Mata-Mata:

* placar exato = +10;
* resultado do jogo correto = +5;
* classificado correto = +5;
* penaltis correto = +3;
* bonus de acerto total = +2;
* maximo por jogo = 22 sem penaltis e 25 com penaltis.

Arquivos de pontuacao:

* `src/utils/calcularPontuacao.js`
* `src/utils/calcularPontuacaoMataMata.js`

---

## Concluido

Versoes antigas concluidas:

* V36 Permissoes Admin.
* V37 Responsividade.
* V38 Seguranca Firestore.
* V38.1 SuperAdmin padronizado.
* V39 Mata-Mata por jogo.
* V40 Resultados oficiais por jogo.
* V41 Pontuacao do Mata-Mata por jogo.
* V41.1 Botao seguro para zerar resultados de teste.
* V42 Ranking exclusivo Mata-Mata.
* V42.1 ate V42.8 refinamentos do Ranking.
* V43 Confrontos oficiais do Mata-Mata.
* V43.1 Penaltis.
* V43.2 Resultado do jogo e bonus de acerto total.
* V43.4 reorganizacao visual e foco Mata-Mata.
* V44 Travamento automatico.
* V44.1 Contagem regressiva.
* V45 Estatisticas Mata-Mata.
* V45.1 Estatisticas por fase.
* V45.2 Destaques do Mata-Mata.
* V45.3 Correcao da premiacao e detalhamento por jogo.
* V45.4 Detalhamento compacto e recolhivel.

Versoes recentes concluidas:

* V46 Comparacao de Palpites.
* V46.1 Comparador de Participantes.
* V47.0 Indicadores no Resumo Mata-Mata.
* V47.0.1 Limpeza visual dos indicadores.
* V47.1 Indicadores na Comparacao de Palpites.
* V47.2 Indicadores no Detalhe do Participante.
* V48 Destaques Mata-Mata no Dashboard.
* V48.0.1 Correcao da contagem de palpites enviados.
* V48.0.2 Acao SuperAdmin para zerar todos os palpites.
* V49.1 Correcoes criticas da auditoria.
* V49.2.1 Helpers visuais compartilhados.
* V49.2.2 Comparacao usando helpers.
* V49.2.3 Detalhe do participante usando helpers.
* V49.2.4 Dashboard usando helpers.
* V49.2.5 Performance do Ranking.

---

## Estado Tecnico Atual

* `Ranking.jsx` carrega `usuarios`, `palpites` e `palpitesMataMata` em colecoes e usa mapas por uid para evitar leituras sequenciais.
* `ResumoMataMata.jsx`, `ComparacaoPalpites.jsx`, `DetalheParticipante.jsx` e `Dashboard.jsx` usam helpers visuais compartilhados de `src/utils/mataMataVisual.js`.
* Dashboard possui cards de Destaques Mata-Mata.
* SuperAdmin pode zerar todos os palpites com confirmacao forte digitando `ZERAR PALPITES`.
* Acesso a comparacao de palpites permanece liberado para usuarios autenticados.
* `firestore.rules` nao foi alterado nas versoes recentes.

---

## Roadmap

### FASE 1 - Concluida

* V46 Comparacao de Palpites.
* V47 Indicadores Visuais de Jogos Encerrados.
* V48 Destaques Dashboard.
* V49 Auditoria Final.

### FASE 2 - Proxima

* V50 Landing Page Publica.
* V51 Hero Copa.
* V52 Pagina de Regras.
* V53 Pagina de Premiacao.
* V54 Destaques Publicos.

### FASE 3 - Planejada

* V55 Perfil Completo.
* V56 Historico do Ranking.
* V57 Timeline da Copa.
* V58 Feed de Atualizacoes.
* V59 Refatoracao Visual Completa.

---

## Instrucoes Para Novo Chat

Ao iniciar um novo chat, enviar:

```text
Projeto: Terceirizados Mil Grau

Leia obrigatoriamente:
- docs/PROJECT_STATUS.md
- docs/CONTINUAR_PROJETO.md
- docs/CODEX_CONTEXT.md

Versao atual: V49.2.5
Proxima fase: FASE 2 - Landing Page Publica
Proxima versao planejada: V50 Landing Page Publica

Nao altere codigo antes de gerar plano tecnico.
Nao faça deploy sem autorizacao.
```

---

## Regras Permanentes Para Codex

* Sempre gerar plano tecnico antes de implementar.
* Nao alterar `firestore.rules` sem aprovacao.
* Nao alterar pontuacao oficial sem aprovacao.
* Nao alterar `calcularPontuacaoMataMata.js` sem aprovacao.
* Nao fazer deploy sem autorizacao explicita.
* Rodar `npm.cmd run build` depois de alteracoes.
* Informar arquivos alterados.
* Informar o que mudou.
* Informar como testar.
* Informar resultado do build.
* Informar comandos Git.
* Informar se precisa deploy.
* Trabalhar em etapas pequenas.
* Manter instrucoes claras para Codex.

---

## Observacoes Importantes Para Fase 2

* A Landing Page Publica nao deve expor dados privados diretamente.
* Antes de abrir dados sem login, avaliar impacto em `firestore.rules`.
* O app atual usa navegacao por estado em `App.jsx`; para paginas publicas pode ser necessario plano de roteamento.
* Deploy esta autorizado somente apos salvar Git, mas nao deve ser executado automaticamente.
