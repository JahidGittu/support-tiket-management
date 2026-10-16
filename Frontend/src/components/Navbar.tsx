import React from "react";
import { User, Role } from "../types";
import { Sparkles, Shield, User as UserIcon, LogOut, ChevronDown } from "lucide-react";

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onSwitchUser: (email: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "AGENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CUSTOMER":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">Support Ticket Management</span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-150 uppercase tracking-wider">
                System
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Smart Support & Automated Triage</p>
          </div>
        </div>

        {/* Right side controls */}
        {currentUser && (
          <div className="flex items-center gap-3">
            {/* Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Switch demo account"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Test Persona:</span>
                <span className="font-semibold">{currentUser.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => {
                      onSwitchUser("admin@supportticket.com");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">System Admin</div>
                      <div className="text-slate-400 text-[11px]">admin@supportticket.com</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">ADMIN</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser("agent@supportticket.com");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Support Agent Rahat</div>
                      <div className="text-slate-400 text-[11px]">agent@supportticket.com</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">AGENT</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser("arif@example.com");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Arif Rahman</div>
                      <div className="text-slate-400 text-[11px]">arif@example.com</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">CUSTOMER</span>
                  </button>
                </div>
              )}
            </div>

            {/* Current user badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
