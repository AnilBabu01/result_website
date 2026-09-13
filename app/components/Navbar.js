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
    { name: "Patti Chart", path: "/bombaybazar-ff-patti-list-chart-complete-full" },
  ];

  // Track scroll position to update header styling
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

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* =====================================================
          MAIN DESKTOP NAVBAR (Dark Emerald & Gold Theme)
      ====================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 sm:px-8 transition-all duration-300">
        <nav
          className={`mx-auto max-w-7xl rounded-2xl transition-all duration-500 ${
            scrolled
              ? "border border-amber-500/30 bg-emerald-950/85 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl py-1.5"
              : "border border-emerald-800/40 bg-emerald-950/90 shadow-lg backdrop-blur-md py-3"
          }`}
        >
          <div className="flex h-12 items-center justify-between px-4 sm:px-6">
            
            {/* ================= LOGO ================= */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-700 p-[2px] shadow-md shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-emerald-950">
                  <img
                    src="/images/BombayBazar.png"
                    alt="bombaybazar FF"
                    className="h-6 w-6 object-contain transition-transform duration-300 group-hover:rotate-6"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<span class="text-amber-400 font-extrabold text-sm tracking-tighter">BB</span>';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col justify-center">
                <span className="text-base font-black tracking-wider text-slate-100 transition-colors group-hover:text-amber-400 sm:text-lg leading-none uppercase">
                  bombaybazar <span className="text-amber-400">RESULT</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-widest uppercase mt-0.5">
                  Fast Updates & Daily Tips
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP NAV LINKS ================= */}
            <div className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-emerald-950 shadow-md shadow-amber-500/20"
                        : "text-slate-300 hover:bg-emerald-900/50 hover:text-amber-400"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ================= RIGHT ACTIONS / MOBILE TOGGLE ================= */}
            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <div className="hidden items-center gap-2 rounded-xl border border-amber-500/30 bg-emerald-900/40 px-3.5 py-1.5 text-xs font-bold text-amber-400 md:flex shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                LIVE UPDATES
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 bg-emerald-900/60 text-amber-400 shadow-md transition-all hover:border-amber-500/50 hover:bg-emerald-900 lg:hidden"
              >
                <div className="flex w-5 flex-col items-end justify-center gap-1.5">
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-5 translate-y-2 rotate-45" : "w-5"
                    }`}
                  />
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-0 opacity-0" : "w-3.5"
                    }`}
                  />
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-5 -translate-y-[7px] -rotate-45" : "w-4"
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
        className={`fixed inset-0 z-[110] bg-emerald-950/60 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-full max-w-xs flex-col border-l border-emerald-800/50 bg-emerald-950 text-slate-100 shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 px-6 py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 font-black text-emerald-950 shadow-md shadow-amber-500/20">
              BB
            </div>
            <div>
              <h2 className="text-sm font-black uppercase text-slate-100 leading-tight">
                bombaybazar
              </h2>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Fast Result
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-900/50 text-slate-400 transition-colors hover:border-amber-500/40 hover:text-amber-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-widest text-amber-400/80">
            Navigation Menu
          </span>
          <div className="flex flex-col gap-2.5">
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
                  className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "text-emerald-950 shadow-md shadow-amber-500/20"
                      : "border border-emerald-900/40 bg-emerald-900/20 text-slate-300 hover:border-amber-500/30 hover:bg-emerald-900/50 hover:text-amber-400"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                  )}
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black ${
                        isActive ? "bg-emerald-950/20 text-emerald-950" : "bg-emerald-900 text-amber-400"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Footer Card */}
        <div className="mt-auto p-6">
          <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-emerald-900/50 to-emerald-950 p-4">
            <div className="relative z-10 mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Live Server Active
              </span>
            </div>
            <p className="relative z-10 text-[11px] font-medium text-slate-400 leading-relaxed">
              Get ultra-fast updates for charts, result history, and live tips directly on your screen.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}