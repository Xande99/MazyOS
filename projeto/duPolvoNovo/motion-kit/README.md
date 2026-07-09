# duPolvo Motion Kit

Empacota os padrões de animação que já provaram funcionar bem na LP da
duPolvo (`projeto/duPolvoNovo/duPolvo/js/main.js`) — reveal com stagger,
contador com easing, headline quebrada em palavras, coreografia de
entrada — como um kit genérico, sem dependência de nenhuma classe
específica daquela página. Objetivo: todo projeto novo herda esse
patamar de motion em vez de reinventar (ou não ter animação nenhuma).

Três formas de usar, conforme a stack do projeto (regra de stack em
`projeto/claude.md`):

1. **Vanilla JS** (este kit) — sites HTML/CSS/JS simples, sem build, ou
   como ilha mínima dentro de Astro.
2. **GSAP + ScrollTrigger** — obrigatório em Tipo A (Astro) por
   `projeto/claude.md`. Recipe abaixo.
3. **Motion (ex-Framer Motion)** — obrigatório em Tipo B (Next.js).
   Recipe abaixo.

Em todos os casos: só anima `transform`/`opacity`, sempre respeita
`prefers-reduced-motion`, easing assinatura
`cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out-expo` em `tokens/motion.css`).

---

## 1. Vanilla JS

Arquivos: `motion-kit.js` + `motion-kit.css` (companion, ver classes
`.reveal`, `[data-stagger]`, `.word`, `.entrance`).

```html
<link rel="stylesheet" href="../tokens/motion.css">
<link rel="stylesheet" href="motion-kit.css">
<script src="motion-kit.js"></script>
```

### Reveal on scroll (com ou sem stagger)

```html
<div class="reveal">Aparece sozinho ao entrar em cena</div>

<div class="prob__grid" data-stagger>
  <div class="pain">...</div>
  <div class="pain">...</div>
  <div class="pain">...</div>
</div>
```

```js
MotionKit.initReveal(); // seletor default: '.reveal, [data-stagger]'
```

### Contador de estatística

```html
<span class="stat__num" data-count="120" data-decimals="0">0</span>
```

```js
MotionKit.initReveal({
  selector: '.reveal, [data-stagger], .stats',
  onReveal: function (el) {
    if (!el.classList.contains('stats')) return;
    el.querySelectorAll('[data-count]').forEach(function (counter, i) {
      setTimeout(function () { MotionKit.animateCount(counter); }, i * 110 + 200);
    });
  }
});
```

### Headline quebrada em palavras (hero)

```html
<h1 id="heroHead">Sua marca tem <em>muitos</em> braços.</h1>
```

```js
MotionKit.splitWords(document.getElementById('heroHead'));
MotionKit.heroEntrance([
  { selector: '#heroHead .word', delay: 180, stagger: 70, className: 'in' },
  { selector: '.hero .eyebrow',  delay: 80,  className: 'hero-in' },
  { selector: '.hero p.lead',    delay: 620, className: 'hero-in' },
  { selector: '.hero__ctas',     delay: 780, className: 'hero-in' }
]);
```

Isso reproduz exatamente a sequência do hero da duPolvo (eyebrow →
palavras do headline em stagger de 70ms → lead → CTAs), só que
declarativa — qualquer projeto novo define seu próprio timeline sem
tocar no motor.

---

## 2. Equivalente em GSAP + ScrollTrigger (Tipo A / Astro)

```bash
npm install gsap
```

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // Reveal com stagger — equivalente ao initReveal()
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0, y: 24, duration: 0.7, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 86%' }
    });
  });

  // Headline em palavras — equivalente ao splitWords() + heroEntrance()
  const split = new SplitText('#heroHead', { type: 'words' });
  gsap.from(split.words, {
    opacity: 0, y: '45%', rotate: 3, duration: 0.7, ease: 'expo.out', stagger: 0.07
  });

  // Contador — equivalente ao animateCount()
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power3.out',
      onUpdate: () => (el.textContent = obj.v.toFixed(el.dataset.decimals || 0)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });
});
```

`gsap.matchMedia()` já cuida do `prefers-reduced-motion` — dentro do
bloco só roda se o usuário não pediu movimento reduzido.

---

## 3. Equivalente em Motion (Tipo B / Next.js)

```bash
npm install motion
```

```tsx
'use client';
import { motion, useReducedMotion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

// Reveal com stagger — equivalente ao initReveal({ selector: '[data-stagger]' })
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export function StaggerGrid({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      variants={shouldReduce ? undefined : container}
      initial={shouldReduce ? undefined : 'hidden'}
      whileInView={shouldReduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.14 }}
    >
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={item}>{c}</motion.div>)
        : children}
    </motion.div>
  );
}

// Contador — equivalente ao animateCount()
export function Counter({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.9 });
  const shouldReduce = useReducedMotion();
  const [value, setValue] = useState(shouldReduce ? target : 0);

  useEffect(() => {
    if (!inView || shouldReduce) return;
    const start = performance.now(), duration = 1800;
    let raf: number;
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, shouldReduce, target]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
```

Modais/dropdowns/toasts (`AnimatePresence`) seguem a mesma lógica —
ver a seção "Animação" de `projeto/claude.md` pro setup automático.

---

## Checklist ao adaptar pra um projeto novo

- [ ] Importar os tokens de motion (`tokens/motion.css` ou os
      equivalentes `--ease-out-expo`/durations no `tailwind.config`)
- [ ] `prefers-reduced-motion` testado de verdade (DevTools → Rendering
      → Emulate CSS media feature), não só assumido
- [ ] Stagger sempre por `transform`/`opacity`, nunca por propriedades
      que disparam layout/paint (`width`, `top`, `border-radius` animado
      — ver o comentário-fix em `duPolvo/css/style.css:393`)
- [ ] Registrar qualquer desvio da stack de animação padrão em
      `.claude/decisions.md` do projeto
