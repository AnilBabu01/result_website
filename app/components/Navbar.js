"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: "Lucky Number", path: "/luckynumber" },
    { name: "Patti Chart", path: "/Sikkim-ff-patti-list-chart-complete-full" },
  ];

  // Track scroll position to enhance navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ====================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 sm:px-8 transition-all duration-300 ">
        <nav
          className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
            scrolled
              ? "border border-amber-500/30 bg-slate-950/80 shadow-2xl backdrop-blur-xl"
              : "border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            
            {/* ================= LOGO ================= */}
            <Link href="/" className="group flex items-center gap-3">
              {/* Logo Icon Container */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <img
                    src="/images/sikkimff.png"
                    alt="Sikkim FF"
                    className="h-7 w-7 object-contain"
                  />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wide text-white transition-colors group-hover:text-amber-400 sm:text-lg">
                  FAST <span className="text-amber-400">RESULT</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Result & Tips
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden items-center gap-1.5 md:flex">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-slate-950"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    {/* Active Background Pill */}
                    {isActive && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 shadow-md shadow-amber-500/20" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ================= RIGHT ACTION / MOBILE TOGGLE ================= */}
            <div className="flex items-center gap-3">
              {/* Live Badge (Desktop) */}
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 lg:flex">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                Live Updates
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 text-slate-200 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
              >
                <div className="flex w-5 flex-col items-center justify-center gap-1.5">
                  <span
                    className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                      open ? "translate-y-2 rotate-45 bg-amber-400" : ""
                    }`}
                  />
                  <span
                    className={`h-0.5 w-full rounded-full bg-amber-400 transition-all duration-300 ${
                      open ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                      open ? "-translate-y-2 -rotate-45 bg-amber-400" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      <div
        className={`fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-[85%] max-w-[340px] flex-col border-l border-slate-800 bg-slate-950 p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Decorative Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 font-black text-slate-950">
              S
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sikkim Fast</h2>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Result & Tips
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ================= MOBILE NAV LINKS ================= */}
        <div className="flex flex-1 flex-col justify-between py-6">
          <div className="flex flex-col gap-2">
            <span className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Navigation Menu
            </span>
            {navItems.map((item, index) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname === item.path || pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/10"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={`transition-transform duration-200 group-hover:translate-x-1 ${
                      isActive ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ================= MOBILE BOTTOM CARD ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">
                Live Updates Active
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get fast real-time results, daily tips, and chart updates directly on your device.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}