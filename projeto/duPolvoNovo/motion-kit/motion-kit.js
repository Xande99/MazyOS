/* ============================================================
   duPolvo Motion Kit — vanilla JS (no build step, no dependency)
   ============================================================
   Extraído dos padrões de animação já provados em
   projeto/duPolvoNovo/duPolvo/js/main.js (reveal com stagger,
   contador com easing, headline quebrada em palavras). Genérico:
   não depende de nenhuma classe específica da duPolvo — cada
   projeto novo configura seus próprios seletores.

   Requer o CSS companion `motion-kit.css` (ou equivalente) com as
   classes `.reveal`, `[data-stagger]` e `.word`, e os tokens de
   motion em ../tokens/motion.css (--ease-out-expo, --dur-reveal etc).

   Ver motion-kit/README.md para o recipe equivalente em GSAP
   (Tipo A/Astro) e Motion (Tipo B/Next.js) — a lib prescrita por
   projeto/claude.md para cada stack.
   ============================================================ */
(function (global) {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Split a heading into <span class="word"> for word-by-word reveal ───
     el: elemento com o texto (pode conter <br> e outras tags simples).
     wordClass: classe aplicada a cada palavra (default "word"). */
  function splitWords(el, wordClass) {
    wordClass = wordClass || 'word';
    if (!el || el.dataset.split) return;
    el.dataset.split = '1';
    var parts = [];
    el.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.trim().split(/\s+/).forEach(function (w) {
          if (w) parts.push('<span class="' + wordClass + '">' + w + '</span> ');
        });
      } else if (node.nodeName === 'BR') {
        parts.push('<br>');
      } else {
        parts.push(node.outerHTML);
      }
    });
    el.innerHTML = parts.join('');
  }

  /* ─── Contador com easing cúbico (ease-out), não linear ───
     el precisa de data-count="123" e opcionalmente data-decimals="1".
     opts.duration em ms (default 1800). Idempotente (roda uma vez só). */
  function animateCount(el, opts) {
    opts = opts || {};
    var duration = opts.duration || 1800;
    if (!el || el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = performance.now();
    function frame(now) {
      var p = Math.min((now - start) / duration, 1);
      var v = target * (1 - Math.pow(1 - p, 3)); // ease-out cúbico
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ─── Reveal on scroll + stagger de filhos, via IntersectionObserver ───
     opts:
       selector    — o que observar (default '.reveal, [data-stagger]')
       staggerStep — segundos entre cada filho de [data-stagger] (default 0.09)
       threshold, rootMargin — passados direto pro IntersectionObserver
       fallbackMs  — revela tudo que ainda não entrou em cena após N ms
                     (rede lenta / aba em background) — default 3200
       onReveal(el) — callback opcional, chamado quando `el` ganha a classe
                      `.in`; use pra disparar contadores, headline word-in
                      etc. específicos daquela seção (ver exemplos no README).
     Retorna a instância do IntersectionObserver, caso precise de controle manual. */
  function initReveal(opts) {
    opts = opts || {};
    var selector = opts.selector || '.reveal, [data-stagger]';
    var staggerStep = opts.staggerStep != null ? opts.staggerStep : 0.09;
    var fallbackMs = opts.fallbackMs != null ? opts.fallbackMs : 3200;

    function applyStagger(el) {
      if (!el.hasAttribute('data-stagger')) {
        el.style.willChange = 'transform, opacity';
        return;
      }
      Array.prototype.forEach.call(el.children, function (c, i) {
        c.style.willChange = 'transform, opacity';
        c.style.transitionDelay = (i * staggerStep) + 's';
      });
    }

    function clearWillChange(el) {
      var clearDelay = el.hasAttribute('data-stagger')
        ? (el.children.length * staggerStep * 1000 + 900)
        : 900;
      setTimeout(function () {
        el.style.willChange = 'auto';
        Array.prototype.forEach.call(el.querySelectorAll('[style*="will-change"]'), function (c) {
          c.style.willChange = 'auto';
        });
      }, clearDelay);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        applyStagger(el);
        requestAnimationFrame(function () {
          el.classList.add('in');
          if (typeof opts.onReveal === 'function') opts.onReveal(el);
          clearWillChange(el);
        });
        io.unobserve(el);
      });
    }, {
      threshold: opts.threshold != null ? opts.threshold : 0.14,
      rootMargin: opts.rootMargin || '0px 0px -6% 0px'
    });

    document.querySelectorAll(selector).forEach(function (el) { io.observe(el); });

    // Fallback: revela o que sobrou (aba em background, rede lenta)
    setTimeout(function () {
      document.querySelectorAll(selector + ':not(.in)').forEach(function (el) {
        applyStagger(el);
        el.classList.add('in');
        if (typeof opts.onReveal === 'function') opts.onReveal(el);
      });
    }, fallbackMs);

    return io;
  }

  /* ─── Coreografia de entrada (hero, ou qualquer bloco above-the-fold) ───
     steps: array de { selector, delay, className }.
       selector  — elemento (ou NodeList via querySelectorAll) a animar
       delay     — ms de espera antes de aplicar a classe
       className — classe adicionada (default 'hero-in'); pra grupos com
                   múltiplos elementos que devem staggerar entre si (ex.
                   palavras do headline, chips flutuantes), passe
                   `stagger: 70` (ms entre cada elemento do NodeList).
     Com prefers-reduced-motion, aplica tudo instantaneamente, sem delays.
     Exemplo de uso equivalente ao hero da duPolvo: ver README. */
  function heroEntrance(steps) {
    (steps || []).forEach(function (step) {
      var className = step.className || 'hero-in';
      var nodes = typeof step.selector === 'string'
        ? document.querySelectorAll(step.selector)
        : step.selector;
      if (!nodes) return;
      var list = nodes.length != null ? Array.prototype.slice.call(nodes) : [nodes];

      if (reduce) {
        list.forEach(function (el) { el && el.classList.add(className); });
        return;
      }

      list.forEach(function (el, i) {
        if (!el) return;
        var d = step.delay || 0;
        if (step.stagger) d += i * step.stagger;
        setTimeout(function () { el.classList.add(className); }, d);
      });
    });
  }

  global.MotionKit = {
    prefersReducedMotion: reduce,
    splitWords: splitWords,
    animateCount: animateCount,
    initReveal: initReveal,
    heroEntrance: heroEntrance
  };
})(window);
