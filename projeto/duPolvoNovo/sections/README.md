# Biblioteca de seções de LP

Seções de landing page genericizadas a partir dos padrões que já
funcionam bem em `duPolvo/index.html` (a entrega mais bem executada do
front-end da agência, ver auditoria de qualidade de 2026-07-09). Cada
`.html` aqui é um bloco autossuficiente, pronto pra copiar pra dentro
de um projeto novo (Tipo A/Astro, ou HTML puro) e adaptar o conteúdo —
o objetivo é todo projeto novo começar no nível "LP da duPolvo", não
no nível "scaffold em branco".

**Não são componentes React/Astro** — são HTML + classes já definidas
no CSS do design system. Pra Astro, cole dentro de um `.astro` como
markup normal (o CSS/tokens já funcionam via import global); pra
Next.js, a estrutura visual serve de referência mas precisa virar JSX
e a animação precisa ser reescrita em `motion` (ver `motion-kit/README.md`).

## O que tem aqui

| Arquivo | Seção | Fundo |
|---|---|---|
| `hero.html` | Hero com headline em palavras, CTAs, prova social, chips flutuantes | dark |
| `problem-grid.html` | Grid de 4 dores/benefícios | claro |
| `process-steps.html` | Processo em 4 etapas (+ variante dark com anel de ícone) | claro/dark |
| `stats.html` | Diferenciais + contador de números | dark |
| `faq.html` | Accordion de perguntas frequentes | claro |
| `cta-final.html` | CTA final com headline em palavras | dark |

Faltando de propósito (ainda não extraídas — podem virar seção nova se
precisar): grid de serviços (`.serv-card`, ver `duPolvo/index.html
#servicos`) e grid de posts/blog (`.post`, `#blog`) — ambas já existem
no CSS, só não foram genericizadas ainda porque são mais específicas
de conteúdo institucional do que reaproveitáveis "as is".

## Dependências

Todo projeto que for usar essas seções precisa, nessa ordem:

```html
<link rel="stylesheet" href="tokens/colors.css">
<link rel="stylesheet" href="tokens/typography.css">
<link rel="stylesheet" href="tokens/spacing.css">
<link rel="stylesheet" href="tokens/motion.css">
<link rel="stylesheet" href="tokens/fonts.css">
<!-- ou o bundle único: <link rel="stylesheet" href="styles.css"> -->
<link rel="stylesheet" href="motion-kit/motion-kit.css">

<!-- + o CSS de componentes (classes .hero, .btn, .pain, .stat, .faq-*
     etc.) — hoje isso vive dentro de duPolvo/css/style.css misturado
     com o restante do CSS daquela página. Se for extrair pra um
     components.css próprio do design system, essa é a próxima dívida
     técnica óbvia (está listado no plano de evolução do front-end). -->

<script src="motion-kit/motion-kit.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Split de headlines que usam entrada palavra-por-palavra
    MotionKit.splitWords(document.getElementById('heroHead'));
    MotionKit.splitWords(document.querySelector('.cta__card h2'));

    // 2. Coreografia do hero
    MotionKit.heroEntrance([
      { selector: '.hero .eyebrow',  delay: 80,  className: 'hero-in' },
      { selector: '#heroHead .word', delay: 180, stagger: 70, className: 'in' },
      { selector: '.hero p.lead',    delay: 620, className: 'hero-in' },
      { selector: '.hero__ctas',     delay: 780, className: 'hero-in' },
      { selector: '.hero__proof',    delay: 960, className: 'hero-in' },
      { selector: '.octo',           delay: 260, className: 'hero-in' },
      { selector: '.hero__chip',     delay: 540, stagger: 150, className: 'hero-in' }
    ]);

    // 3. Reveal on scroll de tudo (stats + CTA words tratados via onReveal)
    MotionKit.initReveal({
      onReveal: function (el) {
        if (el.classList.contains('stats')) {
          el.querySelectorAll('[data-count]').forEach(function (counter, i) {
            setTimeout(function () { MotionKit.animateCount(counter); }, i * 110 + 200);
          });
        }
        if (el.classList.contains('cta__card')) {
          var words = el.querySelectorAll('h2 .word');
          words.forEach(function (w, i) {
            setTimeout(function () { w.classList.add('in'); }, i * 100 + 420);
          });
          var ctas = el.querySelector('.cta__ctas');
          if (ctas) setTimeout(function () { ctas.classList.add('cta-in'); },
            420 + words.length * 100 + 200);
        }
      }
    });

    // 4. FAQ accordion (se a página tiver a seção)
    document.querySelectorAll('#faqList .faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        document.querySelectorAll('#faqList .faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = null;
        });
        if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  });
</script>
```

## Checklist ao montar uma LP nova com essas seções

- [ ] Ler `_memoria/oportunidades-sistemas.md` e o briefing do cliente
      antes — essas seções são estrutura, não substituem copy/estratégia
- [ ] Rodar o "kit mínimo" de skills de `projeto/claude.md`
      (`storybrand-messaging` → `copywriting` → `frontend-design` →
      `hooked-ux` → `cro-methodology`) antes de preencher o conteúdo
- [ ] Trocar TODO placeholder — nenhum "Lorem"/número inventado deve
      sobreviver até a entrega (ver comentário em `stats.html`)
- [ ] Se o cliente tem identidade própria (cor/tipografia diferentes de
      duPolvo), sobrescrever os tokens no projeto do cliente, não editar
      os tokens daqui — este é o design system da duPolvo, não do cliente
- [ ] Rodar o checklist de QA visual pré-entrega antes de publicar
      (contraste, Lighthouse, landmarks — ver plano de evolução do
      front-end, item 5)
