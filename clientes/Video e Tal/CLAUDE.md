# Video e Tal

> Projeto criado em 2026-07-24. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Portfólio digital para o Video e Tal (produtor audiovisual), reunindo projetos já feitos e
marcas com as quais já trabalhou.

## Tipo

Cliente novo

## Entregas previstas

- Site (portfólio institucional)

## Tipo técnico do desenvolvimento

Ver `briefing.md` (Tipo e Deploy). Stack completa e regras técnicas em `projeto/CLAUDE.md`.

## Onde salvar o que

- Briefings, identidade e contexto: nessa pasta na raiz (`identidade/` tem logo e referências)
- Entregas: dentro de `projeto/Video e Tal/`

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz e contexto do negócio definidos em `_memoria/`
da raiz. Identidade visual é própria do cliente (ver `briefing.md` e `identidade/`) — não usa
`identidade/design-guide.md` da duPolvo nem `dupolvo-theme.css`.

## Específico desse projeto

- `src/sections/GaleriaProjetos.astro` e `src/sections/LogoWall.astro` (em `projeto/Video e Tal/`) — seções específicas deste portfólio, fora da biblioteca cross-nicho. Hierarquia de página: GaleriaProjetos (prova primária — o trabalho em si) vem antes de LogoWall (prova secundária — reconhecimento de marca). Ver `src/sections/README.md` do projeto.
- **Vídeos brutos do cliente** ficam em `clientes/Video e Tal/materiais-brutos/` (não versionado — ver `.gitignore` raiz). Os clipes de preview (7s, mudo, comprimido) e os posters já processados estão em `projeto/Video e Tal/public/videos/` e `public/images/projetos/`, usados no `styleguide.astro` como demo dos 7 projetos identificados:
  - **Todos os 7 confirmados pelo cliente (2026-07-24):** ACIAL (cliente ACIAL — Associação Comercial local, Institucional), Reel Havan (cliente Havan, Comercial), Site Certho (cliente Certho — Centro de Hematologia e Oncologia, Institucional), Unha Milena Shine (cliente Milena Shine, Comercial), Cripto Sangue (projeto pessoal, RPG), Curta Laranja (projeto pessoal, Curta-metragem), Figurinhas da Copa (projeto pessoal, Documentário).
- **3 arquivos brutos não usados** (`20240706_163405.mp4`, `IMG_0968.MOV`, `IMG_0973.MOV`) — o próprio cliente confirmou que são só testes curtos de qualidade de câmera/drone, não projetos reais. Ficam arquivados em `materiais-brutos/` sem entrar na galeria.
- Logos das marcas na LogoWall ainda são placeholder — falta pedir pro cliente os logos reais de Havan/Certho (e de qualquer outra marca que ele queira destacar) antes do lançamento.
