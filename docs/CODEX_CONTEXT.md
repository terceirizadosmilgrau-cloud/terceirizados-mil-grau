Projeto: Terceirizados Mil Grau

Leia sempre:
- docs/PROJECT_STATUS.md
- docs/CONTINUAR_PROJETO.md
- docs/CODEX_CONTEXT.md

Status atual:
- Versão atual: V52.3 concluída.
- Núcleo privado do bolão praticamente concluído.
- Fase atual: FASE 2 - Área Pública.
- Landing Page pública criada e polida.
- Página pública de Regras criada em `/regras`.
- Build passando.
- Deploy pode ser feito somente com autorização explícita.
- Próxima versão planejada: V52.4 - Polimento Final da Landing.

Stack:
- React
- Vite
- Firebase Auth
- Firestore
- Firebase Hosting
- GitHub
- React Router DOM

Rotas:
- `/` -> Landing Page pública.
- `/regras` -> Página pública de regras.
- `/login` -> Login.
- `/cadastro` -> Cadastro.
- `/app` -> área autenticada atual.

Permissões:
- participante
- admin
- superadmin

SuperAdmin:
- Baseado em `tipoUsuario`.
- Valor: `superadmin`.
- Sem e-mail hardcoded.

Coleções principais:
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

Pontuação oficial Mata-Mata:
- placar exato = +10
- resultado do jogo correto = +5
- classificado correto = +5
- pênaltis correto = +3
- bônus de acerto total = +2
- máximo atual = 22 sem pênaltis e 25 com pênaltis

Arquivos que NÃO devem ser alterados sem aprovação:
- firestore.rules
- src/utils/calcularPontuacao.js
- src/utils/calcularPontuacaoMataMata.js

UX atual:
- Mata-Mata é o foco principal do Dashboard.
- Fase de Grupos continua funcional, mas em módulo secundário.
- Dashboard possui card separado "Ranking Oficial".
- Dashboard possui Destaques Mata-Mata.
- Ranking abre por padrão na aba Mata-Mata, mantendo aba Geral.
- Ranking usa mapas por uid para `palpites` e `palpitesMataMata`, evitando leituras sequenciais por usuário.
- Resultados usam a mesma tela com abas Mata-Mata e Fase de Grupos.
- Botões do Dashboard abrem Resultados diretamente na aba correta.
- Existe Resumo Mata-Mata somente leitura em `src/pages/ResumoMataMata.jsx`.
- Existe Comparação de Palpites em `src/pages/ComparacaoPalpites.jsx`.
- Comparação possui Comparador de Participantes lado a lado e seção recolhível "Tendências do Bolão".
- Modal do participante prioriza Mata-Mata e deixa Fase de Grupos recolhida.
- Telas principais rolam para o topo ao abrir.
- Participantes no Dashboard usam cards mobile até 768px.

Área pública atual:
- `src/pages/LandingPage.jsx`
- `src/pages/LandingPage.css`
- `src/pages/RegrasPage.jsx`
- `src/pages/RegrasPage.css`
- `src/App.jsx` possui rotas públicas.
- Landing e Regras são estáticas e não leem Firestore.
- Header público possui: Início, Como Funciona, Regras, Premiação.
- Hero atual da Landing:
  - Headline: `Palpite. Dispute. Conquiste o topo.`
  - CTA: Criar conta e Entrar.
- Painel da direita não usa números fake.
- Painel mostra benefícios reais:
  - Ranking ao vivo
  - Mata-Mata completo
  - Comparação de palpites
  - Premiação automática
  - Estatísticas dos participantes
  - Histórico das apostas
- Cards sem siglas:
  - Fase de Grupos
  - Mata-Mata
  - Ranking
  - Comparação
  - Premiação
- Contador foi removido completamente.
- Seção de Premiação na Landing:
  - 1º lugar 50%
  - 2º lugar 30%
  - 3º lugar 20%
- Link "Premiação" rola para a seção real de premiação.
- Link "Como Funciona" rola para os cards.

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
- Participante pode apagar apenas os próprios palpites.
- SuperAdmin pode zerar todos os documentos de:
  - palpites
  - palpitesMataMata
- A ação exige confirmação forte digitando exatamente:
  - ZERAR PALPITES
- Não apagar:
  - usuarios
  - resultados
  - configuracoes
  - regras
  - pagamentos

Versões recentes concluídas:
- V46 Comparação de Palpites
- V46.1 Comparador de Participantes
- V47.0 Indicadores no Resumo Mata-Mata
- V47.0.1 Limpeza visual dos indicadores
- V47.1 Indicadores na Comparação de Palpites
- V47.2 Indicadores no Detalhe do Participante
- V48 Destaques Mata-Mata no Dashboard
- V48.0.1 Correção da contagem de palpites enviados
- V48.0.2 Ação SuperAdmin para zerar todos os palpites
- V49.1 Correções críticas da auditoria
- V49.2.1 Helpers visuais compartilhados
- V49.2.2 Comparação usando helpers
- V49.2.3 Detalhe do participante usando helpers
- V49.2.4 Dashboard usando helpers
- V49.2.5 Performance do Ranking
- V50 Landing Page Pública
- V50.1 Link Voltar para início no Login/Cadastro
- V51 Hero Copa Profissional
- V52 Página Pública de Regras
- V52.2 Correção visual da Landing
- V52.3 Polimento Premium da Landing

Roadmap:
- FASE 1 concluída.
- FASE 2 em andamento:
  - V50 Landing Page Pública: concluída
  - V51 Hero Copa: concluída
  - V52 Página de Regras: concluída
  - V52.3 Polimento Premium da Landing: concluída
  - V52.4 Polimento Final da Landing: próxima
  - V53 Página/Seção de Premiação: avaliar se ainda precisa, pois a Landing já tem seção de premiação
  - V54 Destaques Públicos
- FASE 3 planejada:
  - V55 Perfil Completo
  - V56 Histórico do Ranking
  - V57 Timeline da Copa
  - V58 Feed de Atualizações
  - V59 Refatoração Visual Completa

Regras permanentes:
- Sempre gerar plano técnico antes de implementar.
- Aguardar aprovação quando o usuário pedir plano antes.
- Não alterar `firestore.rules` sem aprovação.
- Não alterar pontuação oficial sem aprovação.
- Não alterar `calcularPontuacaoMataMata.js` sem aprovação.
- Não criar campos novos no Firestore sem aprovação.
- Não fazer deploy sem autorização explícita.
- Rodar `npm.cmd run build` depois de alterações.
- Informar arquivos alterados.
- Informar o que mudou.
- Informar como testar.
- Informar resultado do build.
- Informar comandos Git.
- Informar se precisa deploy.
- Trabalhar em etapas pequenas.

Próxima tarefa:
V52.4 - Polimento Final da Landing.

Plano da V52.4:
- Corrigir acentuação:
  - Premiação
  - Comparação
  - Histórico
  - Campeão
  - arrecadação
- Manter headline:
  - `Palpite. Dispute. Conquiste o topo.`
- Melhorar seção Premiação:
  - 🥇 Campeão — 50% da arrecadação
  - 🥈 Vice-campeão — 30% da arrecadação
  - 🥉 Terceiro lugar — 20% da arrecadação
- Melhorar benefícios rápidos:
  - Ranking ao vivo
  - Mata-Mata completo
  - Comparação de palpites
  - Premiação automática
- Revisar textos dos cards para ficarem mais profissionais.
- Não alterar layout principal.
- Não alterar rotas.
- Não mexer em Login, Cadastro ou RegrasPage.

Arquivos previstos para V52.4:
- src/pages/LandingPage.jsx
- src/pages/LandingPage.css

Build obrigatório:
```bash
npm.cmd run build
```

Git recomendado se V52, V52.2 e V52.3 ainda não foram salvas:
```bash
git status
git add src/App.jsx src/pages/RegrasPage.jsx src/pages/RegrasPage.css src/pages/LandingPage.jsx src/pages/LandingPage.css
git commit -m "Implementa V52 regras publicas e polimento da landing"
git push origin main
```

Não adicionar:
```txt
.firebase/hosting.ZGlzdA.cache
```
