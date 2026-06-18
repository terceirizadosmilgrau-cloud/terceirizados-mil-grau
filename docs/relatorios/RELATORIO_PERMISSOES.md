# Relatório de Permissões

Projeto: Terceirizados Mil Grau

Auditoria original: 15/06/2026

Revisão documental: 18/06/2026

Versão de referência: V52.3

---

## Status

Permissões padronizadas e funcionais.

As inconsistências apontadas na auditoria original foram corrigidas. O sistema usa exclusivamente o campo `tipoUsuario` do documento `usuarios/{uid}` para identificar participante, Admin e SuperAdmin.

Não existe dependência ativa de e-mail hardcoded para conceder permissões.

---

## Modelo atual

Valores válidos:

```js
tipoUsuario: "participante"
tipoUsuario: "admin"
tipoUsuario: "superadmin"
```

Não são usados os campos `role` ou `perfil` como fonte de autorização.

Todo novo cadastro é criado como:

```js
tipoUsuario: "participante"
```

Somente o SuperAdmin pode promover ou remover Admin pela aplicação.

---

## Carregamento e sincronização do perfil

O login consulta:

```text
usuarios/{uid}
```

O objeto autenticado recebe os dados do Firestore, incluindo `tipoUsuario`.

Depois do login, `App.jsx` usa `onSnapshot` no documento do usuário autenticado. Essa sincronização mantém o perfil local atualizado quando o campo `tipoUsuario` muda.

---

## Matriz de permissões

| Ação | Participante | Admin | SuperAdmin |
| --- | --- | --- | --- |
| Ver dados necessários do bolão | Sim | Sim | Sim |
| Editar os próprios palpites | Sim | Sim | Sim |
| Apagar os próprios palpites | Sim | Sim | Sim |
| Confirmar ou marcar pagamento pendente | Não | Sim | Sim |
| Promover participante para Admin | Não | Não | Sim |
| Remover Admin | Não | Não | Sim |
| Excluir participante/Admin | Não | Não | Sim |
| Alterar resultados oficiais | Não | Não | Sim |
| Alterar configurações | Não | Não | Sim |
| Zerar todos os palpites | Não | Não | Sim |

O SuperAdmin não pode excluir outro usuário cujo `tipoUsuario` seja `superadmin`.

---

## Proteção no frontend

Os principais critérios são:

```js
usuario?.tipoUsuario === "admin"
usuario?.tipoUsuario === "superadmin"
```

O frontend usa esses critérios para exibir ou ocultar controles. Isso melhora a experiência, mas não é a única camada de segurança.

---

## Proteção no Firestore

O arquivo `firestore.rules` está versionado no projeto.

Regras relevantes:

- participante cria e altera apenas os próprios palpites;
- participante pode apagar apenas os próprios palpites;
- Admin altera somente o campo `pagamento`;
- SuperAdmin pode alterar `pagamento` e `tipoUsuario`;
- SuperAdmin administra resultados e configurações;
- SuperAdmin pode excluir usuário que não seja SuperAdmin;
- demais escritas não autorizadas são bloqueadas.

As regras não devem ser alteradas sem aprovação explícita e não devem ser publicadas sem autorização de deploy.

---

## Arquivos relacionados

- `src/App.jsx`
- `src/components/Login.jsx`
- `src/components/Cadastro.jsx`
- `src/pages/Dashboard.jsx`
- `src/components/admin/ParticipantesTable.jsx`
- `firestore.rules`

---

## Pontos permanentes de atenção

- Usar somente `tipoUsuario` como fonte de perfil.
- Não reintroduzir e-mail hardcoded.
- Não confiar apenas na visibilidade dos botões.
- Manter as regras do Firestore compatíveis com a interface.
- Não conceder a Admin permissões reservadas ao SuperAdmin.
- Não alterar autenticação ou regras sem plano e aprovação.

---

## Conclusão

O fluxo atual está consistente:

- Admin possui somente ações de pagamento.
- SuperAdmin possui os controles administrativos completos.
- O perfil autenticado é sincronizado em tempo real.
- As regras do Firestore fornecem a proteção efetiva das operações.

As observações antigas sobre relogin obrigatório, SuperAdmin por e-mail e ausência de regras versionadas estão obsoletas e não devem orientar novas alterações.
