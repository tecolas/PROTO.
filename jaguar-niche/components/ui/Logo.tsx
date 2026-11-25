/** Jaguar rosette mark: a broken ring of spots around two inner dots. */
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M9.2 4.6c2.6-1.9 6-2.5 8.8-1.6.9.3.8 1.6-.1 1.8-2.7.6-5.2 1.9-7.2 3.7-.8.7-2 0-1.8-1 .1-1.1.1-2.1.3-2.9Z" />
      <path d="M21.6 4.9c2.9 1.3 5.1 3.9 5.8 7 .2.9-.9 1.5-1.6.9-1.8-1.6-3.3-3.6-4.6-5.8-.5-.9.4-2.4.4-2.1Z" />
      <path d="M28.3 16.4c.4 3.1-.8 6.3-3.1 8.4-.7.6-1.8 0-1.6-.9.7-2.4 1.2-4.8 2.6-7 .5-.8 2-.9 2.1-.5Z" />
      <path d="M19.7 27.6c-2.8 1.3-6 1.2-8.6-.3-.8-.5-.5-1.7.4-1.8 2.6-.2 5.1-.4 7.7-.1.9.1 1.5 1.8.5 2.2Z" />
      <path d="M5.3 22.9c-1.9-2.6-2.5-5.9-1.6-8.9.3-.9 1.6-.9 1.8 0 .6 2.5 1.6 4.8 2 7.4.2.9-1.6 2.1-2.2 1.5Z" />
      <circle cx="14" cy="15" r="2.2" />
      <circle cx="18.6" cy="18.2" r="1.6" />
    </svg>
  );
}
