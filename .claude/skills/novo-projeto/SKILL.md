---
name: novo-projeto
description: >
  Cria uma pasta de projeto nova com `CLAUDE.md` dedicado, depois de uma entrevista curta sobre
  o projeto (cliente, objetivo, entregas previstas). Use quando o usuário disser "novo projeto",
  "novo cliente", "/novo-projeto", "começar projeto pra X" ou pedir pra estruturar um trabalho novo.
---

# /novo-projeto — Pasta de projeto novo com contexto dedicado

Quando o usuário começa um projeto novo (cliente, iniciativa, produto), cria uma pasta com `CLAUDE.md` próprio que herda contexto da raiz e adiciona o que é específico do projeto.

## Workflow

### Passo 1 — Entrevista (4 perguntas)

1. "Qual o nome do projeto ou cliente?"
2. "É um cliente novo, projeto interno ou iniciativa pessoal?"
3. "Qual o objetivo principal? (uma frase)"
4. "Que tipo de entrega vai ter? (ex: ads, site, conteúdo, automação, proposta — pode ser mais de uma)"

### Passo 1.1 — Tipo técnico do projeto (só se a resposta 4 mencionar site, sistema, painel, app ou similar)

Se a resposta 4 incluir desenvolvimento de site/sistema, perguntar antes de seguir:

> "Esse projeto de desenvolvimento é **Tipo A** (landing page, site
> institucional, site de conteúdo) ou **Tipo B** (sistema, SaaS, dashboard,
> área logada com login)?"

Se o usuário não souber classificar: "Vai ter login e banco de dados guardando
informação de usuário, ou é só um site pra mostrar o negócio e captar
contato?" — segunda opção é Tipo A, primeira é Tipo B.

Definir stack e deploy conforme a resposta (regras completas em `projeto/CLAUDE.md`, não repetir aqui):

- **Tipo A** → stack: Astro + Tailwind + TypeScript + GSAP · deploy: Netlify ou Cloudflare Pages
- **Tipo B** → stack: Next.js + TypeScript + Tailwind + Supabase/Postgres + Motion · deploy: Vercel

**Ativação automática (Tipo A ou B) — não pedir nem lembrar, só acontece:**

- Skills de animação relevantes (mapa completo em `CLAUDE.md` raiz): `gsap-scrolltrigger` e complementares pra Tipo A, `motion-framer` e complementares pra Tipo B
- Context7 MCP antes de escrever qualquer código com GSAP, Motion, Next.js ou Tailwind
- Playwright MCP pra verificar cada seção visual antes de considerá-la concluída
- Padrão de qualidade nível referência (Awwwards/godly.website), conforme `_memoria/preferencias.md`
- `identidade/design-guide.md` + tokens de `projeto/duPolvoNovo/tokens/*.css` como base de design — não se aplica se o Passo 1.2 confirmar identidade própria do cliente

**Se Tipo B:** consultar `_memoria/checklist-novo-projeto-supabase.md` agora, nesta entrevista — não só avisar o usuário depois. Aplicar o que der pra resolver sem input manual e listar no briefing só o que realmente depende dele (chaves de API, projeto criado no dashboard do Supabase, etc.).

Se a entrega não envolve site/sistema (só ads, conteúdo, proposta, etc.), pular esse passo — nem toda entrega é desenvolvimento.

### Passo 1.2 — Identidade visual (se a entrega envolve site, LP, redes sociais, branding ou qualquer peça visual)

Perguntar:

> "Esse cliente já tem identidade visual (cores, tipografia, referências) ou é pra criar em cima da linha visual da duPolvo?"

- **Se já tem:** pedir ali mesmo os essenciais — cores principais (hex se souber), fontes, 1-2 referências ou prints. Vai pro `briefing.md`, seção "Identidade visual" (template no Passo 3).
- **Se não tem / é pra herdar da duPolvo:** registrar "Identidade: herda a linha visual da duPolvo" no briefing. O projeto deve consumir `identidade/design-guide.md` + os tokens em `projeto/duPolvoNovo/tokens/` — nunca redigitar valores de cor/tipografia à mão num CSS novo. Essa cópia manual foi a causa da maior parte das inconsistências visuais encontradas na auditoria de front-end de 2026-07-09 (tokens divergindo entre projetos, bug de contraste replicado em 2 lugares).

Não pular esse passo achando que "herda automaticamente" é suficiente — sem essa pergunta feita explicitamente, a captura de identidade acaba não acontecendo (foi o que aconteceu com o Ribas Suplementos: nasceu sem nenhuma cor de marca).

### Passo 1.3 — Nicho de mercado (Cérebro) — obrigatório quando a entrega envolve site, LP, redes sociais, branding ou qualquer peça visual

Mesma condição de gatilho do Passo 1.2. Essa etapa não é opcional: sem ela, a fase de design começa sem a pesquisa de mercado que já está catalogada no Cérebro, e isso é desperdício de trabalho já feito.

Perguntar:

> "Qual desses nichos de mercado se aplica a esse cliente? automotivo, barbearia, empresa, fitness-gym, food-delivery, imoveis, infoprodutos, juridico-contabil, nutri-suplement, odonto, pet-veterinario, psicologia, saude-estetica — ou nenhum deles."

A lista precisa sempre refletir a taxonomia oficial documentada na seção "Estrutura de `cerebro/raw/nichos/`" do `CLAUDE.md` raiz — se essa lista mudar lá, muda aqui também, não manter uma cópia desatualizada.

**Se o cliente se encaixa em um nicho da lista:**

1. Ler todas as notas em `C:\Users\Xande\Desktop\cerebro\raw\nichos\<nicho>\` que tenham `status: done` no frontmatter — ignorar notas `raw` (não processadas), `revisar` (sem conteúdo suficiente) e `duplicado` (redundantes), só o que já foi validado entra no resumo
2. De cada nota, extrair só as seções `## Insights para o nicho` e `## Processar para` (ignorar `## O que observar`, que é detalhe visual da peça individual, não o que importa pra esse resumo)
3. Condensar num resumo único — agrupar por padrão recorrente quando várias notas apontarem pra mesma coisa (ex: "3 referências confirmam que X é padrão robusto pro nicho") em vez de listar nota por nota sem síntese
4. Apresentar esse resumo pro usuário como contexto de referência antes de seguir pro Passo 2 — é matéria-prima pra decisão de design, não só um FYI

Se não houver nenhuma nota `status: done` nesse nicho ainda (pasta vazia ou só com `raw`/`revisar`), avisar isso explicitamente em vez de simular um resumo: "Ainda não há pesquisa processada pra esse nicho em `cerebro/raw/nichos/`. Seguindo sem essa referência."

**Se o cliente não se encaixa em nenhum dos nichos catalogados:** não travar o fluxo — registrar no briefing "Nicho de mercado: fora da taxonomia atual do Cérebro" e seguir.

O resumo gerado aqui vai pro `briefing.md` na seção "Nicho de mercado" (template no Passo 3).

### Passo 2 — Decidir local

Baseado na resposta 2:

- **Cliente novo:** criar em `clientes/<Nome>/` (ou na pasta equivalente do perfil — ler `CLAUDE.md` da raiz pra confirmar a convenção)
- **Projeto interno:** criar em `projetos/<nome>/` (criar `projetos/` se não existir)
- **Iniciativa pessoal:** perguntar onde o usuário prefere

### Passo 3 — Estrutura básica

Criar a pasta com:

- `CLAUDE.md` do projeto (instruções herdadas + específicas)
- `briefing.md` (com o que foi coletado na entrevista — template abaixo)
- Subpastas conforme as entregas mencionadas (ex: se mencionou "ads e conteúdo", criar `ads/` e `conteudo/`)

Template do `briefing.md` — se o Passo 1.1 rodou, as duas primeiras linhas
(**Tipo** e **Deploy**) vão no topo, antes de qualquer outra coisa, porque é
o primeiro arquivo que a sessão do Claude Code em `projeto/` lê:

```markdown
# Briefing — [Nome do projeto]

**Tipo:** [A — Astro | B — Next.js + Supabase]
**Deploy:** [Netlify/Cloudflare Pages | Vercel + Supabase]

*(Omitir as duas linhas acima se o Passo 1.1 não rodou — nem todo projeto é desenvolvimento.)*

## Sobre
[Objetivo da resposta 3]

## Entregas previstas
- [entrega 1 da resposta 4]
- [entrega 2 da resposta 4]
- ...

## Ativação automática
*(Preencher só se o Passo 1.1 rodou.)*
- Skills de animação: [lista conforme Tipo A/B]
- MCPs em uso: Context7, Playwright
- Checklist Supabase: [aplicável — pendências: ... | não aplicável, Tipo A]

## Identidade visual
[Preencher só se o Passo 1.2 rodou.
Se o cliente já tem marca: cores principais (hex se souber), fontes, referências/prints.
Se não tem: "Herda a linha visual da duPolvo — ver identidade/design-guide.md e projeto/duPolvoNovo/tokens/."]

## Nicho de mercado (Cérebro)
[Preencher só se o Passo 1.3 rodou.
Se um nicho foi identificado: nome do nicho + o resumo condensado de "Insights para o nicho" e "Processar para" gerado no Passo 1.3.
Se não houver nota status: done nesse nicho ainda: "Nicho: [nome] — sem pesquisa processada em cerebro/raw/nichos/ ainda."
Se o cliente não se encaixa em nenhum nicho catalogado: "Nicho de mercado: fora da taxonomia atual do Cérebro."]
```

### Passo 4 — Conteúdo do `CLAUDE.md` do projeto

Template:

```markdown
# [Nome do projeto]

> Projeto criado em [data]. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

[Objetivo da resposta 3]

## Tipo

[Cliente novo / Projeto interno / Iniciativa pessoal]

## Entregas previstas

- [entrega 1 da resposta 4]
- [entrega 2 da resposta 4]
- ...

## Tipo técnico do desenvolvimento

[Preencher só se o Passo 1.1 rodou. Omitir essa seção inteira se não houver site/sistema entre as entregas.]

Ver `briefing.md` (Tipo e Deploy). Stack completa e regras técnicas em `projeto/CLAUDE.md`.

## Onde salvar o que

- Briefings e contexto: nessa pasta na raiz
- Entregas: cada subpasta criada (ads/, conteudo/, site/, etc.)

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui.

## Específico desse projeto

[Vazio — preencher com regras que valem só pra esse projeto, conforme for descobrindo]
```

### Passo 5 — Resumo

Responder pro usuário:

```
Pasta criada: [caminho]
✓ CLAUDE.md do projeto
✓ briefing.md
✓ Subpastas: [lista]
```

Se o Passo 1.1 rodou, incluir também:

```
✓ Tipo técnico: [A | B] — stack: [Astro | Next.js + Supabase]
✓ Skills de animação ativas: [lista, ex: gsap-scrolltrigger, locomotive-scroll]
✓ MCPs em uso: Context7 (docs atualizadas), Playwright (verificação visual)
✓ Checklist Supabase: [aplicável — já consultado, pendências: X | não aplicável]
```

Se o Passo 1.2 rodou e a entrega envolve LP/site novo, incluir também esse lembrete (não deixar implícito no "herda da raiz" do CLAUDE.md — na prática isso não é suficiente pra garantir que a identidade seja de fato aplicada):

```
✓ Identidade visual: [colada do cliente | herda a linha da duPolvo]

Antes de montar o design: rodar o kit mínimo de skills pra LP nova
(storybrand-messaging → copywriting → frontend-design → hooked-ux →
cro-methodology — regra completa em projeto/CLAUDE.md). Pra estrutura
e animação, começar pelas seções prontas em
projeto/duPolvoNovo/sections/ e o kit de animação em
projeto/duPolvoNovo/motion-kit/ em vez de do zero.
```

Se o Passo 1.3 rodou, incluir também o resumo do nicho antes desse lembrete de skills — é contexto que deveria informar as escolhas do kit acima, não só um anexo:

```
✓ Nicho de mercado: [nome do nicho]

[resumo condensado de Insights para o nicho + Processar para, gerado no Passo 1.3]
```

E mostrar o comando pronto pra colar na sessão do Claude Code dentro de `projeto/`:

```
Lê o briefing em C:\Users\Xande\Desktop\MazyOS\clientes\<Nome>\briefing.md,
consulta o cérebro em C:\Users\Xande\Desktop\cerebro
e cria a estrutura do site.
```

Fechar com:

```
Quando for trabalhar nesse projeto, abre o terminal já dentro da pasta — assim eu carrego o CLAUDE.md específico junto com o da raiz.
```

## Regras

- Nome de pasta: usar o nome como o usuário falou, sem normalizar agressivamente (manter acentos, espaços viram hífen, mas o nome reconhecível)
- Não criar subpastas que não foram pedidas ("pra organizar melhor"). Só o que foi mencionado nas entregas
- Não pular o Passo 1.1 quando a entrega envolve site/sistema — sem o tipo definido, o Claude Code em `projeto/` não sabe qual stack aplicar
- Se o cliente/projeto já existe (pasta com mesmo nome), avisar e perguntar se é pra adicionar dentro ou criar com sufixo