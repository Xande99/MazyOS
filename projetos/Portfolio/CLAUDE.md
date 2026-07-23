# Portfolio

> Projeto criado em 2026-07-23. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Vitrine pessoal de projetos (sites, LPs) já entregues — pra consulta própria e pra mostrar pra clientes em potencial o que já foi feito, tudo em um só lugar.

## Tipo

Iniciativa pessoal / projeto interno da agência (vitrine de trabalho)

## Entregas previstas

- Site (vitrine de projetos/LPs)

## Tipo técnico do desenvolvimento

Ver `briefing.md` (Tipo e Deploy). Stack completa e regras técnicas em `projeto/CLAUDE.md`.

## Onde salvar o que

- Briefing e contexto: nessa pasta na raiz
- Código do site: `projeto/Portfolio/` (já nasceu do starter Tipo A, build confirmado)

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui — exceto a identidade visual PRÓPRIA deste projeto (não herda a linha da duPolvo), documentada no `briefing.md`.

## Específico desse projeto

- Identidade visual própria (paleta roxo `#5500FF` + Fira Sans) — nunca aplicar `identidade/design-guide.md` da duPolvo aqui.
- Pills/badges de skill: exceção documentada ao contrato de tokens — usam `--color-brand-50` (primitivo) direto como fundo, por não haver semântico dedicado a "fundo de badge" em `_memoria/tokens-contract.md`. Texto do pill em `--color-brand`.
- Hero pede vídeo de fundo full-screen hospedado no Cloudinary (ver `briefing.md`) — validar performance/Core Web Vitals antes de considerar a seção pronta; se pesar demais no LCP, considerar self-host ou poster fallback.
