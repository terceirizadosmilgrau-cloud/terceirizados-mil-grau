# CONTINUAR PROJETO - TERCEIRIZADOS MIL GRAU

Este arquivo serve para continuar o projeto em um novo chat ou no Codex com contexto suficiente para seguir com segurança.

---

## Projeto

Nome: Terceirizados Mil Grau

Tipo: Bolão da Copa 2026

Status atual:

* Versão atual: V52.3 concluída.
* Núcleo privado do bolão praticamente concluído.
* Fase 2 - Área Pública em andamento.
* Landing Page pública criada e visualmente polida.
* Página pública de Regras criada.
* Build passando.
* GitHub deve ser sincronizado antes de continuar em outro computador.
* Deploy pode ser feito somente com autorização explícita.
* Próxima versão planejada: V52.4 - Polimento final da Landing.

---

## Regras Permanentes de Trabalho

Antes de qualquer implementação:

* Sempre gerar Plano Técnico primeiro.
* Aguardar aprovação antes de implementar.

Após qualquer implementação:

* Explicar exatamente o que foi alterado.
* Explicar como testar.
* Informar resultado do build.
* Informar comandos Git.
* Informar claramente se deve ou não fazer deploy.

Deploy:

* Nunca fazer deploy sem autorização explícita.
* Quando for apenas área pública/hosting, usar preferencialmente:

```bash
firebase deploy --only hosting
```

Firestore:

* Nunca alterar `firestore.rules` sem aprovação explícita.
* Nunca expor dados privados em página pública sem plano aprovado.

Pontuação:

* Nunca alterar pontuação oficial sem aprovação explícita.
* Nunca alterar `src/utils/calcularPontuacao.js` sem necessidade aprovada.
* Nunca alterar `src/utils/calcularPontuacaoMataMata.js` sem necessidade aprovada.

Fluxo Codex:

* O Codex é usado para codar.
* Sempre gerar mensagem pronta para enviar ao Codex.
* A mensagem deve conter objetivo, regras, arquivos afetados, como testar, build e Git.

Fluxo de validação:

1. Plano técnico.
2. Aprovação.
3. Implementação.
4. Testes.
5. Build.
6. Git.
7. Deploy somente se autorizado.

---

## Stack

* React
* Vite
* Firebase Authentication
* Firestore
* Firebase Hosting
* GitHub
* React Router DOM

Comando obrigatório após implementações:

```bash
npm.cmd run build
```

---

## Rotas atuais

Área pública:

```txt
/         -> Landing Page pública
/regras   -> Página pública de regras
/login    -> Login
/cadastro -> Cadastro
```

Área autenticada:

```txt
/app      -> área autenticada atual
```

Observação:

* O fluxo interno autenticado ainda usa estado `tela` dentro do app.
* Não converter todas as telas internas para rotas sem plano técnico específico.

---

## Arquivos principais

* `src/App.jsx`
* `src/pages/LandingPage.jsx`
* `src/pages/LandingPage.css`
* `src/pages/RegrasPage.jsx`
* `src/pages/RegrasPage.css`
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
* `package.json`
* `package-lock.json`

---

## Coleções Firestore

### `usuarios/{uid}`

Campos conhecidos:

* `nome`
* `apelido`
* `email`
* `tipoUsuario`
* `pagamento`
* `pontos`
* `dataCadastro`

Valores válidos de `tipoUsuario`:

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
* comparação de palpites;
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

Cada jogo em `jogos` contém:

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
* cálculo do ranking geral.

O Ranking deve funcionar mesmo se este documento não existir.

### `resultados/mataMata`

Uso:

* resultados oficiais do Mata-Mata;
* indicadores visuais;
* cálculo do ranking.

Jogo encerrado visualmente apenas quando possui:

* `placarA` preenchido;
* `placarB` preenchido;
* `classificado` preenchido.

### `configuracoes/mataMata`

Uso:

* confrontos oficiais do Mata-Mata;
* datas e horários dos jogos;
* travamento automático.

### `configuracoes/geral`

Uso:

* liberar/encerrar palpites;
* data limite de palpites.

---

## Permissões

### Participante

Pode:

* fazer seus próprios palpites;
* ver seus palpites;
* ver ranking;
* ver comparação de palpites.

Não pode:

* alterar pagamento;
* alterar perfil;
* alterar resultados;
* alterar configurações;
* alterar dados de outros usuários.

### Admin

Pode:

* ver participantes;
* confirmar pagamento;
* marcar pagamento como pendente.

Não pode:

* promover Admin;
* remover Admin;
* excluir participante;
* alterar resultados;
* alterar configurações.

### SuperAdmin

Pode:

* controle administrativo completo;
* confirmar e marcar pagamento pendente;
* tornar participante Admin;
* remover Admin;
* excluir participante;
* alterar resultados oficiais;
* alterar configurações do bolão;
* zerar todos os documentos de `palpites` e `palpitesMataMata`.

Padrão atual:

```js
tipoUsuario: "superadmin"
```

Não usar e-mail hardcoded para permissão.

---

## Pontuação Oficial

Não alterar sem aprovação explícita.

Mata-Mata:

* placar exato = +10;
* resultado do jogo correto = +5;
* classificado correto = +5;
* pênaltis correto = +3;
* bônus de acerto total = +2;
* máximo por jogo = 22 sem pênaltis e 25 com pênaltis.

Arquivos de pontuação:

* `src/utils/calcularPontuacao.js`
* `src/utils/calcularPontuacaoMataMata.js`

---

## Versões concluídas

### Núcleo privado

* V36 Permissões Admin.
* V37 Responsividade.
* V38 Segurança Firestore.
* V38.1 SuperAdmin padronizado.
* V39 Mata-Mata por jogo.
* V40 Resultados oficiais por jogo.
* V41 Pontuação do Mata-Mata por jogo.
* V41.1 Botão seguro para zerar resultados de teste.
* V42 Ranking exclusivo Mata-Mata.
* V42.1 até V42.8 refinamentos do Ranking.
* V43 Confrontos oficiais do Mata-Mata.
* V43.1 Pênaltis.
* V43.2 Resultado do jogo e bônus de acerto total.
* V43.4 reorganização visual e foco Mata-Mata.
* V44 Travamento automático.
* V44.1 Contagem regressiva.
* V45 Estatísticas Mata-Mata.
* V45.1 Estatísticas por fase.
* V45.2 Destaques do Mata-Mata.
* V45.3 Correção da premiação e detalhamento por jogo.
* V45.4 Detalhamento compacto e recolhível.
* V46 Comparação de Palpites.
* V46.1 Comparador de Participantes.
* V47.0 Indicadores no Resumo Mata-Mata.
* V47.0.1 Limpeza visual dos indicadores.
* V47.1 Indicadores na Comparação de Palpites.
* V47.2 Indicadores no Detalhe do Participante.
* V48 Destaques Mata-Mata no Dashboard.
* V48.0.1 Correção da contagem de palpites enviados.
* V48.0.2 Ação SuperAdmin para zerar todos os palpites.
* V49.1 Correções críticas da auditoria.
* V49.2.1 Helpers visuais compartilhados.
* V49.2.2 Comparação usando helpers.
* V49.2.3 Detalhe do participante usando helpers.
* V49.2.4 Dashboard usando helpers.
* V49.2.5 Performance do Ranking.

### Fase 2 - Área Pública

* V50 Landing Page Pública.
  * Adicionado `react-router-dom`.
  * Rotas públicas `/`, `/login`, `/cadastro` e `/app`.
  * Landing Page pública estática.
* V50.1 Retorno para Landing.
  * Login e Cadastro receberam link `Voltar para início`.
* V51 Hero Copa Profissional.
  * Hero e cards de destaque na Landing.
* V52 Página Pública de Regras.
  * Criada rota `/regras`.
  * Criados `RegrasPage.jsx` e `RegrasPage.css`.
* V52.2 Correção visual da Landing.
  * Removida tentativa de taça/bola complexa.
  * Criado painel limpo do participante.
  * Layout equilibrado desktop/mobile.
* V52.3 Polimento Premium da Landing.
  * Headline: `Palpite. Dispute. Conquiste o topo.`
  * Menu: `Início`, `Como Funciona`, `Regras`, `Premiação`.
  * Removidas pontuações fictícias e mini ranking fake.
  * Painel mostra benefícios reais: ranking ao vivo, mata-mata completo, comparação, premiação, estatísticas e histórico.
  * Removidas siglas dos cards.
  * Removido contador completamente.
  * Criada seção real de Premiação com 50% / 30% / 20%.
  * Ajustados espaçamentos e responsividade.

---

## Estado Técnico Atual

* `Ranking.jsx` carrega `usuarios`, `palpites` e `palpitesMataMata` em coleções e usa mapas por uid para evitar leituras sequenciais.
* `ResumoMataMata.jsx`, `ComparacaoPalpites.jsx`, `DetalheParticipante.jsx` e `Dashboard.jsx` usam helpers visuais compartilhados de `src/utils/mataMataVisual.js`.
* Dashboard possui cards de Destaques Mata-Mata.
* SuperAdmin pode zerar todos os palpites com confirmação forte digitando `ZERAR PALPITES`.
* Acesso à comparação de palpites permanece liberado para usuários autenticados.
* `firestore.rules` não foi alterado nas versões recentes.
* Landing e Regras não leem Firestore.
* Área pública ainda é estática.
* `.firebase/hosting.ZGlzdA.cache` pode aparecer modificado após deploy/build e não deve ser commitado sem necessidade.

---

## Roadmap Atualizado

### FASE 1 - Concluída

* V46 Comparação de Palpites.
* V47 Indicadores Visuais de Jogos Encerrados.
* V48 Destaques Dashboard.
* V49 Auditoria Final.

### FASE 2 - Em andamento

* V50 Landing Page Pública. Concluída.
* V51 Hero Copa. Concluída.
* V52 Página de Regras. Concluída.
* V52.3 Polimento Premium da Landing. Concluída.
* V52.4 Polimento Final da Landing. Próxima.
* V53 Página/Seção Pública de Premiação. Avaliar se ainda precisa, pois a Landing já tem seção de premiação.
* V54 Destaques Públicos.

### FASE 3 - Planejada

* V55 Perfil Completo.
* V56 Histórico do Ranking.
* V57 Timeline da Copa.
* V58 Feed de Atualizações.
* V59 Refatoração Visual Completa.

---

## Próxima Tarefa Recomendada

### V52.4 - Polimento Final da Landing

Objetivo:

* Corrigir acentuação e textos finais.
* Padronizar:
  * Premiação.
  * Comparação.
  * Histórico.
  * Campeão.
  * arrecadação.
* Manter headline:
  * `Palpite. Dispute. Conquiste o topo.`
* Melhorar seção Premiação:
  * 🥇 Campeão — 50% da arrecadação.
  * 🥈 Vice-campeão — 30% da arrecadação.
  * 🥉 Terceiro lugar — 20% da arrecadação.
* Melhorar benefícios rápidos:
  * Ranking ao vivo.
  * Mata-Mata completo.
  * Comparação de palpites.
  * Premiação automática.
* Revisar textos dos cards para ficarem mais profissionais.
* Não alterar layout principal.
* Não alterar rotas.
* Não alterar regras, pontuação, ranking, autenticação ou área privada.

Arquivos previstos:

* `src/pages/LandingPage.jsx`
* `src/pages/LandingPage.css`

---

## Git recomendado antes de continuar amanhã

Se V52, V52.2 e V52.3 ainda não foram salvas em commits separados, salvar juntas:

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

Se já salvou V52 e só falta V52.3:

```bash
git status
git add src/pages/LandingPage.jsx src/pages/LandingPage.css
git commit -m "Implementa V52.3 polimento premium da landing"
git push origin main
```

Deploy somente se autorizado:

```bash
firebase deploy --only hosting
```

---

## Instruções Para Novo Chat

Ao iniciar um novo chat, enviar:

```text
Projeto: Terceirizados Mil Grau

Leia obrigatoriamente:
- docs/PROJECT_STATUS.md
- docs/CONTINUAR_PROJETO.md
- docs/CODEX_CONTEXT.md

Versão atual: V52.3
Fase atual: FASE 2 - Área Pública
Próxima versão planejada: V52.4 - Polimento Final da Landing

Não altere código antes de gerar plano técnico.
Não faça deploy sem autorização.
Não altere firestore.rules.
Não altere pontuação oficial.
```

---

## Mensagem rápida para Codex amanhã

```text
Projeto: Terceirizados Mil Grau

Continuar a partir da V52.3 concluída.

Antes de implementar, leia:
- docs/PROJECT_STATUS.md
- docs/CONTINUAR_PROJETO.md
- docs/CODEX_CONTEXT.md

Próxima versão:
V52.4 - Polimento Final da Landing.

Regras:
- Não alterar firestore.rules.
- Não alterar calcularPontuacao.js.
- Não alterar calcularPontuacaoMataMata.js.
- Não alterar pontuação oficial.
- Não alterar Ranking, Dashboard, Administração, SuperAdmin, Login, Cadastro, RegrasPage ou rotas.
- Não fazer deploy.
- Rodar npm.cmd run build depois de alterar.

Objetivo:
Apenas polir textos e detalhes finais da Landing.

Arquivos previstos:
- src/pages/LandingPage.jsx
- src/pages/LandingPage.css
```
