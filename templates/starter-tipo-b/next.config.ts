import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVG habilitado só pro placeholder de exemplo (hero.svg) — se o
    // projeto real não usar SVG vindo de public/, pode remover isto e
    // a CSP de imagem junto.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
