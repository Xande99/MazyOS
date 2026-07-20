# Contrato de Design Tokens — duPolvo

> Este documento define os NOMES de tokens que todo projeto (Tipo A e Tipo B) deve
> respeitar. Os VALORES mudam por cliente; os NOMES nunca mudam. Componentes e seções
> só podem referenciar tokens semânticos — nunca valores brutos (hex, px soltos, etc).

## Como usar

1. Cada novo projeto ganha um `theme.css` com um bloco `@theme` preenchendo estes
   nomes com os valores da marca do cliente (gerado a partir do `briefing.md`).
2. Componentes/seções da biblioteca nunca usam `#hex`, `16px`, `sans-serif` direto —
   sempre `var(--color-brand)`, `var(--space-4)`, `var(--font-body)`.
3. O lint de tokens (stylelint) barra qualquer valor hardcoded fora do `@theme`.

## 1. Cor

### 1.1 Primitivos (escala bruta da marca — 11 degraus, 50 a 950)
--color-brand-50 ... --color-brand-950
--color-neutral-50 ... --color-neutral-950
Opcional por projeto: --color-accent-* quando o cliente tiver cor secundária forte.

### 1.2 Semânticos (o que os componentes de fato usam)
- --color-brand — cor de marca primária (CTA, links, destaques)
- --color-brand-contrast — texto/ícone sobre --color-brand
- --color-surface — fundo de seção padrão
- --color-surface-alt — fundo de seção alternada (zebra entre seções)
- --color-surface-inverse — fundo escuro/invertido (footer, seção de destaque)
- --color-text — texto principal sobre --color-surface
- --color-text-muted — texto secundário, legendas
- --color-text-inverse — texto sobre --color-surface-inverse
- --color-border — bordas e divisores sutis
- --color-success / --color-error — estados de formulário

Regra de ouro: nenhuma seção referencia --color-brand-500 diretamente. Sempre passa
pelo semântico.

## 2. Tipografia
--font-display (títulos/hero) | --font-body (texto) | --font-mono (opcional)
Escala: --text-xs, --text-sm, --text-base, --text-lg, --text-xl, --text-2xl,
--text-3xl, --text-4xl, --text-5xl, --text-hero (clamp fluido)
Pesos: --font-weight-regular: 400 | --font-weight-medium: 500 | --font-weight-bold: 700

## 3. Espaçamento
--space-section-y (respiro vertical padrão entre seções)
--space-section-y-lg (seções hero/destaque)
--space-container-x (padding lateral do container)
--space-gap-grid (gap padrão de grids de cards/ofertas)

## 4. Raio e sombra
--radius-sm | --radius-md | --radius-lg | --radius-full
--shadow-sm | --shadow-md | --shadow-lg

## 5. Motion (assinatura de animação da duPolvo)
--duration-fast: 150ms | --duration-base: 300ms | --duration-slow: 600ms
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-soft: cubic-bezier(0.45, 0, 0.55, 1)
Presets GSAP nomeados (em motion.ts na biblioteca): reveal, stagger, parallax.

## 6. Layout
--container-max: 1280px | breakpoints herdados do Tailwind

## O que FICA FORA do contrato (decisão deliberada por projeto)
Para não gerar convergência estética entre clientes, são intencionalmente livres:
- Direção de arte específica (ilustração vs foto vs 3D)
- Easings "de assinatura" além dos 2 presets base
- Grid/layout do hero (wireframe-zero pode variar)
- Texturas, grão, efeitos visuais especiais
O sistema garante consistência estrutural e de qualidade — não decide a estética.
