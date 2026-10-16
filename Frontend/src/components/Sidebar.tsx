import React from "react";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  currentUser: User | null;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onOpenPersonaModal: () => void;
  onOpenAiModal?: () => void;
  onLogout?: () => void;
  openCount?: number;
  inProgressCount?: number;
  pendingCount?: number;
  openTicketsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeMenu,
  setActiveMenu,
  onOpenPersonaModal,
  onLogout,
  openCount = 48,
  inProgressCount = 32,
  pendingCount = 36,
  openTicketsCount = 48,
}) => {
  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Tickets", label: "Tickets", icon: Ticket, badge: openTicketsCount },
    { id: "Customers", label: "Customers", icon: Users },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const roleTitle = currentUser?.role === "ADMIN"
    ? "Super Admin (Head Office)"
    : currentUser?.role === "AGENT"
    ? "Support Agent (Control)"
    : "Customer Portal";

  return (
    <aside className="w-68 bg-[#282C37] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 border-r border-slate-700/50 p-4 overflow-y-auto">
      <div>
        {/* Profile Card Header with Avatar & Status */}
        <div className="flex flex-col items-center text-center pt-2 pb-3">
          <div
            onClick={onOpenPersonaModal}
            className="relative cursor-pointer group"
            title="Click to switch persona role"
          >
            <div className="w-18 h-18 rounded-full border-2 border-white/90 bg-[#1A1D24] flex items-center justify-center text-white text-xl font-black tracking-wider shadow-md group-hover:scale-105 transition-transform">
              {currentUser?.role === "ADMIN" ? "AD" : getInitials(currentUser?.name)}
            </div>
            {/* Green Online Dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#282C37]"></span>
          </div>

          <h2 className="text-white text-sm font-bold mt-2.5 leading-snug">
            {roleTitle}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Central Control & Support
          </p>

          {/* 3 Mini Stats Box Grid (Ticket Stats) */}
          <div className="w-full grid grid-cols-3 gap-2 mt-3.5">
            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-white leading-tight">{openCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Open</div>
            </div>

            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-white leading-tight">{inProgressCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">In Progress</div>
            </div>

            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-[#F59E0B] leading-tight">{pendingCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Pending</div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-700/60 my-2"></div>

        {/* Navigation Menu */}
        <div className="pt-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Menu & Dashboard
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#00897B] text-white shadow-md shadow-teal-900/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {isActive ? (
                    <ChevronRight className="w-4 h-4 text-white" />
                  ) : item.badge !== undefined ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-700 text-slate-300">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Signout Button */}
      <div className="pt-3 border-t border-slate-700/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </aside>
  );
};

