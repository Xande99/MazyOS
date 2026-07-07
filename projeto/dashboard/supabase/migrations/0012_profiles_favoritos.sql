-- Favoritos da sidebar: cada sócio marca os módulos que quer ver no
-- topo da navegação. Guarda os hrefs de src/lib/nav-items.ts. A RLS
-- de update já existente (profiles_update_own, auth.uid() = id)
-- garante que cada um só edita a própria lista.

alter table public.profiles
  add column favoritos text[] not null default '{}';
