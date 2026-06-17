Projeto: Terceirizados Mil Grau

Leia sempre:
- docs/PROJECT_STATUS.md
- docs/CONTINUAR_PROJETO.md
- docs/CODEX_CONTEXT.md

Status atual:
- Versao atual: V49.2.5
- Nucleo do bolao privado praticamente concluido.
- Foco atual: Mata-Mata.
- Build passando.
- Deploy autorizado apos salvar Git.
- Nao fazer deploy automaticamente.
- Proxima fase: FASE 2 - Landing Page Publica.
- Proxima versao planejada: V50 Landing Page Publica.

Stack:
- React
- Vite
- Firebase Auth
- Firestore
- Firebase Hosting
- GitHub

Permissoes:
- participante
- admin
- superadmin

SuperAdmin:
- Baseado em `tipoUsuario`.
- Valor: `superadmin`.
- Sem e-mail hardcoded.

Colecoes principais:
- usuarios
- palpites
- palpitesMataMata
- resultados
- configuracoes

Documentos importantes:
- resultados/grupos
- resultados/mataMata
- configuracoes/geral
- configuracoes/mataMata

Mata-Mata atual:
- Confrontos oficiais configurados pelo SuperAdmin.
- Salvos em `configuracoes/mataMata`.
- Participante preenche:
  - placarA
  - placarB
  - classificado
  - decididoNosPenaltis
- Resultados oficiais usam os mesmos confrontos.
- Jogo encerrado visualmente apenas quando resultado oficial tem placarA, placarB e classificado preenchidos.

Pontuacao oficial Mata-Mata:
- placar exato = +10
- resultado do jogo correto = +5
- classificado correto = +5
- penaltis correto = +3
- bonus de acerto total = +2
- maximo atual = 22 sem penaltis e 25 com penaltis

Arquivos que NAO devem ser alterados sem aprovacao:
- firestore.rules
- src/utils/calcularPontuacao.js
- src/utils/calcularPontuacaoMataMata.js

UX atual:
- Mata-Mata e o foco principal do Dashboard.
- Fase de Grupos continua funcional, mas em modulo secundario.
- Dashboard possui card separado "Ranking Oficial".
- Dashboard possui Destaques Mata-Mata.
- Ranking abre por padrao na aba Mata-Mata, mantendo aba Geral.
- Ranking usa mapas por uid para `palpites` e `palpitesMataMata`, evitando leituras sequenciais por usuario.
- Resultados usam a mesma tela com abas Mata-Mata e Fase de Grupos.
- Botoes do Dashboard abrem Resultados diretamente na aba correta.
- Existe Resumo Mata-Mata somente leitura em `src/pages/ResumoMataMata.jsx`.
- Existe Comparacao de Palpites em `src/pages/ComparacaoPalpites.jsx`.
- Comparacao possui Comparador de Participantes lado a lado e secao recolhivel "Tendencias do Bolao".
- Modal do participante prioriza Mata-Mata e deixa Fase de Grupos recolhida.
- Telas principais rolam para o topo ao abrir.
- Participantes no Dashboard usam cards mobile ate 768px.

Helpers visuais:
- Arquivo: `src/utils/mataMataVisual.js`
- Usado por:
  - `ResumoMataMata.jsx`
  - `ComparacaoPalpites.jsx`
  - `DetalheParticipante.jsx`
  - `Dashboard.jsx`
- Helpers incluem:
  - textoPreenchido
  - valorPreenchido
  - placarPreenchido
  - jogoEncerrado
  - formatarPlacar
  - formatarConfronto
  - formatarResultadoOficial
  - placarCorreto
  - classificadoCorreto
  - resultadoTemPenaltis
  - penaltisCorreto
  - obterIndicadoresJogo

Limpeza de palpites:
- Participante pode apagar apenas os proprios palpites.
- SuperAdmin pode zerar todos os documentos de:
  - palpites
  - palpitesMataMata
- A acao exige confirmacao forte digitando exatamente:
  - ZERAR PALPITES
- Nao apagar:
  - usuarios
  - resultados
  - configuracoes
  - regras
  - pagamentos

Versoes recentes concluidas:
- V46 Comparacao de Palpites
- V46.1 Comparador de Participantes
- V47.0 Indicadores no Resumo Mata-Mata
- V47.0.1 Limpeza visual dos indicadores
- V47.1 Indicadores na Comparacao de Palpites
- V47.2 Indicadores no Detalhe do Participante
- V48 Destaques Mata-Mata no Dashboard
- V48.0.1 Correcao da contagem de palpites enviados
- V48.0.2 Acao SuperAdmin para zerar todos os palpites
- V49.1 Correcoes criticas da auditoria
- V49.2.1 Helpers visuais compartilhados
- V49.2.2 Comparacao usando helpers
- V49.2.3 Detalhe do participante usando helpers
- V49.2.4 Dashboard usando helpers
- V49.2.5 Performance do Ranking

Roadmap:
- FASE 1 concluida.
- FASE 2 proxima:
  - V50 Landing Page Publica
  - V51 Hero Copa
  - V52 Pagina de Regras
  - V53 Pagina de Premiacao
  - V54 Destaques Publicos
- FASE 3 planejada:
  - V55 Perfil Completo
  - V56 Historico do Ranking
  - V57 Timeline da Copa
  - V58 Feed de Atualizacoes
  - V59 Refatoracao Visual Completa

Regras permanentes:
- Sempre gerar plano tecnico antes de implementar.
- Aguardar aprovacao quando o usuario pedir plano antes.
- Nao alterar `firestore.rules` sem aprovacao.
- Nao alterar pontuacao oficial sem aprovacao.
- Nao alterar `calcularPontuacaoMataMata.js` sem aprovacao.
- Nao criar campos novos no Firestore sem aprovacao.
- Nao fazer deploy sem autorizacao explicita.
- Rodar `npm.cmd run build` depois de alteracoes.
- Informar arquivos alterados.
- Informar o que mudou.
- Informar como testar.
- Informar resultado do build.
- Informar comandos Git.
- Informar se precisa deploy.
- Trabalhar em etapas pequenas.

Antes da Fase 2:
- Gerar plano tecnico da V50.
- Avaliar rotas publicas.
- Avaliar se sera necessario roteamento real.
- Avaliar privacidade dos dados publicos.
- Nao expor diretamente `usuarios`, `palpites` ou `palpitesMataMata` em pagina publica sem plano aprovado.
