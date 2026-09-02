"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: "Lucky Number", path: "/luckynumber" },
    { name: "Patti", path: "/kolkata-ff-patti-list-chart-complete-full" },
  ];

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
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <nav
          className="
            w-full
            border-b
            border-yellow-500
            bg-yellow-400
            shadow-[0_10px_40px_rgba(0,0,0,0.20)]
          "
        >
          <div className="flex min-h-[64px] items-center justify-between px-4 sm:px-6">
            {/* ================= LOGO ================= */}
            <Link href="/" className="group flex min-w-0 items-center gap-2">
              {/* Logo Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                 
                
                  group-hover:scale-105
                "
              >
                <img src="/images/kolkataff.png" alt="Kolkata FF" />
              </div>

              {/* Logo Text */}
              <div className="hidden xs:block sm:block">
                <h1
                  className="
                    text-sm
                    font-extrabold
                    tracking-wide
                    text-black
                    sm:text-base
                  "
                >
                  Fast Result
                </h1>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-purple-800
                  "
                >
                  Result & Tips
                </p>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path ||
                      pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      relative
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-violet-600
                            to-blue-600
                            text-white
                            shadow-lg
                            shadow-violet-700/30
                          `
                          : `
                            text-black
                            hover:bg-black/10
                            hover:text-black
                          `
                      }
                    `}
                  >
                    {item.name}

                    {/* Active Indicator */}
                    {isActive && (
                      <span
                        className="
                          absolute
                          -bottom-[1px]
                          left-1/2
                          h-[2px]
                          w-5
                          -translate-x-1/2
                          rounded-full
                          bg-white
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-black/10
                bg-black/5
                text-black
                transition
                duration-300
                hover:bg-black/10
                md:hidden
              "
            >
              <div className="flex w-5 flex-col gap-1.5">
                <span className="h-0.5 w-full rounded-full bg-black" />
                <span className="h-0.5 w-4/5 rounded-full bg-purple-700" />
                <span className="h-0.5 w-full rounded-full bg-black" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      <div
        className={`
          fixed
          inset-0
          z-[110]
          bg-black/60
          backdrop-blur-sm
          transition-all
          duration-300
          md:hidden
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={() => setOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`
          fixed
          right-0
          top-0
          z-[120]
          flex
          h-full
          w-[82%]
          max-w-[360px]
          flex-col
          border-l
          border-white/10
          bg-[#080c18]/95
          shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
          backdrop-blur-2xl
          transition-transform
          duration-300
          ease-out
          md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Decorative Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-violet-600/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-20
            h-48
            w-48
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        {/* ================= MOBILE HEADER ================= */}
        <div
          className="
            relative
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-5
            py-5
          "
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            {/* Mobile Logo */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-600
                to-blue-600
                shadow-lg
                shadow-violet-500/20
              "
            >
              <span className="font-black text-white">K</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Kolkata Fast</h2>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-purple-300
                "
              >
                Result & Tips
              </p>
            </div>
          </Link>

          {/* ================= CLOSE BUTTON ================= */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-xl
              text-white
              transition
              hover:bg-red-500/10
              hover:text-red-400
            "
          >
            ×
          </button>
        </div>

        {/* ================= MOBILE NAV ================= */}
        <div className="relative flex flex-1 flex-col px-5 py-7">
          <p
            className="
              mb-4
              px-2
              text-[11px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-slate-400
            "
          >
            Navigation
          </p>

          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname === item.path ||
                    pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-4
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-violet-600/90
                          to-blue-600/80
                          text-white
                          shadow-lg
                          shadow-violet-500/20
                        `
                        : `
                          text-white
                          hover:bg-white/5
                          hover:text-white
                        `
                    }
                  `}
                >
                  {/* Number */}
                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-xs
                      font-bold
                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-white/5 text-slate-300 group-hover:text-purple-300"
                      }
                    `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Name */}
                  <span className="flex-1 text-sm font-semibold">
                    {item.name}
                  </span>

                  {/* Arrow */}
                  <span
                    className={`
                      text-lg
                      transition-transform
                      duration-300
                      ${
                        isActive
                          ? "translate-x-0 text-white"
                          : "-translate-x-1 text-slate-400 group-hover:translate-x-0 group-hover:text-purple-300"
                      }
                    `}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ================= BOTTOM CARD ================= */}
          <div className="mt-auto pt-8">
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-violet-500/20
                bg-gradient-to-br
                from-violet-500/10
                to-blue-500/10
                p-5
              "
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="
                    h-2
                    w-2
                    animate-pulse
                    rounded-full
                    bg-green-400
                  "
                />

                <span className="text-xs font-semibold text-green-300">
                  Live Updates
                </span>
              </div>

              <p
                className="
                  text-xs
                  leading-relaxed
                  text-slate-300
                "
              >
                Check the latest Kolkata Fast results, tips and lucky numbers.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
