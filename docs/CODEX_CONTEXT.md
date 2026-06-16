Projeto: Terceirizados Mil Grau

Status Atual:

V36 ✅
V37 ✅
V38 ✅
V38.1 ✅
V39 ✅
V40 ✅
V41 ✅
V41.1 ✅
V42 ✅
V42.1 até V42.8 ✅
V43 ✅
V43.1 ✅

Stack:
- React
- Vite
- Firebase Auth
- Firestore
- Firebase Hosting

Permissões:
- participante
- admin
- superadmin

SuperAdmin:
Baseado em tipoUsuario.
Sem e-mail hardcoded.

Mata-Mata atual:
- Confrontos oficiais configurados pelo SuperAdmin.
- Salvos em configuracoes/mataMata.
- Participante preenche:
  - placarA
  - placarB
  - classificado
  - decididoNosPenaltis
- Resultados oficiais usam os mesmos confrontos.

Pontuação atual:
- placar exato = 10
- classificado correto = 5
- pênaltis correto = +3
- máximo atual = 18

Próxima versão:
V43.2 - Resultado do jogo e bônus de acerto total.

Antes de alterar código:
- gerar plano técnico;
- rodar npm.cmd run build;
- listar arquivos alterados;
- não fazer deploy.