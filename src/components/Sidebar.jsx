import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiShoppingBag, FiUsers, FiTag, FiCreditCard,
  FiCalendar, FiLogOut, FiX, FiRefreshCw,
} from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
import { toast } from "react-toastify";
import Logo from "./Logo";
import { getUser, removeUser } from "../utils/auth";
import { useData } from "../context/DataContext";
import { initialsOf } from "../utils/format";

const groups = [
  {
    title: "Asosiy",
    links: [
      { to: "/", label: "Dashboard", icon: FiGrid, end: true },
      { to: "/orders", label: "Buyurtmalar", icon: FiShoppingBag, badge: "orders" },
    ],
  },
  {
    title: "Menyu",
    links: [
      { to: "/foods", label: "Taomlar", icon: GiKnifeFork },
      { to: "/categories", label: "Kategoriyalar", icon: FiTag },
    ],
  },
  {
    title: "Boshqaruv",
    links: [
      { to: "/workers", label: "Xodimlar", icon: FiUsers },
      { to: "/wallet", label: "Hamyon", icon: FiCreditCard },
      { to: "/calendar", label: "Kalendar", icon: FiCalendar },
    ],
  },
];

const timeFormatter = new Intl.DateTimeFormat("uz-UZ", { hour: "2-digit", minute: "2-digit" });
const dateFormatter = new Intl.DateTimeFormat("uz-UZ", { day: "2-digit", month: "short" });

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const user = getUser();
  const { orders, refresh, loading, error } = useData();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "ready").length;

  const handleLogout = () => {
    removeUser();
    toast.info("Tizimdan chiqdingiz");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobil uchun qoraytirish */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-base-content/25 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-base-300/80 bg-base-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative z-10 flex items-center justify-between px-5 py-5">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle text-base-content/40 lg:hidden"
            aria-label="Menyuni yopish"
          >
            <FiX />
          </button>
        </div>

        {/* Holat kartasi */}
        <div className="relative z-10 mx-5 mb-4 rounded-2xl border border-base-300/80 bg-base-200/60 p-3">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                error ? "text-error" : "text-success"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${error ? "bg-error" : "live-dot bg-success"}`}
              />
              {error ? "Server o'chiq" : "Tizim ishlayapti"}
            </span>
            <button
              onClick={() => refresh()}
              className="text-base-content/30 transition-colors hover:text-primary"
              aria-label="Yangilash"
            >
              <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="nums font-mono text-xl font-bold tracking-tight">
              {timeFormatter.format(now)}
            </p>
            <p className="text-[10px] capitalize text-base-content/45">{dateFormatter.format(now)}</p>
          </div>
        </div>

        {/* Navigatsiya */}
        <nav className="scrollbar-thin relative z-10 flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/30">
                {group.title}
              </p>
              {group.links.map(({ to, label, icon: Icon, end, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-content shadow-md shadow-primary/25"
                        : "text-base-content/55 hover:bg-base-200 hover:text-base-content"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`text-lg transition-colors ${
                          isActive ? "" : "text-base-content/35 group-hover:text-base-content/70"
                        }`}
                      />
                      {label}
                      {badge === "orders" && activeOrders > 0 && (
                        <span
                          className={`nums ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                            isActive ? "bg-white/25 text-white" : "bg-warning text-warning-content"
                          }`}
                        >
                          {activeOrders}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Foydalanuvchi */}
        <div className="relative z-10 border-t border-base-300/80 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-xl px-1.5 py-2">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-black text-white shadow-md shadow-primary/25">
              {initialsOf(user)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-base-100 bg-success" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[10px] text-base-content/40">Egasi · to'liq huquq</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-xs h-9 w-full justify-start gap-2 rounded-xl text-xs font-semibold text-base-content/45 transition-colors hover:bg-error/10 hover:text-error"
          >
            <FiLogOut />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
