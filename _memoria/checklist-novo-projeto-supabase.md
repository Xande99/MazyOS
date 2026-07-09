# Checklist — novo sistema com Supabase

Passos manuais que ainda precisam de você. A partir do passo 6, a aplicação de migrations já é automática (CLI configurada).

## 1. Criar o projeto no Supabase

Em [dashboard.supabase.com](https://dashboard.supabase.com):

- Nome do projeto
- Senha do banco (guardar em local seguro — não vai pra nenhum arquivo do repo)
- Região: **sa-east-1 (São Paulo)**

Configuração de Security recomendada:
- **Enable Data API**: sim
- **Automatically expose new tables**: como preferir no projeto
- **Enable automatic RLS**: **desmarcado** — RLS é controlado manualmente via migration, como já fazemos

## 2. Pegar as chaves da API

Em **Settings > API Keys**:
- Project URL
- Publishable key
- Secret key (Service Role) — seção "Secret keys" da mesma tela

## 3. Criar `.env.local` na raiz do projeto

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Nunca colocar prefixo `NEXT_PUBLIC_` na service role key — ela não pode ir pro client.

## 4. Linkar o projeto na CLI

A CLI já está instalada e logada nesta máquina (dev dependency, `npx supabase`). Só falta linkar o projeto novo:

```
npx supabase link --project-ref <ref-do-projeto>
```

## 5. Confirmar `.gitignore`

Antes de qualquer commit, confirmar que `.env.local` está no `.gitignore`.

## 6. Migrations automáticas

A partir daqui, toda migration nova é aplicada automaticamente via `supabase db push` pelo Claude Code, que avisa depois de aplicar (nunca antes). Não precisa mais copiar SQL manualmente no SQL Editor.

## 7. Cofre de acesso / dados sensíveis

Se o projeto for usar Cofre de acesso ou qualquer dado sensível, habilitar a extensão **pgsodium / Supabase Vault** em **Database > Extensions** antes de rodar a migration que depende dela.
