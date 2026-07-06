import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client com a service_role key — bypassa RLS e é a única forma de
 * chamar as funções do Cofre que tocam o Vault. NUNCA importar isso
 * num Client Component; o pacote `server-only` quebra o build se
 * alguém tentar. A chave nunca leva prefixo NEXT_PUBLIC_.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
