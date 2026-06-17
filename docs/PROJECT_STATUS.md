# TERCEIRIZADOS MIL GRAU

## Status Atual

Versão atual: V52.3

Status geral:

* Núcleo privado do bolão praticamente concluído.
* Fase atual: FASE 2 - Área Pública.
* Landing Page pública criada e polida.
* Página pública de Regras criada.
* Build passando.
* GitHub deve ser sincronizado antes de continuar em outro computador.
* Deploy somente com autorização explícita.
* Próxima versão planejada: V52.4 - Polimento Final da Landing.

---

## Stack

* React
* Vite
* Firebase Authentication
* Firestore
* Firebase Hosting
* GitHub
* React Router DOM

---

## Rotas Atuais

```txt
/         -> Landing Page pública
/regras   -> Página pública de regras
/login    -> Login
/cadastro -> Cadastro
/app      -> área autenticada atual
```

Observação:

* A área autenticada ainda mantém navegação interna por estado `tela`.
* Não refatorar todas as telas internas para rotas sem plano técnico aprovado.

---

## Funcionalidades Implementadas

### Núcleo privado

* Login e cadastro.
* Dashboard administrativo e do participante.
* Listagem de participantes.
* Confirmação de pagamento.
* Promoção/remoção de Admin.
* Exclusão de participante por SuperAdmin.
* Palpites da fase de grupos.
* Palpites Mata-Mata por jogo.
* Travamento automático dos palpites.
* Resumo de palpites.
* Resumo Mata-Mata somente leitura.
* Ranking Geral.
* Ranking Mata-Mata.
* Detalhe do participante.
* Comparação de palpites.
* Comparador de participantes lado a lado.
* Tendências do Bolão.
* Destaques Mata-Mata no Dashboard.
* Resultados oficiais de grupos.
* Resultados oficiais do Mata-Mata por jogo.
* Pontuação oficial do Mata-Mata por jogo.
* Indicadores visuais de jogos pendentes/encerrados.
* Indicadores de acerto/erro de placar, classificado e pênaltis.
* Helpers visuais compartilhados para Mata-Mata.
* Ação SuperAdmin para zerar todos os palpites.
* Regras Firestore configuradas no projeto.
* Responsividade mobile nas principais telas.

### Área pública

* V50 Landing Page Pública.
* V50.1 Links para voltar ao início no Login/Cadastro.
* V51 Hero Copa Profissional.
* V52 Página Pública de Regras.
* V52.2 Correção visual da Landing.
* V52.3 Polimento Premium da Landing.

Estado visual atual da Landing:

* Headline: `Palpite. Dispute. Conquiste o topo.`
* Menu: `Início`, `Como Funciona`, `Regras`, `Premiação`.
* Painel da direita com benefícios reais, sem números fake.
* Cards sem siglas.
* Contador removido completamente.
* Seção real de Premiação criada:
  * 50% para 1º lugar.
  * 30% para 2º lugar.
  * 20% para 3º lugar.
* Links:
  * `Como Funciona` rola para os cards.
  * `Premiação` rola para a seção de premiação.
  * `Regras` abre `/regras`.
  * `Entrar` abre `/login`.
  * `Criar conta` abre `/cadastro`.

---

## Versões Concluídas Recentemente

* V46 concluída: Comparação de Palpites.
* V46.1 concluída: Comparador de Participantes.
* V47.0 concluída: Indicadores no Resumo Mata-Mata.
* V47.0.1 concluída: Limpeza visual dos indicadores.
* V47.1 concluída: Indicadores na Comparação de Palpites.
* V47.2 concluída: Indicadores no Detalhe do Participante.
* V48 concluída: Destaques Mata-Mata no Dashboard.
* V48.0.1 concluída: Correção da contagem de palpites enviados.
* V48.0.2 concluída: Ação SuperAdmin para zerar todos os palpites.
* V49.1 concluída: Correções críticas da auditoria.
* V49.2.1 concluída: Helpers visuais compartilhados.
* V49.2.2 concluída: Comparação usando helpers.
* V49.2.3 concluída: Detalhe do participante usando helpers.
* V49.2.4 concluída: Dashboard usando helpers.
* V49.2.5 concluída: Performance do Ranking.
* V50 concluída: Landing Page Pública.
* V50.1 concluída: Retorno para Landing no Login/Cadastro.
* V51 concluída: Hero Copa Profissional.
* V52 concluída: Página Pública de Regras.
* V52.2 concluída: Correção visual da Landing.
* V52.3 concluída: Polimento Premium da Landing.

---

## Perfis

### Participante

* Fazer seus próprios palpites.
* Ver seus palpites.
* Ver ranking.
* Ver comparação de palpites.
* Ver dados necessários do bolão.
* Não pode alterar pagamento, perfil, resultados ou configurações.

### Admin

* Confirmar pagamento.
* Marcar pagamento como pendente.
* Ver participantes.
* Não pode promover Admin, remover Admin, excluir participante, alterar resultados ou configurações.

### SuperAdmin

* Controle administrativo completo.
* Confirmar e marcar pagamento pendente.
* Tornar participante Admin.
* Remover Admin.
* Excluir participante.
* Alterar resultados oficiais.
* Alterar configurações do bolão.
* Zerar todos os documentos de `palpites` e `palpitesMataMata` com confirmação forte.

O SuperAdmin é definido por:

```js
tipoUsuario: "superadmin"
```

Não há dependência de e-mail hardcoded na lógica ativa do app ou nas regras Firestore.

---

## Firestore

Coleções usadas:

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
* Usuários autenticados podem ler dados necessários ao bolão privado.
* Participante cria/edita apenas seus próprios palpites.
* Participante apaga apenas seus próprios palpites.
* Admin altera apenas pagamento.
* SuperAdmin altera pagamento, perfis, resultados e configurações.
* SuperAdmin pode apagar documentos de `palpites` e `palpitesMataMata`.

Observação para Área Pública:

* Páginas públicas não devem expor diretamente coleções privadas como `usuarios`, `palpites` e `palpitesMataMata`.
* Landing e Regras atuais não leem Firestore.
* Para dados públicos futuros, criar plano de privacidade e avaliar documento público agregado antes de alterar rules.

---

## Pontuação Oficial Mata-Mata

Não alterar sem aprovação explícita.

* Placar exato: +10.
* Resultado do jogo correto: +5.
* Classificado correto: +5.
* Pênaltis correto: +3 quando o resultado oficial foi decidido nos pênaltis.
* Bônus de acerto total: +2.
* Máximo por jogo: 22 pontos sem pênaltis e 25 pontos com pênaltis.

Arquivo oficial:

* `src/utils/calcularPontuacaoMataMata.js`

Também não alterar sem aprovação:

* `src/utils/calcularPontuacao.js`

---

## Arquivos Importantes

* `src/App.jsx`
* `src/pages/LandingPage.jsx`
* `src/pages/LandingPage.css`
* `src/pages/RegrasPage.jsx`
* `src/pages/RegrasPage.css`
* `src/components/Login.jsx`
* `src/components/Cadastro.jsx`
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

### FASE 1 - Concluída

* V46 Comparação de Palpites.
* V47 Indicadores Visuais de Jogos Encerrados.
* V48 Destaques Dashboard.
* V49 Auditoria Final e ajustes críticos/performance.

### FASE 2 - Em andamento

* V50 Landing Page Pública. Concluída.
* V51 Hero Copa. Concluída.
* V52 Página de Regras. Concluída.
* V52.3 Polimento Premium da Landing. Concluída.
* V52.4 Polimento Final da Landing. Próxima.
* V53 Página/Seção de Premiação. Avaliar necessidade, pois a Landing já tem seção de premiação.
* V54 Destaques Públicos.

### FASE 3 - Planejada

* V55 Perfil Completo.
* V56 Histórico do Ranking.
* V57 Timeline da Copa.
* V58 Feed de Atualizações.
* V59 Refatoração Visual Completa.

---

## Próxima Tarefa

### V52.4 - Polimento Final da Landing

Antes de implementar, gerar plano técnico se ainda não aprovado.

Objetivo:

* Finalizar pequenos detalhes de texto e apresentação da Landing.
* Não alterar estrutura principal.
* Não mexer em regras, pontuação, rotas, Login, Cadastro, RegrasPage ou área privada.

Escopo previsto:

* Corrigir acentuação:
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

Arquivos previstos:

* `src/pages/LandingPage.jsx`
* `src/pages/LandingPage.css`

---

## Git / Deploy

Se V52, V52.2 e V52.3 ainda não foram commitadas:

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

Deploy somente com autorização:

```bash
firebase deploy --only hosting
```

---

## Regras Permanentes

* Sempre gerar plano técnico antes de implementar.
* Não alterar `firestore.rules` sem aprovação.
* Não alterar pontuação oficial sem aprovação.
* Não alterar `calcularPontuacaoMataMata.js` sem aprovação.
* Não fazer deploy sem autorização explícita.
* Rodar `npm.cmd run build` após implementações.
* Sempre informar arquivos alterados, o que mudou, como testar, resultado do build, comandos Git e se precisa deploy.
* Trabalhar em etapas pequenas.
* Manter instruções claras para Codex, pois o projeto usa Codex para codar.
