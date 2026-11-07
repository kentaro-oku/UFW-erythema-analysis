"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/primitives";
import { site } from "@/content/site";

const NAV = [
  { href: "#about", label: "TERASTIEについて" },
  { href: "#lineup", label: "ラインナップ" },
  { href: "#features", label: "3つの役割" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const onScroll = () => {
      const limit = hero ? hero.offsetHeight - window.innerHeight : 0;
      setSolid(window.scrollY > limit - 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] items-center gap-8 px-4 transition-colors duration-500 sm:px-8",
        solid ? "bg-ivory/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <a href="#top" className="flex flex-col leading-tight" aria-label="TERASTIE トップへ">
        <span className="font-serif text-xl tracking-[0.28em] text-ink">TERASTIE</span>
        <span className="text-[10px] tracking-[0.22em] text-taupe">{site.clinic}</span>
      </a>
      <nav aria-label="メインナビゲーション" className="ml-auto hidden gap-7 text-[13px] tracking-[0.1em] text-ink-soft lg:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="transition-colors hover:text-ink">
            {n.label}
          </a>
        ))}
      </nav>
      <a
        href={site.shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto inline-flex min-h-10 items-center rounded-full border border-ink bg-ink px-5 text-xs font-medium tracking-[0.14em] text-ivory transition hover:bg-ink-soft lg:ml-0"
      >
        オンラインショップ
      </a>
    </header>
  );
}
