---
name: qa-visual-pre-entrega
description: >
  Checklist de qualidade visual/técnica antes de qualquer entrega de LP, site ou
  sistema — contraste WCAG, Lighthouse (performance/acessibilidade/SEO), landmarks
  semânticos e conformidade com os tokens de marca. Use quando o usuário disser
  "posso entregar isso?", "checklist antes de publicar", "QA visual", "isso tá
  pronto pra ir pro ar?", "/qa-visual-pre-entrega", ou antes de avisar um cliente
  que um projeto está pronto.
user-invocable: true
---

# QA visual pré-entrega

Existe porque a auditoria de front-end de 2026-07-09 encontrou, em produção,
coisas que uma checagem de 5 minutos já teria pego: um par de cores da própria
marca falhando contraste WCAG AA, `<main>` ausente em duas LPs, e Core Web
Vitals que `projeto/claude.md` manda medir mas nenhum projeto media de fato.
Este checklist só serve se rodar **antes** de avisar o cliente que está pronto,
não depois.

## Workflow

### 0. Segurança — bloqueante, roda antes de qualquer outro item

Achados da auditoria de segurança do MazyOS (2026-07-20): nenhum projeto
tinha header de segurança configurado, e o único achado 🟠 Alto foi CDN de
terceiro sem self-host em produção. Esses dois viraram gate obrigatório —
não são "nice to have" no meio de uma lista de itens manuais.

- [ ] **Headers de segurança presentes na resposta real** (não só no código):
      `curl -I <url>` — confirmar `X-Content-Type-Options`, `X-Frame-Options`,
      `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
      Ausente = não é "pronto pra entregar", nem com justificativa — corrigir
      antes (herdado do starter desde a Fase 5 da auditoria; se faltar, o
      projeto não nasceu do starter ou o header foi removido em algum ponto,
      investigar o porquê).
- [ ] **`npm run deps:audit`** sem vulnerabilidade alta/crítica sem justificativa
      registrada — mesmo critério do `/deps-review`.
- [ ] **Nenhum script de terceiro carregado via CDN sem `integrity`/self-host**
      — grep rápido por `<script src="https://` no HTML final; se achar,
      resolver como foi feito pro `duPolvoNovo` (vendorizar via `npm pack`),
      não só adicionar `integrity` (mitiga só parte do risco).
- [ ] **Nenhum segredo no bundle client** — grep básico por padrões óbvios
      (`SERVICE_ROLE`, `sk_live`, chave de 40+ caracteres) no output do build
      voltado pro client (`dist/`/`.next/static/`), não no server-side.

### 1. Automatizado — rodar sempre que houver uma URL (local ou publicada)

**a) Lighthouse** (performance, acessibilidade, boas práticas, SEO):

```bash
npx --yes lighthouse <url> --output=html --output-path=./lighthouse-report.html --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Ler o score de cada categoria. A categoria **Accessibility** do Lighthouse já
roda regras do axe-core — cobre boa parte de contraste, `alt` ausente, ordem de
heading e uso de landmark, então não precisa reimplementar isso. Pra entender
uma falha específica que o relatório apontar (o que ela significa, como
corrigir), ver `.claude/skills/accessibility/` (WCAG 2.2 com padrão de código
pronto) e `.claude/skills/core-web-vitals/` (LCP/INP/CLS) — este checklist só
roda o Lighthouse e cobra o número, não repete esse conteúdo.

No Windows, é comum o comando terminar com um erro `EPERM` ao tentar apagar a
pasta temporária do Chrome depois de gerar o relatório — é cosmético, o
`lighthouse-report.html`/`.json` já foi escrito antes desse erro acontecer.
Ignorar e ler o relatório normalmente.

Critério de aceite (thresholds do README do `web-quality-skills`, os mesmos
usados em `projeto/claude.md`):
- Performance ≥ 90
- Accessibility = 100 — abaixo disso, ler os itens específicos que o relatório aponta e corrigir, não só anotar o número
- Best Practices ≥ 95
- SEO ≥ 95

**b) Conformidade com os tokens de marca** (o que o Lighthouse NÃO cobre —
ele audita contraste, não se a cor É a da marca):

```bash
cd .claude/skills/qa-visual-pre-entrega
npm install   # só na primeira vez
node scripts/check-tokens.js <url>
```

Varre toda cor efetivamente renderizada na página (`color`/`background-color`/
`border-color` computados) e lista qualquer uma que não bate com a paleta
aprovada em `projeto/duPolvoNovo/tokens/colors.css`. Se o projeto é de um
cliente com identidade própria (não herdando a linha da duPolvo), rodar com
`--tokens=caminho/do/css-de-marca-do-cliente.css` em vez do default.

Qualquer resultado fora da paleta precisa de uma decisão explícita: ou é um
hex esquecido que devia ser um token (corrigir), ou é intencional (documentar
por quê — normalmente porque é a cor de um cliente específico).

**c) Lint de tokens em tempo de build** (projetos Tipo A/B nascidos do starter,
com design system aplicado — ver `_memoria/tokens-contract.md`):

```bash
cd projeto/<Nome>
npm run qa   # já roda check + lint:css (stylelint) + build
```

`lint:css` barra hex/rgb/hsl/oklch literal e `font-family` solta em qualquer
CSS/`<style>` de `.astro` fora de `theme*.css` (config em `.stylelintrc.json`
do starter). Complementa o `check-tokens.js` do item (b): este aqui pega no
código-fonte antes do build, aquele audita a cor computada depois de
renderizado — os dois cobrem ângulos diferentes, rodar os dois.

### 2. Manual — o que os automatizados acima não pegam

- [ ] **Responsividade real**: testar em mobile, tablet e desktop de verdade
      (DevTools device toolbar ou dispositivo físico), não só redimensionar a
      janela do desktop
- [ ] **`prefers-reduced-motion` testado de verdade**: DevTools → Rendering →
      Emulate CSS media feature → `prefers-reduced-motion: reduce` — confirmar
      que toda animação para/reduz, não só assumir que o CSS/JS trata isso
- [ ] **Semântica além do que o Lighthouse pega**: confirmar 1 único `<h1>`
      por página, `<main>` presente, `<nav>` com `aria-label` quando há mais de
      uma navegação na página
- [ ] **Copy revisada**: sem placeholder (`Lorem`, `[preencher]`, número
      inventado) sobrando — ver o comentário sobre isso em
      `projeto/duPolvoNovo/sections/stats.html`
- [ ] **Links e CTAs reais**: WhatsApp/telefone/e-mail testados de verdade,
      não `href="#"` esquecido
- [ ] **Se o projeto herda a linha da duPolvo**: identidade realmente vem dos
      tokens (`projeto/duPolvoNovo/tokens/`), não redigitada à mão — é a causa
      mais comum de deriva encontrada na auditoria de 2026-07-09

### 3. Veredito

Só responder "pronto pra entregar" se:
- Lighthouse dentro dos critérios de aceite acima, **ou** com justificativa
  clara registrada (ex.: imagem pesada que o cliente exigiu manter)
- `check-tokens.js` limpo, ou toda cor fora da paleta explicada
- Todo item manual marcado

Se algo não passar, listar exatamente o que falta — não arredondar pra "tá
quase bom" quando não está.

## Referências

Este checklist roda o Lighthouse e cobra o número — pra entender o *porquê*
de uma falha específica e como corrigi-la em profundidade, ver:

- [`web-quality-audit`](../web-quality-audit/SKILL.md) — os 150+ checks completos por trás dos 4 scores do Lighthouse (performance/acessibilidade/SEO/boas práticas)
- [`accessibility`](../accessibility/SKILL.md) — WCAG 2.2 com padrão de código pronto (contraste, foco, ARIA, target size)
- [`core-web-vitals`](../core-web-vitals/SKILL.md) — LCP/INP/CLS em detalhe, com Speculation Rules API e View Transitions
