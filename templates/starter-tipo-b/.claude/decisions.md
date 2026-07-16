# Decisões técnicas — starter-tipo-b

## [2026-07-16] Migração middleware.ts → proxy.ts (Next.js 16) — entrada retroativa

**Registro retroativo:** decisão tomada durante a criação original do starter (commit `a78f5e9`, 2026-07-16), só registrada agora neste arquivo — não é uma decisão nova desta sessão.

**Decisão:** Nomear o arquivo de proxy de autenticação `proxy.ts`, na raiz do projeto — não `middleware.ts`.

**Motivo:** O Next.js 16 renomeou `middleware.ts` pra `proxy.ts` (ver https://nextjs.org/docs/messages/middleware-to-proxy), migração feita via codemod oficial. O arquivo renova a sessão do Supabase em toda navegação — sem isso, o token expira e o usuário parece deslogado de forma aleatória. Usa `getUser()` (não `getSession()`) porque valida o token com o servidor do Supabase em vez de só ler o cookie, que pode estar adulterado. O bloco de redirecionamento de rota protegida foi deixado comentado de propósito — cada projeto decide suas próprias rotas privadas, não é algo genérico o bastante pra vir ativo por padrão no starter.

**Alternativas descartadas:** manter o nome `middleware.ts`. Tecnicamente ainda funcionaria numa janela de compatibilidade, mas divergiria da convenção oficial do Next.js 16 desde o primeiro dia do starter, empurrando a migração pra cada projeto filho resolver depois em vez de nascer já correto.

**Impacto:** Todo projeto Tipo B nascido do starter via `/novo-projeto` já nasce com o nome de arquivo certo pro Next.js 16 — sem migração posterior necessária. Sessões futuras em `projeto/<Nome>/` não devem recriar `middleware.ts` por hábito de versões anteriores do framework.

## [2026-07-16] Não corrigir vulnerabilidade moderada de postcss (GHSA-qx2v-qp2m-jg93)

**Decisão:** Manter `next@16.2.10` como está, sem rodar `npm audit fix --force`, apesar do `npm audit` acusar 2 vulnerabilidades moderadas (mesmo advisory, duas entradas na árvore).

**Motivo:** As duas ocorrências resolvem pro mesmo advisory — XSS via `</style>` não escapado no output do PostCSS Stringify — afetando `postcss@8.4.31`, empacotado **internamente** por `next@16.2.10` (`node_modules/next/node_modules/postcss`). O `postcss@8.5.19` usado via `@tailwindcss/postcss` já está corrigido; não é ele que aparece no audit. Não existe hoje nenhuma versão *stable* de `next` mais nova que `16.2.10` — só `16.3.0-canary.*`/`16.3.0-preview.*` (confirmado via `npm view next versions`) — então não há upgrade seguro disponível ainda. O risco em si é de build-time (compilador PostCSS), não de runtime exposto a usuário final.

**Alternativas descartadas:** `npm audit fix --force`, que rebaixaria `next` pra `9.3.3` — o npm resolve pro mínimo do range semver compatível com o `postcss` corrigido, não pra uma versão real mais recente. Downgrade de anos de diferença, inviável.

**Impacto:** Nenhum agora. Acompanhar releases do Next 16.3 estável e rodar `npm update next` (ou `npm audit fix`) quando uma versão stable publicar o `postcss` interno atualizado.
