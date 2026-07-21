-- Testes de impersonação RLS — MazyOS
--
-- Como usar: colar o bloco do projeto desejado no SQL Editor do Supabase
-- (dashboard.supabase.com > SQL Editor) e rodar. Usa o padrão idiomático
-- do Postgres/Supabase pra simular um request autenticado sem precisar de
-- sessão real: `set role` troca o role do Postgres, `request.jwt.claims`
-- é o GUC que o PostgREST usa pra resolver `auth.uid()` dentro das
-- policies — sem ele, `auth.uid()` retorna null mesmo com `role = authenticated`.
--
-- Reexecutar sempre que o schema de RLS mudar (rotina registrada em
-- ACOES-MANUAIS.md). Todo bloco de escrita já vem com o cleanup embutido
-- logo depois — não deixar rodando parcialmente.

-- ================================================================
-- DASHBOARD (projeto real, ref nexflcqiwfovdvhfevyc)
-- ================================================================
-- Verificado via script Node com supabase-js (login real com a conta de
-- teste + client anon), não via SQL Editor — mais fiel ao tráfego real
-- (PostgREST), que é o que a RLS de fato intercepta. Resultado em
-- 2026-07-20: 10/10 casos passaram, zero achado crítico, zero linha
-- residual. Os blocos SQL abaixo reproduzem os mesmos 4 cenários pra
-- reexecução futura sem precisar de Node — equivalentes, não idênticos
-- byte a byte, no mecanismo de simulação.

-- Caso 1: anon não lê nem escreve em contacts (política "contacts_all_authenticated" é só p/ authenticated)
set role anon;
select count(*) as deve_ser_zero from public.contacts;
-- insert deve falhar com "new row violates row-level security policy":
-- insert into public.contacts (categoria, nome) values ('cliente', '__RLS_TEST__');
reset role;

-- Caso 2: authenticated (using(true)) lê/escreve contacts — comportamento esperado, não é falha
-- Trocar <TEST_USER_ID> pelo id real da conta de teste (select id from auth.users where email = '<TEST_EMAIL do .env.local>')
set role authenticated;
set local request.jwt.claims = '{"sub": "<TEST_USER_ID>", "role": "authenticated"}';
insert into public.contacts (categoria, nome, tags)
  values ('cliente', '__RLS_TEST_CASE2__ apagar', array['__rls_test__'])
  returning id \gset
select * from public.contacts where id = :'id';
delete from public.contacts where id = :'id'; -- cleanup imediato, mesma sessão
reset role;

-- Caso 3: authenticated só atualiza o próprio profiles (auth.uid() = id), não o de outro sócio
-- Trocar <TEST_USER_ID> pelo mesmo id do Caso 2, <OUTRO_USER_ID> por qualquer outro sócio real
set role authenticated;
set local request.jwt.claims = '{"sub": "<TEST_USER_ID>", "role": "authenticated"}';
update public.profiles set cor_avatar = cor_avatar where id = '<OUTRO_USER_ID>';
-- espera "UPDATE 0" (RLS filtra a linha antes do update, não dá erro — só afeta 0 linhas)
reset role;

-- Caso 4: RPCs do Cofre são revogadas de authenticated, só service_role executa
set role authenticated;
set local request.jwt.claims = '{"sub": "<TEST_USER_ID>", "role": "authenticated"}';
select public.cofre_revelar_segredo('00000000-0000-0000-0000-000000000000');
-- espera "permission denied for function cofre_revelar_segredo"
reset role;

-- Nota sobre 4b (chamada via PostgREST/RPC HTTP, não reproduzível em SQL puro):
-- no teste real (script Node), authenticated.rpc('cofre_criar_entrada', {...})
-- não retornou "permission denied" como o 4a — retornou "Could not find the
-- function public.cofre_criar_entrada(...) in the schema cache". Motivo: o
-- PostgREST monta o schema cache por role: como a função foi revogada de
-- authenticated (revoke ... from public, anon, authenticated), ela nem
-- aparece no cache exposto àquele role — parece "não existe" em vez de
-- "negado". Mesmo efeito de segurança (authenticated nunca consegue chamar),
-- mecanismo de rejeição diferente — só documentando pra quem for auditar
-- depois não estranhar a mensagem de erro.

-- ================================================================
-- RIBAS SUPLEMENTOS (Supabase ainda não criado/linkado — ver ACOES-MANUAIS.md)
-- ================================================================
-- ESCRITO, NÃO VERIFICADO. Sem projeto Supabase e sem Docker nesta máquina,
-- não há como rodar isso ainda. Baseado só na leitura da migration
-- (supabase/migrations/20260709042944_schema_inicial.sql) — reflete o que
-- as policies deveriam fazer, não o que foi observado rodando de verdade.
-- Rodar (e corrigir se algo não bater) assim que o projeto existir —
-- pendência já registrada em ACOES-MANUAIS.md.

-- Caso 1: anon insere pedido (guest checkout — esperado, não é falha)
set role anon;
insert into pedidos (nome_cliente, email_cliente, telefone_cliente, endereco, total_centavos)
  values ('__RLS_TEST__ convidado', 'teste@example.com', '11999999999',
          '{"rua":"Rua X","numero":"1","bairro":"B","cidade":"C","uf":"SP","cep":"01001-000"}', 1000)
  returning id \gset
reset role;

-- Caso 2: anon (ou outro authenticated) não enxerga pedido de terceiro
-- (policy "pedidos: dono vê os próprios" é só pra authenticated com cliente_user_id = auth.uid())
set role anon;
select count(*) as deve_ser_zero from pedidos where id = :'id';
reset role;

set role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-000000000099", "role": "authenticated"}'; -- uuid qualquer, não é o dono
select count(*) as deve_ser_zero from pedidos where id = :'id';
reset role;

-- Caso 3: dono autenticado enxerga só os próprios. O insert do checkout
-- (checkout/actions.ts) já foi corrigido em 2026-07-20 pra preencher
-- cliente_user_id quando o cliente está logado (antes ficava sempre null,
-- então nenhum pedido de cliente logado nunca aparecia aqui) — mas o fix
-- ainda não foi verificado contra um banco de verdade (sem projeto Supabase
-- do Ribas ainda). Rodar este caso assim que o projeto existir.
-- Trocar <DONO_USER_ID> por um usuário real depois que a fixture existir.
set role authenticated;
set local request.jwt.claims = '{"sub": "<DONO_USER_ID>", "role": "authenticated"}';
select count(*) as deve_ser_maior_que_zero from pedidos where cliente_user_id = '<DONO_USER_ID>';
reset role;

-- cleanup do Caso 1 (rodar como service_role / postgres, RLS não deixa anon apagar)
-- delete from pedidos where id = :'id';
