Projeto: Terceirizados Mil Grau

Status Atual:

V36 concluida
V37 concluida
V38 concluida
V38.1 concluida
V39 concluida
V40 concluida
V41 concluida
V41.1 concluida
V42 concluida
V42.1 ate V42.8 concluidas
V43 concluida
V43.1 concluida
V43.2 concluida

Stack:
- React
- Vite
- Firebase Auth
- Firestore
- Firebase Hosting

Permissoes:
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

Pontuacao atual:
- placar exato = +10
- resultado do jogo correto = +5
- classificado correto = +5
- penaltis correto = +3
- bonus de acerto total = +2
- maximo atual = 22 sem penaltis e 25 com penaltis

Resultado do jogo:
- Derivado do placar.
- placarA > placarB = timeA venceu.
- placarA === placarB = empate.
- placarB > placarA = timeB venceu.

Acerto total:
- placar exato correto;
- resultado do jogo correto;
- classificado correto;
- se o jogo oficial foi decidido nos penaltis, tambem precisa acertar penaltis.

Antes de alterar codigo:
- gerar plano tecnico quando a tarefa pedir;
- rodar npm.cmd run build;
- listar arquivos alterados;
- nao fazer deploy.
