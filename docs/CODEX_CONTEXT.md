Projeto: Terceirizados Mil Grau

Status Atual:

V36 concluida
V37 concluida
V38 concluida
V38.1 concluida
V39 concluida
V40 concluida
V41 concluida

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
Nao existe mais email hardcoded.

Firestore:
Protegido por firestore.rules.

V39 implementada:
- Mata-Mata com palpites por jogo.
- Cada jogo tem time A, time B, placar previsto e classificado previsto.
- O modelo antigo por listas segue salvo para compatibilidade com ranking atual.

V40 implementada:
- Resultados Oficiais com Mata-Mata por jogo.
- resultados/mataMata grava jogos e campos antigos derivados.
- Botao seguro para zerar resultados de teste apenas para superadmin.

V41 implementada:
- Pontuacao do Mata-Mata por jogo.
- Placar exato vale 10 pontos.
- Classificado correto vale 5 pontos.
- Fallback antigo preservado quando jogos nao existir nos dois lados.

Proxima versao:
V42 - Ranking exclusivo Mata-Mata.

Antes de alterar codigo:
Sempre gerar plano tecnico.
Sempre rodar npm run build.
Sempre listar arquivos alterados.
