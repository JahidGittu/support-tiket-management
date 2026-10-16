import React from "react";
import {
  LayoutGrid,
  Users,
  Wallet,
  Clock,
  FileText,
  ShieldAlert,
  Briefcase,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  currentUser: User | null;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onOpenPersonaModal: () => void;
  onLogout: () => void;
  transactionCount?: number;
  visaFileCount?: number;
  pendingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeMenu,
  setActiveMenu,
  onOpenPersonaModal,
  onLogout,
  transactionCount = 0,
  visaFileCount = 0,
  pendingCount = 0,
}) => {
  const menuItems = [
    { id: "Dashboard", label: "ড্যাশবোর্ড ওভারভিউ", icon: LayoutGrid },
    { id: "Agents", label: "এজেন্ট ডিরেক্টরি", icon: Users },
    { id: "Ledger", label: "ফাইন্যান্সিয়াল লেজার", icon: Wallet },
    { id: "BankDeposit", label: "ব্যাংক ডিপোজিট যাচাই", icon: Clock },
    { id: "VisaTracker", label: "ভিসা প্রসেসিং ট্র্যাকার", icon: FileText },
    { id: "Blacklist", label: "পাসপোর্ট ব্ল্যাকলিস্ট", icon: ShieldAlert },
    { id: "JobCircular", label: "জব সার্কুলার বোর্ড", icon: Briefcase },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const roleTitle = currentUser?.role === "ADMIN" 
    ? "সুপার এডমিন (হেড অফিস)"
    : currentUser?.role === "AGENT"
    ? "সাপোর্ট এজেন্ট (কন্ট্রোল)"
    : "কাস্টমার পোর্টাল";

  return (
    <aside className="w-72 bg-[#282C37] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 border-r border-slate-700/50 p-4 overflow-y-auto">
      <div>
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-3">
          {/* Circular Avatar with Green Online Dot */}
          <div 
            onClick={onOpenPersonaModal}
            className="relative cursor-pointer group"
            title="রোল ও একাউন্ট পরিবর্তন করতে ক্লিক করুন"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/90 bg-[#1A1D24] flex items-center justify-center text-white text-2xl font-black tracking-wider shadow-md group-hover:scale-105 transition-transform">
              {currentUser?.role === "ADMIN" ? "AD" : getInitials(currentUser?.name)}
            </div>
            {/* Green Online Dot */}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#282C37]"></span>
          </div>

          {/* User Name & Role */}
          <h2 className="text-white text-sm font-bold mt-3 leading-snug">
            {roleTitle}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            সেন্ট্রাল কন্ট্রোল ও হিসাব
          </p>

          {/* 3 Mini Stats Box Grid */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4">
            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-white leading-tight">{transactionCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">লেনদেন</div>
            </div>

            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-white leading-tight">{visaFileCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">ভিসা ফাইল</div>
            </div>

            <div className="bg-[#21252F] border border-slate-700/60 rounded-xl py-2 px-1 text-center">
              <div className="text-sm font-bold text-[#F59E0B] leading-tight">{pendingCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">পেন্ডিং</div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-700/60 my-2"></div>

        {/* Navigation Menu */}
        <div className="pt-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 mb-2">
            মেনু ও ড্যাশবোর্ড
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
          <span>পোর্টাল হতে সাইন আউট</span>
        </button>
      </div>
    </aside>
  );
};

