"use client";

import Magnetic from "./Magnetic";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  /** "ink" = black pill, "paper" = white pill, "ghost-ink"/"ghost-paper" = outlined on light/dark */
  variant?: "ink" | "paper" | "ghost-ink" | "ghost-paper";
  className?: string;
  label?: string;
  type?: "button" | "submit";
  arrow?: boolean;
};

const STYLES: Record<NonNullable<Props["variant"]>, { base: string; fill: string; hover: string }> = {
  ink: { base: "bg-ink text-paper", fill: "bg-paper", hover: "group-hover:text-ink" },
  paper: { base: "bg-paper text-ink", fill: "bg-ink", hover: "group-hover:text-paper" },
  "ghost-ink": { base: "border border-ink/30 text-ink", fill: "bg-ink", hover: "group-hover:text-paper" },
  "ghost-paper": { base: "border border-paper/30 text-paper", fill: "bg-paper", hover: "group-hover:text-ink" },
};

/** Pill button: wipe fill from below + rolling label + magnetic pull. */
export default function Button({ children, onClick, variant = "ink", className = "", label, type = "button", arrow = true }: Props) {
  const s = STYLES[variant];
  return (
    <Magnetic>
      <button
        type={type}
        onClick={onClick}
        data-cursor="hover"
        data-cursor-label={label}
        className={`group relative isolate inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 md:h-14 md:gap-3 md:px-7 md:text-[13px] md:tracking-[0.2em] ${s.base} ${s.hover} ${className}`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 translate-y-[101%] rounded-[50%_50%_0_0] transition-[transform,border-radius] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:rounded-none ${s.fill}`}
        />
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
          >
            {children}
          </span>
        </span>
        {arrow && (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </Magnetic>
  );
}
