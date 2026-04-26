"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun, User, History, Heart, Calendar, Plus, Menu, X, ChefHat, Home } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Início", icon: <Home className="w-4 h-4" /> },
    { href: "/gerar", label: "Gerar Receita", icon: <ChefHat className="w-4 h-4" /> },
    { href: "/historico", label: "Histórico", icon: <History className="w-4 h-4" /> },
    { href: "/favoritos", label: "Favoritos", icon: <Heart className="w-4 h-4" /> },
    { href: "/plano", label: "Plano Semanal", icon: <Calendar className="w-4 h-4" /> },
    { href: "/importar", label: "Importar", icon: <Plus className="w-4 h-4" /> },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-2 gap-4">

          {/* ─── Logo destacado ─── */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 group"
            aria-label="FitChef — Ir para início"
          >
            <div className="relative">
              {/* Anel brilhante no hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-fitgreen-400 to-fitorange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              <div className="relative h-12 w-auto bg-white rounded-xl p-0.5 shadow-md group-hover:shadow-fitgreen-500/30 transition-shadow duration-300">
                <Image
                  src="/logo.jpeg"
                  alt="FitChef Logo"
                  width={140}
                  height={48}
                  className="h-11 w-auto object-contain rounded-lg"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active
                      ? "bg-fitgreen-50 text-fitgreen-700 dark:bg-fitgreen-900/20 dark:text-fitgreen-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {link.icon}
                  {link.label}
                  {active && (
                    <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-fitgreen-500 inline-block" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ─── Actions ─── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Dark mode toggle */}
            <button
              aria-label="Alternar tema"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {theme === "dark"
                ? <Sun className="w-5 h-5 text-fitorange-400" />
                : <Moon className="w-5 h-5 text-fitblue-700" />}
            </button>

            {/* Perfil */}
            <button
              aria-label="Editar perfil"
              onClick={() => router.push(profile.isConfigured ? "/perfil/editar" : "/perfil")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-fitgreen-500 hover:bg-fitgreen-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {profile.displayName ?? "Perfil"}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label="Menu"
              className="md:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Nav ─── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? "bg-fitgreen-50 text-fitgreen-700" : "hover:bg-accent"}`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
