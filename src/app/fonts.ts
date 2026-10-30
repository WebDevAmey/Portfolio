import localFont from "next/font/local";

// Self-hosted, Latin-subset files (see src/app/fonts/). Both families are SIL OFL 1.1.
export const display = localFont({
  src: [{ path: "./fonts/bricolage-grotesque-var.woff2", weight: "200 800", style: "normal" }],
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: "Arial",
});

export const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
});
