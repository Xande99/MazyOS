# Biblioteca de seções — starter-tipo-a

Cinco componentes Astro reutilizáveis, cada um com props tipadas e reveal-on-scroll já aplicado, derivados dos padrões cross-nicho documentados em `cerebro/raw/nichos/_sintese-geral.md` (síntese de segundo nível, regra 13.9 do `cerebro/CLAUDE.md`). Não são um wireframe pronto — são os blocos individuais mais recorrentes do Cérebro, pra montar a página real em cima deles em vez de desenhar do zero.

Todos usam os tokens de marca de `src/styles/dupolvo-theme.css` (cores, tipografia, raio, sombra) e a classe `.reveal` do sistema existente (`src/scripts/reveal.ts`) — nenhum componente aqui traz animação própria fora desse sistema.

## As 5 seções

| Componente | Padrão de origem | Quando usar |
|---|---|---|
| `AncoraConfianca.astro` | Padrão universal #1 — pessoa nomeada, **9/13 nichos**, o mais transversal do Cérebro | Clínica, consultório ou prestador solo — sempre que o negócio vende confiança em cima de uma pessoa específica. Variante `numero` cobre loja/comércio, onde estatística agregada substitui rosto individual |
| `ProvaNumerica.astro` | Padrão universal #2 — bloco de estatística após o hero, **5/13 nichos** | Logo abaixo do hero, antes de qualquer outra seção — é a posição, não o conteúdo do número, que é o padrão confirmado |
| `TierPreco.astro` | Padrão universal #3 — tier de preço com opção central destacada, **5/13 nichos** | Sempre que o cliente decidir mostrar preço em formato de plano/pacote (não procedimento avulso) — nunca lista de preço solta sem hierarquia visual |
| `GridOferta.astro` | Base do "esqueleto padrão" em quase todo `_sintese.md`, item 3 do wireframe-zero | Grid de serviços/produtos/tratamentos — normalmente a seção mais central da página, a que os outros blocos orbitam |
| `FAQ.astro` | Item 5 do wireframe-zero — padrão regional (saude-estetica, psicologia, juridico-contabil), candidato a universal | Perto do fim da página, antes do CTA final — trata a objeção que ainda resta depois de oferta e preço mostrados |

## Quando usar cada uma (por categoria de negócio)

A síntese geral mapeia 3 categorias de negócio cross-nicho (ver seção "Especificidades por categoria de negócio" em `_sintese-geral.md`) — usar como guia rápido de que seções priorizar:

- **Clínica/consultório** (odonto, saude-estetica, psicologia, pet-veterinario, juridico-contabil, fitness-gym institucional): `AncoraConfianca` (variante `pessoa`) logo após o hero, `GridOferta` pros serviços, `FAQ` antes do CTA.
- **Loja/comércio** (nutri-suplement, ecommerce, food-delivery): `AncoraConfianca` (variante `numero`) ou `ProvaNumerica`, `GridOferta` pro catálogo, `TierPreco` se vender por pacote/assinatura.
- **Prestador solo/marca pessoal** (psicologia solo, saude-estetica solo, juridico-contabil solo, infoprodutor): `AncoraConfianca` (variante `pessoa`, bio mais extensa via `cargo`/`anosExperiencia`), `TierPreco` se vender curso/consultoria em pacotes.

## Wireframe-zero sugerido

Sequência que reflete o `## Wireframe-zero duPolvo` de `_sintese-geral.md`: Hero (fora desta biblioteca, específico de cada projeto) → `AncoraConfianca` ou `ProvaNumerica` → `GridOferta` → `TierPreco` (se aplicável) → `FAQ` → CTA final (fora desta biblioteca).

## Decisões de implementação

- **Imagens via `<img>` simples, não `astro:assets`** — decisão deliberada: esta é uma biblioteca reutilizável entre projetos de clientes diferentes, e nem sempre a imagem real do cliente está disponível/importada localmente no momento em que a seção é usada. Sempre passar `width`/`height` explícitos nas props (já default no `AncoraConfianca` e fixo no `GridOferta`) pra evitar layout shift. Se o projeto tiver a imagem final como asset local, considerar trocar por `astro:assets` `<Image />` na hora de aplicar a seção na página real — não é obrigatório, é uma melhoria disponível.
- **Grids usam `[grid-template-columns:repeat(auto-fit,minmax(...))]`** (valor arbitrário do Tailwind) em vez de `sm:grid-cols-N` calculado dinamicamente — nomes de classe montados em runtime (`` `sm:grid-cols-${n}` ``) não são detectados pelo scanner estático do Tailwind v4 e quebram o CSS silenciosamente. O valor arbitrário é uma string literal fixa no arquivo, sempre detectado, e se adapta sozinho a qualquer quantidade de itens.
- **`FAQ.astro` usa `<details>`/`<summary>` nativo**, nunca GSAP — hierarquia de animação do `projeto/claude.md` (CSS puro → View Transitions → GSAP → Motion) manda usar a opção mais leve que resolve, e accordion é interação simples demais pra justificar GSAP. Teclado e semântica de aberto/fechado vêm de graça do HTML nativo.
- **Todas as 5 seções consomem só tokens semânticos** de `_memoria/tokens-contract.md` (`bg-brand`, `text-text`, `shadow-sm`...), nunca hex/rgb/hsl literal ou nome de fonte solto — é o que permite trocar `theme.css` sem tocar em nenhum componente. `npm run lint:css` (stylelint + `stylelint-declaration-strict-value`, config em `.stylelintrc.json`) barra isso automaticamente em qualquer `.css`/`<style>` de `.astro`, exceto dentro de `theme*.css` (onde os valores brutos são o ponto). **Limitação conhecida:** o lint audita CSS de verdade, não strings de classe Tailwind dentro de `class="..."` — um hex escondido num valor arbitrário (`class="text-[#ff0000]"`) não é pego por essa ferramenta; revisão de PR ainda precisa olhar isso.

## Como o `/novo-projeto` deve usar isso

Ao montar a página de uma LP nova (Tipo A), antes de criar qualquer seção do zero: verificar se `AncoraConfianca`, `ProvaNumerica`, `TierPreco`, `GridOferta` ou `FAQ` já cobre a necessidade (ver tabela acima) e usar a seção existente, passando as props com o conteúdo real do cliente — nunca placeholder. Só criar seção nova quando nenhuma das 5 cobrir o caso (ex: antes/depois, calculadora, seção de sinais de alerta). Ver `.claude/skills/novo-projeto/SKILL.md` pra onde essa checagem entra no fluxo.

Biblioteca nasce com 5 seções — cresce conforme novos padrões forem confirmados em `_sintese-geral.md` (regenerada conforme regra 13.9) ou conforme a experiência real de projeto pedir algo que se repete.
