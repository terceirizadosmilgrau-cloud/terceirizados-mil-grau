# ROADMAP OFICIAL APOS V45.4

Projeto: Terceirizados Mil Grau

Fonte: `Roadmap Oficial Apos V45.4.pdf`

## Estado Atual

Versao atual: V45.4

Ultimas versoes concluidas:

- V43.4J - Correcao do topo mobile
- V44 - Travamento automatico dos palpites
- V44.1 - Contagem regressiva para travamento
- V45 - Estatisticas Mata-Mata
- V45.1 - Estatisticas por fase mais claras
- V45.2 - Destaques do Mata-Mata
- V45.3 - Correcao da zona de premiacao e detalhamento por jogo
- V45.4 - Detalhamento Mata-Mata compacto e recolhivel

Build:

- `npm.cmd run build` passando.

Deploy:

- Ultima versao validada e funcional.
- Nao fazer novo deploy sem autorizacao explicita.

---

## Diretriz Principal

O nucleo do sistema ja e considerado funcional para operacao do Mata-Mata.

A partir deste ponto, novas versoes devem priorizar:

- Experiencia do usuario.
- Clareza das informacoes.
- Aparencia profissional.
- Engajamento dos participantes.
- Landing page publica.
- Melhorias visuais inspiradas no layout de referencia.

Evitar alteracoes profundas na regra de negocio sem necessidade real.

---

## Fase 1 - Fechamento Funcional

Objetivo: garantir que o sistema esteja totalmente preparado para uso real durante o Mata-Mata.

### V46 - Comparacao de Palpites

Comparar dois participantes jogo a jogo.

Exemplo:

- Brasil x Uruguai
- Participante A: Brasil 2x1
- Participante B: Brasil 1x0
- Resultado: Brasil 2x1

Prioridade: Muito alta.

### V47 - Indicadores Visuais de Jogos Encerrados

Mostrar visualmente:

- Encerrado
- Trava em 2h

Alem do travamento ja existente.

Prioridade: Muito alta.

### V48 - Destaques no Dashboard

Adicionar cards rapidos:

- Lider Atual
- Rei dos Placares
- Rei dos Classificados
- Melhor Aproveitamento

Objetivo: mostrar informacoes importantes sem abrir Estatisticas.

Prioridade: Muito alta.

### V49 - Auditoria Final

Revisao completa:

- Ranking Geral
- Ranking Mata-Mata
- Estatisticas
- Modal do participante
- Responsividade
- Permissoes
- Firestore Rules

Objetivo: eliminar bugs antes da Copa.

Prioridade: Muito alta.

---

## Fase 2 - Experiencia Premium

Objetivo: transformar o sistema em algo proximo ao layout profissional de referencia.

### V50 - Landing Page Publica

Pagina inicial publica contendo:

- Logo
- Contagem regressiva da Copa
- Premiacao
- Ranking Top 3
- Entrar
- Cadastrar

Impacto: Muito alto.

### V51 - Hero Principal da Copa

Area principal contendo:

- Fundo estadio
- Taca da Copa
- Nome do bolao
- Valor da inscricao
- Contagem regressiva

Impacto: Muito alto.

### V52 - Pagina de Regras

Pagina dedicada:

- `/regras`

Conteudo:

- Pontuacao
- Criterios
- Desempates
- Premiacao
- Funcionamento do bolao

Impacto: Alto.

### V53 - Pagina de Premiacao

Mostrar dinamicamente:

- 1o lugar
- 2o lugar
- 3o lugar

Com base na arrecadacao.

Impacto: Alto.

### V54 - Destaques Publicos

Sem necessidade de login.

Exibir:

- Lider atual
- Rei dos placares
- Melhor aproveitamento
- Participantes

Impacto: Alto.

---

## Fase 3 - Produto Profissional

Objetivo: transformar o sistema em um produto completo.

### V55 - Perfil Completo do Participante

Tela propria contendo:

- Posicao
- Pontos
- Medalhas
- Estatisticas
- Historico

Impacto: Muito alto.

### V56 - Historico do Ranking

Registrar:

- Quem liderou cada etapa
- Maior subida
- Maior queda

Impacto: Medio.

### V57 - Timeline da Copa

Exibir:

- Proximos jogos
- Ultimos resultados
- Jogos encerrados

Impacto: Alto.

### V58 - Feed de Atualizacoes

Exemplos:

- "Joao assumiu a lideranca."
- "Brasil x Argentina encerrado."

Impacto: Medio.

### V59 - Refatoracao Visual Completa

Objetivo: aproximar o sistema do layout profissional de referencia.

Incluindo:

- Fundo estadio
- Cards premium
- Identidade visual Copa
- Melhor tipografia
- Melhor navegacao

Impacto: Muito alto.

---

## Fase 4 - Extras Futuros

### V60 - Pagina Publica Sem Login

Exibir:

- Ranking
- Resultados
- Premiacao

### V61 - Sistema de Conquistas

Exemplos:

- Rei dos Placares
- 10 acertos seguidos
- Melhor rodada

### V62 - Hall da Fama

Apos a Copa:

- Campeao
- Vice
- Terceiro colocado
- Historico permanente

---

## Ordem Recomendada

1. V46 - Comparacao de Palpites
2. V47 - Indicadores Visuais
3. V48 - Destaques Dashboard
4. V49 - Auditoria Final
5. V50 - Landing Page Publica
6. V51 - Hero Copa
7. V52 - Regras
8. V53 - Premiacao
9. V54 - Destaques Publicos
10. V55 - Perfil Completo
11. V57 - Timeline da Copa
12. V59 - Refatoracao Visual Completa

---

## Regras Para O Codex

Antes de qualquer nova versao:

- Ler `docs/PROJECT_STATUS.md`
- Ler `docs/CONTINUAR_PROJETO.md`
- Ler `docs/CODEX_CONTEXT.md`
- Gerar plano tecnico
- Aguardar aprovacao

Apos implementar:

- Rodar `npm.cmd run build`
- Informar arquivos alterados
- Explicar o que foi adicionado
- Explicar como testar
- Explicar como salvar no Git
- Nao fazer deploy sem autorizacao explicita

Nunca alterar sem plano tecnico aprovado previamente:

- Firestore Rules
- Pontuacao oficial
- Permissoes
- Estrutura principal do Ranking
