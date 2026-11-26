import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PAGES, getPage, pageHref, type Block } from "@/lib/institutional";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";
import Logo from "@/components/ui/Logo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  return { title: page ? `${page.title} — Jaguar Niche` : "Jaguar Niche" };
}

const linkCls = "font-semibold underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink";

/** Turns {tokens} inside a sentence into links. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\{\w+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        switch (part) {
          case "{whatsapp}":
            return (
              <a key={i} href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkCls}>
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            );
          case "{instagram}":
            return (
              <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {INSTAGRAM_HANDLE}
              </a>
            );
          case "{privacidade}":
            return getPage("privacidade") ? (
              <Link key={i} href={pageHref("privacidade")} className={linkCls}>
                Política de Privacidade
              </Link>
            ) : (
              <span key={i}>Política de Privacidade</span>
            );
          case "{loja}":
            return (
              <Link key={i} href="/" className={linkCls}>
                nossa loja
              </Link>
            );
          default:
            return <span key={i}>{part}</span>;
        }
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string") {
    return (
      <p className="text-[15px] leading-relaxed text-ink/75 md:text-base">
        <Rich text={block} />
      </p>
    );
  }
  return (
    <ul className="space-y-3 border-l border-ink/15 pl-5">
      {block.list.map((item, i) => {
        const [head, ...rest] = item.split(": ");
        return (
          <li key={i} className="text-[15px] leading-relaxed text-ink/75 md:text-base">
            {rest.length ? (
              <>
                <strong className="font-semibold text-ink">{head}:</strong> <Rich text={rest.join(": ")} />
              </>
            ) : (
              <Rich text={item} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default async function InstitutionalRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <div className="relative min-h-screen text-ink">
      <div aria-hidden className="tex-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.045]" />

      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Jaguar Niche — página inicial">
            <Logo className="h-7 w-7" />
            <span className="display text-lg leading-none tracking-tight md:text-xl">
              Jaguar <span className="font-serif font-normal normal-case italic tracking-normal">Niche</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            ← Voltar à loja
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 pb-24 pt-14 md:grid-cols-[220px_1fr] md:px-10 md:pt-20">
        <nav aria-label="Institucional" className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow mb-4 text-ash">Institucional</p>
          <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
            {PAGES.map((p) => {
              const active = p.slug === page.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={pageHref(p.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-sm transition-colors md:rounded-xl ${
                      active ? "bg-ink text-paper" : "border border-ink/15 hover:bg-ink/5 md:border-transparent"
                    }`}
                  >
                    {p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="min-w-0 max-w-3xl">
          <p className="eyebrow text-ash">Última atualização: {page.updated}</p>
          <h1 className="display mt-4 break-words text-[8.4vw] md:text-7xl">{page.title}</h1>
          <p className="mt-6 font-serif text-2xl italic leading-snug md:text-3xl">{page.intro}</p>

          <ol className="mt-14 space-y-12">
            {page.sections.map((s, i) => (
              <li key={s.title} className="grid gap-4 border-t border-ink/15 pt-8 md:grid-cols-[64px_1fr]">
                <span className="display text-3xl text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                <div className="space-y-4">
                  <h2 className="display text-2xl md:text-3xl">{s.title}</h2>
                  {s.blocks.map((b, j) => (
                    <BlockView key={j} block={b} />
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <aside className="mt-16 flex flex-col gap-5 rounded-[1.75rem] bg-ink p-7 text-paper md:flex-row md:items-center md:justify-between md:p-9">
            <div>
              <p className="eyebrow text-ash">Ficou alguma dúvida?</p>
              <p className="display mt-2 text-2xl md:text-3xl">Fale com a gente</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-paper/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink"
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </div>
          </aside>
        </article>
      </main>

      <footer className="border-t border-ink/10 px-5 py-6 md:px-10">
        <div className="eyebrow mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 !tracking-[0.2em] text-ash md:flex-row">
          <span>© 2026 Jaguar Niche</span>
          <span>Quarter zips · Inverno 26</span>
        </div>
      </footer>
    </div>
  );
}
