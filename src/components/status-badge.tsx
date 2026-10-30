export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong py-1.5 pr-4 pl-3 font-mono text-[length:var(--step-mono)] tracking-[var(--tracking-mono)] text-paper/80 uppercase">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-lime/60 [animation-duration:2.4s] motion-reduce:hidden" />
        <span className="relative size-2 rounded-full bg-lime" />
      </span>
      {children}
    </p>
  );
}
