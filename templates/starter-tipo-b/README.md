# duPolvo — Starter Tipo B (Next.js)

Starter pra sistema / SaaS / dashboard / área autenticada, conforme a stack oficial em `projeto/claude.md`. Usado pelo comando `/novo-projeto` pra criar `projeto/<Nome>/` — não é pra desenvolver direto aqui.

## O que já vem pronto

- **Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind v4 + Motion** — stack oficial Tipo B.
- **Tokens de marca duPolvo** aplicados via `app/dupolvo-theme.css` (`@theme` do Tailwind v4) — mesmos valores do starter Tipo A. Fonte: `identidade/design-guide.md` / `projeto/duPolvoNovo/tokens/`.
- **Server Component por padrão** (`app/page.tsx`) + **Client Component com Motion** (`components/ExpandableCard.tsx`) demonstrando `AnimatePresence` e `useReducedMotion()` — o equivalente, no lado React, do `gsap.matchMedia()` do starter Tipo A.
- **Supabase configurado** — `lib/supabase/client.ts` (Client Components), `lib/supabase/server.ts` (Server Components/Actions, via `next/headers`), `proxy.ts` (renovação de sessão a cada navegação — é o antigo `middleware.ts`; Next.js 16 renomeou o convention pra `proxy`, ver [nextjs.org/docs/messages/middleware-to-proxy](https://nextjs.org/docs/messages/middleware-to-proxy)). Padrão de variáveis de ambiente segue `_memoria/checklist-novo-projeto-supabase.md`.
- **`.env.example`** com as 3 variáveis do checklist — **nunca** commitar `.env.local` real (`.gitignore` já bloqueia, exceto o próprio `.env.example`).
- `.gitignore` correto (`node_modules/`, `.next/`, `.env*` exceto `.env.example`).
- **Lint de tokens** (`stylelint` + `stylelint-declaration-strict-value`, config em `.stylelintrc.json`) — barra hex/rgb/hsl/oklch literal e `font-family` solta em qualquer `.css` do projeto (inclui `.module.css`, se algum for criado), exceto dentro de `theme*.css`/`dupolvo-theme.css`. Paridade com o starter-tipo-a (`_memoria/tokens-contract.md`). **Cobertura conhecida:** hoje o projeto não usa CSS Modules nem `styled-jsx` — só Tailwind utilities em `className` e os 2 arquivos `.css` reais. Se `styled-jsx` (`<style jsx>`) for adotado depois, este lint **não** cobre esses blocos automaticamente — precisa de um parser dedicado (nenhum foi instalado, por não haver uso atual a justificar).

## O que configurar por projeto

1. **`app/layout.tsx`** → trocar `siteUrl = "https://exemplo.duPolvo.com.br"` pelo domínio real assim que o cliente tiver um (alimenta `metadataBase`, usado pra resolver URLs absolutas de Open Graph).
2. **Supabase** → copiar `.env.example` pra `.env.local`, seguir `_memoria/checklist-novo-projeto-supabase.md` (criar projeto no dashboard, região `sa-east-1`, linkar a CLI). A partir do passo 6 do checklist, migrations já aplicam automático.
3. **`proxy.ts`** → o bloco de redirecionamento de rota protegida vem comentado de propósito — ativar e ajustar o `pathname` conforme as rotas privadas reais do projeto.
4. **`app/page.tsx`** → substituir pelo conteúdo real (esse arquivo é só prova de que o starter builda limpo, não é uma tela pronta).
5. **RLS no Supabase** → habilitar em toda tabela nova, sem exceção — regra do `projeto/claude.md`, não é opcional.
6. **Identidade própria do cliente** (se não herdar a linha da duPolvo) → editar `app/dupolvo-theme.css`.

## Comandos

```bash
npm install        # não vem pronto de propósito — /novo-projeto roda isso após copiar o starter
npm run dev
npm run build
npm run typecheck   # tsc --noEmit
npm run lint
npm run lint:css    # stylelint — tokens semânticos, ver _memoria/tokens-contract.md
npm run qa          # typecheck + lint + lint:css + build (o que dá pra automatizar localmente; Lighthouse/Playwright/a11y ficam pro pipeline de QA manual)
```

## Estrutura

```
app/
  layout.tsx          — metadata, preload de fonte, import do globals.css
  page.tsx             — página de exemplo (Server Component)
  globals.css          — @import tailwindcss + dupolvo-theme.css + base/utilitários
  dupolvo-theme.css    — tokens de marca (cópia vendorizada de templates/tailwind-preset-dupolvo/)
  icon.svg              — favicon (convenção de arquivo do App Router)
components/
  ExpandableCard.tsx    — exemplo de Client Component com Motion/AnimatePresence
lib/
  supabase/
    client.ts            — cliente pra Client Components
    server.ts             — cliente pra Server Components/Actions
proxy.ts               — auth: renovação de sessão a cada navegação (ex-middleware.ts)
public/
  fonts/                 — Bricolage Grotesque self-hosted
  hero.svg                — placeholder de imagem, trocar pelo material real do cliente
.env.example
```
