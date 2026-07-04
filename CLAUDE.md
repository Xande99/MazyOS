# duPolvo Studio — MazyOS

Operação da agência. Aqui ficam todos os clientes, propostas, conteúdo e entregas da duPolvo Studio.

**Estrutura de pastas:**
- `_memoria/` — quem é a agência, como falamos, foco atual
- `identidade/` — marca da duPolvo (aplicada nas peças internas e de cliente)
- `clientes/` — uma subpasta por cliente, autossuficiente
- `briefings/` — briefings antes de virar cliente
- `propostas/` — propostas em andamento
- `marketing/` — conteúdo institucional da agência
- `saidas/` — documentos pontuais, análises
- `dados/` — arquivos a analisar (relatórios de cliente, exports)
- `scripts/` — automações e scripts internos
- `projeto/` — pasta de desenvolvimento dos sites e LPs dos clientes

## Pastas vinculadas

| Pasta | Caminho | Para que serve |
|---|---|---|
| `projeto/` | `C:\Users\Xande\Desktop\MazyOS\projeto\` | Desenvolvimento dos sites e LPs |
| `cerebro/` | `C:\Users\Xande\Desktop\cerebro\` | Base de conhecimento técnico (referência, não editar) |

---

## Sobre a agência

Agência criativa e digital, 4 pessoas, Guaratinguetá SP. Atendemos pequenos negócios locais e empreendedores que já têm operação mas nunca investiram de verdade em presença digital. Nossos pilares: Programação, Design, Vídeo/Edição, Tráfego Pago.

## Clientes ativos

*(Nenhum ainda — fase de pré-lançamento. Atualizar quando o primeiro entrar.)*

## O que mais produzimos aqui

- Propostas comerciais pra novos clientes
- Carrosséis e conteúdo institucional da agência
- Landing pages e peças de tráfego pago
- Relatórios de performance para clientes

## Tom de voz

Direto, criativo, ousado sem ser arrogante. Frases curtas. "Fora do óbvio" como assinatura. Resultado sem prometer milagre.

Evitar: alavancar, ecossistema, jornada, entregar valor, metodologia ágil, mindset, expertise, bullet com emoji, copy de comitê, entusiasmo vazio.

## Regras do sistema

- Cliente novo → criar pasta `clientes/<Nome>/` com briefing, estratégia e subpastas conforme as entregas contratadas
- Proposta nova → `propostas/<cliente>-<data>.html` antes de fechar
- Casos de sucesso ficam em `clientes/<Nome>/caso.md` (reuso em pitches)
- Toda peça visual consulta `identidade/design-guide.md` antes de criar

## Ferramentas conectadas

- [ ] Notion
- [ ] Gmail
- [ ] Google Calendar
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é a duPolvo, o que faz, como funciona
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Pra qualquer tarefa visual (carrossel, post, landing page), consultar `identidade/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de novo projeto

Quando iniciar um novo projeto de cliente:

1. Rodar `/novo-projeto` e responder as perguntas do cliente
2. O briefing gerado fica em `clientes/<Nome>/briefing.md`
3. Comunicar o caminho do briefing pro Claude Code em `projeto/`:
   ```
   Lê o briefing em C:\Users\Xande\Desktop\MazyOS\clientes\<Nome>\briefing.md,
   consulta o cérebro em C:\Users\Xande\Desktop\cerebro
   e cria a estrutura do site.
   ```
4. Desenvolvimento acontece dentro de `projeto/<Nome>/`
5. Quando pronto, mover a pasta `projeto/<Nome>/` pro Desktop

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se não encontrar, executar a tarefa normalmente.

Sempre que o pedido envolver fazer ou melhorar algo com skill, buscar entre todas as skills já analisadas (catálogo em `saidas/outros/arsenal-skills.html`) qual(is) a mais adequada(s) — não só a mais óbvia. As skills nativas do MazyOS (abrir, novo-projeto, instalar, salvar, mapear-rotinas, atualizar, carrossel, seo, anuncio-google, aprovar-post, publicar-tema, relatorio-ads, responder-avaliacoes, email-profissional, analisar-dados) continuam óbvias, uso direto. As demais (adicionadas depois) devem ser usadas tanto pra executar o que foi pedido quanto pra auxiliar a melhoria do próprio MazyOS.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (clientes, serviços, mercado) → `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato, o que evitar) → `_memoria/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** → próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (cliente novo, skill nova, mudança de foco, processo novo, ferramenta instalada, estrutura alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Se sim, identificar o que atualizar:

- **Cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Tom ou estilo** → `_memoria/preferencias.md`
- **Pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Visual (cores, fontes, logo)** → `identidade/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais sem impacto no contexto (escrever um email avulso, criar um post)
- Perguntas simples ou conversas sem ação
- Mudanças já salvas pelo bloco "Aprender com correções"

**Dica:** rode `/atualizar` pra uma varredura completa quando houver dúvida.

---

## Criação de skills

Quando o usuário pedir skill nova:

1. Verificar se existe template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto
2. Perguntar se é específica desse projeto ou útil em qualquer:
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Universal → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code