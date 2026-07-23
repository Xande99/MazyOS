# Briefing — Portfolio

**Tipo:** A — Astro
**Deploy:** Netlify ou Cloudflare Pages

## Sobre
Guardar todos os trabalhos (sites, LPs) já feitos em um só lugar, pra consulta própria e principalmente pra mostrar pra clientes em potencial o que já foi entregue.

## Entregas previstas
- Site (vitrine de projetos/LPs entregues)

## Ativação automática
- Skills de animação: GSAP + ScrollTrigger (View Transitions já ativado no Layout via `ClientRouter`)
- MCPs em uso: Context7, Playwright
- Checklist Supabase: não aplicável (Tipo A)

## Identidade visual
Identidade própria (não herda a linha da duPolvo).

**Paleta** (definida no briefing, aplicada em `theme.css`):
```css
--brand: #5500FF        → --color-brand-600 (oklch 0.489 0.296 280)
--brand-muted: #ede8ff  → --color-brand-50 (oklch 0.97 0.03 280) — fundo dos pills de skill
--dark: #141414         → --color-neutral-900 (oklch 0.1912 0 0) — fundo de seções escuras
--gray-dark: #525252    → --color-neutral-600 (oklch 0.438 0 0) — texto secundário
--gray-mid: #a3a3a3     → --color-neutral-400 (oklch 0.7156 0 0)
--gray-light: #f5f5f5   → --color-neutral-100 (oklch 0.970 0 0)
--white / --black       → oklch(1 0 0) / oklch(0 0 0) — texto principal, invertendo por seção
```

**Tipografia:** Fira Sans (única família, display e body) — sem pacote variável no Fontsource, instalado `@fontsource/fira-sans@5.3.0` (pesos 400/500/700).

**Assets** (copiados de `projeto/img/` para `projeto/Portfolio/src/assets/img/`): `Marca.svg`, `marca_plumbob.svg`, `Perfil.png`, `perfil.svg`, `Cursos.svg`, `Idioma.svg`, `Detalhe.svg`, `cruz.svg`, `Rectangle 6/7/8/18.svg`.

**Padrão visual a manter:**
- Alternância fundo claro (Hero) / fundo escuro (Experiência, Formação, Contato)
- Big type de fundo: palavras-chave grandes, bold, uppercase, translúcidas, como elemento gráfico
- Glow/blur em `--color-brand` atrás de elementos de destaque
- Cards com borda esquerda em `--color-brand`, fundo escuro translúcido
- Pills de skill: fundo `--color-brand-50`, texto `--color-brand`
- Carrossel: setas circulares + dots, item ativo = barra alongada em `--color-brand`
- Minimalista, bastante whitespace, hierarquia por tamanho de fonte

**Referências de acabamento** (nível, não layout literal): russellnumo.nl, marimba.design, nainibansal.com

**Hero — pedido específico:** vídeo de fundo full-screen (cinemático, escuro), via `<video autoplay loop muted playsinline>`, fonte: Cloudinary (`https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4`). Avaliar peso/performance do vídeo externo antes de entregar (Core Web Vitals, LCP) — self-host ou compressão adicional se necessário.

## Nicho de mercado (Cérebro)
Não se aplica — portfólio pessoal, fora da taxonomia de nichos de cliente do Cérebro.

## Pendências
- Domínio ainda não definido (`astro.config.mjs` está com placeholder `https://portfolio.exemplo.com.br`)
- `curriculo_digital/` (HTML/CSS/JS vanilla, mesma paleta) é um projeto separado — não migrado nem relacionado a este.
- QA rodado em 2026-07-23 (Task 6, montagem final): Performance 100 (desktop) / 99 (mobile), Accessibility 100, Best Practices 96, SEO 100 — vídeo do Hero sem impacto no LCP, elemento de LCP é o `<h1>` (confirmado via `lcp-breakdown-insight` do Lighthouse). Ressalva: neste ambiente de desenvolvimento o vídeo do Cloudinary retorna 401 (bloqueio de rede do sandbox, mesmo achado da Task 2) — a medição reflete o cenário de fallback, não o vídeo carregando de verdade; vale re-medir após deploy real. Best Practices 96 tem 1 audit reprovado (`errors-in-console`) só por causa desse mesmo 401 — não é falha de código, e 96 já está acima do threshold (≥95).

## Decisões
- 2026-07-23: `astro` atualizado de `7.0.9` para `7.1.3` (patch de segurança, corrige XSS refletido via View Transitions) mesmo com a release tendo pouco mais de 68h — risco aceito conscientemente por ser patch oficial do próprio time do Astro (não é dependência nova/desconhecida) e por o bug afetar exatamente o recurso (View Transitions) que este projeto usa. `npm audit`: 0 vulnerabilidades depois da atualização.
