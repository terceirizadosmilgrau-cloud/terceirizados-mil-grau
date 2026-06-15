# Relatorio Runtime - Permissoes Admin

Projeto: Terceirizados Mil Grau

Data: 2026-06-15

Objetivo: investigar por que o usuario Android aparece como Admin na tabela, mas a coluna "Acoes" continua vazia.

---

## Status da investigacao

Foram adicionados logs temporarios em:

- `src/pages/Dashboard.jsx`
- `src/components/admin/ParticipantesTable.jsx`

O build da aplicacao passou com sucesso apos a instrumentacao.

Comando executado:

```bash
npm.cmd run build
```

Resultado:

```text
vite build concluido com sucesso
```

Observacao importante:

Nao foi possivel capturar os valores reais do console em uma sessao autenticada porque o navegador interno desta sessao nao estava disponivel. Portanto, os campos de "valor real observado" abaixo ficam como "nao capturado nesta execucao". Os logs ja estao no codigo para o usuario abrir a aplicacao, entrar com a conta Android e verificar o console do navegador.

---

## 1. Onde `isAdmin` e calculado

Arquivo:

`src/pages/Dashboard.jsx`

Codigo:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";
```

Significado:

`isAdmin` so sera `true` se o objeto `usuario` logado tiver:

```js
tipoUsuario: "admin"
```

---

## 2. Onde `isSuperAdmin` e calculado

### Em `Dashboard.jsx`

Arquivo:

`src/pages/Dashboard.jsx`

Codigo:

```js
const isSuperAdmin =
  usuario?.email === "ardcost4@icloud.com";
```

### Em `App.jsx`

Arquivo:

`src/App.jsx`

Codigo:

```js
const isSuperAdmin =
  usuario?.email === "ardcost4@icloud.com";
```

Significado:

`isSuperAdmin` nao depende de `tipoUsuario`. Ele depende somente do e-mail hardcoded.

---

## 3. Logs adicionados em `Dashboard.jsx`

Arquivo:

`src/pages/Dashboard.jsx`

Logs temporarios adicionados:

```js
console.log("USUARIO", usuario);
console.log("TIPO_USUARIO", usuario?.tipoUsuario);
console.log("EMAIL", usuario?.email);
console.log("IS_ADMIN", isAdmin);
console.log("IS_SUPERADMIN", isSuperAdmin);
```

Esses logs aparecem quando o Dashboard renderiza.

Eles servem para confirmar se o usuario logado realmente possui `tipoUsuario` no estado React.

---

## 4. Log adicionado em `ParticipantesTable`

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

Log temporario adicionado:

```js
console.log("ParticipantesTable", {
  isAdmin,
  isSuperAdmin,
});
```

Esse log mostra quais valores chegaram na tabela via props.

---

## 5. Valores reais em runtime

### Valor real de `usuario`

Valor observado nesta execucao:

```text
Nao capturado nesta sessao.
```

Motivo:

Nao foi possivel abrir uma sessao autenticada no navegador interno para capturar o console.

Valor esperado para Admin:

```js
{
  uid: "...",
  email: "...",
  tipoUsuario: "admin",
  ...
}
```

### Valor real de `usuario.tipoUsuario`

Valor observado nesta execucao:

```text
Nao capturado nesta sessao.
```

Valor esperado para o usuario Android logado como Admin:

```js
"admin"
```

Se aparecer:

```js
undefined
```

ou:

```js
"participante"
```

entao `isAdmin` sera `false`.

### Valor real de `isAdmin`

Valor observado nesta execucao:

```text
Nao capturado nesta sessao.
```

Valor esperado para Android logado como Admin:

```js
true
```

### Valor real de `isSuperAdmin`

Valor observado nesta execucao:

```text
Nao capturado nesta sessao.
```

Valor esperado para Android, se o e-mail nao for `ardcost4@icloud.com`:

```js
false
```

### Valor recebido por `ParticipantesTable`

Valor observado nesta execucao:

```text
Nao capturado nesta sessao.
```

Valor esperado para Android logado como Admin:

```js
{
  isAdmin: true,
  isSuperAdmin: false
}
```

Se a coluna "Acoes" estiver vazia, o console provavelmente mostrara:

```js
{
  isAdmin: false,
  isSuperAdmin: false
}
```

---

## 6. Por que Android aparece como Admin na tabela

Na tabela, o perfil exibido em cada linha vem do participante daquela linha:

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

Codigo:

```js
p.tipoUsuario === "superadmin"
  ? "SuperAdmin"
  : p.tipoUsuario === "admin"
  ? "Admin"
  : "Participante"
```

Aqui, `p` representa um item da lista `participantes`.

Ou seja:

```js
p.tipoUsuario
```

e o tipo do usuario listado na linha da tabela.

Por isso Android pode aparecer como Admin na coluna "Perfil".

---

## 7. Por que a coluna "Acoes" pode continuar vazia

A coluna "Acoes" nao usa `p.tipoUsuario` para liberar os botoes.

Ela usa as permissoes do usuario logado:

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

Codigo:

```js
{(isAdmin || isSuperAdmin) && (
  <>
    ...
  </>
)}
```

Aqui:

- `p.tipoUsuario` mostra o perfil do usuario da linha.
- `isAdmin` mostra se o usuario logado e Admin.
- `isSuperAdmin` mostra se o usuario logado e SuperAdmin.

Essa diferenca e o ponto central do problema.

Android aparecer como Admin na tabela prova apenas que:

```js
p.tipoUsuario === "admin"
```

para aquela linha.

Mas os botoes so aparecem se:

```js
usuario.tipoUsuario === "admin"
```

para o usuario atualmente logado.

---

## 8. Causa exata no codigo

A causa exata no codigo e a diferenca entre o dado usado para exibir o perfil da linha e o dado usado para liberar a coluna "Acoes".

Perfil exibido na linha:

```js
p.tipoUsuario
```

Permissao para mostrar botoes:

```js
isAdmin || isSuperAdmin
```

Onde:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";
```

Portanto, se Android aparece como Admin na tabela, mas a coluna "Acoes" esta vazia, uma destas situacoes esta acontecendo:

1. O usuario logado nao e Android.
2. O usuario logado e Android, mas `usuario.tipoUsuario` nao foi carregado no estado React.
3. O usuario Android foi promovido a Admin, mas a sessao atual ainda esta antiga e precisa relogar.
4. O objeto `usuario` vem do Firebase Auth sem os dados do Firestore.
5. `isAdmin` chega como `false` em `ParticipantesTable`.

---

## 9. Como confirmar no console

Entrar na aplicacao com o usuario Android e abrir o console do navegador.

Procurar estes logs:

```text
USUARIO
TIPO_USUARIO
EMAIL
IS_ADMIN
IS_SUPERADMIN
ParticipantesTable
```

### Resultado correto esperado

```js
USUARIO {
  uid: "...",
  email: "...",
  tipoUsuario: "admin",
  ...
}

TIPO_USUARIO admin
EMAIL email-do-android
IS_ADMIN true
IS_SUPERADMIN false

ParticipantesTable {
  isAdmin: true,
  isSuperAdmin: false
}
```

Com esse resultado, a coluna "Acoes" deve mostrar botoes de pagamento.

### Resultado que explica a coluna vazia

```js
USUARIO {
  uid: "...",
  email: "...",
  ...
}

TIPO_USUARIO undefined
EMAIL email-do-android
IS_ADMIN false
IS_SUPERADMIN false

ParticipantesTable {
  isAdmin: false,
  isSuperAdmin: false
}
```

Nesse caso, a coluna "Acoes" fica vazia porque `usuario.tipoUsuario` nao esta carregado.

---

## 10. Correcao recomendada

Nao foi feita correcao nesta etapa, apenas logs temporarios.

Correcao recomendada:

1. Garantir que o login sempre busque `usuarios/{uid}` no Firestore.
2. Garantir que `loginSucesso` receba um objeto com `tipoUsuario`.
3. Se o usuario for promovido para Admin enquanto esta logado, forcar recarregamento do perfil ou exigir logout/login.
4. Melhor solucao: criar um listener em tempo real para o documento do usuario logado:

```js
onSnapshot(doc(db, "usuarios", usuario.uid), ...)
```

Assim, quando o SuperAdmin promover um usuario para Admin, o estado local atualiza automaticamente.

Outra alternativa:

Ao carregar `participantes`, encontrar o participante com `id === usuario.uid` e sincronizar `usuario.tipoUsuario` com o documento atualizado.

---

## 11. Status final

Logs temporarios adicionados:

- Sim.

Build validado:

- Sim.

Valores reais capturados em navegador autenticado:

- Nao, porque o navegador interno estava indisponivel nesta sessao.

Causa mais provavel:

- A linha Android mostra `p.tipoUsuario === "admin"`, mas a permissao dos botoes depende de `usuario.tipoUsuario`.
- O `usuario` logado provavelmente nao esta chegando com `tipoUsuario: "admin"` no momento em que o Dashboard renderiza, ou a sessao esta desatualizada.

Correcao recomendada:

- Sincronizar o perfil do usuario logado com o Firestore em tempo real ou recarregar o perfil apos login/promocao.
