import localFont from "next/font/local";

// Self-hosted, Latin-subset files (see src/app/fonts/). Text: a static-width instance of
// Bricolage Grotesque cut from the variable font, weights 400-600. Both families are SIL OFL 1.1.
export const text = localFont({
  src: [{ path: "./fonts/bricolage-text.woff2", weight: "400 600", style: "normal" }],
  display: "swap",
  variable: "--ff-text",
  adjustFontFallback: "Arial",
});

export const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--ff-mono",
  adjustFontFallback: false,
  preload: false,
});
