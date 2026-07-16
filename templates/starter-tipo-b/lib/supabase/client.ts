import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase pro navegador — usar dentro de Client Components
 * ("use client"). Para Server Components/Actions, usar
 * lib/supabase/server.ts em vez deste.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
