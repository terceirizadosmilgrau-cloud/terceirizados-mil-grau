# TERCEIRIZADOS MIL GRAU

## Stack

* React
* Vite
* Firebase Authentication
* Firestore
* Firebase Hosting
* GitHub

---

## Status Atual

Versao atual: V39

Sistema funcional, responsivo e com regras de seguranca do Firestore preparadas no projeto.

Status das versoes recentes:

* V36 concluida: Permissoes Admin funcionando.
* V37 concluida: Responsividade mobile implementada.
* V38 concluida: Seguranca Firestore preparada com `firestore.rules`.
* V38.1 concluida: SuperAdmin padronizado por `tipoUsuario`.
* V39 concluida: Mata-Mata por jogo implementado nos palpites e na central.

---

## Funcionalidades Implementadas

* Login
* Cadastro
* Dashboard
* Listagem de participantes
* Cards mobile de participantes
* Confirmacao de pagamento
* Promocao e remocao de Admin
* Exclusao de participante por SuperAdmin
* Palpites da fase de grupos
* Resumo de palpites
* Ranking geral
* Premiacao
* Destaques do ranking
* Melhor aproveitamento
* Rei dos acertos
* Mata-Mata
* Mata-Mata por jogo
* Central de Palpites
* Central Mata-Mata
* Resultados Oficiais
* Configuracao de liberacao/encerramento de palpites
* Responsividade para celular nas principais telas
* Regras Firestore configuradas no projeto

---

## Perfis

### Participante

* Fazer seus proprios palpites.
* Ver seus palpites.
* Ver ranking.
* Ver dados necessarios do bolao.
* Nao pode alterar pagamento.
* Nao pode alterar perfil.
* Nao pode alterar resultados.

### Admin

* Confirmar pagamento.
* Marcar pagamento como pendente.
* Ver participantes.
* Nao pode promover Admin.
* Nao pode remover Admin.
* Nao pode excluir participante.
* Nao pode alterar resultados.

### SuperAdmin

* Controle administrativo completo.
* Confirmar e marcar pagamento pendente.
* Tornar participante Admin.
* Remover Admin.
* Excluir participante.
* Alterar resultados oficiais.
* Alterar configuracoes do bolao.

O SuperAdmin agora e definido por:

```js
tipoUsuario: "superadmin"
```

Nao ha mais dependencia de e-mail hardcoded na logica ativa do app ou nas regras Firestore.

---

## Firestore

Arquivo criado:

* `firestore.rules`

Configuracao adicionada em:

* `firebase.json`

Colecoes usadas:

* `usuarios`
* `palpites`
* `palpitesMataMata`
* `resultados`
* `configuracoes`

Regras atuais preparadas para:

* Participante editar apenas seus proprios palpites.
* Admin alterar apenas pagamento.
* SuperAdmin alterar pagamento, perfis, resultados e configuracoes.
* Bloquear escrita nao autorizada.

Observacao:
As regras foram preparadas no projeto, mas deploy deve ser feito apenas apos teste final.

---

## Responsividade

V37 concluida com ajustes mobile em:

* Dashboard
* Tabela/lista de participantes
* Ranking
* Detalhe do participante
* Palpites
* Grupos de palpite
* Mata-Mata
* Central Mata-Mata
* Resultados Oficiais

No celular, a tabela de participantes passa a usar cards responsivos.
No desktop, a tabela permanece preservada.

---

## Roadmap

### V36 - Concluida

* Permissoes Admin.
* Sincronizacao do usuario com Firestore em tempo real.
* `tipoUsuario` funcional para Admin.

### V37 - Concluida

* Responsividade completa.
* Ajustes mobile sem alterar regras de negocio.
* Cards mobile para participantes.

### V38 - Concluida

* Criacao de `firestore.rules`.
* Configuracao de rules em `firebase.json`.
* Auditoria de compatibilidade com o app.

### V38.1 - Concluida

* SuperAdmin padronizado por `tipoUsuario`.
* Remocao da dependencia de e-mail hardcoded.

### V39 - Concluida

* Palpites do Mata-Mata por partida.
* Cada jogo possui time A, time B, placar previsto e classificado previsto.
* Central Mata-Mata exibe jogos por participante.
* Modelo antigo por listas preservado para compatibilidade com ranking atual.

### V40

* Resultados oficiais por jogo.

### V41

* Pontuacao por jogo.

### V42

* Ranking exclusivo Mata-Mata.

### V43

* Comparacao de palpites.

### V44

* Travamento automatico dos palpites.

### V45

* Estatisticas do bolao.

---

## V39 Implementada

O Mata-Mata evoluiu para estrutura por partida nos palpites dos participantes.

Cada partida possui:

* Time A
* Time B
* Placar previsto
* Classificado previsto

Exemplo:

```text
Brasil 2 x 1 Uruguai
Classificado: Brasil
```

Pendencias planejadas para proximas versoes:

* V40: Resultados oficiais por jogo.
* V41: Pontuacao por jogo.

---

## Proxima Tarefa

Iniciar V40: Resultados oficiais por jogo.
