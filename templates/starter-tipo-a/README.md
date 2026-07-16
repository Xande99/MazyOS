# duPolvo — Starter Tipo A (Astro)

Starter pra landing page / site institucional / site de conteúdo, conforme a stack oficial em `projeto/claude.md`. Usado pelo comando `/novo-projeto` pra criar `projeto/<Nome>/` — não é pra desenvolver direto aqui.

## O que já vem pronto

- **Astro 7 + Tailwind v4 + TypeScript strict + GSAP** — stack oficial Tipo A.
- **Tokens de marca duPolvo** aplicados via `src/styles/dupolvo-theme.css` (`@theme` do Tailwind v4) — cores, tipografia (Bricolage Grotesque, `font-display: swap`, preload), raio, easing. Fonte: `identidade/design-guide.md` / `projeto/duPolvoNovo/tokens/`.
- **View Transitions** (`<ClientRouter />`) ativado no `Layout.astro` — navegação entre páginas já morfa elementos com `transition:name` sem config extra.
- **Sistema `.reveal`** — fade + slide-up no scroll via GSAP `ScrollTrigger`, com easing assinatura da marca (`CustomEase` a partir do cubic-bezier de `--ease-out-expo`). Envolto em `gsap.matchMedia()`: só anima se o usuário não pediu `prefers-reduced-motion: reduce`. Reinicializa sozinho a cada navegação via View Transitions.
- **Página `index.astro` de exemplo** — HTML semântico, meta tags completas (title/description/canonical/Open Graph/Twitter), imagem otimizada via `astro:assets` com `width`/`height` explícitos (sem layout shift), pensada pra bater os 4 thresholds do pipeline de QA (`Performance ≥ 90`, `Accessibility = 100`, `Best Practices ≥ 95`, `SEO ≥ 95`) — **mas isso não substitui rodar o pipeline de QA de verdade** (Playwright + Lighthouse + `mcp-accessibility-scanner`) antes de qualquer entrega real de cliente.
- `.gitignore` correto (`node_modules/`, `dist/`, `.astro/`, `.env*`).

## O que configurar por projeto

1. **`astro.config.mjs`** → trocar `site: 'https://exemplo.duPolvo.com.br'` pelo domínio real assim que o cliente tiver um (canonical/OG dependem disso — sem `site` configurado, o build falha).
2. **`src/pages/index.astro`** → substituir pelo conteúdo real do cliente (esse arquivo é só prova de que o starter builda limpo, não é uma LP pronta).
3. **`src/sections/`** → pasta vazia de propósito — é onde entram as seções reutilizáveis conforme o projeto cresce (ver também `projeto/duPolvoNovo/sections/` como referência de biblioteca já existente).
4. **Identidade própria do cliente** (se não herdar a linha da duPolvo) → editar `src/styles/dupolvo-theme.css` com a paleta/tipografia do cliente, ou renomear/substituir o arquivo — ver Passo 1.2 do `/novo-projeto`.
5. **Skills de animação extras** (`locomotive-scroll`, `lightweight-3d-effects`, etc.) → ativar conforme a LP pedir, seguindo o mapa em `CLAUDE.md` raiz do MazyOS. GSAP + ScrollTrigger já são a base; o resto é por cima.

## Comandos

```bash
npm install       # não vem pronto de propósito — /novo-projeto roda isso após copiar o starter
npm run dev
npm run build
npm run check      # astro check — TypeScript strict
npm run qa         # check + build (o que dá pra automatizar localmente; Lighthouse/Playwright/a11y ficam pro pipeline de QA manual)
```

## Estrutura

```
src/
  layouts/Layout.astro     — <head> completo, ClientRouter, import do global.css
  components/               — componentes pequenos e reutilizáveis
  sections/                 — vazia — biblioteca de seções do projeto
  scripts/reveal.ts         — sistema de reveal (GSAP + matchMedia)
  styles/
    global.css               — @import tailwindcss + dupolvo-theme.css + base/utilitários
    dupolvo-theme.css        — tokens de marca (cópia vendorizada de templates/tailwind-preset-dupolvo/)
  assets/hero.svg            — placeholder de imagem, trocar pelo material real do cliente
  pages/index.astro          — página de exemplo
public/
  fonts/                     — Bricolage Grotesque self-hosted
  favicon.svg
```
