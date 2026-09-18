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
    // { name: "Tips", path: "/tips" },
    { name: "Lucky Number", path: "/luckynumber" },
    // { name: "Patti Chart", path: "/sikkimff-ff-patti-list-chart-complete-full" },
  ];

  // Track scroll position to update navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR (Clean Light Glass Aesthetic)
      ====================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 sm:px-8 transition-all duration-300">
        <nav
          className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-violet-200 bg-white/85 shadow-xl shadow-slate-200/50 backdrop-blur-xl py-1.5"
              : "border-slate-200/80 bg-white/95 shadow-md backdrop-blur-lg py-2.5"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            
            {/* ================= LOGO ================= */}
            <Link href="/" className="group flex items-center gap-3">
              {/* Logo Badge Container */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-amber-500 p-[1px] shadow-sm transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white">
                  <img
                    src="/images/sikkim1.png"
                    alt="Sikkim FF"
                    className="h-6 w-6 object-contain transition-transform duration-300 group-hover:rotate-6"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.innerHTML =
                          '<span class="text-violet-600 font-extrabold text-xs tracking-wider">FF</span>';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col justify-center">
                <span className="text-base font-black tracking-tight text-slate-900 sm:text-lg leading-none">
                  SIKKIM <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">FF RESULT</span>
                </span>
                <span className="text-[10px] font-semibold text-violet-600 tracking-widest uppercase mt-0.5">
                  Live Updates
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden items-center gap-1 lg:flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-md shadow-violet-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ================= ACTION BUTTON / MOBILE TOGGLE ================= */}
            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 md:flex">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE NOW
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-violet-300 hover:bg-slate-100 lg:hidden"
              >
                <div className="flex w-5 flex-col items-end justify-center gap-1.5">
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-5 translate-y-2 rotate-45" : "w-5"
                    }`}
                  />
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-0 opacity-0" : "w-3"
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
        className={`fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-full max-w-xs flex-col border-l border-slate-200 bg-white text-slate-800 shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Decorative Glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-100 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

        {/* Mobile Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-black text-white shadow-sm">
              FF
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                Sikkim FF
              </h2>
              <p className="text-[10px] font-semibold text-amber-600">
                Dashboard
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-violet-600">
            Navigation Menu
          </span>
          <div className="flex flex-col gap-2">
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
                  className={`group relative flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-violet-200 bg-violet-50 text-violet-950 shadow-sm"
                      : "border-slate-100 bg-slate-50/60 text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold ${
                        isActive
                          ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                          : "bg-slate-200 text-slate-600 group-hover:bg-slate-300 group-hover:text-slate-900"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
                      isActive ? "text-amber-600" : "text-slate-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Footer Status Box */}
        <div className="mt-auto p-6">
          <div className="relative overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-slate-50 to-violet-50/30 p-4">
            <div className="relative z-10 mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-amber-700">
                Live Server Status
              </span>
            </div>
            <p className="relative z-10 text-xs text-slate-600 leading-relaxed">
              Real-time synchronization active for daily charts, result feeds, and lucky numbers.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}