import type { Metadata } from "next";
import "./globals.css";

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
        {/* Preload da fonte de display — evita layout shift no maior texto acima da dobra (LCP) */}
        <link
          rel="preload"
          href="/fonts/BricolageGrotesque_36pt-ExtraBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
