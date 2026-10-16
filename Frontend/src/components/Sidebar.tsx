import React from "react";
import {
  LayoutDashboard,
  Ticket,
  Users,
  UserCheck,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  currentUser: User | null;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onOpenPersonaModal: () => void;
  onOpenAiModal: () => void;
  openTicketsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeMenu,
  setActiveMenu,
  onOpenPersonaModal,
  onOpenAiModal,
  openTicketsCount = 12,
}) => {
  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Tickets", label: "Tickets", icon: Ticket, badge: openTicketsCount },
    { id: "Customers", label: "Customers", icon: Users },
    { id: "Team", label: "Team", icon: UserCheck },
    { id: "Knowledge Base", label: "Knowledge Base", icon: BookOpen },
    { id: "Reports", label: "Reports", icon: BarChart3 },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A1128] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 border-r border-slate-900/40">
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10c0 4.41-2.87 8.16-6.84 9.5-.5.1-.68-.22-.68-.48v-1.7c0-1.8-1.5-3.3-3.3-3.32H11c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-base font-bold tracking-tight">SupportHub</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Smarter Support, Happier Users
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1D68FE] text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: AI Assistant Card & User Profile */}
      <div className="p-4 space-y-4">
        {/* AI Assistant Banner */}
        <div
          onClick={onOpenAiModal}
          className="bg-linear-to-b from-[#161D38] to-[#10172E] border border-indigo-500/20 rounded-2xl p-3.5 cursor-pointer hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-white text-xs font-semibold">AI Assistant</span>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
              Beta
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Get smart suggestions for faster resolution.
          </p>
        </div>

        {/* User Profile Footer */}
        <div
          onClick={onOpenPersonaModal}
          className="flex items-center justify-between pt-2 border-t border-slate-800/80 cursor-pointer hover:opacity-90 transition-opacity"
          title="Click to switch test persona"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt={currentUser?.name || "Rafsan Ahmed"}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <div className="text-white text-xs font-semibold leading-tight">
                {currentUser?.name || "Rafsan Ahmed"}
              </div>
              <div className="text-[11px] text-slate-400 capitalize">
                {currentUser?.role ? currentUser.role.toLowerCase() : "Admin"}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
