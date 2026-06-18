# Relatório de Runtime — Permissões Admin

Projeto: Terceirizados Mil Grau

Investigação original: 15/06/2026

Revisão documental: 18/06/2026

Versão de referência: V52.3

---

## Status

Encerrado e resolvido.

Este relatório registrava uma investigação antiga sobre uma conta exibida como Admin na lista de participantes, mas sem os botões esperados na coluna **Ações**. O diagnóstico não representa mais um problema ativo da aplicação.

---

## Solução vigente

O perfil do usuário autenticado é carregado do documento:

```text
usuarios/{uid}
```

Após o login, `App.jsx` mantém esse documento sincronizado em tempo real por meio de `onSnapshot`. Assim, mudanças em `tipoUsuario` passam a atualizar o estado do usuário autenticado sem depender de e-mail fixo.

Critérios atuais:

```js
const isAdmin =
  usuario?.tipoUsuario === "admin";

const isSuperAdmin =
  usuario?.tipoUsuario === "superadmin";
```

Valores válidos:

```text
participante
admin
superadmin
```

---

## Comportamento esperado

### Participante

Não recebe ações administrativas.

### Admin

Pode:

- confirmar pagamento;
- marcar pagamento como pendente.

Não pode:

- promover ou remover Admin;
- excluir participantes;
- alterar resultados ou configurações.

### SuperAdmin

Pode:

- executar as ações de pagamento;
- promover participante para Admin;
- remover Admin;
- excluir usuário que não seja SuperAdmin;
- acessar controles administrativos exclusivos.

---

## Fluxo até a tabela

`Dashboard.jsx` calcula `isAdmin` e `isSuperAdmin` usando `usuario.tipoUsuario` e envia os dois valores para:

```text
src/components/admin/ParticipantesTable.jsx
```

A tabela exibe as ações de pagamento quando:

```js
isAdmin || isSuperAdmin
```

As ações de perfil e exclusão continuam restritas a:

```js
isSuperAdmin
```

---

## Logs temporários

Os logs usados na investigação antiga não permanecem no código atual.

Não foram encontrados logs de diagnóstico como:

```text
USUARIO
TIPO_USUARIO
IS_ADMIN
IS_SUPERADMIN
ParticipantesTable
```

---

## Segurança

A autorização não depende somente da interface. O arquivo `firestore.rules` está versionado e aplica as restrições:

- Admin altera somente `pagamento`;
- SuperAdmin pode alterar `pagamento` e `tipoUsuario`;
- SuperAdmin pode excluir usuário que não seja SuperAdmin;
- operações não autorizadas permanecem bloqueadas.

---

## Validação recomendada

Quando houver suspeita de regressão:

1. Entrar com uma conta `participante` e confirmar que não existem ações administrativas.
2. Entrar com uma conta `admin` e confirmar os botões de pagamento.
3. Entrar com uma conta `superadmin` e confirmar ações de perfil e exclusão.
4. Verificar o campo `tipoUsuario` em `usuarios/{uid}`.
5. Confirmar que nenhuma permissão depende de e-mail hardcoded.

---

## Conclusão

O problema histórico foi resolvido pela padronização das permissões em `tipoUsuario` e pela sincronização em tempo real do usuário autenticado. Este documento deve ser tratado apenas como registro de encerramento.
