"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: "Lucky Number", path: "/luckynumber" },
    { name: "Old", path: "/old-kolkata-ff-fatafat-result" },
    { name: "Patti", path: "/kolkata-ff-patti-list-chart-complete-full" },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] z-50">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-yellow-500/30 shadow-lg">
          {/* Logo */}
          <h1 className="text-yellow-400 font-bold text-lg tracking-wide">
            Kolkata fast result & Tips
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 bg-black/30 p-1 rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-md"
                      : "text-yellow-200 hover:bg-yellow-500/20"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-yellow-400 text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-xs bg-black/90 backdrop-blur-xl z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            className="text-yellow-400 text-2xl"
            onClick={() => setOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4 px-6 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`py-3 text-center rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black"
                    : "text-yellow-200 hover:bg-yellow-500/20"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
