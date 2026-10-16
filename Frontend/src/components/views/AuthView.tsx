import React, { useState } from "react";
import { api } from "../../services/api";
import { User, Role } from "../../types";
import {
  Shield,
  Sparkles,
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Headphones,
  LogIn,
  UserPlus,
} from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  initialMode?: "login" | "register";
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthSuccess,
  initialMode = "login",
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Logins
  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { user, token } = await api.login(demoEmail, "password123");
      localStorage.setItem("support_ticket_token", token);
      localStorage.setItem("resolvedesk_token", token);
      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (activeTab === "login") {
        if (!email.trim() || !password.trim()) {
          setErrorMessage("Please enter both email and password.");
          setLoading(false);
          return;
        }
        const { user, token } = await api.login(email.trim(), password);
        localStorage.setItem("support_ticket_token", token);
        localStorage.setItem("resolvedesk_token", token);
        onAuthSuccess(user);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setErrorMessage("Please fill in all registration fields.");
          setLoading(false);
          return;
        }
        const { user, token } = await api.register(name.trim(), email.trim(), password, role);
        localStorage.setItem("support_ticket_token", token);
        localStorage.setItem("resolvedesk_token", token);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SUPPORT TICKET <span className="text-emerald-600 font-extrabold">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Customer Support & Smart Queue Management System
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300">
          {/* 2-Way Tab Bar with Smooth Sliding Animated Capsule */}
          <div className="relative p-1.5 bg-slate-100/90 border-b border-slate-200/80 m-4 rounded-2xl flex select-none">
            {/* Sliding Active Pill Background with Smooth Cubic-Bezier Transition */}
            <div
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-md shadow-slate-200/90 border border-slate-200/70 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
                activeTab === "login" ? "translate-x-0" : "translate-x-full"
              }`}
            />

            {/* Tab 1: Sign In */}
            <button
              type="button"
              id="tab-sign-in"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage(null);
              }}
              className={`relative z-10 w-1/2 py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer ${
                activeTab === "login"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LogIn
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  activeTab === "login"
                    ? "text-emerald-600 scale-110"
                    : "text-slate-400"
                }`}
              />
              <span>Sign In</span>
            </button>

            {/* Tab 2: Create Account */}
            <button
              type="button"
              id="tab-create-account"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage(null);
              }}
              className={`relative z-10 w-1/2 py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer ${
                activeTab === "register"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  activeTab === "register"
                    ? "text-emerald-600 scale-110"
                    : "text-slate-400"
                }`}
              />
              <span>Create Account</span>
            </button>
          </div>

          <div className="p-6 pt-2 space-y-4">
            {/* Quick Demo Login Buttons (on Sign In tab) with Smooth Collapse */}
            <div
              className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                activeTab === "login"
                  ? "max-h-48 opacity-100 scale-100 mb-2"
                  : "max-h-0 opacity-0 scale-95 pointer-events-none mb-0"
              }`}
            >
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Quick Demo Switcher
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    1-Click Login
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("arif@example.com")}
                    disabled={loading}
                    className="p-2 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-200 flex flex-col items-center text-center cursor-pointer group hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-slate-800">Customer</span>
                    <span className="text-[9px] text-emerald-600 font-mono font-medium">/customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("agent@supportticket.com")}
                    disabled={loading}
                    className="p-2 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 flex flex-col items-center text-center cursor-pointer group hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Headphones className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-slate-800">Agent</span>
                    <span className="text-[9px] text-blue-600 font-mono font-medium">/agent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("admin@supportticket.com")}
                    disabled={loading}
                    className="p-2 bg-white hover:bg-purple-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-all duration-200 flex flex-col items-center text-center cursor-pointer group hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Shield className="w-4 h-4 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-slate-800">Admin</span>
                    <span className="text-[9px] text-purple-600 font-mono font-medium">/admin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in-50 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration: Full Name (Smooth Expand / Collapse) */}
              <div
                className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                  activeTab === "register"
                    ? "max-h-24 opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Arif Rahman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required={activeTab === "register"}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Registration: Role Selection (Smooth Expand / Collapse) */}
              <div
                className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                  activeTab === "register"
                    ? "max-h-24 opacity-100 pt-1"
                    : "max-h-0 opacity-0 pointer-events-none pt-0"
                }`}
              >
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Account Type (Role)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "CUSTOMER", label: "Customer", desc: "User Portal" },
                    { id: "AGENT", label: "Agent", desc: "Support Staff" },
                    { id: "ADMIN", label: "Admin", desc: "Full Access" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as Role)}
                      className={`py-1.5 px-2 text-center rounded-lg border transition-all duration-150 cursor-pointer ${
                        role === item.id
                          ? "border-emerald-500 bg-emerald-50/90 text-emerald-800 font-bold shadow-2xs ring-1.5 ring-emerald-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight">{item.label}</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button with Micro-Interaction */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1E222D] hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <>
                    <span className="transition-all duration-200">
                      {activeTab === "login" ? "Sign In to Dashboard" : "Complete Registration"}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
