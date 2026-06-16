# CONTINUAR PROJETO - TERCEIRIZADOS MIL GRAU

Este arquivo serve para continuar o projeto em um novo chat com contexto suficiente para seguir com seguranca.

---

## Projeto

Nome: Terceirizados Mil Grau

Tipo: Bolao da Copa 2026

Objetivo atual: manter o sistema funcional para participantes, admins e superadmin, com ranking, palpites, Mata-Mata, responsividade mobile e regras Firestore preparadas.

Versao atual: V43.4I - Mata-Mata como foco principal, resumos, limpeza dos proprios palpites, scroll no topo e modal do participante reorganizado.

Proxima versao planejada: a definir.

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
* `src/pages/ResumoMataMata.jsx`
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

* `jogos`
* `oitavas`
* `quartas`
* `semifinal`
* `final`
* `campeao`
* `atualizadoEm`

Estrutura de `jogos`:

* `oitavas`
* `quartas`
* `semifinal`
* `final`

Cada item de jogo contem:

* `id`
* `timeA`
* `timeB`
* `placarA`
* `placarB`
* `classificado`
* `decididoNosPenaltis`

Observacao:

Os campos antigos por lista continuam sendo gravados a partir dos classificados para compatibilidade com telas e fallback.

### `resultados/grupos`

Uso:

* resultados oficiais da fase de grupos;
* calculo do ranking.

### `resultados/mataMata`

Uso:

* resultados oficiais do Mata-Mata atual;
* calculo do ranking.

Campos atuais:

* `jogos`
* `oitavas`
* `quartas`
* `semifinal`
* `final`
* `campeao`
* `atualizadoEm`

Estrutura de `jogos`:

* `oitavas`
* `quartas`
* `semifinal`
* `final`

Cada item de jogo contem:

* `id`
* `timeA`
* `timeB`
* `placarA`
* `placarB`
* `classificado`
* `decididoNosPenaltis`

Observacao:

Os resultados oficiais tambem mantem os campos antigos por lista derivados dos classificados para compatibilidade e fallback.

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
* participante pode apagar apenas seus proprios palpites.
* admin pode alterar apenas `pagamento`.
* superadmin pode alterar `pagamento`, `tipoUsuario`, resultados e configuracoes.
* superadmin pode excluir usuario que nao seja `superadmin`.
* todo o resto fica bloqueado.

Observacao importante:

O Ranking atual calcula no cliente lendo `usuarios`, `palpites` e `palpitesMataMata` de todos. Por isso as regras ainda permitem leitura dessas colecoes para usuarios autenticados. Para privacidade maior, uma versao futura deveria criar ranking publico calculado separadamente.

O Ranking nao usa `usuarios.pontos` para ordenar ou calcular pontuacao. Ele calcula no cliente a partir de `resultados/grupos`, `resultados/mataMata`, `palpites/{uid}` e `palpitesMataMata/{uid}`.

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

### V39 - Mata-Mata Por Jogo

Status: concluida.

Implementado:

* `PalpitesMataMata.jsx` passou a cadastrar jogos por fase.
* Cada jogo possui time A, time B, placar previsto e classificado previsto.
* `CentralMataMata.jsx` exibe confrontos por participante quando o novo modelo existe.
* Palpites antigos por lista continuam visiveis como fallback.
* Campos antigos (`oitavas`, `quartas`, `semifinal`, `final`, `campeao`) continuam salvos para compatibilidade com o ranking atual.

### V40 - Resultados Oficiais Por Jogo

Status: concluida.

Implementado:

* `Resultados.jsx` passou a cadastrar resultados oficiais do Mata-Mata por jogo.
* Cada jogo oficial possui time A, time B, placar oficial e classificado oficial.
* `resultados/mataMata` grava `jogos` e tambem os campos antigos derivados (`oitavas`, `quartas`, `semifinal`, `final`, `campeao`).
* Compatibilidade com o modelo antigo preservada.
* Botao "Zerar Resultados de Teste" visivel apenas para `tipoUsuario === "superadmin"`.
* O botao limpa apenas `resultados/grupos` e `resultados/mataMata`, mantendo os documentos existentes.

### V41 - Pontuacao Do Mata-Mata Por Jogo

Status: concluida.

Implementado:

* `calcularPontuacaoMataMata.js` usa `palpitesMataMata/{uid}.jogos` e `resultados/mataMata.jogos` quando os dois existem.
* Placar exato vale 10 pontos.
* Classificado correto vale 5 pontos.
* Acertando placar e classificado, o jogo soma 15 pontos.
* Fallback antigo por listas preservado quando `jogos` nao existe em algum dos lados.
* `Ranking.jsx` segue sendo ranking geral, mas agora considera a pontuacao por jogo do Mata-Mata.

### V43.2 - Resultado Do Jogo E Bonus De Acerto Total

Status: concluida.

Implementado:

* Resultado do jogo correto vale 5 pontos.
* Resultado do jogo e derivado do placar:
  * `placarA > placarB`: timeA venceu.
  * `placarA === placarB`: empate.
  * `placarB > placarA`: timeB venceu.
* Placar exato continua valendo 10 pontos.
* Classificado correto continua valendo 5 pontos.
* Penaltis correto continua valendo 3 pontos.
* Bonus de acerto total vale 2 pontos.
* Acerto total exige placar exato, resultado do jogo e classificado corretos.
* Se o jogo oficial foi decidido nos penaltis, o acerto total tambem exige penaltis correto.
* Pontos maximos do Mata-Mata no Ranking foram atualizados.
* Maximo por jogo: 22 pontos sem penaltis e 25 pontos com penaltis.

### V43.4 - Reorganizacao Visual, Resumos E Foco Mata-Mata

Status: concluida.

Implementado:

* Dashboard reorganizado em bloco Mata-Mata, bloco Fase de Grupos e card separado de Ranking Oficial.
* Bloco Mata-Mata contem Palpites Mata-Mata, Resumo Mata-Mata, Central Mata-Mata e Resultados Mata-Mata.
* Bloco Fase de Grupos contem Palpites de Grupos, Resumo de Palpites, Central de Palpites e Resultados de Grupos.
* Ranking abre por padrao na aba Mata-Mata.
* Ranking Geral continua disponivel.
* Resultados usam a mesma tela, com abas Mata-Mata e Fase de Grupos.
* Dashboard abre Resultados ja na aba correspondente ao botao clicado.
* Nova tela `ResumoMataMata.jsx`, somente leitura.
* Resumo de Grupos mostra mensagem quando nao ha palpites.
* Participante pode limpar apenas seus proprios palpites em `palpites/{uid}` e `palpitesMataMata/{uid}`.
* `firestore.rules` permite delete nos palpites apenas para `isOwner(uid)` ou `isSuperAdmin()`.
* Telas principais rolam para o topo ao abrir usando `window.scrollTo(0, 0)`.
* Modal `DetalheParticipante` foi reorganizado para mostrar Mata-Mata primeiro e Fase de Grupos recolhida.
* Cards mobile de participantes aparecem ate 768px para evitar tabela com scroll horizontal no celular.

---

## Roadmap

### V39 - Concluida

Mata-Mata por jogo.

Implementado:

* modelo por partida nos palpites;
* central com visualizacao por jogo;
* compatibilidade com listas antigas para o ranking atual.

Cada jogo possui:

* Time A
* Time B
* Placar previsto
* Classificado previsto

Exemplo:

```text
Brasil 2 x 1 Uruguai
Classificado: Brasil
```

### V40 - Concluida

Resultados oficiais por jogo.

### V41 - Concluida

Pontuacao por jogo.

### V42

Ranking exclusivo Mata-Mata.

### V43

Comparacao de palpites.

### V43.2 - Concluida

Resultado do jogo e bonus de acerto total.

### V44

Travamento automatico dos palpites.

### V45

Estatisticas do bolao.

---

## Proxima Tarefa

Proxima versao a definir.

Antes de alterar codigo em uma nova versao, gerar plano tecnico quando solicitado contendo:

* modelo de dados sugerido;
* colecoes/documentos Firestore envolvidos;
* telas afetadas;
* impacto no ranking;
* impacto em `firestore.rules`;
* plano de exibicao do ranking exclusivo Mata-Mata;
* etapas pequenas e seguras.

---

## Instrucoes Para Novo Chat

Ao iniciar um novo chat, enviar este arquivo e pedir:

```text
Leia CONTINUAR_PROJETO.md e PROJECT_STATUS.md.
Entenda o estado atual do projeto.
Nao altere codigo antes de gerar plano tecnico.
Vamos continuar a partir da V43.4I.
```

Tambem informar:

* V36, V37, V38, V38.1, V39, V40, V41, V42, V43.2 e V43.4 estao concluidas.
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

Regras para V42:

* Nao quebrar o Ranking Geral atual.
* Primeiro propor como sera o ranking exclusivo Mata-Mata.
* Depois implementar em etapas.
* Validar build a cada etapa importante.

Regras para V43.2:

* Nao criar novo campo para resultado do jogo; ele e derivado do placar.
* Resultado do jogo correto vale +5.
* Bonus de acerto total vale +2.
* Atualizar pontos maximos do Ranking sempre que mudar a pontuacao.

---

## Observacoes Importantes

* A conta principal ja deve estar com `tipoUsuario: "superadmin"` em `usuarios/{uid}`.
* Os relatorios antigos em `relatorios/` podem citar problemas que ja foram resolvidos.
* O arquivo `PROJECT_STATUS.md` contem o resumo oficial atualizado.
* Este arquivo e o guia de continuidade para novos chats.

configuracoes/mataMata

Uso:
- confrontos oficiais do Mata-Mata

Estrutura:

jogos:
  oitavas
  quartas
  semifinal
  final

Cada jogo:
- id
- fase
- timeA
- timeB
- data
- horario
