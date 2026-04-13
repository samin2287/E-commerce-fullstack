import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { theme } from "@/lib/constants/theme";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/#products" },
      { label: "New arrivals", href: "/#products" },
      { label: "Sale", href: "/#products" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-emerald-900">{theme.brand.name}</p>
            <p className="mt-2 max-w-xs text-sm text-zinc-600">{theme.brand.tagline}</p>
            <div className="mt-4 flex gap-3">
              {[FaTwitter, FaFacebookF, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-800"
                  aria-label="Social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-zinc-900">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-600 transition hover:text-emerald-800"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 text-xs text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} {theme.brand.name}. UI demo — no backend.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-emerald-800">
              Privacy
            </Link>
            <Link href="#" className="hover:text-emerald-800">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
