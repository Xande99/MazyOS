## [2026-07-07] Cofre: Sessão como tabela própria, não campo solto

**Decisão:** Nova tabela `vault_sessions` (CRUD completo via RLS) em vez de um campo texto de "cliente" na credencial.
**Motivo:** Relação real 1:N (uma sessão agrupa várias credenciais), precisa de CRUD independente (criar/editar/excluir sessão) e cascade de limpeza no Vault ao excluir.
**Alternativas descartadas:** Extrair automaticamente o nome do cliente a partir do rótulo de texto livre da credencial existente (rejeitada por frágil — a migração renomeia a sessão usando o rótulo atual, deixando o usuário renomear depois pela tela de edição).
**Impacto:** `vault_entries.session_id` (`on delete cascade`), trigger `vault_entries_cleanup_secret` limpa o segredo correspondente em `vault.secrets` tanto na exclusão direta da credencial quanto no cascade de excluir a sessão.

## [2026-07-07] Favoritos da sidebar: array em coluna, não tabela separada

**Decisão:** Coluna `profiles.favoritos text[]` em vez de uma tabela relacional `profiles_favoritos`.
**Motivo:** Não há requisito de ordenação customizada entre favoritos nem metadado extra por favorito — só associação simples (favoritado ou não).
**Alternativas descartadas:** Tabela `user_favorites(user_id, href, posicao)` — mais "correta" relacionalmente, mas overengineering pro requisito atual.
**Impacto:** Se no futuro pedir reordenar favoritos manualmente entre si (não só favoritos-no-topo), essa decisão precisa ser revisada — array não guarda posição customizada.

## [2026-07-07] Fetch de usuário movido pro client (renderização estática)

**Decisão:** Layout `(app)` e a página Início pararam de buscar sessão/usuário no servidor; passaram a consumir um contexto client-side (`CurrentUserProvider`, em `src/lib/hooks/use-current-user.tsx`) que busca uma vez só e persiste entre navegações.
**Motivo:** Qualquer uso de `cookies()`/sessão em Server Component força a rota inteira (e o grupo de rotas) a renderizar dinamicamente no Next, impedindo prefetch/cache real do client router — era a causa raiz da lentidão sentida na navegação entre módulos da sidebar.
**Alternativas descartadas:** Só trocar `getUser()` por `getSession()` no servidor (reduz o custo de rede da checagem, mas não resolve a causa raiz — a rota continuava classificada como dinâmica no build).
**Impacto:** Rotas do painel viraram estáticas (`○`) no build de produção em vez de dinâmicas (`ƒ`). Qualquer página nova que precise do usuário logado deve consumir `useCurrentUser()`, não buscar sessão no servidor.

## [2026-07-09] `--color-accent` escurecido para `#c81f66` (era `#fd4b90`)

**Decisão:** Token `--color-accent` em `globals.css` passou do rosa vívido da marca (`#fd4b90`) para uma variante mais escura (`#c81f66`), espelhando o novo `--du-pink-ink` de `projeto/duPolvoNovo/tokens/colors.css`.
**Motivo:** `#fd4b90` como texto branco sobre fundo preenchido (botões `bg-accent text-white`) mede ~3.2:1 de contraste — abaixo do mínimo WCAG AA (4.5:1) para texto normal. O mesmo bug existia na LP institucional da duPolvo (mesmo hex reaproveitado) e foi corrigido lá na origem; aqui só herdava o valor.
**Alternativas descartadas:** Manter o rosa vívido e só aumentar o tamanho/peso do texto do botão para entrar na faixa de "large text" (limite 3:1) — rejeitada por exigir mudança de layout maior nos botões existentes, e por não resolver outros usos de `--color-accent` como texto pequeno.
**Impacto:** Qualquer elemento usando `bg-accent`/`text-accent` fica com o rosa levemente mais escuro/magenta. `--color-accent-hover` (`#ff6ba3`, mais claro) não mudou — o hover agora "clareia" na direção do rosa original da marca, efeito colateral aceitável.

## [2026-07-21] Projeto "Segurança" semeado em Tarefas (todo_projects/todo_items)

**Decisão:** Criado o projeto "Segurança" em `todo_projects` com 4 itens em `todo_items` (rotação de chaves 90d, `/deps-review` mensal, re-teste RLS por mudança de schema, verificação mensal de CVEs) — cada `titulo` já inclui uma descrição curta do porquê, já que a tabela não tem coluna de descrição separada. Visível pros 4 sócios (mesma policy `using(true)` de todo o painel — não existe "privado" nesse schema).
**Motivo:** Fase 5 (Herança Automática) da auditoria de segurança, item 5 — tirar a "Rotina recorrente" de `MazyOS/ACOES-MANUAIS.md` (markdown que só quem abre o repo vê) e colocar na ferramenta que os sócios já usam todo dia.
**Alternativas descartadas:** Coluna de descrição nova em `todo_items` — rejeitada por exigir migration só pra isso; dobrar a descrição dentro do `titulo` resolve sem mexer em schema. Projeto "privado"/só pro Claude Code — tecnicamente impossível nesse schema (RLS não tem conceito de dono), e o usuário decidiu que faz mais sentido visível a todos mesmo.
**Alternativas descartadas (2):** Nenhuma automação de recorrência — `todo_items` não tem campo de intervalo/repetição, então isso é decisão do design, não limitação a contornar (comentário original da migration já diz "checklist, não motor de planilha"). Reabrir/recriar cada item quando vencer o prazo é manual, documentado no `ACOES-MANUAIS.md`.
**Impacto:** 5 linhas novas (`todo_projects` + 4×`todo_items`), nada existente alterado. `ACOES-MANUAIS.md` atualizado pra apontar o dashboard como fonte de verdade da rotina recorrente, mantendo a lista ali só como referência.
