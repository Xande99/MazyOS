# Lições técnicas

Registro curto de decisões técnicas que vale lembrar entre sessões — não é changelog, é o "porquê" que não está óbvio só lendo o código.

## 2026-07-20 — Design system white-label (tokens semânticos)

Adotado o contrato de design tokens em [`_memoria/tokens-contract.md`](tokens-contract.md): componentes/seções da biblioteca (`templates/starter-tipo-a/src/sections/`) referenciam só tokens semânticos (`--color-brand`, `--color-surface`, `--space-section-y`...), nunca hex/px soltos nem primitivo da escala direto. Trocar a marca de um cliente passa a significar editar um `theme.css` só.

Peças: `templates/tailwind-preset-dupolvo/theme.base.css` (template em branco pro `/novo-projeto` preencher por cliente), `dupolvo-theme.css` retrofitado com a camada semântica (marca da própria duPolvo também cumpre o contrato), as 5 seções refatoradas, `motion.ts` com presets GSAP nomeados lendo os tokens de motion, e `stylelint` (`npm run lint:css`, só no starter-tipo-a por enquanto) barrando valor bruto fora de `theme*.css`.

Achado real na validação (dois `theme.css` fake radicalmente diferentes, via Playwright): cards com `bg-surface` (mesmo token do fundo da página) ficavam sem contraste em tema escuro, porque `shadow-sm` preto não separa preto de preto. Corrigido usando `bg-surface-alt` nos cards — elevação por cor, não só por sombra. Vale lembrar em qualquer seção nova que empilhe um cartão sobre o fundo padrão da página.

Pendente (não é bug, é decisão adiada): `stylelint` só está configurado no `starter-tipo-a`; `starter-tipo-b` (Next.js) ainda não tem o lint de tokens equivalente.
