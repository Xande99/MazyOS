// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TROCAR pelo domínio real assim que o projeto tiver um — alimenta
  // canonical URL e og:url/twitter:url no Layout.astro. Sem isso
  // configurado, o build falha (Astro.site fica undefined).
  site: 'https://exemplo.duPolvo.com.br',
  vite: {
    plugins: [tailwindcss()],
  },
});
