import Image from "next/image";
import { ExpandableCard } from "@/components/ExpandableCard";

// Server Component por padrão — nenhuma diretiva "use client" aqui.
// Só o <ExpandableCard /> abaixo é Client Component (interatividade real).
export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="container-du flex items-center justify-between py-6">
        <span className="font-display text-lg font-extrabold text-blue">duPolvo</span>
        <nav aria-label="Navegação principal">
          <a
            href="#exemplo"
            className="rounded-pill bg-pink-ink px-5 py-2 text-sm font-bold text-white transition-colors duration-300 hover:bg-pink-600"
          >
            Fale com a gente
          </a>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container-du section-y grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-pink-ink">
              Starter Tipo B · Next.js
            </p>
            <h1 className="text-5xl leading-[0.96] font-extrabold text-blue md:text-6xl">
              Sistema, não site — <span className="text-pink-ink">com base pronta</span>.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-[--du-text-body]">
              Server Component nesta página, Client Component com Motion no card abaixo,
              Supabase configurado em <code>lib/supabase/</code> e proxy (<code>proxy.ts</code>)
              de auth de esqueleto — tudo pronto pra começar a feature real.
            </p>
          </div>

          <Image
            src="/hero.svg"
            alt="Composição gráfica de exemplo em amarelo-limão, rosa e verde-água sobre fundo azul-marinho, ilustrando a paleta de marca da duPolvo"
            width={1200}
            height={800}
            priority
            className="w-full rounded-xl"
          />
        </section>

        <section id="exemplo" className="bg-ink py-[--du-section-y]">
          <div className="container-du">
            <h2 className="text-3xl font-bold text-[--du-text-on-dark] md:text-4xl">
              Client Component com Motion
            </h2>
            <p className="mt-4 max-w-prose text-[--du-text-body-dark]">
              Clique pra expandir — a transição usa <code>AnimatePresence</code> e respeita{" "}
              <code>prefers-reduced-motion</code> automaticamente via{" "}
              <code>useReducedMotion()</code>.
            </p>
            <div className="mt-8 max-w-xl">
              <ExpandableCard title="Como isso funciona por baixo?">
                O componente é marcado com <code>&quot;use client&quot;</code> só porque precisa
                de estado (<code>useState</code>) e de gesto do usuário — o resto da página
                continua Server Component, sem JS extra no bundle.
              </ExpandableCard>
            </div>
          </div>
        </section>

        <section className="container-du section-y">
          <h2 className="text-3xl font-bold text-blue md:text-4xl">Paleta</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "cream", cls: "bg-cream border border-line" },
              { name: "ink", cls: "bg-ink" },
              { name: "pink", cls: "bg-pink-ink" },
              { name: "blue", cls: "bg-blue" },
              { name: "lime", cls: "bg-lime" },
              { name: "aqua", cls: "bg-aqua" },
            ].map((swatch) => (
              <div key={swatch.name}>
                <div className={`h-20 rounded-md ${swatch.cls}`} />
                <p className="mt-2 text-sm font-bold text-blue">{swatch.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container-du border-t border-line py-8 text-sm text-[--du-text-muted]">
        <p>duPolvo Studio — Guaratinguetá SP.</p>
      </footer>
    </div>
  );
}
