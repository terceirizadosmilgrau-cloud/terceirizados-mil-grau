# PROMPT PARA CONTINUAR - POS V45.4

Projeto: Terceirizados Mil Grau

Estado atual:

- V45.4 concluida.
- Build passando com `npm.cmd run build`.
- Ultima versao validada e funcional.
- Mata-Mata e o foco principal.
- Ranking abre por padrao na aba Mata-Mata.
- Estatisticas Mata-Mata implementadas.
- Modal do participante corrigido e compactado.
- Nao fazer deploy sem autorizacao explicita.

Antes de qualquer alteracao:

1. Ler:
   - `docs/PROJECT_STATUS.md`
   - `docs/CONTINUAR_PROJETO.md`
   - `docs/CODEX_CONTEXT.md`
   - `ROADMAP_PROJETO_V45_4.md`

2. Inspecionar os arquivos relacionados a tarefa.

3. Gerar plano tecnico antes de implementar mudancas relevantes.

4. Aguardar aprovacao quando o usuario pedir plano primeiro.

---

## Ultimas Versoes Concluidas

- V43.4J - Correcao do topo mobile
- V44 - Travamento automatico dos palpites
- V44.1 - Contagem regressiva para travamento
- V45 - Estatisticas Mata-Mata
- V45.1 - Estatisticas por fase mais claras
- V45.2 - Destaques do Mata-Mata
- V45.3 - Correcao da zona de premiacao e detalhamento por jogo
- V45.4 - Detalhamento Mata-Mata compacto e recolhivel

---

## Diretriz Principal

O nucleo do sistema ja e considerado funcional para operacao do Mata-Mata.

Proximas versoes devem priorizar:

- Experiencia do usuario.
- Clareza das informacoes.
- Aparencia profissional.
- Engajamento dos participantes.
- Landing page publica.
- Melhorias visuais inspiradas no layout de referencia.

Evitar alteracoes profundas na regra de negocio sem necessidade real.

---

## Estado Funcional

### Mata-Mata

- Confrontos oficiais ficam em `configuracoes/mataMata`.
- Palpites ficam em `palpitesMataMata/{uid}`.
- Resultados oficiais ficam em `resultados/mataMata`.
- Jogos travam individualmente por `data` + `horario`.
- Contagem regressiva aparece antes do travamento.

### Pontuacao Mata-Mata

Regra atual:

- Placar exato: +10
- Resultado correto: +5
- Classificado correto: +5
- Penaltis correto: +3
- Acerto total: +2

Maximo por jogo:

- 22 sem penaltis
- 25 com penaltis

Nao alterar pontuacao oficial sem pedido explicito.

### Estatisticas Mata-Mata

Arquivo principal:

- `src/pages/EstatisticasMataMata.jsx`

Mostra:

- Resumo geral.
- Rankings de acertos.
- Destaques do Mata-Mata.
- Estatisticas por fase.

Nao cria colecao Firestore.
Nao grava dados.

### Modal Do Participante

Arquivo principal:

- `src/components/DetalheParticipante.jsx`

Estado atual:

- Corrige zona de premiacao pela posicao visual.
- Mostra detalhamento Mata-Mata recolhivel.
- Mostra resumo por fase.
- Cada fase pode expandir jogos.
- Fase de Grupos permanece recolhida.

### Ranking

Arquivo principal:

- `src/pages/Ranking.jsx`

Estado atual:

- Passa `posicaoModal` e `emZonaPremiacao` para o modal.
- Passa `palpiteMataMata` e `resultadoMataMata` para detalhamento.
- Nao alterar comportamento do Ranking sem necessidade.

---

## Roadmap Oficial Apos V45.4

### Fase 1 - Fechamento Funcional

1. V46 - Comparacao de Palpites
2. V47 - Indicadores Visuais de Jogos Encerrados
3. V48 - Destaques no Dashboard
4. V49 - Auditoria Final

### Fase 2 - Experiencia Premium

1. V50 - Landing Page Publica
2. V51 - Hero Principal da Copa
3. V52 - Pagina de Regras
4. V53 - Pagina de Premiacao
5. V54 - Destaques Publicos

### Fase 3 - Produto Profissional

1. V55 - Perfil Completo do Participante
2. V56 - Historico do Ranking
3. V57 - Timeline da Copa
4. V58 - Feed de Atualizacoes
5. V59 - Refatoracao Visual Completa

### Fase 4 - Extras Futuros

1. V60 - Pagina Publica Sem Login
2. V61 - Sistema de Conquistas
3. V62 - Hall da Fama

---

## Proxima Versao Recomendada

V46 - Comparacao de Palpites.

Objetivo:

- Comparar dois participantes jogo a jogo.
- Mostrar palpite de cada um, resultado oficial e diferenca de desempenho.
- Manter foco em clareza e experiencia do usuario.

Prioridade: Muito alta.

---

## Regras Para Codex

- Usar apenas `tipoUsuario` para permissoes.
- Nao voltar para e-mail hardcoded.
- Nao mexer em Firestore Rules sem plano tecnico aprovado.
- Nao alterar pontuacao oficial sem pedido explicito.
- Nao alterar estrutura principal do Ranking sem plano tecnico aprovado.
- Nao fazer deploy.
- Rodar `npm.cmd run build` apos alteracoes de codigo.
- Listar arquivos alterados no final.
- Explicar o que foi adicionado.
- Explicar como testar.
- Explicar se pode salvar no Git.
