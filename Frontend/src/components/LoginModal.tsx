import React, { useState } from "react";
import { api } from "../services/api";
import { User } from "../types";
import { Sparkles, Shield, User as UserIcon, AlertCircle, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@resolvedesk.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        const { user, token } = await api.register(name, email, password, role);
        localStorage.setItem("resolvedesk_token", token);
        onSuccess(user);
      } else {
        const { user, token } = await api.login(email, password);
        localStorage.setItem("resolvedesk_token", token);
        onSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { user, token } = await api.login(userEmail, "password123");
      localStorage.setItem("resolvedesk_token", token);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegister ? "Create Account" : "Sign In to ResolveDesk AI"}
          </h2>
          <p className="text-xs text-slate-500">
            Enterprise Issue Resolution & Automated Ticket Triage
          </p>
        </div>

        {/* 1-Click Persona Login (Ideal for Live Assessment) */}
        {!isRegister && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
              Quick Test Personas (1-Click)
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@resolvedesk.com")}
                disabled={loading}
                className="p-2 text-left bg-white hover:bg-purple-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors flex flex-col items-center text-center"
              >
                <Shield className="w-4 h-4 text-purple-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Admin</span>
                <span className="text-[9px] text-slate-400">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("agent@resolvedesk.com")}
                disabled={loading}
                className="p-2 text-left bg-white hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors flex flex-col items-center text-center"
              >
                <Sparkles className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Agent</span>
                <span className="text-[9px] text-slate-400">Triage Queue</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("user@resolvedesk.com")}
                disabled={loading}
                className="p-2 text-left bg-white hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col items-center text-center"
              >
                <UserIcon className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Customer</span>
                <span className="text-[9px] text-slate-400">Create Ticket</span>
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Hasan"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@resolvedesk.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Support Agent</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs shadow-indigo-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isRegister ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Need a new account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
