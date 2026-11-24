import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource-variable/inter-tight/index.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOLTEN — Small-Batch Gourmet Hot Sauce",
  description:
    "Fire-roasted, slow-fermented, hand-sealed. Molten makes small-batch gourmet hot sauces with nothing to hide.",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
