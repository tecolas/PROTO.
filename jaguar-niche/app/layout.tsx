import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/archivo-black/400.css";
import "@fontsource-variable/inter-tight/index.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NORTE — Quarter Zips",
  description: "Quarter zips de merino, fleece, tech shell e moletom pesado. Feitos para o frio, desenhados para durar.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
