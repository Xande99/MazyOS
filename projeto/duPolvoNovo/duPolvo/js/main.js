(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Icons ─── */
  if (window.lucide) lucide.createIcons();

  /* ─── Header scroll ─── */
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 20); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── Ticker: duplicate content for seamless loop ─── */
  var track = document.getElementById('ticker');
  if (track) track.innerHTML += track.innerHTML;

  /* ─── CTA h2 word split ─── */
  var ctaH2 = document.querySelector('.cta__card h2');
  if (ctaH2) {
    var parts = [];
    ctaH2.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.trim().split(/\s+/).forEach(function (w) {
          if (w) parts.push('<span class="word">' + w + '</span> ');
        });
      } else if (node.nodeName === 'BR') {
        parts.push('<br>');
      } else {
        parts.push(node.outerHTML);
      }
    });
    ctaH2.innerHTML = parts.join('');
  }

  /* ─── Stat counter animation ─── */
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var dec    = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var dur = 1800, start = performance.now();
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ─── Hero entrance sequence ─── */
  function heroEntrance() {
    var eyebrow = document.querySelector('.hero .eyebrow');
    var words   = document.querySelectorAll('#heroHead .word');
    var lead    = document.querySelector('.hero p.lead');
    var ctas    = document.querySelector('.hero__ctas');
    var proof   = document.querySelector('.hero__proof');
    var octo    = document.querySelector('.octo');
    var chips   = document.querySelectorAll('.hero__chip');

    if (reduce) {
      [eyebrow, lead, ctas, proof, octo].forEach(function (el) {
        if (el) { el.classList.add('hero-in'); el.classList.add('in'); }
      });
      words.forEach(function (w) { w.classList.add('in'); });
      chips.forEach(function (c) { c.classList.add('hero-in'); });
      return;
    }

    /* eyebrow */
    setTimeout(function () { if (eyebrow) eyebrow.classList.add('hero-in'); }, 80);

    /* headline words — stagger 70ms each, start at 180ms */
    words.forEach(function (w, i) {
      setTimeout(function () { w.classList.add('in'); }, 180 + i * 70);
    });

    /* timing after last word finishes its 700ms transition */
    var afterWords = 180 + words.length * 70 + 680;

    /* lead */
    setTimeout(function () { if (lead) lead.classList.add('hero-in'); }, afterWords - 160);

    /* ctas */
    setTimeout(function () { if (ctas) ctas.classList.add('hero-in'); }, afterWords + 80);

    /* proof */
    setTimeout(function () { if (proof) proof.classList.add('hero-in'); }, afterWords + 260);

    /* octo slides in from right */
    setTimeout(function () { if (octo) octo.classList.add('hero-in'); }, 260);

    /* chips stagger after octo */
    chips.forEach(function (chip, i) {
      setTimeout(function () { chip.classList.add('hero-in'); }, 540 + i * 150);
    });
  }

  /* ─── IntersectionObserver: reveal + stagger + counters + CTA ─── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;

      /* Apply stagger delays BEFORE .in so CSS transitions fire correctly */
      if (el.hasAttribute('data-stagger')) {
        Array.prototype.forEach.call(el.children, function (c, i) {
          c.style.willChange = 'transform, opacity';
          c.style.transitionDelay = (i * 0.09) + 's';
        });

        /* Proc numbers get extra delay so they appear after the card starts */
        if (el.classList.contains('proc__grid')) {
          Array.prototype.forEach.call(el.children, function (c, i) {
            var num = c.querySelector('.proc-item__n');
            if (num) num.style.transitionDelay = (i * 0.09 + 0.18) + 's';
          });
        }
      } else {
        el.style.willChange = 'transform, opacity';
      }

      /* Use rAF so the delay styles settle before the class triggers transitions */
      requestAnimationFrame(function () {
        el.classList.add('in');

        /* Counters inside .stats */
        if (el.classList.contains('stats')) {
          el.querySelectorAll('[data-count]').forEach(function (counter, i) {
            setTimeout(function () { animateCount(counter); }, i * 110 + 200);
          });
        }

        /* CTA card: words start after card slides up (~400ms), buttons after words */
        if (el.classList.contains('cta__card')) {
          var ctaWords = el.querySelectorAll('h2 .word');
          ctaWords.forEach(function (w, i) {
            setTimeout(function () { w.classList.add('in'); }, i * 100 + 420);
          });
          var ctaCtas = el.querySelector('.cta__ctas');
          if (ctaCtas) {
            setTimeout(function () { ctaCtas.classList.add('cta-in'); }, 420 + ctaWords.length * 100 + 200);
          }
        }

        /* Libera will-change após a entrada terminar (≈ 900ms cobre a transição mais longa) */
        var clearDelay = el.hasAttribute('data-stagger')
          ? (el.children.length * 90 + 900)
          : 900;
        setTimeout(function () {
          el.style.willChange = 'auto';
          Array.prototype.forEach.call(el.querySelectorAll('[style*="will-change"]'), function (c) {
            c.style.willChange = 'auto';
          });
        }, clearDelay);
      });

      io.unobserve(el);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.reveal, [data-stagger]').forEach(function (el) {
    io.observe(el);
  });

  /* ─── Mobile menu ─── */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileNav  = document.getElementById('mobileNav');

  function openMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.removeAttribute('inert');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.setAttribute('inert', '');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) { closeMenu(); } else { openMenu(); }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  /* ─── FAQ accordion ─── */
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

  /* ─── Fallback: reveal anything still hidden after 3s (slow network / bg tab) ─── */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in), [data-stagger]:not(.in)').forEach(function (el) {
      if (el.hasAttribute('data-stagger')) {
        Array.prototype.forEach.call(el.children, function (c, i) {
          c.style.transitionDelay = (i * 0.09) + 's';
        });
        if (el.classList.contains('stats')) {
          el.querySelectorAll('[data-count]').forEach(function (counter) {
            animateCount(counter);
          });
        }
      }
      el.classList.add('in');
      /* CTA fallback */
      if (el.classList.contains('cta__card')) {
        var fb = el.querySelectorAll('h2 .word');
        fb.forEach(function (w, i) { setTimeout(function () { w.classList.add('in'); }, i * 100); });
        var fbCtas = el.querySelector('.cta__ctas');
        if (fbCtas) setTimeout(function () { fbCtas.classList.add('cta-in'); }, fb.length * 100 + 200);
      }
    });
  }, 3200);

  /* ─── Boot ─── */
  heroEntrance();
})();

/* ─── Solução: linha de processo pinada com scroll (GSAP + ScrollTrigger) ───
   Só ativa com motion permitido e as duas libs carregadas — sem elas, ou com
   prefers-reduced-motion, a seção fica no estado final estático (ver CSS,
   regras .motion-ready), sem perda de conteúdo. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var section = document.getElementById('solucao');
  var stepsEl = section && document.getElementById('stepsRow');
  var fill    = stepsEl && stepsEl.querySelector('.steps__line-fill');
  if (!section || !stepsEl || !fill || reduce) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  stepsEl.classList.add('motion-ready');

  var steps = stepsEl.querySelectorAll('.step');
  var thresholds = Array.prototype.map.call(steps, function (_, i) {
    return (i + 1) / steps.length - 0.08;
  });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=100%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      onUpdate: function (self) {
        Array.prototype.forEach.call(steps, function (step, i) {
          step.classList.toggle('step--active', self.progress >= thresholds[i]);
        });
      }
    }
  });

  tl.to(fill, { scaleX: 1, ease: 'none' });
})();

/* ─── Contact modal ─── */
(function () {
  var MODAL_HTML =
    '<div class="modal-overlay" id="contactModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>' +
      '<div class="modal" id="modalBox">' +
        '<button class="modal__close" id="modalClose" aria-label="Fechar">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<h2 class="modal__title" id="modalTitle">Conta o que você precisa</h2>' +
        '<p class="modal__sub">A gente responde em até 24h úteis.</p>' +
        '<form class="modal-form" id="contactForm" novalidate>' +
          '<div class="modal-field" id="field-nome">' +
            '<label for="modal-nome">Nome <span aria-hidden="true">*</span></label>' +
            '<input type="text" id="modal-nome" name="nome" autocomplete="name" required placeholder="Seu nome">' +
            '<span class="field-error" id="err-nome">Por favor, informe seu nome.</span>' +
          '</div>' +
          '<div class="modal-field" id="field-email">' +
            '<label for="modal-email">E-mail <span aria-hidden="true">*</span></label>' +
            '<input type="email" id="modal-email" name="email" autocomplete="email" required placeholder="seu@email.com">' +
            '<span class="field-error" id="err-email">Por favor, informe um e-mail válido.</span>' +
          '</div>' +
          '<div class="modal-field">' +
            '<label for="modal-whatsapp">WhatsApp <span style="font-weight:400;opacity:.55">(opcional)</span></label>' +
            '<input type="tel" id="modal-whatsapp" name="whatsapp" autocomplete="tel" placeholder="(11) 99999-0000">' +
          '</div>' +
          '<div class="modal-field" id="field-servico">' +
            '<label for="modal-servico">Serviço de interesse <span aria-hidden="true">*</span></label>' +
            '<select id="modal-servico" name="servico" required>' +
              '<option value="">Selecione um serviço</option>' +
              '<option value="Todos os serviços — pacote completo">Todos os serviços — quero o pacote completo</option>' +
              '<option value="Programação">Programação</option>' +
              '<option value="Design">Design</option>' +
              '<option value="Vídeo &amp; Edição">Vídeo &amp; Edição</option>' +
              '<option value="Tráfego Pago">Tráfego Pago</option>' +
              '<option value="Não sei ainda">Não sei ainda</option>' +
            '</select>' +
            '<span class="field-error" id="err-servico">Por favor, selecione um serviço.</span>' +
          '</div>' +
          '<div class="modal-field" id="field-mensagem">' +
            '<label for="modal-mensagem">Mensagem <span aria-hidden="true">*</span></label>' +
            '<textarea id="modal-mensagem" name="mensagem" rows="4" required placeholder="Conta um pouco sobre o que você precisa..."></textarea>' +
            '<span class="field-error" id="err-mensagem">Por favor, escreva uma mensagem.</span>' +
          '</div>' +
          '<button type="submit" class="btn btn--lg" style="justify-content:center"><span>Enviar mensagem</span></button>' +
        '</form>' +
        '<div class="modal-success" id="modalSuccess" aria-live="polite" aria-atomic="true">' +
          '<div class="modal-success__icon">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</div>' +
          '<p>Recebemos! A gente te responde em breve. 🐙</p>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  var overlay   = document.getElementById('contactModal');
  var box       = document.getElementById('modalBox');
  var closeBtn  = document.getElementById('modalClose');
  var form      = document.getElementById('contactForm');
  var success   = document.getElementById('modalSuccess');
  var trigger   = document.getElementById('btnEmail');
  var lastFocus = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      box.querySelectorAll('button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled; });
  }

  function openModal() {
    lastFocus = document.activeElement;
    overlay.removeAttribute('hidden');
    overlay.getBoundingClientRect(); // force reflow so transition fires
    overlay.classList.add('modal-visible');
    document.body.classList.add('modal-open');
    setTimeout(function () {
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    }, 50);
  }

  function closeModal() {
    overlay.classList.remove('modal-visible');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
    setTimeout(function () {
      overlay.setAttribute('hidden', '');
      form.reset();
      form.querySelectorAll('.modal-field.has-error').forEach(function (f) {
        f.classList.remove('has-error');
      });
      form.style.display = '';
      success.classList.remove('visible');
    }, 320);
  }

  // Focus trap
  overlay.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('modal-visible')) closeModal();
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);
  if (trigger) trigger.addEventListener('click', openModal);

  function validateField(fieldEl, inputEl) {
    var val = inputEl.value.trim();
    var ok  = true;
    if (inputEl.required && !val) {
      ok = false;
    } else if (inputEl.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      ok = false;
    }
    fieldEl.classList.toggle('has-error', !ok);
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nomeEl     = document.getElementById('modal-nome');
    var emailEl    = document.getElementById('modal-email');
    var servicoEl  = document.getElementById('modal-servico');
    var mensagemEl = document.getElementById('modal-mensagem');
    var whatsEl    = document.getElementById('modal-whatsapp');

    var results = [
      validateField(document.getElementById('field-nome'),     nomeEl),
      validateField(document.getElementById('field-email'),    emailEl),
      validateField(document.getElementById('field-servico'),  servicoEl),
      validateField(document.getElementById('field-mensagem'), mensagemEl)
    ];

    if (!results.every(Boolean)) {
      var firstErr = form.querySelector('.modal-field.has-error input,.modal-field.has-error select,.modal-field.has-error textarea');
      if (firstErr) firstErr.focus();
      return;
    }

    var whats = whatsEl.value.trim();
    var lines = [
      'Nome: ' + nomeEl.value.trim(),
      'E-mail: ' + emailEl.value.trim()
    ];
    if (whats) lines.push('WhatsApp: ' + whats);
    lines.push('Serviço: ' + servicoEl.value, '', 'Mensagem:', mensagemEl.value.trim());

    window.location.href =
      'mailto:ola@dupolvo.com.br' +
      '?subject=' + encodeURIComponent('Contato via site — ' + servicoEl.value) +
      '&body='    + encodeURIComponent(lines.join('\n'));

    form.style.display = 'none';
    success.classList.add('visible');
  });

  form.addEventListener('input', function (e) {
    var field = e.target.closest('.modal-field');
    if (field) field.classList.remove('has-error');
  });
})();
