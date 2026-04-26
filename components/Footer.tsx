import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image src="/logo.jpeg" alt="FitChef" width={80} height={32} className="h-8 w-auto object-contain" />
            <p className="text-sm text-fitblue-800 dark:text-fitblue-300 font-medium italic">
              Sabor e Saúde na Sua Rotina
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {[
              { href: "/", label: "Início" },
              { href: "/gerar", label: "Gerar Receita" },
              { href: "/historico", label: "Histórico" },
              { href: "/favoritos", label: "Favoritos" },
              { href: "/plano", label: "Plano Semanal" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="hover:text-fitgreen-500 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {[
              { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
              { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
              { icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
            ].map(s => (
              <button key={s.label} aria-label={s.label} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-fitorange-500 transition-colors">
                {s.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FitChef. Feito com ❤️ para sua saúde.
        </div>
      </div>
    </footer>
  );
}
