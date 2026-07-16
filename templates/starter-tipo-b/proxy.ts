import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Esqueleto de proxy de auth (era `middleware.ts` até o Next.js 16 —
 * ver https://nextjs.org/docs/messages/middleware-to-proxy) — renova
 * a sessão do Supabase em toda navegação. Sem isso, o token expira e
 * o usuário parece deslogado de forma aleatória.
 *
 * O bloco de redirecionamento de rota protegida está comentado de
 * propósito — cada projeto decide suas próprias rotas privadas.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() (não getSession()) — valida o token com o servidor do
  // Supabase em vez de só ler o cookie, que pode estar adulterado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Exemplo de rota protegida — ajustar/ativar conforme o projeto:
  // if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }
  void user;

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
