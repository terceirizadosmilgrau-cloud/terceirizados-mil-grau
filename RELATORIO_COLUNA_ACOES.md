# Relatorio - Coluna Acoes Vazia

Projeto: Terceirizados Mil Grau

Data da auditoria: 2026-06-15

Objetivo: verificar por que a coluna "Acoes" da tabela de participantes pode aparecer vazia.

Importante: nenhum codigo da aplicacao foi alterado nesta auditoria. Este arquivo e apenas um relatorio.

---

## Resumo da causa mais provavel

A coluna "Acoes" fica vazia quando estas duas variaveis chegam como `false` dentro de `ParticipantesTable`:

```js
isAdmin
isSuperAdmin
```

No componente `ParticipantesTable`, todos os botoes da coluna "Acoes" estao dentro deste bloco:

```js
{(isAdmin || isSuperAdmin) && (
  <>
    ...
  </>
)}
```

Ou seja:

- Se `isAdmin` for `false`
- E `isSuperAdmin` for `false`

Entao nenhum botao aparece.

---

## 1. Onde `isAdmin` e calculado

Arquivo:

`src/pages/Dashboard.jsx`

Trecho:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";
```

Conclusao:

`isAdmin` depende de `usuario.tipoUsuario`.

Para `isAdmin` ser `true`, o objeto `usuario` precisa estar assim:

```js
{
  tipoUsuario: "admin"
}
```

Se `usuario.tipoUsuario` vier `undefined`, `"participante"`, `"superadmin"` ou qualquer outro valor, `isAdmin` sera `false`.

---

## 2. Onde `isSuperAdmin` e calculado

### Em `Dashboard.jsx`

Arquivo:

`src/pages/Dashboard.jsx`

Trecho:

```js
const isSuperAdmin =
  usuario?.email === "ardcost4@icloud.com";
```

Conclusao:

Dentro do Dashboard, SuperAdmin depende apenas do e-mail.

Para `isSuperAdmin` ser `true`, o usuario logado precisa ter exatamente:

```js
email: "ardcost4@icloud.com"
```

### Em `App.jsx`

Arquivo:

`src/App.jsx`

Trecho:

```js
const isSuperAdmin =
  usuario?.email === "ardcost4@icloud.com";
```

Conclusao:

O App tambem usa o mesmo criterio por e-mail para liberar telas exclusivas como:

- Central de Palpites
- Central Mata-Mata
- Resultados Oficiais

---

## 3. Onde `ParticipantesTable` e chamado

Arquivo:

`src/pages/Dashboard.jsx`

O componente e importado no topo:

```js
import ParticipantesTable from "../components/admin/ParticipantesTable";
```

E e chamado no final do JSX do Dashboard.

---

## 4. Quais props sao enviadas para `ParticipantesTable`

Arquivo:

`src/pages/Dashboard.jsx`

Props enviadas:

```js
participantes={participantesFiltrados}
isSuperAdmin={isSuperAdmin}
isAdmin={isAdmin}
confirmarPagamento={confirmarPagamento}
tornarAdmin={tornarAdmin}
removerAdmin={removerAdmin}
excluirParticipante={excluirParticipante}
```

Conclusao:

A chamada esta enviando as props esperadas.

Nao ha erro aparente de nome de prop entre `Dashboard.jsx` e `ParticipantesTable.jsx`.

---

## 5. Quais props `ParticipantesTable` espera receber

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

Assinatura do componente:

```js
function ParticipantesTable({
  participantes,
  isSuperAdmin,
  isAdmin,
  confirmarPagamento,
  tornarAdmin,
  removerAdmin,
  excluirParticipante,
}) {
```

Props esperadas:

- `participantes`
- `isSuperAdmin`
- `isAdmin`
- `confirmarPagamento`
- `tornarAdmin`
- `removerAdmin`
- `excluirParticipante`

Conclusao:

As props esperadas batem com as props enviadas pelo Dashboard.

---

## 6. Codigo completo da chamada de `ParticipantesTable`

Arquivo:

`src/pages/Dashboard.jsx`

Codigo:

```jsx
<ParticipantesTable
  participantes={
    participantesFiltrados
  }
  isSuperAdmin={isSuperAdmin}
  isAdmin={isAdmin}
  confirmarPagamento={confirmarPagamento}
  tornarAdmin={tornarAdmin}
  removerAdmin={removerAdmin}
  excluirParticipante={excluirParticipante}
/>
```

Analise:

A chamada esta correta.

Se a coluna "Acoes" esta vazia, o problema provavelmente nao esta na chamada do componente, mas nos valores calculados de:

```js
isAdmin
isSuperAdmin
```

---

## 7. Codigo completo do bloco da coluna "Acoes"

Arquivo:

`src/components/admin/ParticipantesTable.jsx`

Codigo:

```jsx
<td style={td}>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "120px",
    }}
  >
    {(isAdmin || isSuperAdmin) && (
      <>
        {!p.pagamento && (
          <button
            style={botaoVerde}
            onClick={() =>
              confirmarPagamento(
                p.id,
                true
              )
            }
          >
            Confirmar
          </button>
        )}

        {p.pagamento && (
          <button
            style={botaoLaranja}
            onClick={() =>
              confirmarPagamento(
                p.id,
                false
              )
            }
          >
            Pendente
          </button>
        )}

        {isSuperAdmin &&
          p.tipoUsuario ===
            "participante" && (
            <button
              style={botaoAzul}
              onClick={() =>
                tornarAdmin(p.id)
              }
            >
              Tornar Admin
            </button>
          )}

        {isSuperAdmin &&
          p.tipoUsuario ===
            "admin" && (
            <button
              style={botaoVermelho}
              onClick={() =>
                removerAdmin(p.id)
              }
            >
              Remover Admin
            </button>
          )}

        {isSuperAdmin &&
          p.tipoUsuario !==
            "superadmin" && (
            <button
              style={botaoExcluir}
              onClick={() =>
                excluirParticipante(
                  p.id,
                  p.nome
                )
              }
            >
              Excluir
            </button>
          )}
      </>
    )}
  </div>
</td>
```

Observacao:

No arquivo real existem alguns emojis e caracteres com encoding quebrado, mas isso nao muda a logica da permissao.

---

## Como a coluna "Acoes" decide o que mostrar

### Para participante comum

Se:

```js
isAdmin === false
isSuperAdmin === false
```

Resultado:

Nenhum botao aparece.

A coluna fica vazia.

### Para Admin

Se:

```js
isAdmin === true
isSuperAdmin === false
```

Resultado:

Aparecem apenas botoes de pagamento:

- Confirmar
- Pendente

Nao aparecem:

- Tornar Admin
- Remover Admin
- Excluir

Porque essas acoes dependem especificamente de `isSuperAdmin`.

### Para SuperAdmin

Se:

```js
isSuperAdmin === true
```

Resultado:

Aparecem:

- Confirmar ou Pendente
- Tornar Admin, quando o usuario da linha e participante
- Remover Admin, quando o usuario da linha e admin
- Excluir, quando o usuario da linha nao e superadmin

---

## Diagnostico principal

A coluna "Acoes" esta vazia porque o bloco que renderiza os botoes depende de:

```js
isAdmin || isSuperAdmin
```

Se nenhum dos dois for verdadeiro, o React renderiza o `<td>` e a `<div>`, mas nao renderiza nenhum botao dentro.

Entao a investigacao deve focar nestes pontos:

1. O usuario logado realmente tem `tipoUsuario: "admin"` no Firestore?
2. O login realmente carregou `tipoUsuario` para dentro do objeto `usuario`?
3. O usuario promovido a Admin saiu e entrou novamente depois da promocao?
4. O e-mail do SuperAdmin e exatamente `ardcost4@icloud.com`?

---

## Pontos especificos encontrados

### A chamada de `ParticipantesTable` esta correta

O Dashboard envia:

```js
isAdmin={isAdmin}
isSuperAdmin={isSuperAdmin}
```

E a tabela espera:

```js
isAdmin,
isSuperAdmin,
```

Nao ha divergencia de nomes.

### O Admin depende de `usuario.tipoUsuario`

Se o objeto `usuario` nao contiver `tipoUsuario`, o Admin nao recebe botoes.

Esse era o problema investigado anteriormente: o Firebase Auth sozinho nao traz `tipoUsuario`; esse campo precisa vir do Firestore.

### SuperAdmin nao depende de `tipoUsuario`

Mesmo que um documento no Firestore tenha:

```js
tipoUsuario: "superadmin"
```

isso nao torna o usuario SuperAdmin no Dashboard.

O SuperAdmin depende exclusivamente do e-mail:

```js
usuario?.email === "ardcost4@icloud.com"
```

---

## Conclusao

A coluna "Acoes" fica vazia quando o usuario logado nao e reconhecido nem como Admin nem como SuperAdmin.

O codigo da chamada de `ParticipantesTable` esta consistente com as props esperadas.

O ponto mais sensivel e o calculo:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";
```

Se `usuario.tipoUsuario` nao estiver carregado no momento em que o Dashboard renderiza, `isAdmin` sera `false` e a coluna "Acoes" ficara vazia para esse usuario.

Status:

- Chamada de `ParticipantesTable`: correta.
- Props enviadas: corretas.
- Props esperadas: corretas.
- Bloco da coluna "Acoes": depende corretamente de `isAdmin || isSuperAdmin`.
- Causa mais provavel da coluna vazia: `isAdmin` e `isSuperAdmin` estao ambos `false`.

Arquivo principal para verificar em runtime:

`src/pages/Dashboard.jsx`

Variaveis criticas:

```js
usuario
usuario?.tipoUsuario
usuario?.email
isAdmin
isSuperAdmin
```
