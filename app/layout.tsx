import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitChef — Sabor e Saúde na Sua Rotina",
  description:
    "Transforme o que você tem em algo delicioso. Gerador de receitas inteligente baseado nos ingredientes e perfil do usuário.",
  keywords: [
    "receitas saudáveis",
    "gerador de receitas",
    "fit",
    "dieta",
    "nutrição",
    "culinária",
    "ingredientes",
    "low carb",
    "vegano",
  ],
  authors: [{ name: "FitChef" }],
  openGraph: {
    title: "FitChef — Sabor e Saúde na Sua Rotina",
    description:
      "Transforme o que você tem em algo delicioso. Gerador de receitas inteligente.",
    type: "website",
    locale: "pt_BR",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2db84b" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2e1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={poppins.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
