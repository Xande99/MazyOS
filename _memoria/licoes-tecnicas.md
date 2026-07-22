# Lições técnicas

Registro curto de decisões técnicas que vale lembrar entre sessões — não é changelog, é o "porquê" que não está óbvio só lendo o código.

## 2026-07-20 — Design system white-label (tokens semânticos)

Adotado o contrato de design tokens em [`_memoria/tokens-contract.md`](tokens-contract.md): componentes/seções da biblioteca (`templates/starter-tipo-a/src/sections/`) referenciam só tokens semânticos (`--color-brand`, `--color-surface`, `--space-section-y`...), nunca hex/px soltos nem primitivo da escala direto. Trocar a marca de um cliente passa a significar editar um `theme.css` só.

Peças: `templates/tailwind-preset-dupolvo/theme.base.css` (template em branco pro `/novo-projeto` preencher por cliente), `dupolvo-theme.css` retrofitado com a camada semântica (marca da própria duPolvo também cumpre o contrato), as 5 seções refatoradas, `motion.ts` com presets GSAP nomeados lendo os tokens de motion, e `stylelint` (`npm run lint:css`, só no starter-tipo-a por enquanto) barrando valor bruto fora de `theme*.css`.

Achado real na validação (dois `theme.css` fake radicalmente diferentes, via Playwright): cards com `bg-surface` (mesmo token do fundo da página) ficavam sem contraste em tema escuro, porque `shadow-sm` preto não separa preto de preto. Corrigido usando `bg-surface-alt` nos cards — elevação por cor, não só por sombra. Vale lembrar em qualquer seção nova que empilhe um cartão sobre o fundo padrão da página.

## 2026-07-20 — Enforcement de tokens estendido ao starter-tipo-b

`stylelint` + `stylelint-declaration-strict-value` também configurado no `starter-tipo-b` (Next.js), mesmas regras do Tipo A, plugado em `npm run qa` (`typecheck && lint && lint:css && build`). Testado com arquivo de sanidade (hex, `rgb()`, `Comic Sans`) — pegou os 3 erros, removido depois. Lint no que já existe (`app/globals.css`) passou limpo, sem violação.

**Cobertura conhecida:** hoje o starter-tipo-b não usa CSS Modules nem `styled-jsx` — só Tailwind utilities em `className` e os 2 `.css` reais (`globals.css`, `dupolvo-theme.css`). O glob `**/*.css` já cobriria `.module.css` se algum aparecer, mas `styled-jsx` (`<style jsx>` dentro de `.tsx`) não é coberto — exigiria um parser dedicado, não instalado por falta de uso atual que justifique. Registrar isso se `styled-jsx` for adotado depois.

Achado à parte, não resolvido nesta entrada: `npm audit` no starter-tipo-b acusa 2 vulnerabilidades moderadas no `postcss` interno do próprio `next` (não introduzidas pelo stylelint) — a única correção automática (`npm audit fix --force`) faz downgrade de Next pra `9.3.3`, inaceitável. Decisão de como tratar isso fica pendente.

## 2026-07-20 — Nem toda fonte tem pacote `-variable` no Fontsource

Fontsource não garante versão variável pra toda fonte do Google Fonts — depende de a fonte de origem ter eixo variável publicado. Ex: Bebas Neue só tem um peso (400) e `npm view @fontsource-variable/bebas-neue` retorna 404 — só existe `@fontsource/bebas-neue` (estático). Já Space Grotesk tem eixo de peso completo e `@fontsource-variable/space-grotesk` existe normalmente.

Regra pra qualquer automação de instalação de fonte (não é específico de nicho): sempre rodar `npm view @fontsource-variable/<fonte>` antes de assumir que o pacote variável existe. Se não existir, cair pro `@fontsource/<fonte>` estático, instalando só os arquivos de peso efetivamente usados no projeto (cada peso é uma entrada separada no pacote) — nunca a família completa, pra não comprometer o Lighthouse Performance.

Validado durante a implementação de tipografia por nicho do `/novo-projeto` ([[tokens-contract]], ver `CLAUDE.md` seção "Regras do sistema"): barbearia/Bebas Neue expôs o caso sem variável, nutri-suplement/Space Grotesk confirmou o caminho variável funcionando normalmente. Os dois builds passaram com Lighthouse Performance ≥90.

## 2026-07-21 — duPolvo Vault: repositório de componentes/animação (GSAP + tokens de marca)

Novo recurso permanente: `C:\Users\Xande\Desktop\duPolvo-vault` (também publicado em `github.com/Xande99/dupolvo-vault`) — repositório de componentes/seções/técnicas de animação prontas, organizado por categoria (`text-effects`, `transitions`, `heros`, `menus`, `cards`, `backgrounds`, `buttons`, `sections`). Cada componente tem `demo.html` isolado (abre direto no navegador, sem build) e `NOTES.md` com origem, como customizar, e pegadinhas. `index.html` na raiz é um hub visual gerado por `tools/build-index.mjs`.

Registrado como pasta vinculada na tabela "Pastas vinculadas" do `CLAUDE.md` raiz e como etapa de consulta na seção ANIMAÇÃO do `projeto/CLAUDE.md` — antes de implementar qualquer seção com animação (hero, menu, transição, card, background, efeito de texto), checar se já existe componente pronto na categoria correspondente do Vault, como mais uma fonte de referência junto com a síntese de nicho do Cérebro. Motivo: reduz reinvenção de animação já validada e mantém consistência de qualidade (nível Awwwards) entre projetos de clientes diferentes, alinhado ao objetivo permanente de front-end registrado em [[preferencias]].
