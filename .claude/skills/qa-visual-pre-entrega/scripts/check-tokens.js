#!/usr/bin/env node
/* ============================================================
   check-tokens.js — varredura de conformidade de marca
   ============================================================
   Carrega uma URL num Chrome headless (Playwright) e lista toda
   cor efetivamente renderizada (color/background-color/border-color
   computados) que NÃO bate com a paleta aprovada — pega hex
   "inventado"/hardcoded, tema Tailwind default esquecido, ou drift
   entre o token file e o que foi de fato commitado no CSS.

   Isso não é coberto por Lighthouse (que audita contraste, não
   se a cor É a da marca) — ver SKILL.md pra onde essa varredura
   entra no checklist geral, junto com Lighthouse e os itens manuais.

   Uso:
     node check-tokens.js <url> [--tokens=caminho1.css,caminho2.css]

   Sem --tokens, usa a paleta default da duPolvo (tokens/colors.css).
   Saída: lista de cores fora da paleta, com contagem de uso e um
   seletor de exemplo. Exit code 1 se achar alguma, 0 se limpo.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DEFAULT_TOKENS = [
  path.join(__dirname, '..', '..', '..', '..', 'projeto', 'duPolvoNovo', 'tokens', 'colors.css')
];

const EXEMPT = new Set(['#ffffff', '#000000', 'transparent']);

function rgbToHex(rgbStr) {
  const m = rgbStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  const [, r, g, b, a] = m;
  if (a !== undefined && parseFloat(a) === 0) return 'transparent';
  const hex = (n) => parseInt(n, 10).toString(16).padStart(2, '0');
  return ('#' + hex(r) + hex(g) + hex(b)).toLowerCase();
}

function extractPalette(files) {
  const palette = new Set();
  files.forEach((file) => {
    if (!fs.existsSync(file)) {
      console.error('(aviso) arquivo de tokens não encontrado, ignorando: ' + file);
      return;
    }
    const css = fs.readFileSync(file, 'utf8');
    const matches = css.match(/#[0-9a-fA-F]{3,8}/g) || [];
    matches.forEach((hex) => {
      let h = hex.toLowerCase();
      if (h.length === 4) { // #abc -> #aabbcc
        h = '#' + [...h.slice(1)].map((c) => c + c).join('');
      }
      if (h.length === 9) h = h.slice(0, 7); // descarta canal alpha (#rrggbbaa)
      palette.add(h);
    });
  });
  return palette;
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => !a.startsWith('--'));
  const tokensArg = args.find((a) => a.startsWith('--tokens='));
  const tokenFiles = tokensArg
    ? tokensArg.replace('--tokens=', '').split(',').map((p) => path.resolve(p))
    : DEFAULT_TOKENS;

  if (!url) {
    console.error('Uso: node check-tokens.js <url> [--tokens=caminho1.css,caminho2.css]');
    process.exit(2);
  }

  const palette = extractPalette(tokenFiles);
  console.log('Paleta aprovada (' + palette.size + ' cores) extraída de:');
  tokenFiles.forEach((f) => console.log('  - ' + f));
  console.log('');

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  const found = await page.evaluate(() => {
    function selectorFor(el) {
      if (el.id) return '#' + el.id;
      if (el.className && typeof el.className === 'string' && el.className.trim()) {
        return el.tagName.toLowerCase() + '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
      }
      return el.tagName.toLowerCase();
    }
    const results = [];
    document.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      ['color', 'backgroundColor', 'borderTopColor'].forEach((prop) => {
        const val = cs[prop];
        if (!val) return;
        results.push({ value: val, selector: selectorFor(el), prop });
      });
    });
    return results;
  });

  await browser.close();

  const offPalette = new Map(); // hex -> { count, selector, prop }
  found.forEach(({ value, selector, prop }) => {
    const hex = rgbToHex(value);
    if (!hex || hex === 'transparent') return;
    if (EXEMPT.has(hex) || palette.has(hex)) return;
    const key = hex;
    if (!offPalette.has(key)) offPalette.set(key, { count: 0, selector, prop });
    offPalette.get(key).count++;
  });

  if (offPalette.size === 0) {
    console.log('✓ Nenhuma cor fora da paleta aprovada encontrada.');
    process.exit(0);
  }

  console.log('✗ ' + offPalette.size + ' cor(es) fora da paleta aprovada:\n');
  const rows = [...offPalette.entries()].sort((a, b) => b[1].count - a[1].count);
  rows.forEach(([hex, info]) => {
    console.log('  ' + hex + '  (' + info.count + 'x, ex.: ' + info.selector + ' → ' + info.prop + ')');
  });
  console.log('\nSe alguma dessas cores é intencional (identidade própria de um cliente,\nnão herdada da duPolvo), rode com --tokens apontando pro CSS de marca\ndesse cliente em vez do default.');
  process.exit(1);
}

main();
