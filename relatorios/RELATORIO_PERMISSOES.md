# Relatorio de Permissoes

Projeto: Terceirizados Mil Grau

Data da auditoria: 2026-06-15

Objetivo: auditar o fluxo de permissoes do sistema, principalmente o motivo de contas com `tipoUsuario = "admin"` receberem ou nao permissoes de Admin.

---

## Resumo

O sistema usa o campo `tipoUsuario` no Firestore para diferenciar participantes e admins.

Atualmente, o fluxo Admin esta parcialmente funcional:

- Usuarios com `tipoUsuario: "admin"` conseguem receber permissoes de Admin se esse campo for carregado corretamente no login.
- O Admin pode confirmar pagamento e marcar pagamento como pendente.
- O SuperAdmin tem permissoes extras, mas e identificado por e-mail fixo, nao por `tipoUsuario`.

Ponto importante: se um usuario for promovido para Admin enquanto ja esta logado, ele precisa sair e entrar novamente para o estado local `usuario.tipoUsuario` ser atualizado.

---

## 1. Onde o campo `tipoUsuario` e salvo

### Cadastro de novo usuario

Arquivo:

`src/components/Cadastro.jsx`

Ao criar uma conta, o sistema salva um documento em:

`usuarios/{uid}`

Com este campo:

```js
tipoUsuario: "participante"
```

Ou seja, todo usuario novo nasce como participante.

### Tornar usuario Admin

Arquivo:

`src/pages/Dashboard.jsx`

Funcao:

```js
const tornarAdmin = async (id) => {
  await updateDoc(doc(db, "usuarios", id), {
    tipoUsuario: "admin",
  });
};
```

Essa funcao altera o campo `tipoUsuario` para `"admin"`.

### Remover Admin

Arquivo:

`src/pages/Dashboard.jsx`

Funcao:

```js
const removerAdmin = async (id) => {
  await updateDoc(doc(db, "usuarios", id), {
    tipoUsuario: "participante",
  });
};
```

Essa funcao volta o usuario para participante.

---

## 2. Onde `tipoUsuario` e carregado apos login

Arquivo:

`src/components/Login.jsx`

Apos autenticar com Firebase Auth, o sistema busca o documento do usuario no Firestore:

```js
const usuarioSnapshot = await getDoc(
  doc(db, "usuarios", credencial.user.uid)
);
```

Depois mistura os dados do Firestore com os dados basicos do Firebase Auth:

```js
loginSucesso({
  ...dadosUsuario,
  uid: credencial.user.uid,
  email: credencial.user.email,
});
```

Arquivo:

`src/App.jsx`

O App recebe esse objeto em `loginSucesso`:

```js
const loginSucesso = (user) => {
  setUsuario(user);
  setTela("dashboard");
};
```

Com isso, `usuario.tipoUsuario` fica disponivel para o Dashboard.

---

## 3. Onde `tipoUsuario` e utilizado para liberar funcionalidades

### Identificacao de Admin

Arquivo:

`src/pages/Dashboard.jsx`

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";
```

Essa e a principal verificacao de Admin.

### Acoes de pagamento

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

```js
{(isAdmin || isSuperAdmin) && (
  <>
    ...
  </>
)}
```

Dentro desse bloco aparecem as acoes:

- Confirmar pagamento.
- Marcar pagamento como pendente.

Portanto, Admin e SuperAdmin podem alterar status de pagamento pela interface.

### Filtro de admins

Arquivo:

`src/pages/Dashboard.jsx`

```js
if (filtro === "admins") {
  filtroOk =
    p.tipoUsuario === "admin" ||
    p.tipoUsuario === "superadmin";
}
```

O filtro considera tanto `admin` quanto `superadmin`.

### Exibicao de perfil na tabela

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

```js
{p.tipoUsuario === "superadmin"
  ? "SuperAdmin"
  : p.tipoUsuario === "admin"
  ? "Admin"
  : "Participante"}
```

A tabela usa `tipoUsuario` para mostrar o perfil visual do participante.

---

## 4. Inconsistencias entre `tipoUsuario`, `role` e `perfil`

### Campo `role`

Nao foi encontrado uso real de `role` como regra de permissao no codigo da aplicacao.

### Campo `perfil`

Nao foi encontrado campo `perfil` como regra de permissao.

A palavra "Perfil" aparece apenas como titulo de coluna na tabela de participantes.

### Campo `tipoUsuario`

Este e o campo realmente usado para Admin:

```js
tipoUsuario: "participante"
tipoUsuario: "admin"
tipoUsuario: "superadmin"
```

Porem, existe uma inconsistencia importante no caso do SuperAdmin.

---

## 5. Inconsistencia do SuperAdmin

O SuperAdmin nao e definido por `tipoUsuario` no fluxo principal.

Arquivos:

`src/App.jsx`

`src/pages/Dashboard.jsx`

O SuperAdmin e identificado por e-mail fixo:

```js
usuario?.email === "ardcost4@icloud.com"
```

Mas em outros pontos a interface reconhece:

```js
p.tipoUsuario === "superadmin"
```

Isso significa:

- Um usuario com `tipoUsuario: "superadmin"` no Firestore pode aparecer como SuperAdmin na tabela.
- Mas ele nao recebe permissoes reais de SuperAdmin se o e-mail nao for `ardcost4@icloud.com`.
- O verdadeiro SuperAdmin depende do e-mail hardcoded.

Essa e a maior inconsistencia do modelo de permissao atual.

---

## 6. Arquivos envolvidos

### Arquivos principais

- `PROJECT_STATUS.md`
- `src/components/Cadastro.jsx`
- `src/components/Login.jsx`
- `src/App.jsx`
- `src/pages/Dashboard.jsx`
- `src/components/admin/ParticipantesTable.jsx`

### Arquivos relacionados indiretamente

- `src/firebase.js`
- `src/pages/Ranking.jsx`
- `src/pages/CentralPalpites.jsx`
- `src/pages/CentralMataMata.jsx`
- `src/pages/Resultados.jsx`

Esses arquivos usam dados do Firestore ou funcionalidades restritas, mas a logica principal de permissao esta nos arquivos principais listados acima.

---

## 7. Fluxo Admin esta funcional?

Resposta curta: parcialmente sim.

O fluxo Admin esta funcional para o objetivo descrito no `PROJECT_STATUS.md`, desde que:

1. O usuario tenha documento em `usuarios/{uid}`.
2. Esse documento tenha `tipoUsuario: "admin"`.
3. O usuario faca login depois de receber esse tipo.
4. As regras do Firestore permitam atualizar o campo `pagamento`.

Com essas condicoes, o Admin consegue:

- Ver botoes de acao na tabela de participantes.
- Confirmar pagamento.
- Marcar pagamento como pendente.

---

## 8. Pontos de atencao

### 1. Permissao esta no frontend

A permissao atual e controlada principalmente pela interface React.

Isso e suficiente para esconder ou mostrar botoes, mas nao e seguranca real.

Para seguranca real, as regras do Firestore precisam validar quem pode alterar:

- `usuarios/{uid}.pagamento`
- `usuarios/{uid}.tipoUsuario`
- documentos de resultados
- documentos de configuracao

Nao foi encontrado arquivo de regras Firestore versionado no projeto.

### 2. Admin precisa relogar apos promocao

Se um usuario esta logado como participante e o SuperAdmin clica em "Tornar Admin", o estado local desse usuario nao muda automaticamente.

Ele precisa sair e entrar novamente para carregar o novo `tipoUsuario`.

### 3. SuperAdmin deveria ser padronizado

Hoje existem dois conceitos misturados:

- SuperAdmin por e-mail fixo.
- SuperAdmin por `tipoUsuario`.

O ideal seria escolher um modelo unico.

Sugestao futura:

```js
usuario?.tipoUsuario === "superadmin"
```

Ou entao manter e-mail fixo, mas remover o uso visual de `tipoUsuario: "superadmin"` para evitar confusao.

---

## Conclusao

O problema original do Admin era causado pelo fato de o sistema precisar carregar `tipoUsuario` do Firestore apos o login.

Com `tipoUsuario` carregado no objeto `usuario`, a verificacao abaixo funciona:

```js
usuario?.tipoUsuario === "admin"
```

O Admin entao recebe as permissoes previstas para pagamentos.

Mesmo assim, ainda ha riscos e inconsistencias:

- SuperAdmin usa e-mail hardcoded.
- `tipoUsuario: "superadmin"` aparece na interface, mas nao controla permissao real.
- Permissoes estao majoritariamente no frontend.
- Regras Firestore nao estao versionadas no projeto.

Status final da auditoria:

Admin: funcional para pagamentos, com dependencia de relogin apos promocao.

SuperAdmin: funcional por e-mail fixo, mas inconsistente com `tipoUsuario`.

Seguranca geral: precisa de revisao nas regras do Firestore.
