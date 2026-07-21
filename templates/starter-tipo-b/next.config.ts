import type { NextConfig } from "next";

// Baseline de headers de seguranca — mesmo conjunto aplicado em
// dashboard/Ribas na auditoria de seguranca (achado Medio: nenhum projeto
// tinha nenhum header configurado). CSP fica de fora aqui tambem — cada
// projeto tem rotas/scripts diferentes o suficiente pra exigir tuning
// caso a caso, nao dá pra herdar um CSP genérico com seguranca.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // SVG habilitado só pro placeholder de exemplo (hero.svg) — se o
    // projeto real não usar SVG vindo de public/, pode remover isto e
    // a CSP de imagem junto.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
