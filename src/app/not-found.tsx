import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60svh] flex-col justify-center py-24">
      <p className="mono-label mb-4">404</p>
      <h1 className="font-display text-[length:var(--step-3)] font-medium tracking-[-0.03em]">
        This page wandered off.
      </h1>
      <Link href="/" className="link mt-8 w-fit">
        Back home
      </Link>
    </section>
  );
}
