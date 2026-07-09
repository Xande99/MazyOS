# Identidade visual

> **Fonte técnica canônica:** `projeto/duPolvoNovo/tokens/*.css` (colors, typography, spacing, motion, fonts). Este arquivo é o resumo de referência rápida em linguagem humana — os valores exatos (incluindo variantes derivadas e regras de acessibilidade) vivem nos tokens. Se os dois divergirem, os tokens têm precedência e este arquivo deve ser atualizado.

---

## Cores

- **Fundo claro:** `#F7F4F1`
- **Fundo escuro:** `#020E20`
- **Rosa — CTAs, destaques, palavras em evidência:** `#FD4B90`
- **Azul escuro — títulos em seções claras:** `#123047`
- **Amarelo limão — ticker, badges, acentos:** `#DFFF5A`
- **Verde água — ícones, bordas secundárias:** `#81DFC0`

**Regra de acessibilidade (obrigatória):** o rosa `#FD4B90` puro **não passa contraste WCAG AA** quando usado como texto/ícone sobre fundo claro (~2.9:1) ou como fundo de botão com texto branco (~3.2:1) — mínimo exigido é 4.5:1 para texto normal. Nesses dois casos, usar a variante escurecida **`#C81F66`** (`--du-pink-ink` em `tokens/colors.css`), que passa em ~5:1. O rosa vívido original continua correto para: superfícies grandes/decorativas, glows, ícones sobre fundo escuro, e texto grande (títulos ≥ 24px ou ≥ 18.6px em negrito).

---

## Tipografia

- **Família:** Bricolage Grotesque (via @font-face)
- **Display / H1:** ExtraBold 800, 36pt, letter-spacing negativo
- **H2 / H3:** Bold 700, 24pt
- **Corpo:** Regular 400, 24pt
- **Escala fluida completa (clamp mobile→desktop) e demais pesos/tamanhos (lead, small, eyebrow, line-heights, letter-spacing):** ver `tokens/typography.css` — não duplicado aqui pra evitar mais uma fonte divergente.

---

## Espaçamento

- **Escala base:** 4px (`--sp-1: 4px` até `--sp-10: 128px`)
- **Container:** largura máxima 1200px
- **Gutter lateral:** fluido, `clamp(20px, 5vw, 48px)`
- **Ritmo entre seções:** fluido, `clamp(72px, 9vw, 140px)`
- **Border-radius:** de 8px (sm) a 28px (xl), mais pill (999px) para botões/badges — generoso, nunca quadrado
- Valores exatos e tokens de sombra: `tokens/spacing.css`

---

## Motion

- **Easing assinatura:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expressivo) — usar como padrão em reveals e transições
- **Easing "back" (bounce leve):** `cubic-bezier(0.34, 1.56, 0.64, 1)` — usado em hovers de ícone/card, não em page-level
- **Durações:** 180ms (fast/hover) · 300ms (base) · 400ms (slow) · 760ms (reveal de entrada)
- **Sempre** respeitar `prefers-reduced-motion: reduce` — remover/zerar entrada, stagger e loops de flutuação
- Ver `tokens/motion.css` e a seção de Animação em `projeto/claude.md` (hierarquia CSS → View Transitions → GSAP/Motion)

---

## Estilo geral

Visual ousado mas limpo. Contraste alto entre fundo escuro e acentos vibrantes (rosa, amarelo, verde água). Não é minimalista neutro — tem personalidade. Fora do óbvio visualmente, assim como no texto.

---

## Elementos-chave

- Bordas: usar com moderação, preferencialmente em verde água
- Border-radius dos cards: generoso (suave, não quadrado)
- Botões: rosa como padrão de CTA — usar `#C81F66` (`--du-pink-ink`) como fundo do botão preenchido com texto branco (o `#FD4B90` puro falha contraste aí); `#FD4B90` continua ok em botão ghost/outline (texto colorido, sem fundo preenchido)
- Sombras: leves ou nenhuma — o contraste de cor já separa os elementos

---

## O que NUNCA fazer

- Usar gradiente genérico de agência (azul → roxo)
- Fontes serifadas no digital
- Cores pastéis neutras sem intenção
- Rosa como decoração — só como CTA ou destaque com propósito

---

## Logo

- **Arquivo:** ainda não definido
- **Quando tiver:** salvar em `identidade/logo.png` ou `identidade/logo.svg`
- **Onde usar:** slide final de carrossel (CTA), header de propostas, slides de apresentação
- **Tamanho sugerido:** largura entre 120–200px nos HTMLs

---

## Observações adicionais

Site da duPolvo já desenvolvido (`projeto/duPolvoNovo/duPolvo/`) — serve como referência visual primária, e seu CSS consome diretamente os tokens em `projeto/duPolvoNovo/tokens/`. Consultar antes de criar qualquer peça nova. Qualquer projeto novo que herde a identidade da duPolvo (não a de um cliente com marca própria) deve importar/replicar esses tokens em vez de redigitar valores — é a causa mais comum de deriva visual entre projetos.
