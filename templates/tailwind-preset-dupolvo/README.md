# tailwind-preset-dupolvo

Tokens de marca da duPolvo em formato Tailwind v4 (CSS-first, `@theme`) — usado pelos dois starters (`templates/starter-tipo-a/` e `templates/starter-tipo-b/`) pra não redigitar cor/fonte/raio em cada projeto novo.

## Por que é uma cópia vendorizada, não um import ao vivo

Tailwind v4 não tem `tailwind.config.js` — o tema é 100% CSS (`@theme` dentro do próprio `global.css`). Um `@import` relativo apontando pra fora da pasta do projeto (`../../templates/...`) quebraria assim que o `/novo-projeto` copia o starter pra `projeto/<Nome>/` e, mais tarde, a pasta inteira é movida pro Desktop — nesse ponto `templates/` nem existe mais no caminho.

Por isso cada starter tem sua própria cópia de `dupolvo-theme.css` em `src/styles/` (Tipo A) ou `app/` (Tipo B), com `@font-face` apontando pra `/fonts/...` (caminho absoluto). Os arquivos de fonte em si ficam em `public/fonts/` nos dois starters (caminho estável, sem hash de build, igual em qualquer framework que sirva `public/` na raiz). Este diretório é a fonte canônica pra edição — se um token de marca mudar aqui, precisa recopiar pros dois starters manualmente.

## Como ressincronizar os starters se este arquivo mudar

```bash
cp templates/tailwind-preset-dupolvo/dupolvo-theme.css templates/starter-tipo-a/src/styles/dupolvo-theme.css
cp templates/tailwind-preset-dupolvo/dupolvo-theme.css templates/starter-tipo-b/app/dupolvo-theme.css
cp templates/tailwind-preset-dupolvo/fonts/*.ttf templates/starter-tipo-a/public/fonts/
cp templates/tailwind-preset-dupolvo/fonts/*.ttf templates/starter-tipo-b/public/fonts/
```

## Fonte de verdade acima desta

Os valores aqui vêm de `projeto/duPolvoNovo/tokens/*.css` (canônico) e `identidade/design-guide.md` (resumo). Se algo divergir, os tokens em `duPolvoNovo` ganham — atualizar este arquivo pra bater, nunca o contrário.
