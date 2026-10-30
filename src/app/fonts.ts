import localFont from "next/font/local";

// Self-hosted, Latin-subset instances of Bricolage Grotesque cut from the variable font
// (see src/app/fonts/). Display: 88% width, medium, optical sizes 12-96. Text: 100% width, 400-600.
// All families are SIL OFL 1.1.
export const display = localFont({
  src: [{ path: "./fonts/bricolage-display.woff2", weight: "500", style: "normal" }],
  display: "swap",
  variable: "--ff-display",
  adjustFontFallback: "Arial",
});

export const text = localFont({
  src: [{ path: "./fonts/bricolage-text.woff2", weight: "400 600", style: "normal" }],
  display: "swap",
  variable: "--ff-text",
  adjustFontFallback: "Arial",
  preload: false,
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
