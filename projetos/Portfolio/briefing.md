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

**Hero — pedido específico (atualizado 2026-07-23, Task 7):** o vídeo de fundo full-screen original (Cloudinary de terceiro) foi substituído por um shader WebGL (Three.js) renderizado localmente — ver "Pendências" e `.claude/decisions.md` do projeto pro raciocínio completo.

## Nicho de mercado (Cérebro)
Não se aplica — portfólio pessoal, fora da taxonomia de nichos de cliente do Cérebro.

## Pendências
- Domínio ainda não definido (`astro.config.mjs` está com placeholder `https://portfolio.exemplo.com.br`)
- `curriculo_digital/` (HTML/CSS/JS vanilla, mesma paleta) é um projeto separado — não migrado nem relacionado a este.
- ~~Vídeo do Hero é hotlinked de um Cloudinary de terceiro (risco de confiabilidade/licenciamento)~~ — **resolvida em 2026-07-23 (Task 7)**: vídeo substituído por shader WebGL (Three.js) renderizado localmente, sem dependência de rede/conta de terceiro. Ver `.claude/decisions.md` do projeto pro raciocínio completo.
- QA re-medido em 2026-07-23 (Task 7, shader no lugar do vídeo, `npm run build && npm run preview` + `npx lighthouse`): Performance 100 (desktop) / 97 (mobile), Accessibility 100/100, Best Practices 100/100, SEO 100/100. Todos acima do threshold (Performance ≥90, Accessibility=100, Best Practices≥95, SEO≥95). Mobile caiu pra 83 na primeira medição com o shader ativo em qualquer largura (bundle do Three.js ~500KB bloqueando a main thread sob CPU throttling — bootup-time 1.6s, TBT 400ms); mitigação aplicada: shader desabilitado abaixo do breakpoint `md` (767px) via `import()` dinâmico (chunk nem é baixado nesse caso), caindo no mesmo fallback estático do `prefers-reduced-motion`. Pós-mitigação: bootup-time 0.5s, TBT 140ms, Performance mobile 97. `mcp-accessibility-scanner` (`scan_page`, tags WCAG 2.2 AA): 0 violações — as 2 únicas ocorrências vistas com o conjunto de tags AAA (`color-contrast-enhanced`) são pré-existentes, em elementos decorativos fora do Hero (watermarks "Projetos"/"Contato"), já documentadas e aceitas no nível AA na Task 6.

## Decisões
- 2026-07-23: `astro` atualizado de `7.0.9` para `7.1.3` (patch de segurança, corrige XSS refletido via View Transitions) mesmo com a release tendo pouco mais de 68h — risco aceito conscientemente por ser patch oficial do próprio time do Astro (não é dependência nova/desconhecida) e por o bug afetar exatamente o recurso (View Transitions) que este projeto usa. `npm audit`: 0 vulnerabilidades depois da atualização.
