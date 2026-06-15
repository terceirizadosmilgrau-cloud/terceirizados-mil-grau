# CONTINUAR PROJETO - TERCEIRIZADOS MIL GRAU

Este arquivo serve para continuar o projeto em um novo chat com contexto suficiente para seguir com seguranca.

---

## Projeto

Nome: Terceirizados Mil Grau

Tipo: Bolao da Copa 2026

Objetivo atual: manter o sistema funcional para participantes, admins e superadmin, com ranking, palpites, Mata-Mata, responsividade mobile e regras Firestore preparadas.

Proxima versao planejada: V39 - Mata-Mata por jogo.

---

## Stack

* React
* Vite
* Firebase Authentication
* Firestore
* Firebase Hosting
* GitHub

Comandos principais:

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
* `src/components/GrupoPalpite.jsx`
* `src/pages/ResumoPalpites.jsx`
* `src/pages/Ranking.jsx`
* `src/components/DetalheParticipante.jsx`
* `src/pages/PalpitesMataMata.jsx`
* `src/pages/CentralPalpites.jsx`
* `src/pages/CentralMataMata.jsx`
* `src/pages/Resultados.jsx`
* `src/utils/calcularPontuacao.js`
* `src/utils/calcularPontuacaoMataMata.js`
* `src/data/grupos.js`
* `src/firebase.js`
* `src/index.css`
* `firestore.rules`
* `firebase.json`
* `PROJECT_STATUS.md`

Pasta de relatorios antigos:

* `relatorios/`

Os relatorios antigos sao historicos e podem conter referencias a problemas ja resolvidos.

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

Uso:

* cadastro de usuarios;
* login e sincronizacao do usuario;
* listagem de participantes;
* permissoes Admin/SuperAdmin;
* pagamento;
* ranking.

### `palpites/{uid}`

Uso:

* palpites da fase de grupos;
* resumo dos palpites;
* ranking;
* central de palpites.

Estrutura esperada:

* grupos `A`, `B`, `C` etc.
* cada grupo com:
  * `primeiro`
  * `segundo`
  * `terceiro`
  * `quarto`
* `atualizadoEm`

### `palpitesMataMata/{uid}`

Uso:

* palpites do Mata-Mata atual;
* ranking;
* central Mata-Mata.

Campos atuais:

* `oitavas`
* `quartas`
* `semifinal`
* `final`
* `campeao`

### `resultados/grupos`

Uso:

* resultados oficiais da fase de grupos;
* calculo do ranking.

### `resultados/mataMata`

Uso:

* resultados oficiais do Mata-Mata atual;
* calculo do ranking.

Campos atuais:

* `oitavas`
* `quartas`
* `semifinal`
* `final`
* `campeao`

### `configuracoes/geral`

Uso:

* liberar/encerrar palpites;
* data limite de palpites.

Campos conhecidos:

* `palpitesLiberados`
* `dataLimitePalpites`

---

## Perfis

### Participante

Pode:

* fazer seus proprios palpites;
* ver seus palpites;
* ver ranking;
* ver dados necessarios do bolao.

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
* alterar configuracoes do bolao.

Padrao atual:

```js
tipoUsuario: "superadmin"
```

Nao usar e-mail hardcoded para permissao.

---

## Regras Atuais

Arquivo:

* `firestore.rules`

Configurado em:

* `firebase.json`

Estado:

* regras criadas;
* SuperAdmin padronizado por `tipoUsuario`;
* sem fallback por e-mail hardcoded;
* ainda nao fazer deploy sem pedido explicito.

Resumo das regras:

* usuario autenticado pode ler dados necessarios.
* participante pode criar seu proprio usuario no cadastro.
* participante pode criar/editar apenas seus proprios palpites.
* admin pode alterar apenas `pagamento`.
* superadmin pode alterar `pagamento`, `tipoUsuario`, resultados e configuracoes.
* superadmin pode excluir usuario que nao seja `superadmin`.
* todo o resto fica bloqueado.

Observacao importante:

O Ranking atual calcula no cliente lendo `usuarios`, `palpites` e `palpitesMataMata` de todos. Por isso as regras ainda permitem leitura dessas colecoes para usuarios autenticados. Para privacidade maior, uma versao futura deveria criar ranking publico calculado separadamente.

---

## Concluido

### V36 - Permissoes Admin

Status: concluida.

Implementado:

* Admin funcional por `tipoUsuario: "admin"`.
* SuperAdmin funcional por `tipoUsuario: "superadmin"`.
* Sincronizacao do usuario logado em tempo real via `usuarios/{uid}`.
* Admin pode confirmar/marcar pagamento pendente.
* SuperAdmin pode promover/remover Admin e excluir participante.

### V37 - Responsividade

Status: concluida.

Implementado:

* Dashboard responsivo.
* Ranking responsivo.
* Detalhe do participante responsivo.
* Palpites responsivo.
* Mata-Mata responsivo.
* Central Mata-Mata responsiva.
* Resultados Oficiais responsivo.
* Participantes no mobile usando cards.
* Tabela desktop de participantes preservada.

### V38 - Seguranca Firestore

Status: concluida no projeto.

Implementado:

* `firestore.rules` criado.
* `firebase.json` aponta para `firestore.rules`.
* regras auditadas contra o app.
* build validado.

Observacao:

Deploy das regras ainda deve ser feito somente quando o usuario pedir explicitamente.

### V38.1 - SuperAdmin Padronizado

Status: concluida.

Implementado:

* `App.jsx` usa `usuario?.tipoUsuario === "superadmin"`.
* `Dashboard.jsx` usa `usuario?.tipoUsuario === "superadmin"`.
* `firestore.rules` usa `myTipoUsuario() == "superadmin"`.
* dependencia de e-mail hardcoded removida da logica ativa.

---

## Roadmap

### V39 - Proxima versao

Mata-Mata por jogo.

Objetivo:

* substituir ou evoluir o modelo atual de Mata-Mata por listas de classificados para um modelo por partida.

Cada jogo deve possuir:

* Time A
* Time B
* Placar previsto
* Placar oficial
* Classificado previsto
* Classificado oficial

Exemplo:

```text
Brasil 2 x 1 Uruguai
Classificado: Brasil
```

### V40

Resultados oficiais por jogo.

### V41

Pontuacao por jogo.

### V42

Ranking exclusivo Mata-Mata.

### V43

Comparacao de palpites.

### V44

Travamento automatico dos palpites.

### V45

Estatisticas do bolao.

---

## Proxima Tarefa

Iniciar V39 - Mata-Mata por jogo.

Antes de alterar codigo na V39, gerar plano tecnico contendo:

* modelo de dados sugerido;
* colecoes/documentos Firestore envolvidos;
* telas afetadas;
* impacto no ranking;
* impacto em `firestore.rules`;
* plano de migracao do modelo atual de Mata-Mata;
* etapas pequenas e seguras.

---

## Instrucoes Para Novo Chat

Ao iniciar um novo chat, enviar este arquivo e pedir:

```text
Leia CONTINUAR_PROJETO.md e PROJECT_STATUS.md.
Entenda o estado atual do projeto.
Nao altere codigo antes de gerar plano tecnico.
Vamos continuar a partir da V39 - Mata-Mata por jogo.
```

Tambem informar:

* V36, V37, V38 e V38.1 estao concluidas.
* Nao reabrir problema antigo de Admin.
* Nao voltar para e-mail hardcoded.
* Nao fazer deploy sem pedido explicito.

---

## Instrucoes Para Codex

Regras gerais:

* Ler `PROJECT_STATUS.md` e `CONTINUAR_PROJETO.md` antes de iniciar uma nova versao.
* Nao alterar layout se a tarefa for apenas regra de negocio.
* Nao alterar regra de negocio se a tarefa for apenas layout.
* Nao alterar Firestore ou rules sem pedido explicito.
* Nao executar `firebase deploy` sem pedido explicito.
* Rodar `npm.cmd run build` depois de alteracoes relevantes.
* Trabalhar em etapas pequenas.
* Listar arquivos modificados ao final.

Regras de permissao:

* Usar apenas `tipoUsuario` para perfil.
* Valores validos:
  * `participante`
  * `admin`
  * `superadmin`
* Nao usar e-mail hardcoded para permissao.
* Nao mexer em `ParticipantesTable.jsx` sem pedido explicito, porque ela controla botoes admin/superadmin.

Regras de seguranca:

* Firestore deve respeitar `firestore.rules`.
* Participante edita apenas seus proprios palpites.
* Admin altera apenas pagamento.
* SuperAdmin altera configuracoes, resultados e perfis.

Regras para V39:

* Nao quebrar Mata-Mata atual sem plano de migracao.
* Primeiro propor modelo por jogo.
* Depois implementar em etapas.
* Validar build a cada etapa importante.

---

## Observacoes Importantes

* A conta principal ja deve estar com `tipoUsuario: "superadmin"` em `usuarios/{uid}`.
* Os relatorios antigos em `relatorios/` podem citar problemas que ja foram resolvidos.
* O arquivo `PROJECT_STATUS.md` contem o resumo oficial atualizado.
* Este arquivo e o guia de continuidade para novos chats.
