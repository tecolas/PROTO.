"use client";

import Magnetic from "./Magnetic";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "dark";
  className?: string;
  label?: string;
  type?: "button" | "submit";
};

/** Pill button with a liquid fill wipe and rolling label on hover. */
export default function FireButton({ children, onClick, variant = "solid", className = "", label, type = "button" }: Props) {
  const base =
    variant === "solid"
      ? "bg-ember text-ink"
      : variant === "dark"
        ? "bg-ink text-cream"
        : "border border-cream/25 text-cream";
  const fill = variant === "solid" ? "bg-cream" : variant === "dark" ? "bg-ember" : "bg-ember";
  const hoverText = variant === "dark" ? "group-hover:text-ink" : variant === "ghost" ? "group-hover:text-ink" : "";

  return (
    <Magnetic>
      <button
        type={type}
        onClick={onClick}
        data-cursor="hover"
        data-cursor-label={label}
        className={`group relative isolate inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-5 text-[13px] font-semibold uppercase tracking-[0.14em] md:h-14 md:gap-3 md:px-7 md:text-sm md:tracking-[0.18em] transition-colors duration-500 ${base} ${hoverText} ${className}`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 translate-y-[101%] rounded-[50%_50%_0_0] transition-[transform,border-radius] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:rounded-none ${fill}`}
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
      </button>
    </Magnetic>
  );
}
