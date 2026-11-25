"use client";

import { motion } from "framer-motion";
import { useUI } from "@/lib/store";
import { scrollToTarget } from "@/lib/scroll";
import Button from "../ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

function Badge() {
  const text = "meio zíper · inteiro estilo · inverno 26 · ";
  return (
    <div className="relative h-28 w-28 md:h-36 md:w-36">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow" aria-hidden>
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="15" letterSpacing="3.6" fill="currentColor" fontWeight="600" style={{ textTransform: "uppercase" }}>
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-ink text-paper">
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path d="M12 4v16M6 14l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default function Hero() {
  const intro = useUI((s) => s.introDone);
  const show = intro ? "show" : "hidden";
  const rise = (d: number) => ({
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 1.2, ease: EASE, delay: d } },
  });
  const fade = (d: number) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: d } },
  });

  return (
    <section id="topo" className="relative flex h-[100svh] min-h-[640px] flex-col justify-between px-5 pb-24 pt-28 text-ink md:px-10 md:pb-10">
      <h1 className="sr-only">Jaguar Niche — quarter zips premium de merino, fleece, tech shell e moletom</h1>

      <motion.div initial="hidden" animate={show} className="eyebrow flex items-start justify-between">
        <motion.p variants={fade(0.1)} className="max-w-[13rem] leading-relaxed">
          <span className="text-ash">(01)</span> Quarter zips feitos para o frio
        </motion.p>
        <motion.div variants={fade(0.2)} className="hidden text-right leading-relaxed md:block">
          <p>Coleção Inverno 26</p>
          <p className="text-ash">Lote 03 / 1.200 peças</p>
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div initial="hidden" animate={show} className="md:max-w-[38%]">
          <h2 className="display text-[10.5vw] md:text-[4.2vw]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" variants={rise(0.15)}>
                Feito para
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" variants={rise(0.25)}>
                o <span className="font-serif font-normal normal-case italic tracking-normal">frio.</span>
              </motion.span>
            </span>
          </h2>
          <motion.div variants={fade(0.6)} className="mt-5 flex flex-wrap gap-2 md:mt-7 md:gap-3">
            <Button onClick={() => scrollToTarget("#loja")} label="Loja">
              Comprar agora
            </Button>
            <Button variant="ghost-ink" onClick={() => scrollToTarget("#modelos")}>
              Modelos
            </Button>
          </motion.div>
        </motion.div>

        <div className="flex items-end gap-8 md:max-w-[34%]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            className="hidden max-w-[17rem] text-[14px] leading-relaxed text-ink/70 md:block"
          >
            Meio zíper, gola alta e tecidos que trabalham por você. Quatro construções, cinco tons, nenhum excesso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
            animate={intro ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            className="hidden shrink-0 md:block"
          >
            <button onClick={() => scrollToTarget("#historia")} aria-label="Ir para a história" data-cursor="hover">
              <Badge />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
