import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Award,
  CalendarDays,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
  X,
} from "lucide-react";

export default function DashboardSidebar({ mobileOpen = false, onClose }) {
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
    {
      name: "My Credentials",
      path: "/dashboard/credentials",
      icon: FileCheck2,
    },
    {
      name: "My Achievements",
      path: "/dashboard/achievements",
      icon: Award,
    },
    {
      name: "My Batch",
      path: "/dashboard/batch",
      icon: Users,
    },
    {
      name: "Events",
      path: "/dashboard/events",
      icon: CalendarDays,
    },
  ];

  function handleLogout() {
    localStorage.removeItem("alumniLoggedIn");
    localStorage.removeItem("alumniUser");
    localStorage.removeItem("alumniRemembered");
    navigate("/login");
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#18392b] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-[#18392b]">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[#d4af37]">
                PLM ACCOUNTANCY
              </p>
              <p className="text-sm font-bold">BSA Alumni System</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            Alumni Portal
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/dashboard"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#d4af37] text-[#18392b]"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            onClick={onClose}
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <GraduationCap size={19} />
            Back to Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
