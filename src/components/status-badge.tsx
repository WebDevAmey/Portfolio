export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface py-1 pr-3 pl-2.5 font-mono text-[length:var(--step-mono)] tracking-[var(--tracking-mono)] text-fg-2 uppercase">
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-fg/50 [animation-duration:2.4s] motion-reduce:hidden" />
        <span className="relative size-1.5 rounded-full bg-fg" />
      </span>
      {children}
    </p>
  );
}
