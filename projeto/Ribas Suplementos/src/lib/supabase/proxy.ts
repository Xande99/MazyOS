import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "./configurado";

/**
 * Loja é pública por padrão (catálogo, carrinho e checkout como convidado
 * não exigem login). O proxy só renova a sessão e protege /conta.
 */
export async function updateSession(request: NextRequest) {
  // Antes do .env.local ser preenchido (checklist de setup do Supabase),
  // deixa passar sem tentar autenticar — cada página trata a ausência de
  // configuração mostrando um aviso, em vez do proxy quebrar o site inteiro.
  if (!supabaseConfigurado()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isContaRoute = request.nextUrl.pathname.startsWith("/conta");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if (!user && isContaRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/conta";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
