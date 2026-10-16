import React, { useState } from "react";
import { Building2, ShieldCheck, Bell, LogOut, ChevronDown } from "lucide-react";
import { User } from "../types";

interface TopHeaderProps {
  currentUser: User | null;
  onSwitchUser: (email: string) => void;
  onLogout: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleText = currentUser?.role === "ADMIN"
    ? "সুপার এডমিন (হেড অফিস)"
    : currentUser?.role === "AGENT"
    ? "সাপোর্ট এজেন্ট (কন্ট্রোল)"
    : "কাস্টমার পোর্টাল";

  return (
    <header className="h-18 bg-[#1E222D] border-b border-slate-800/90 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Logo, Title, Version & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#141720] border border-slate-700/60 flex items-center justify-center text-[#00BFA5] shadow-xs">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-sm font-extrabold tracking-wider">
              GLOBAL EXPRESS LIMITED ERP
            </h1>
            <span className="border border-slate-600 text-slate-400 text-[10px] font-semibold px-1.5 py-0.2 rounded-md">
              v2.5
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            সেন্ট্রাল হেড অফিস কন্ট্রোল প্যানেল ও লেজার
          </p>
        </div>
      </div>

      {/* Right: Role Capsule & Notification Bell (NO language switcher, NO theme moon!) */}
      <div className="flex items-center gap-3">
        {/* Role Capsule with Quick Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="border border-slate-700/80 bg-[#161922] hover:bg-[#1C202B] px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-200 transition-colors shadow-2xs"
            title="রোল পরিবর্তন করতে ক্লিক করুন"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>{roleText}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Persona Switcher Dropdown */}
          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-[#232733] border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                টেস্ট একাউন্ট নির্বাচন করুন
              </div>

              <button
                onClick={() => {
                  onSwitchUser("admin@resolvedesk.com");
                  setRoleMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">সুপার এডমিন</div>
                  <div className="text-[10px] text-slate-400">admin@resolvedesk.com</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700">
                  ADMIN
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchUser("agent@resolvedesk.com");
                  setRoleMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">সাপোর্ট এজেন্ট</div>
                  <div className="text-[10px] text-slate-400">agent@resolvedesk.com</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                  AGENT
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchUser("arif@example.com");
                  setRoleMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">আরিফ রহমান (কাস্টমার)</div>
                  <div className="text-[10px] text-slate-400">arif@example.com</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  CUSTOMER
                </span>
              </button>

              <div className="border-t border-slate-700/60 mt-1 pt-1">
                <button
                  onClick={() => {
                    onLogout();
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button 
          className="relative w-9 h-9 rounded-xl border border-slate-700/80 bg-[#161922] hover:bg-[#1C202B] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="নোটিফিকেশন"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]"></span>
        </button>
      </div>
    </header>
  );
};
