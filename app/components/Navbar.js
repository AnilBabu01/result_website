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
    <div className="bg-yellow-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 text-center">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold">
          Kolkata Fast Result & Tips
        </h1>

        {/* Menu */}
        <div
          className={`${
            open ? "block" : "block"
          } md:flex justify-center items-center gap-4 mt-4`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded transition-all duration-200 
                  ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-black hover:bg-white hover:text-black"
                  }`}
                onClick={() => setOpen(false)} // close menu on mobile click
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
