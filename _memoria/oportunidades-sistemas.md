# Oportunidades de sistemas — duPolvo

Consolidação das três análises feitas em sessão sobre o que construir com Claude Code além de sites e LPs institucionais: um mapa geral de possibilidades, os 10 sistemas verticais com potencial de receita recorrente (mensalidade/licenciamento pros 12 nichos já mapeados) e o esboço de arquitetura resumido de cada um. Nada disso foi construído — é material de decisão, não backlog fechado. Antes de desenvolver qualquer sistema novo (fora de LP/site institucional), usar este arquivo como base e só aprofundar o que for pedido.

---

## 1. Mapa geral de possibilidades

*Site é só um dos oito braços — mapa do que dá pra construir com a stack já dominada (front-end vanilla, GSAP, React/Next.js e Claude Code como parceiro técnico).*

### 01 — Ferramentas internas pra agência
*Pra tirar decisão da cabeça de alguém e colocar num lugar que os 4 sócios consultam.*

- **Gerador de proposta a partir do briefing** — Lê `clientes/<nome>/briefing.md` e monta o esqueleto da proposta já no HTML de identidade, com preço calculado por pacote escolhido. Problema: hoje cada proposta é montada do zero, manualmente. Esforço: médio. Skill: novo-projeto (parcial).
- **Calculadora de orçamento por pacote** — Escolhe pilares (Programação, Design, Vídeo, Tráfego), urgência e escopo — devolve faixa de preço e horas na hora, em reunião. Problema: precificação hoje é no olho, cada sócio calcula diferente. Esforço: rápido. Skill: sem skill ainda.
- **Painel de status dos clientes** — Lê as pastas `clientes/*/` e mostra num quadro só: briefing pronto, contrato assinado, prazo mais próximo, pendências. Problema: com 4 pessoas e vários clientes, o estado real vive na cabeça de alguém. Esforço: médio. Skill: mapear-rotinas.
- **Relatório de performance com identidade própria** — Pega os números que a `relatorio-ads` já analisa e transforma em página HTML no padrão visual da duPolvo — não o PDF genérico do Meta. Problema: relatório bonito é diferencial competitivo com cliente pequeno. Esforço: médio. Skill: relatorio-ads + dataviz.

### 02 — Micro-SaaS e iscas de marketing
*Ferramentas públicas, gratuitas, que existem pra puxar lead e provar que a duPolvo pensa diferente antes mesmo de fechar contrato.*

- **Raio-X do Instagram parado** — Quiz curto sobre frequência de post, resposta a comentário e tráfego pago — devolve nota e diagnóstico no final, capturando contato. Problema: dono de negócio local não sabe que a operação dele tá capenga até ver o número. Esforço: médio. Skill: jobs-to-be-done + cro-methodology.
- **Calculadora "quanto custa não ter site"** — Dono coloca ticket médio e clientes estimados perdidos por mês — a ferramenta devolve o valor anual que isso representa. Problema: sem site é abstrato; sem site custando R$ X por ano é concreto. Esforço: rápido. Skill: hundred-million-offers.
- **Gerador de legenda fora do óbvio** — Digita o que vende, a ferramenta devolve 3 legendas no tom duPolvo — free tool que expõe a qualidade da copy da agência. Problema: copy genérica de IA é fácil de achar; copy com ponto de vista, não. Esforço: médio. Skill: copywriting.
- **Simulador de pacote público** — Versão pública da calculadora interna: o lead marca o que precisa e vê o pacote e a faixa de investimento, terminando em CTA de WhatsApp. Problema: reduz a fricção entre curiosidade e primeira conversa. Esforço: médio. Skill: cro-methodology.

### 03 — Sistemas pra cliente além do site
*Onde o perfil de cliente típico — clínica, salão, restaurante, loja física — tem dor recorrente que um site sozinho não resolve.*

- **Portal simples do cliente** — Página privada por cliente onde ele acompanha status do projeto, baixa relatório e vê o que está agendado — sem depender de WhatsApp solto. Problema: hoje esse acompanhamento se perde em mensagem avulsa. Esforço: grande. Skill: sem skill ainda.
- **Agendamento pra clínica, salão ou restaurante** — Página de agendamento personalizável por cliente, sem depender de app de terceiro caro — template reaproveitável entre contratos parecidos. Problema: é a dor mais comum do perfil de cliente que a duPolvo atende. Esforço: grande. Skill: sem skill ainda.
- **Catálogo digital sem app de terceiro** — Cardápio ou vitrine de produtos atualizável por um arquivo simples, no lugar do PDF ou print de Canva que o cliente reenvia toda semana. Problema: aproveita exatamente o stack HTML/CSS/JS vanilla já dominado. Esforço: médio. Skill: sem skill ainda.
- **Painel central de avaliações** — Centraliza avaliações do Google de todos os clientes ativos num só lugar, com alerta pra nota baixa — a resposta em si já sai pronta. Problema: responder-avaliacoes resolve a resposta; falta o radar que avisa quando responder. Esforço: médio. Skill: responder-avaliacoes.

### 04 — Portfólio técnico
*Peças que provam capacidade de front-end além de landing page — o tipo de coisa que faz outro dev olhar duas vezes.*

- **Case study interativo** — Em vez de PDF ou print, uma mini-aplicação que mostra a evolução real de métricas de um cliente — antes e depois, com gráfico animado. Problema: prova resultado e capacidade técnica na mesma peça. Esforço: médio. Skill: dataviz + timeline-report.
- **Laboratório de microinterações** — Página no site institucional com os componentes animados que a agência sabe construir — um mini design system público, navegável. Problema: quem pesquisa a agência antes de fechar vê o trabalho, não só a promessa. Esforço: médio. Skill: microinteractions + refactoring-ui.
- **Timeline scroll-driven de um projeto real** — Storytelling com GSAP contando o antes, durante e depois de um cliente real — funciona como portfólio e como conteúdo de rede ao mesmo tempo. Problema: duas peças em uma — prova técnica e material de tráfego. Esforço: médio. Skill: top-design.

### 05 — Automação do processo interno
*Claude Code cuidando dos bastidores do próprio MazyOS — o tipo de coisa que só compensa depois que a base já existe, que é onde a duPolvo está agora.*

- **Slash command briefing → proposta** — Comando que já monta o esqueleto da proposta a partir do briefing, deixando só a revisão fina. Problema: menos etapa manual entre briefing fechado e proposta enviada. Esforço: rápido. Skill: novo-projeto.
- **Checklist automática antes de entregar** — Hook que roda antes de mover `projeto/<cliente>/` pro Desktop — confere responsividade, performance, links quebrados. Problema: evita esquecimento no meio da correria de time pequeno. Esforço: rápido. Skill: update-config.
- **Resumo semanal automático** — Toda segunda, roda sozinho: propostas em aberto, prazos da semana, o que atrasou — salvo em `saidas/` ou mandado por e-mail. Problema: ninguém precisa lembrar de perguntar "como estamos essa semana". Esforço: rápido. Skill: schedule (cron nativo).
- **Comando de status por cliente** — `/status-cliente Nome` resume o que existe em `clientes/<nome>/` sem precisar abrir pasta por pasta. Problema: contexto rápido antes de uma call ou mensagem no WhatsApp. Esforço: rápido. Skill: sem skill ainda.

### 06 — Extensões e standalone
*Fora do navegador de propostas e do repositório — coisas que rodam por conta própria.*

- **Swipe file compartilhado** — Extensão de navegador pra qualquer um dos 4 sócios salvar referência visual boa direto numa pasta comum, com tag automática. Problema: referência boa hoje se perde em print solto de celular. Esforço: médio. Skill: sem skill ainda.
- **Painel de bandeja** — App leve (Tauri) fixo na bandeja do sistema mostrando prazo mais próximo, propostas pendentes e métrica de tráfego dos clientes ativos. Problema: visão rápida sem abrir uma aba a mais. Esforço: grande. Skill: sem skill ainda.
- **CLI própria `dupolvo`** — Pacote instalado local com comandos tipo `dupolvo status`, `dupolvo proposta` — roda mesmo fora de uma sessão de Claude Code. Problema: rotina disponível mesmo sem abrir o Claude. Esforço: grande. Skill: sem skill ainda.

**Nota de fechamento do mapa geral:** nada disso foi construído. É o mapa pra escolher — pelo que dói mais agora (fase de pré-lançamento aponta pra categorias 01 e 05), ou pelo que rende mais conteúdo de captação (02 e 04).

---

## 2. Os 10 sistemas verticais recorrentes

*O projeto fecha uma vez. A mensalidade, não. Sistemas pra vender ou licenciar por assinatura aos 12 nichos já mapeados (`Área de Trabalho\nichos\`: automotivo, barbearia, empresa, estetica, fitness-gym, food-delivery, imoveis, infoprodutos, juridico-contabil, odonto, pet-veterinario, psicologia) — não site, não LP: ferramenta que o dono abre todo dia e paga pra continuar abrindo.*

### 01 — Agendamento vertical
- **Nichos:** barbearia · odonto · pet-veterinario · estetica · fitness-gym · psicologia
- **Complexidade:** média · **MVP:** rápido
- **Problema real:** agenda genérica (Calendly, Google Agenda) não entende a lógica do nicho — barbearia precisa de horário por profissional e serviço, odonto precisa de tempo de cadeira por procedimento, psicologia precisa de recorrência semanal fixa por paciente.
- **Por que mensalidade:** é a ferramenta que o dono abre todo santo dia. Cancelar a assinatura significa voltar pro caderno — fricção alta de sair.

### 02 — Painel de gestão / CRM leve
- **Nichos:** todos — mais forte em automotivo · barbearia · odonto · pet-veterinario · imoveis · juridico-contabil · empresa
- **Complexidade:** baixa-média · **MVP:** rápido
- **Problema real:** histórico do cliente vive na cabeça do dono ou num post-it. Troca de funcionário apaga o relacionamento inteiro.
- **Por que mensalidade:** o dado acumula com o tempo — o valor cresce a cada mês, o que é argumento natural pra recorrência: sair do sistema significa perder o histórico.

### 03 — Catálogo / cardápio autoatualizável
- **Nichos:** food-delivery · imoveis (catálogo de imóveis) · estetica (tabela de procedimentos) · automotivo (tabela de serviços)
- **Complexidade:** baixa · **MVP:** rápido
- **Problema real:** cardápio em PDF ou print de Canva fica desatualizado, e o dono depende de alguém (ou da própria duPolvo) pra mudar um preço.
- **Por que mensalidade:** hospedagem + autonomia pra editar sozinho justifica uma taxa baixa e contínua — é o tipo de coisa que ele paga só pra não precisar pedir ajuda de novo.

### 04 — Gerador automático de orçamento/proposta
- **Nichos:** automotivo · juridico-contabil · empresa · estetica (protocolo) · imoveis (proposta)
- **Complexidade:** baixa-média · **MVP:** rápido
- **Problema real:** montar orçamento é manual, demorado, e cada funcionário calcula diferente — a inconsistência mina a confiança do cliente antes de fechar.
- **Por que mensalidade:** uso recorrente garantido, mas o valor percebido cai depois do primeiro mês — funciona melhor como taxa fixa baixa do que como produto que sustenta ticket alto sozinho.

### 05 — Dashboard de métricas pro cliente
- **Nichos:** infoprodutos · imoveis · empresa — quem já roda tráfego pago
- **Complexidade:** média-alta · **MVP:** parcial
- **Problema real:** cliente recebe print do Ads Manager ou relatório confuso e não entende se o dinheiro dele está indo bem.
- **Por que mensalidade:** só faz sentido cobrar à parte de quem não é cliente de tráfego pago da própria duPolvo — senão canibaliza um serviço que já é vendido por outro canal.

### 06 — Avaliação pós-atendimento (QR → formulário → dashboard)
- **Nichos:** barbearia · odonto · food-delivery · automotivo · estetica
- **Complexidade:** baixa · **MVP:** rápido
- **Problema real:** o dono só descobre que um cliente saiu insatisfeito quando o Google já tem uma avaliação de uma estrela, pública.
- **Por que mensalidade:** uso passivo e constante, mas como produto isolado é fino demais pra sustentar assinatura própria — rende mais como peça embutida em outro sistema.

### 07 — Lembrete de recorrência automático (recall)
- **Nichos:** barbearia · odonto · pet-veterinario · estetica · automotivo
- **Complexidade:** baixa-média · **MVP:** rápido
- **Problema real:** o cliente não volta não porque não gostou — esqueceu. E o dono não tem nenhum sistema que lembre por ele.
- **Por que mensalidade:** é literalmente uma máquina de trazer receita de volta pro cliente do dono. Fácil justificar o preço mostrando quantos agendamentos o lembrete gerou no mês.

### 08 — Prontuário / histórico documental
- **Nichos:** odonto · psicologia · pet-veterinario · estetica · juridico-contabil
- **Complexidade:** média-alta · **MVP:** sem atalho seguro
- **Problema real:** ficha em papel, foto solta no celular, documento perdido — e nesses nichos costuma ser dado sensível (saúde, sigilo profissional).
- **Por que mensalidade:** dado sensível acumulado é o maior trava de saída de todos — ninguém migra de sistema de prontuário por capricho.

### 09 — Funil de captação com qualificação (bot de WhatsApp)
- **Nichos:** imoveis · infoprodutos · juridico-contabil · empresa
- **Complexidade:** média-alta · **MVP:** parcial
- **Problema real:** o lead chega e espera resposta humana pra saber se faz sentido pra ele — nesse intervalo, já foi falar com o concorrente.
- **Por que mensalidade:** cada lead qualificado tem valor direto e mensurável — fácil amarrar o preço a quantos leads passaram pelo funil no mês.

### 10 — Cobrança recorrente + controle de inadimplência
- **Nichos:** fitness-gym · pet-veterinario (planos) · juridico-contabil (assessoria mensal) · psicologia (pacote de sessões)
- **Complexidade:** alta · **MVP:** sem atalho seguro
- **Problema real:** mensalidade atrasada é perseguida por mensagem avulsa — ou pior, nem é perseguida.
- **Por que mensalidade:** irônico, mas verdadeiro — é o sistema que garante a própria mensalidade do cliente dele. Envolve dinheiro de terceiro — a parte mais delicada da lista, técnica e legalmente.

---

## 3. Cruzamento por nicho (matriz completa)

Onde cada sistema encaixa forte (●), como possibilidade secundária (◐), ou não se aplica/fraco (·).

| Nicho | Agenda | CRM | Catálogo | Orçam. | Dash. | Avaliaç. | Recall | Prontu. | Funil | Cobrança |
|---|---|---|---|---|---|---|---|---|---|---|
| automotivo | ◐ | ● | · | ● | ◐ | ◐ | ● | ◐ | ◐ | · |
| barbearia | ● | ● | · | · | ◐ | ● | ● | · | · | ◐ |
| empresa | ◐ | ● | · | ● | ◐ | · | · | · | ● | ◐ |
| estetica | ● | ● | ◐ | ◐ | ◐ | ● | ● | ● | ◐ | ◐ |
| fitness-gym | ● | ● | · | · | ◐ | ◐ | ◐ | ◐ | ◐ | ● |
| food-delivery | ◐ | ◐ | ● | · | ◐ | ● | ◐ | · | · | · |
| imoveis | ◐ | ● | ● | ◐ | ● | · | · | · | ● | · |
| infoprodutos | · | ◐ | · | · | ● | ◐ | · | · | ● | ◐ |
| juridico-contabil | ◐ | ● | · | ● | · | · | ◐ | ● | ◐ | ● |
| odonto | ● | ● | · | ◐ | · | ● | ● | ● | · | ◐ |
| pet-veterinario | ● | ● | · | ◐ | · | ◐ | ● | ● | · | ◐ |
| psicologia | ● | ● | · | · | · | · | ◐ | ● | · | ● |

**Legenda:** ● encaixe forte · ◐ possível / secundário · · fraco ou não se aplica.

**Colunas** (nome completo do sistema): Agenda = Agendamento vertical (01) · CRM = Painel de gestão/CRM leve (02) · Catálogo = Catálogo/cardápio autoatualizável (03) · Orçam. = Gerador automático de orçamento/proposta (04) · Dash. = Dashboard de métricas pro cliente (05) · Avaliaç. = Avaliação pós-atendimento (06) · Recall = Lembrete de recorrência automático (07) · Prontu. = Prontuário/histórico documental (08) · Funil = Funil de captação com qualificação/bot WhatsApp (09) · Cobrança = Cobrança recorrente + controle de inadimplência (10).

---

## 4. Recomendação final priorizada

**Comece por agenda + recall, em barbearia.**

De tudo isso, **agendamento vertical (01) somado a lembrete de recorrência (07)** é o que tem melhor custo-benefício pra validar primeiro — sozinho ou com 4 pessoas, ainda sem clientes fixos.

Nenhum dos dois mexe com dado sensível de saúde nem com dinheiro de terceiro — os dois riscos mais caros da lista (prontuário e cobrança recorrente) ficam de fora dessa primeira aposta. É o par mais simples do stack, o ciclo de validação é curto e o resultado é fácil de mostrar: dá pra comparar a agenda antes e depois do recall e apontar, em número, quantos clientes sumidos voltaram.

Barbearia ganha de odonto e pet-veterinário como primeiro nicho porque o ciclo de corte se repete a cada 3-4 semanas — em dois meses já se vê o recall funcionando ou não, sem esperar seis meses de calendário odontológico ou vacinal pra ter dado.

- → Depois de validado, **CRM leve (02)** estende o mesmo produto sem exigir tecnologia nova — histórico de corte e preferência já é o próximo degrau natural.
- → **Prontuário (08)** e **cobrança recorrente (10)** ficam pra quando já houver caixa e um cliente-piloto satisfeito — são os dois que mais custam se der errado, não os dois pra aprender errando.

---

## 5. Esboço de arquitetura por sistema

*Fluxo, telas, dado essencial e stack de cada um dos 10 sistemas — resumido o suficiente pra comparar esforço entre eles, não pra construir nenhum ainda.*

### 01 — Agendamento vertical — MVP médio
**Fluxo:** dono cadastra serviços, profissionais e horários disponíveis. Cliente final abre o link público, escolhe serviço + horário e confirma. Sistema trava o horário e avisa o dono, que acompanha a agenda do dia num painel.
**Telas:** agenda do dono (dia/semana) · cadastro de serviços/profissionais · página pública de agendamento.
**Dado essencial:** `Cliente → Agendamento → Serviço` · `Agendamento → Profissional`.
**Stack:** Next.js + banco de dados + autenticação (dono) + e-mail/WhatsApp.

### 02 — Painel de gestão / CRM leve — MVP rápido-médio
**Fluxo:** dono ou atendente cadastra o cliente na primeira visita. A cada atendimento, adiciona uma nota rápida no histórico. Antes do próximo atendimento, consulta a ficha pra lembrar contexto e preferência.
**Telas:** lista de clientes (busca) · ficha do cliente (linha do tempo) · novo registro/atendimento.
**Dado essencial:** `Cliente → Atendimento (histórico)`.
**Stack:** Next.js + banco de dados + autenticação.

### 03 — Catálogo / cardápio autoatualizável — MVP rápido
**Fluxo:** dono edita itens (nome, preço, foto, disponibilidade) num painel simples. A página pública atualiza na hora. Cliente final acessa por link ou QR code, sem precisar logar.
**Telas:** painel — lista + edição de itens · página pública do catálogo.
**Dado essencial:** `Categoria → Item`.
**Stack:** Next.js + banco de dados + storage de imagem.

### 04 — Gerador automático de orçamento/proposta — MVP rápido-médio
**Fluxo:** atendente escolhe itens/serviços e quantidades num formulário. Sistema calcula o valor com a tabela de preço já cadastrada e gera um documento pronto pra enviar ao cliente.
**Telas:** novo orçamento (seleção de itens) · tabela de preços/regras · lista de orçamentos gerados.
**Dado essencial:** `Item/Serviço → Linha do Orçamento` · `Orçamento → Linha do Orçamento`.
**Stack:** Next.js + banco de dados + geração de PDF.

### 05 — Dashboard de métricas pro cliente — MVP grande
**Fluxo:** sistema puxa métricas periodicamente da conta de anúncio do cliente. Processa e guarda os números-chave. Cliente acessa um link simples e vê resumo em linguagem direta, sem jargão de Ads Manager.
**Telas:** acesso do cliente (login/link único) · dashboard — resumo + gráfico.
**Dado essencial:** `Cliente → Conta de Anúncio → Métrica`.
**Stack:** Next.js + banco de dados + autenticação + API Meta/Google Ads.

### 06 — Avaliação pós-atendimento — MVP rápido
**Fluxo:** cliente escaneia um QR code depois do atendimento e responde um formulário curto, sem login. Dono vê as respostas centralizadas, com destaque pra nota baixa.
**Telas:** formulário público (via QR) · painel — lista + média + alertas.
**Dado essencial:** `Avaliação` (solta, ou ligada a Atendimento).
**Stack:** Next.js + banco de dados.

### 07 — Lembrete de recorrência (recall) — MVP médio
**Fluxo:** sistema sabe a última visita de cada cliente e o intervalo esperado de retorno. Um job agendado roda sozinho e dispara o lembrete no WhatsApp. Dono vê quantos lembretes viraram agendamento de volta.
**Telas:** clientes na janela de retorno · regra de recorrência por serviço.
**Dado essencial:** `Cliente → Serviço (intervalo) → Lembrete`.
**Stack:** Next.js + banco de dados + job agendado + WhatsApp API.

### 08 — Prontuário / histórico documental — MVP grande
**Fluxo:** profissional registra evolução, texto ou anexo a cada atendimento. Histórico fica organizado por paciente, com controle de quem pode acessar cada registro.
**Telas:** ficha do paciente (histórico) · novo registro + upload · controle de acesso/permissão.
**Dado essencial:** `Paciente → Registro Clínico → Anexo`.
**Stack:** Next.js + banco de dados + autenticação por permissão + storage de arquivo + cuidado LGPD.

### 09 — Funil de captação (bot WhatsApp) — MVP grande
**Fluxo:** lead escreve no WhatsApp do negócio. Bot segue um roteiro curto de perguntas de qualificação. Conforme a resposta, o lead é classificado e encaminhado pro humano certo.
**Telas:** lista de leads + classificação · configuração do roteiro.
**Dado essencial:** `Lead → Mensagem` · `Lead → Classificação`.
**Stack:** Next.js + banco de dados + WhatsApp Business API.

### 10 — Cobrança recorrente + inadimplência — MVP grande
**Fluxo:** cliente final assina um plano. Gateway de pagamento cobra automaticamente todo mês. Se falhar, sistema avisa e marca inadimplência; dono vê quem está em dia num painel.
**Telas:** lista de assinantes + status · cadastro de plano/valor · assinatura (cliente final).
**Dado essencial:** `Cliente → Assinatura → Cobrança`.
**Stack:** Next.js + banco de dados + autenticação + gateway de pagamento + webhook.

### Comparação rápida (tabela resumo)

| Sistema | Nicho | Complexidade | MVP | Precisa de quê |
|---|---|---|---|---|
| 01 · Agendamento vertical | barbearia, odonto, pet-vet, estética, fitness, psicologia | Média | médio | DB + auth + e-mail/WhatsApp |
| 02 · CRM leve | todos | Baixa–média | rápido–médio | DB + auth |
| 03 · Catálogo/cardápio | food-delivery, imóveis, estética, automotivo | Baixa | rápido | DB + storage de imagem |
| 04 · Gerador de orçamento | automotivo, jurídico-contábil, empresa, estética, imóveis | Baixa–média | rápido–médio | DB + geração de PDF |
| 05 · Dashboard de métricas | infoprodutos, imóveis, empresa | Média–alta | grande | DB + auth + API Meta/Google Ads |
| 06 · Avaliação pós-atendimento | barbearia, odonto, food-delivery, automotivo, estética | Baixa | rápido | DB |
| 07 · Recall automático | barbearia, odonto, pet-vet, estética, automotivo | Baixa–média | médio | DB + cron + WhatsApp API |
| 08 · Prontuário/histórico | odonto, psicologia, pet-vet, estética, jurídico-contábil | Média–alta | grande | DB + auth por permissão + storage + LGPD |
| 09 · Funil de captação (bot) | imóveis, infoprodutos, jurídico-contábil, empresa | Média–alta | grande | DB + WhatsApp Business API |
| 10 · Cobrança recorrente | fitness-gym, pet-vet, jurídico-contábil, psicologia | Alta | grande | DB + auth + gateway de pagamento + webhook |
