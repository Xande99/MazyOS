import type { Metadata } from "next";
import "./globals.css";

// Preload da fonte de display — evita layout shift no maior texto acima
// da dobra (LCP). Default = Bricolage Grotesque (linha visual da duPolvo,
// self-hosted em public/fonts/) — vale pra todo projeto que herda essa
// linha (Passo 1.2 do /novo-projeto).
//
// Projeto com tipografia própria (Passo 1.3 do /novo-projeto — nicho com
// _tipografia.md ou fallback Manrope+Inter): Passo 3.5 troca estas duas
// linhas pelo import Turbopack da fonte Fontsource escolhida, ex:
//   // @ts-expect-error -- Next não tem tipo pra import de asset ?url de pacote
//   import preloadFontHref from "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url";
//   const preloadFontType = "font/woff2";
// O sufixo `?url` resolve pro caminho final com hash do build (mesmo
// mecanismo do starter-tipo-a, confirmado via Turbopack em teste real,
// 2026-07-21) — nunca hardcodar o caminho, o Fontsource não garante nome
// de arquivo estável entre versões. `@ts-expect-error` é necessário: o
// Next não tem declaração de tipo pra imports `?url` de pacote (sem ele,
// o build falha no type-check).
const preloadFontHref = "/fonts/BricolageGrotesque_36pt-ExtraBold.ttf";
const preloadFontType = "font/ttf";

// TROCAR pela URL real do projeto assim que o cliente tiver domínio —
// alimenta metadataBase (usado pra resolver og:image/canonical absolutos).
const siteUrl = "https://exemplo.duPolvo.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "duPolvo Studio — Starter Tipo B",
    template: "%s · duPolvo Studio",
  },
  description:
    "Página de exemplo do starter Next.js da duPolvo: tokens de marca, Server Component, Client Component com Motion e Supabase configurados.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "duPolvo Studio",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        {/* Preload da fonte de display — evita layout shift no maior texto acima da dobra (LCP). Ver comentário acima. */}
        <link
          rel="preload"
          href={preloadFontHref}
          as="font"
          type={preloadFontType}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
