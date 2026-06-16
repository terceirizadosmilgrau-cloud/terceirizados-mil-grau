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
V43.4 concluida
V43.4E concluida
V43.4F concluida
V43.4G concluida
V43.4H concluida
V43.4I concluida

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

UX atual:
- Mata-Mata e o foco principal do Dashboard.
- Fase de Grupos continua funcional, mas em modulo secundario.
- Dashboard possui card separado "Ranking Oficial".
- Ranking abre por padrao na aba Mata-Mata, mantendo aba Geral.
- Resultados usam a mesma tela com abas Mata-Mata e Fase de Grupos.
- Botoes do Dashboard abrem Resultados diretamente na aba correta.
- Existe Resumo Mata-Mata somente leitura em src/pages/ResumoMataMata.jsx.
- Resumo de Grupos mostra mensagem quando nao ha palpites.
- Modal do participante prioriza Mata-Mata e deixa Fase de Grupos recolhida.
- Telas principais rolam para o topo ao abrir.
- Participantes no Dashboard usam cards mobile ate 768px.

Limpeza de palpites:
- Participante pode apagar apenas os proprios palpites.
- Grupos: palpites/{uid}.
- Mata-Mata: palpitesMataMata/{uid}.
- firestore.rules permite delete somente para dono do documento ou superadmin.

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
