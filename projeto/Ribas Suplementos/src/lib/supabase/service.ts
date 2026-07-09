import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client com a service_role key — bypassa RLS. Só usar em Server Actions/route
 * handlers que precisam ler/escrever fora do escopo do usuário autenticado
 * (ex.: confirmar pedido via webhook de pagamento). Nunca importar num
 * Client Component; o pacote `server-only` quebra o build se tentar.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
