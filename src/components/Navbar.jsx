import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const plmLogo = "/assets/plm-accountancy-logo.svg";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Batches", path: "/batches" },
    { name: "Engagement", path: "/alumni" },
    { name: "Profile", path: "/login" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d8d0] bg-white text-[#18392b] shadow-sm">
      <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between px-6 md:px-10 lg:px-14">
        
        {/* PLM BRAND */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          <img
            src={plmLogo}
            alt="Pamantasan ng Lungsod ng Maynila College of Accountancy"
            className="h-[58px] w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-6 font-serif text-[16px] transition-colors ${
                isActive(link.path)
                  ? "text-[#18392b]"
                  : "text-[#263d32] hover:text-[#b69225]"
              }`}
            >
              {link.name}

              <span
                className={`absolute bottom-[10px] left-0 right-0 mx-auto h-[2px] w-full bg-[#d4af37] transition-transform ${
                  isActive(link.path)
                    ? "scale-x-100"
                    : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* BSA ALUMNI SYSTEM */}
        <Link
          to="/"
          className="hidden items-center gap-2 md:flex"
        >
          <div className="font-sans font-black leading-none">
            <span className="text-[25px] text-[#d4af37]">BSA</span>
          </div>

          <div className="h-7 w-px bg-[#18392b]" />

          <div className="font-serif text-[13px] font-bold leading-[1.05] text-[#18392b]">
            <div>ALUMNI</div>
            <div>SYSTEM</div>
          </div>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d7d7d0] text-[#18392b] md:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden border-t border-[#e1e1da] bg-white transition-all duration-300 md:hidden ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`border-b border-[#eeeeea] py-4 font-serif ${
                isActive(link.path)
                  ? "font-bold text-[#b69225]"
                  : "text-[#18392b]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
