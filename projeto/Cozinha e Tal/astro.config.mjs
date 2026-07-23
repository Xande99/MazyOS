// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TROCAR pelo domínio real assim que o projeto tiver um — alimenta
  // canonical URL e og:url/twitter:url no Layout.astro. Sem isso
  // configurado, o build falha (Astro.site fica undefined).
  site: 'https://exemplo.duPolvo.com.br',
  build: {
    // 'always' em vez do default 'auto' (só inlina <4kb): o CSS compilado
    // da página (Tailwind + theme.css + fonte) passa de 4kb e virava um
    // arquivo externo render-blocking (~163ms de LCP em Fast 4G/4x CPU,
    // medido via Chrome DevTools trace, 2026-07-22). Página única sem
    // navegação entre rotas — não há cache cross-page a perder inlinando
    // tudo. Ver .claude/decisions.md.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
