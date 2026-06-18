# Relatório — Coluna Ações

Projeto: Terceirizados Mil Grau

Auditoria original: 15/06/2026

Revisão documental: 18/06/2026

Versão de referência: V52.3

---

## Status

Problema histórico encerrado.

A coluna **Ações** da lista de participantes segue as permissões do usuário autenticado. Uma coluna sem controles para participante comum é comportamento esperado, não erro.

---

## Regra atual

O Dashboard calcula:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";

const isSuperAdmin =
  usuario?.tipoUsuario === "superadmin";
```

Esses valores são enviados para:

```text
src/components/admin/ParticipantesTable.jsx
```

As ações de pagamento são exibidas quando:

```js
isAdmin || isSuperAdmin
```

As ações de promover, remover Admin e excluir são exibidas somente quando:

```js
isSuperAdmin
```

---

## O que cada perfil visualiza

### Participante

Não visualiza botões administrativos.

### Admin

Visualiza:

- Confirmar pagamento;
- Marcar pagamento como pendente.

Não visualiza:

- Tornar Admin;
- Remover Admin;
- Excluir participante.

### SuperAdmin

Visualiza:

- ações de pagamento;
- Tornar Admin para participantes;
- Remover Admin para contas Admin;
- Excluir contas que não sejam SuperAdmin.

---

## Diferença importante

O perfil mostrado em uma linha usa:

```js
p.tipoUsuario
```

Esse valor pertence ao participante listado.

As ações disponíveis usam:

```js
isAdmin
isSuperAdmin
```

Esses valores pertencem ao usuário autenticado.

Portanto, uma linha mostrar “Admin” não significa que o usuário atualmente conectado tenha permissão administrativa.

---

## Correções consolidadas

Desde a investigação original:

- o SuperAdmin deixou de depender de e-mail hardcoded;
- `tipoUsuario` tornou-se a fonte única de perfil;
- o usuário autenticado passou a ser sincronizado com `usuarios/{uid}` por `onSnapshot`;
- `firestore.rules` passou a estar versionado e a validar as permissões;
- os logs temporários de diagnóstico foram removidos;
- a tabela possui apresentação desktop e cards mobile com as mesmas regras de autorização.

---

## Checklist em caso de regressão

1. Confirmar o `uid` da conta autenticada.
2. Verificar `usuarios/{uid}.tipoUsuario`.
3. Confirmar que o valor é exatamente `participante`, `admin` ou `superadmin`.
4. Verificar os valores de `isAdmin` e `isSuperAdmin` no Dashboard.
5. Confirmar que as props chegam à `ParticipantesTable`.
6. Testar a tabela desktop e os cards mobile.
7. Confirmar que o Firestore aceita somente a operação correspondente ao perfil.

---

## Conclusão

A renderização da coluna **Ações** está coerente com o modelo atual de permissões. O diagnóstico antigo de SuperAdmin por e-mail e perfil desatualizado não corresponde ao código da V52.3.

Este arquivo permanece como documentação de comportamento e roteiro para investigar uma possível regressão futura.
