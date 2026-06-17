# TERCEIRIZADOS MIL GRAU

## Status Atual

Versao atual: V49.2.5

Status geral:

* Nucleo do bolao privado praticamente concluido.
* Foco atual: Mata-Mata.
* Build passando.
* Deploy autorizado apos salvar Git, mas nao executar deploy automaticamente.
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

---

## Funcionalidades Implementadas

* Login e cadastro.
* Dashboard administrativo e do participante.
* Listagem de participantes.
* Confirmacao de pagamento.
* Promocao/remocao de Admin.
* Exclusao de participante por SuperAdmin.
* Palpites da fase de grupos.
* Palpites Mata-Mata por jogo.
* Travamento automatico dos palpites.
* Contagem regressiva.
* Resumo de palpites.
* Resumo Mata-Mata somente leitura.
* Ranking Geral.
* Ranking Mata-Mata.
* Detalhe do participante.
* Comparacao de palpites.
* Comparador de participantes lado a lado.
* Tendencias do Bolao.
* Destaques Mata-Mata no Dashboard.
* Resultados oficiais de grupos.
* Resultados oficiais do Mata-Mata por jogo.
* Pontuacao oficial do Mata-Mata por jogo.
* Indicadores visuais de jogos pendentes/encerrados.
* Indicadores de acerto/erro de placar, classificado e penaltis.
* Helpers visuais compartilhados para Mata-Mata.
* Acao SuperAdmin para zerar todos os palpites.
* Regras Firestore configuradas no projeto.
* Responsividade mobile nas principais telas.

---

## Versoes Concluidas Recentemente

* V46 concluida: Comparacao de Palpites.
* V46.1 concluida: Comparador de Participantes.
* V47.0 concluida: Indicadores no Resumo Mata-Mata.
* V47.0.1 concluida: Limpeza visual dos indicadores.
* V47.1 concluida: Indicadores na Comparacao de Palpites.
* V47.2 concluida: Indicadores no Detalhe do Participante.
* V48 concluida: Destaques Mata-Mata no Dashboard.
* V48.0.1 concluida: Correcao da contagem de palpites enviados.
* V48.0.2 concluida: Acao SuperAdmin para zerar todos os palpites.
* V49.1 concluida: Correcoes criticas da auditoria.
* V49.2.1 concluida: Helpers visuais compartilhados.
* V49.2.2 concluida: Comparacao usando helpers.
* V49.2.3 concluida: Detalhe do participante usando helpers.
* V49.2.4 concluida: Dashboard usando helpers.
* V49.2.5 concluida: Performance do Ranking.

---

## Perfis

### Participante

* Fazer seus proprios palpites.
* Ver seus palpites.
* Ver ranking.
* Ver comparacao de palpites.
* Ver dados necessarios do bolao.
* Nao pode alterar pagamento, perfil, resultados ou configuracoes.

### Admin

* Confirmar pagamento.
* Marcar pagamento como pendente.
* Ver participantes.
* Nao pode promover Admin, remover Admin, excluir participante, alterar resultados ou configuracoes.

### SuperAdmin

* Controle administrativo completo.
* Confirmar e marcar pagamento pendente.
* Tornar participante Admin.
* Remover Admin.
* Excluir participante.
* Alterar resultados oficiais.
* Alterar configuracoes do bolao.
* Zerar todos os documentos de `palpites` e `palpitesMataMata` com confirmacao forte.

O SuperAdmin e definido por:

```js
tipoUsuario: "superadmin"
```

Nao ha dependencia de e-mail hardcoded na logica ativa do app ou nas regras Firestore.

---

## Firestore

Colecoes usadas:

* `usuarios`
* `palpites`
* `palpitesMataMata`
* `resultados`
* `configuracoes`

Documentos importantes:

* `resultados/grupos`
* `resultados/mataMata`
* `configuracoes/geral`
* `configuracoes/mataMata`

Estado das regras:

* `firestore.rules` existe no projeto.
* Usuarios autenticados podem ler dados necessarios ao bolao privado.
* Participante cria/edita apenas seus proprios palpites.
* Participante apaga apenas seus proprios palpites.
* Admin altera apenas pagamento.
* SuperAdmin altera pagamento, perfis, resultados e configuracoes.
* SuperAdmin pode apagar documentos de `palpites` e `palpitesMataMata`.

Observacao para Fase 2:

Páginas publicas nao devem expor diretamente colecoes privadas como `usuarios`, `palpites` e `palpitesMataMata`. Para a Landing Page Publica, avaliar dados agregados, anonimizados ou documentos publicos separados antes de alterar rules.

---

## Pontuacao Oficial Mata-Mata

Nao alterar sem aprovacao explicita.

* Placar exato: +10.
* Resultado do jogo correto: +5.
* Classificado correto: +5.
* Penaltis correto: +3 quando o resultado oficial foi decidido nos penaltis.
* Bonus de acerto total: +2.
* Maximo por jogo: 22 pontos sem penaltis e 25 pontos com penaltis.

Arquivo oficial:

* `src/utils/calcularPontuacaoMataMata.js`

---

## Arquivos Importantes

* `src/App.jsx`
* `src/pages/Dashboard.jsx`
* `src/pages/Ranking.jsx`
* `src/pages/PalpitesMataMata.jsx`
* `src/pages/ResumoMataMata.jsx`
* `src/pages/ComparacaoPalpites.jsx`
* `src/components/DetalheParticipante.jsx`
* `src/pages/Resultados.jsx`
* `src/utils/calcularPontuacao.js`
* `src/utils/calcularPontuacaoMataMata.js`
* `src/utils/mataMataVisual.js`
* `firestore.rules`

---

## Roadmap

### FASE 1 - Concluida

* V46 Comparacao de Palpites.
* V47 Indicadores Visuais de Jogos Encerrados.
* V48 Destaques Dashboard.
* V49 Auditoria Final e ajustes criticos/performance.

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

## Regras Permanentes

* Sempre gerar plano tecnico antes de implementar.
* Nao alterar `firestore.rules` sem aprovacao.
* Nao alterar pontuacao oficial sem aprovacao.
* Nao alterar `calcularPontuacaoMataMata.js` sem aprovacao.
* Nao fazer deploy sem autorizacao explicita.
* Rodar `npm.cmd run build` apos implementacoes.
* Sempre informar arquivos alterados, o que mudou, como testar, resultado do build, comandos Git e se precisa deploy.
* Trabalhar em etapas pequenas.
* Manter instrucoes claras para Codex, pois o projeto usa Codex para codar.

---

## Proxima Tarefa

V50 - Landing Page Publica.

Antes de implementar, gerar plano tecnico da Fase 2 considerando:

* rotas publicas;
* dados que podem ser exibidos sem login;
* impacto em privacidade;
* impacto em `firestore.rules`;
* layout responsivo;
* deploy somente apos autorizacao.
