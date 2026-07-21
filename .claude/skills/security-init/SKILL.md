---
name: security-init
description: >
  Aplica a postura de segurança padrão do MazyOS (deps pinadas, ignore-scripts,
  headers de segurança, esqueleto de testes RLS) num projeto que já existe e
  não nasceu do /novo-projeto — legado, importado, ou criado antes da auditoria
  de segurança. Use quando o usuário disser "roda o security-init nesse
  projeto", "aplica o hardening padrão aqui", "esse projeto entrou de fora,
  precisa de segurança", ou "/security-init".
user-invocable: true
---

# /security-init — Hardening de segurança pra projeto existente

Existe porque `/novo-projeto` já garante essa postura em projeto novo (Fase 5 —
Herança Automática, `templates/starter-tipo-a/` e `templates/starter-tipo-b/`
já nascem com isso). Este comando é o mesmo hardening, mas pra projeto que
**já existe** — não passou pelo starter, então nada disso está lá por padrão.

Referência do padrão completo: `AUDITORIA-SEGURANCA.md` (Fase 0-4) e
`CLAUDE.md` raiz, seção "Segurança (regras permanentes)".

## Escopo — o que este comando NUNCA faz sozinho

- Não cria/linka projeto Supabase novo
- Não roda `npm install` de dependência nova sem perguntar primeiro (regra do
  `CLAUDE.md`: pacote novo só entra com aprovação explícita, mesmo sugerido
  pelo próprio Claude)
- Não roda migration nenhuma
- Não sobrescreve config existente sem mostrar o diff antes — se o projeto já
  tem `next.config.ts`/`netlify.toml` com conteúdo próprio, mesclar, nunca
  substituir

Tudo que exige uma dessas ações vira item do relatório final ("pendência
manual"), não uma ação automática.

## Workflow

### 1. Detectar o projeto

Perguntar (se não estiver óbvio pelo contexto da conversa) qual pasta em
`projeto/<Nome>/` é o alvo. Depois, detectar a stack:

- `astro.config.mjs` presente → **Tipo A** (Astro)
- `next.config.ts`/`next.config.js` presente → **Tipo B** (Next.js)
- Nenhum dos dois, mas tem `index.html` na raiz e nenhum `package.json` → site
  estático vanilla (caso do `duPolvoNovo` antes da Fase 2) — pular pra seção
  "Site estático vanilla" abaixo, o resto do workflow não se aplica.
- Nenhum dos padrões acima bate → avisar o usuário e perguntar a stack
  manualmente antes de continuar, não adivinhar.

### 2. Pinagem de dependências

Ler `package.json`. Pra cada dependência com `^`/`~`:
1. `npm view <pacote>@<versão-atual-resolvida> time.<versão>` — confirmar
   idade ≥ 72h (deveria estar OK, já que é versão em uso, mas documentar).
2. Trocar pra versão exata (sem `^`/`~`) igual ao que já está resolvido no
   lockfile — não é upgrade, é só travar o que já roda. Upgrade de versão é
   trabalho do `/deps-review`, não deste comando.
3. `npm install` (regenera lockfile com a versão exata) — isso é reinstalar o
   que já existe, não instalar pacote novo, então não precisa de aprovação
   extra por pacote.

### 3. `.npmrc` com `ignore-scripts=true`

Se não existir, criar com esse único conteúdo. Se o build depender de algum
binário nativo com install script legítimo (`sharp`, `esbuild`,
`unrs-resolver` são os casos já conhecidos no repo), documentar isso no
relatório final como allowlist a testar — não desligar `ignore-scripts`
global pra contornar (mesma regra do `projeto/claude.md`).

### 4. Headers de segurança

**Tipo B (Next.js):** ler `next.config.ts` existente. Se já tiver `headers()`,
mesclar o array de headers sem duplicar chave; se não tiver, adicionar o
bloco `async headers()` com o baseline (`X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
`Strict-Transport-Security` — exato conteúdo em
`templates/starter-tipo-b/next.config.ts`, copiar de lá pra manter os dois em
sincronia).

**Tipo A (Astro/Netlify):** mesmo baseline via `[[headers]]` no
`netlify.toml` (ver `templates/starter-tipo-a/netlify.toml`) — se o projeto
não usa Netlify (Cloudflare Pages, por exemplo), perguntar qual hosting antes
de decidir o mecanismo certo (Cloudflare Pages usa `_headers` na `public/`,
sintaxe parecida mas arquivo diferente).

CSP fica de fora nos dois casos — mesma decisão já registrada nos templates,
não reabrir essa discussão aqui sem pedido explícito.

### 5. Testes de impersonação RLS (se o projeto usa Supabase)

Detectar por `supabase/migrations/*.sql` ou dependência `@supabase/supabase-js`.
Se existir:

1. Ler as migrations, extrair tabelas + policies (padrão: quem é
   `anon`/`authenticated`, o que cada policy permite).
2. Gerar (ou adicionar seção nova em) `security/rls-tests.sql` — mesmo
   formato usado pro Ribas Suplementos nesta auditoria: casos de acesso
   negado/permitido por role, comentado com o resultado esperado.
3. **Se o projeto já está linkado a um Supabase real** (confirmar via
   `supabase/.temp/project-ref` ou perguntar): oferecer rodar os testes de
   verdade, com o mesmo protocolo de segurança usado na Fase 3 desta
   auditoria — mostrar exatamente que linha/registro cada caso vai criar
   *antes* de rodar, confirmar limpeza depois, nunca contra dado de produção
   sem aprovação explícita.
4. **Se não está linkado**: marcar como "escrito, não verificado" e apontar
   isso como pendência manual no relatório final.

### 6. `.gitignore` e segredos

Confirmar que `.env*` está no `.gitignore` (exceto `.env.example`/
`.env.*.example`). Rodar uma varredura leve (`git log --all -- .env*`, mesmo
padrão usado na Fase 0) pra confirmar que nenhum `.env` real já foi commitado
no histórico — se achar, é achado crítico, reportar imediatamente e parar
antes de continuar o resto do workflow (rotação de credencial é prioridade
sobre qualquer outro item deste comando).

### 7. `zod` (só Tipo B) — recomendação, não instalação automática

Diferente do template (que já nasce com `zod`), projeto existente pode ter
convenção própria de validação. Verificar se `zod` (ou schema validation
equivalente — `yup`, `valibot`) já está em uso. Se não estiver, **não
instalar sozinho** — listar como recomendação no relatório final, com o
mesmo trecho de exemplo do `templates/starter-tipo-b/README.md`.

### Site estático vanilla (sem build step)

Aplica só um subconjunto: (a) qualquer script de terceiro carregado via CDN
sem self-host vira achado — mesmo padrão do `duPolvoNovo` antes da Fase 2.2,
resolver do mesmo jeito (baixar via `npm pack`, vendorizar, trocar o
`<script src>`); (b) headers de segurança dependem 100% de onde é hospedado
— perguntar (Netlify → `_headers` ou `netlify.toml`; Vercel → `vercel.json`;
Cloudflare Pages → `_headers`) antes de escolher o mecanismo.

## Relatório final

Mesmo formato de `AUDITORIA-SEGURANCA.md`/`ACOES-MANUAIS.md`, só que
por projeto:

```
## security-init — projeto/<Nome>/ — [data]

### Aplicado automaticamente
- [x] Deps pinadas (N pacotes)
- [x] .npmrc criado
- [x] Headers de segurança em [next.config.ts | netlify.toml]
- [x] security/rls-tests.sql [criado | seção adicionada] (se aplicável)

### Achados
- [qualquer coisa fora do padrão encontrada — CDN sem self-host, segredo em
  histórico, etc.]

### Pendências manuais (não fiz sozinho)
- [ ] zod recomendado, não instalado — decisão do time
- [ ] RLS tests escritos mas não verificados (projeto não linkado a Supabase real)
- [ ] Rotação de credencial se algo crítico foi achado no passo 6
```

Registrar também como entrada em `projeto/<Nome>/.claude/decisions.md`
(criar o arquivo se não existir), mesmo formato de decisão usado no resto do
repo — decisão, motivo, alternativas descartadas, impacto.

## Verificação antes de considerar concluído

`npm run build` (ou `npm run qa` se o script existir) dentro do projeto,
depois de todas as mudanças — mesma regra de qualquer outra alteração de
config: não reportar como pronto sem confirmar que builda.
