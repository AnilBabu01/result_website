"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    // { name: "Home", path: "/" },
    // { name: "Tips", path: "/tips" },
    // { name: "Lucky Number", path: "/luckynumber" },
    // { name: "Patti Chart", path: "/sikkimff-ff-patti-list-chart-complete-full" },
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
          DESKTOP / MAIN NAVBAR (Floating Pill Design)
      ====================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 sm:px-8 transition-all duration-300">
        <nav
          className={`mx-auto max-w-7xl rounded-full transition-all duration-500 ${
            scrolled
              ? "border border-sky-200/50 bg-white/85 shadow-lg shadow-sky-100/50 backdrop-blur-xl py-1"
              : "border border-transparent bg-white/95 shadow-sm backdrop-blur-md py-2"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            
            {/* ================= LOGO ================= */}
            <Link href="/" className="group flex items-center gap-3">
              {/* Logo Icon Container - Sky Theme */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-blue-600 p-[2px] shadow-md shadow-sky-200/50 transition-transform duration-300 group-hover:rotate-12">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <img
                    src="/images/sikkimff.png"
                    alt="sikkimff FF"
                    className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110"
                    // Fallback if image doesn't exist yet
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<span class="text-sky-500 font-bold text-sm">BB</span>';
                    }}
                  />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col justify-center">
                <span className="text-base font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-blue-600 sm:text-lg leading-none">
                  sikkimff <span className="text-sky-500">RESULT</span>
                </span>
                <span className="text-[10px] font-medium text-sky-600/80 tracking-wide mt-0.5">
                  Fast Updates & Tips
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-md shadow-sky-200"
                        : "text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                  >
                    {/* Active Background Pill */}
                    {isActive && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ================= RIGHT ACTION / MOBILE TOGGLE ================= */}
            <div className="flex items-center gap-4">
              {/* Live Badge (Desktop) - Styled to match Sky theme but keep 'Live' green feel */}
              <div className="hidden items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-700 md:flex shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </span>
                Live Now
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-600 shadow-sm transition-all hover:bg-sky-50 hover:shadow-md lg:hidden"
              >
                <div className="flex w-5 flex-col items-end justify-center gap-1.5">
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-5 translate-y-2 rotate-45" : "w-5"
                    }`}
                  />
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-0 opacity-0" : "w-4"
                    }`}
                  />
                  <span
                    className={`h-[2px] rounded-full bg-current transition-all duration-300 ${
                      open ? "w-5 -translate-y-[7px] -rotate-45" : "w-3"
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
        className={`fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Decorative Glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100/50 bg-white/50 backdrop-blur-md">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 font-black text-white shadow-md shadow-sky-200">
              BB
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 leading-tight">
                sikkimff
              </h2>
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">
                Fast Result
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ================= MOBILE NAV LINKS ================= */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
          <span className="mb-4 text-xs font-bold uppercase tracking-widest text-sky-400">
            Menu Options
          </span>
          <div className="flex flex-col gap-3">
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
                  className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-lg shadow-sky-200/50"
                      : "bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-500 to-blue-500" />
                  )}
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                        isActive ? "bg-white/20 text-white" : "bg-white text-sky-400 shadow-sm"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span className="text-base">{item.name}</span>
                  </div>
                  <span
                    className={`transition-transform duration-300 group-hover:translate-x-1 ${
                      isActive ? "text-white" : "text-sky-300"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE BOTTOM CARD ================= */}
        <div className="mt-auto p-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 p-5">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-sky-200/50 blur-xl" />
            <div className="relative z-10 mb-3 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
              <span className="text-sm font-extrabold text-sky-800">
                Live Server Active
              </span>
            </div>
            <p className="relative z-10 text-xs font-medium text-slate-600 leading-relaxed">
              Experience the fastest updates for charts, results, and daily tips straight to your mobile.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}