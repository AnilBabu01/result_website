"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "TIPS", path: "/tips" },
    { name: "LUCKY NUMBER", path: "/luckynumber" },
    { name: "OLD", path: "/old" },
  ];

  return (
    <nav className="bg-yellow-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            Kolkata Fast Result & Tips
          </h1>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open ? "✖" : "☰"}
          </button>
        </div>

        {/* Menu */}
        <div
          className={`
            ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            overflow-hidden transition-all duration-300 ease-in-out
            md:max-h-full md:opacity-100
          `}
        >
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-2 md:gap-4 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-center px-4 py-2 rounded transition-all duration-200 
                    ${
                      isActive
                        ? "bg-red-500 text-white"
                        : "text-black hover:bg-white hover:text-black"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}