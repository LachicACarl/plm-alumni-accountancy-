import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Batches", path: "/batches" },
    { name: "Alumni", path: "/alumni" },
    { name: "Events", path: "/events" },
    { name: "Login", path: "/login" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d2c2] bg-[#18392b] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
            <GraduationCap size={24} />
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#d4af37]">
              PAMANTASAN NG LUNGSOD NG MAYNILA
            </p>
            <p className="text-sm font-bold">
              College of Accountancy
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition ${
                location.pathname === link.path
                  ? "text-[#d4af37]"
                  : "text-white/85 hover:text-[#d4af37]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  location.pathname === link.path
                    ? "bg-white/10 text-[#d4af37]"
                    : "text-white/85"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
