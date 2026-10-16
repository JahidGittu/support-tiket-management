import React, { useState } from "react";
import { Search, Bell, Moon, ChevronDown, Shield, Sparkles, User as UserIcon, LogOut } from "lucide-react";
import { User } from "../types";

interface TopHeaderProps {
  currentUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSwitchUser: (email: string) => void;
  onLogout: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  searchQuery,
  setSearchQuery,
  onSwitchUser,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Bar */}
      <div className="relative w-full max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search tickets, customers, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-2xl pl-11 pr-14 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 shadow-2xs">
          ⌘ K
        </div>
      </div>

      {/* Right Controls: Notification, Moon, User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with unread orange dot */}
        <button className="relative w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
        </button>

        {/* Dark Mode Moon Icon */}
        <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
          <Moon className="w-5 h-5" />
        </button>

        {/* User Capsule with Dropdown */}
        <div className="relative pl-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1.5 pr-2 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt={currentUser?.name || "Rafsan Ahmed"}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || "Rafsan Ahmed"}
              </div>
              <div className="text-[11px] text-slate-400 font-medium capitalize">
                {currentUser?.role ? currentUser.role.toLowerCase() : "Admin"}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Test Persona (Live Demo)
              </div>
              <button
                onClick={() => {
                  onSwitchUser("admin@resolvedesk.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800">Rafsan Ahmed</div>
                  <div className="text-[11px] text-slate-400">admin@resolvedesk.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  ADMIN
                </span>
              </button>
              <button
                onClick={() => {
                  onSwitchUser("agent@resolvedesk.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800">Rahat Ahmed</div>
                  <div className="text-[11px] text-slate-400">agent@resolvedesk.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  AGENT
                </span>
              </button>
              <button
                onClick={() => {
                  onSwitchUser("arif@example.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800">Arif Rahman</div>
                  <div className="text-[11px] text-slate-400">arif@example.com</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  CUSTOMER
                </span>
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    onLogout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
