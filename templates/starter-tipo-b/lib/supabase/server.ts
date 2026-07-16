import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase pra Server Components e Server Actions — lê/escreve
 * sessão via cookies do Next.js. Chamar de novo a cada request (não
 * reaproveitar a instância entre requisições).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` foi chamado de dentro de um Server Component.
            // Pode ser ignorado com segurança se o proxy (proxy.ts,
            // ex-middleware.ts) já estiver renovando a sessão em toda
            // navegação — é o caso aqui.
          }
        },
      },
    },
  );
}
