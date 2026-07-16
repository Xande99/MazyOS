---
name: processar-clips
description: >
  Processa lote(s) de clips raw em cerebro/raw/nichos/<nicho>/ — lê cada nota,
  visualiza o conteúdo real, preenche as 3 seções de análise e classifica o
  status (done/revisar/duplicado), move nota de nicho errado quando aplicável,
  regenera _sintese.md e sinaliza _sintese-geral.md ao final. Use quando o
  usuário disser "processa os clips", "processa o raw de <nicho>", "roda o
  raw pra done", "/processar-clips" ou pedir pra avançar notas raw pendentes
  no Cérebro.
---

# /processar-clips — Raw → done no Cérebro

Formaliza o processo de processamento de clips validado no piloto de `saude-estetica` (25 notas) e replicado nos outros 12 nichos do Cérebro. As regras completas de front-matter, ciclo de vida, estrutura de pasta e das duas sínteses vivem em `cerebro/CLAUDE.md` seção 13 (13.1 a 13.9) — esta skill **não duplica** esse conteúdo, só documenta o processo operacional de rodar um lote sem precisar reconstruir a lógica do zero a cada sessão.

**Antes de começar:** ler `cerebro/CLAUDE.md` seção 13 inteira se a sessão ainda não tiver esse contexto — é a fonte de verdade de todo front-matter, status e formato usado abaixo.

## Workflow

### Passo 1 — Levantar o lote

Listar todas as notas com `status: raw` no(s) nicho(s) alvo (`cerebro/raw/nichos/<nicho>/*.md`). Se o usuário não especificar nicho, perguntar qual ou confirmar que é pra rodar todos os nichos com raw pendente. Lote grande (20+ notas de uma vez) vale confirmar antes de começar — melhor processar em levas com entrega intermediária do que estourar a sessão no meio de um lote gigante sem checkpoint.

### Passo 2 — Processar nota por nota

Pra cada nota `raw`, nessa ordem:

1. **Ler a nota inteira e visualizar o conteúdo real** — se tiver imagem local (`![[nome.ext]]`), abrir e olhar a imagem de fato; se referenciar URL remota, seguir o link; se for artigo, ler o texto inteiro. **Nunca preencher as seções de análise sem ter visto o conteúdo real.** Inventar observação a partir só do nome do arquivo ou da URL é o erro que essa skill existe pra prevenir — é a mesma regra que já vale pra notas `done` em `cerebro/CLAUDE.md` 13.5.
2. **Preservar o corpo bruto original intacto** — a captura (imagem embutida, texto colado, link) nunca é substituída, resumida ou movida de lugar. As 3 seções de análise (formato exato em `cerebro/CLAUDE.md` 13.6: `## O que observar`, `## Insights para o nicho`, `## Processar para`) são sempre **adicionadas abaixo** do que já existe, nunca no lugar.
3. Decidir o status (critérios do Passo 3) e atualizar o campo `status:` no front-matter.
4. Preencher as 3 seções com conteúdo específico daquele clip — nunca copiar texto de outra nota do mesmo nicho, nunca generalizar a partir do padrão do nicho pra evitar olhar o clip individual de verdade.

### Passo 3 — Critérios de status

- **`done`** — conteúdo real visto, dá pra extrair observação específica e não-genérica daquele clip em particular. Preencher as 3 seções normalmente.
- **`revisar`** — conteúdo insuficiente pra gerar insight real: vídeo que as ferramentas disponíveis não conseguem analisar, template com Lorem Ipsum/placeholder não substituído, captura cortada ou quebrada, página vazia. Preencher as 3 seções só com o que der pra observar honestamente (geralmente estrutura/layout, nunca copy ou posicionamento que na prática não existe) — ver `cerebro/raw/nichos/fitness-gym/Consultoria7.md` como exemplo real de formato. **Nunca forçar uma análise inventada só pra fechar como `done`.**
- **`duplicado`** — mesmo conteúdo de outra nota já processada (na mesma pasta ou em outro nicho, clipado duas vezes por engano). Front-matter vira `duplicado`; as 3 seções apontam pra nota `done` sobrevivente ("Ver análise completa em `<nome>.md`") em vez de repetir a análise — ver `cerebro/raw/nichos/empresa/Empresa31.md` como exemplo real de formato. **Nunca apagar nenhum dos dois arquivos** — marcar o status substitui a exclusão.
- **Nicho errado** — se o conteúdo real do clip pertence a um nicho diferente do da pasta onde está: mover o `.md` (e a imagem local, se houver) pra `raw/nichos/<nicho-correto>/`, renomear seguindo a numeração/convenção já usada na pasta de destino, e atualizar o campo `nichos:` no front-matter (regra 13.7 do `cerebro/CLAUDE.md`). Confirmar o nicho de destino contra a lista oficial em `MazyOS/CLAUDE.md` antes de mover — nunca criar pasta de nicho nova sem registrar lá primeiro.

### Passo 4 — Regenerar síntese(s)

Ao final do lote, pra cada nicho que teve ao menos 1 nota virar `done` (ou receber/perder uma nota por movimentação entre nichos):

1. Regenerar `_sintese.md` daquele nicho do zero, lendo todas as notas `done` atuais da pasta (regra 13.8 — nunca editar à mão, nunca só acrescentar ao final).
2. Avaliar se a mudança foi grande o suficiente pra também justificar regenerar `_sintese-geral.md` (regra 13.9): nicho ganhando `_sintese.md` pela primeira vez, ou mudança material nos "Insights consolidados" de um nicho que já tinha síntese. Lote pequeno (1-2 notas) num nicho já robusto raramente muda o consolidado — nesse caso, **sinalizar a possibilidade pro usuário em vez de decidir sozinho e regenerar por conta própria**.

### Passo 5 — Relatório final (obrigatório)

Todo lote processado fecha com um resumo estruturado, mesmo que seja de 1 nota só — nunca só "processei as notas":

```
Lote processado — [nicho(s)]:

✓ done: [N] (lista os nomes)
⚠ revisar: [N] (lista os nomes + motivo resumido de cada um)
⧉ duplicado: [N] (lista os nomes + pra qual nota done cada um aponta)
↔ movidos entre nichos: [N] (nome — de <nicho origem> pra <nicho destino>)

Sínteses regeneradas: [lista de _sintese.md atualizados nesse lote]
_sintese-geral.md: [regenerada agora | sinalizada como candidata, não regenerada — motivo | sem mudança relevante]
```

## Regras

- Fonte de verdade de front-matter, ciclo de vida, seções de análise, movimentação entre nichos e estrutura das duas sínteses é sempre `cerebro/CLAUDE.md` seção 13. Se esta skill e o `CLAUDE.md` divergirem em algum detalhe no futuro, o `CLAUDE.md` vence — e esta skill precisa ser corrigida pra voltar a bater.
- Nunca processar em lote sem visualizar cada clip individualmente, mesmo com muitas notas na fila — cada uma é vista de verdade antes de virar `done`, `revisar` ou `duplicado`.
- Nunca inflar a contagem de `done` pra fechar o lote mais rápido — `revisar` e `duplicado` são resultados esperados e válidos do processo, não falha.
- Relatório final é sempre obrigatório, independente do tamanho do lote.
