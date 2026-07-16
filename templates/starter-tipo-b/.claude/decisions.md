# Decisões técnicas — starter-tipo-b

## [2026-07-16] Não corrigir vulnerabilidade moderada de postcss (GHSA-qx2v-qp2m-jg93)

**Decisão:** Manter `next@16.2.10` como está, sem rodar `npm audit fix --force`, apesar do `npm audit` acusar 2 vulnerabilidades moderadas (mesmo advisory, duas entradas na árvore).

**Motivo:** As duas ocorrências resolvem pro mesmo advisory — XSS via `</style>` não escapado no output do PostCSS Stringify — afetando `postcss@8.4.31`, empacotado **internamente** por `next@16.2.10` (`node_modules/next/node_modules/postcss`). O `postcss@8.5.19` usado via `@tailwindcss/postcss` já está corrigido; não é ele que aparece no audit. Não existe hoje nenhuma versão *stable* de `next` mais nova que `16.2.10` — só `16.3.0-canary.*`/`16.3.0-preview.*` (confirmado via `npm view next versions`) — então não há upgrade seguro disponível ainda. O risco em si é de build-time (compilador PostCSS), não de runtime exposto a usuário final.

**Alternativas descartadas:** `npm audit fix --force`, que rebaixaria `next` pra `9.3.3` — o npm resolve pro mínimo do range semver compatível com o `postcss` corrigido, não pra uma versão real mais recente. Downgrade de anos de diferença, inviável.

**Impacto:** Nenhum agora. Acompanhar releases do Next 16.3 estável e rodar `npm update next` (ou `npm audit fix`) quando uma versão stable publicar o `postcss` interno atualizado.
