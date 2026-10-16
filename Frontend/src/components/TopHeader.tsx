import React, { useState, useMemo } from "react";
import {
  Bell,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Building2,
  Check,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { User, Ticket } from "../types";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "ticket" | "ai" | "alert" | "system";
  read: boolean;
  ticketId?: string;
}

interface TopHeaderProps {
  currentUser: User | null;
  tickets?: Ticket[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSwitchUser: (email: string) => void;
  onLogout: () => void;
  onSelectTicket?: (ticket: Ticket) => void;
  onSwitchToCustomerPortal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  tickets = [],
  searchQuery,
  setSearchQuery,
  onSwitchUser,
  onLogout,
  onSelectTicket,
  onSwitchToCustomerPortal,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Dynamic notification generation from real tickets
  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    // System heartbeat notification
    list.push({
      id: "sys-1",
      title: "System Status Online",
      message: "Database & Express API microservices operational with 99.9% uptime.",
      time: "Just now",
      type: "system",
      read: readIds.has("sys-1"),
    });

    // Recent tickets as notifications
    tickets.slice(0, 4).forEach((t, idx) => {
      const times = ["10m ago", "35m ago", "1h ago", "3h ago"];
      const notifId = `tkt-${t.id}`;

      list.push({
        id: notifId,
        title: `New Ticket: ${t.title}`,
        message: `Submitted by ${t.customer?.name || "Customer"} (${t.priority} priority, ${t.category})`,
        time: times[idx] || "Today",
        type: t.priority === "HIGH" || t.priority === "URGENT" ? "alert" : "ticket",
        read: readIds.has(notifId),
        ticketId: t.id,
      });

      if (t.status === "CUSTOMER_REPLIED") {
        const replyNotifId = `reply-${t.id}`;
        list.push({
          id: replyNotifId,
          title: `💬 Customer Replied: ${t.title}`,
          message: `${t.customer?.name || "Customer"} submitted a response. Immediate agent action requested.`,
          time: "2m ago",
          type: "alert",
          read: readIds.has(replyNotifId),
          ticketId: t.id,
        });
      }

      if (t.aiSummary) {
        const aiId = `ai-${t.id}`;
        list.push({
          id: aiId,
          title: `Gemini AI Auto-Triage: #${t.id.slice(0, 6)}`,
          message: t.aiSummary,
          time: times[idx] || "Today",
          type: "ai",
          read: readIds.has(aiId),
          ticketId: t.id,
        });
      }
    });

    return list;
  }, [tickets, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setReadIds((prev) => new Set([...prev, notif.id]));
    if (notif.ticketId && onSelectTicket) {
      const match = tickets.find((t) => t.id === notif.ticketId);
      if (match) {
        onSelectTicket(match);
        setNotifMenuOpen(false);
      }
    }
  };

  const roleText = currentUser?.role === "ADMIN"
    ? "Super Admin (Head Office)"
    : currentUser?.role === "AGENT"
    ? "Support Agent (Control)"
    : "Customer Portal";

  return (
    <header className="h-18 bg-[#1E222D] border-b border-slate-800/90 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Logo, Title & Subtitle */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#141720] border border-slate-700/60 flex items-center justify-center text-[#00BFA5] shadow-xs">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div>
          <h1 className="text-white text-base font-extrabold tracking-wider">
            SUPPORT TICKET MANAGEMENT
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            Staff ERP & Smart Queue Manager
          </p>
        </div>
      </div>

      {/* Right Controls: Role Capsule, Customer Portal Switcher & Dynamic Notification Bell */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Switch to Customer Portal Button */}
        {onSwitchToCustomerPortal && (
          <button
            onClick={onSwitchToCustomerPortal}
            className="border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-colors shadow-2xs cursor-pointer"
            title="Switch to Customer Support Portal (/)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer Portal (/)</span>
            <span className="sm:hidden">Portal (/)</span>
          </button>
        )}

        {/* Role Capsule with Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifMenuOpen(false);
            }}
            className="border border-slate-700/80 bg-[#161922] hover:bg-[#1C202B] px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-200 transition-colors shadow-2xs"
            title="Click to switch persona role"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>{roleText}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Persona Switcher Dropdown */}
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-[#232733] border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Test Persona (Live Demo)
              </div>

              <button
                onClick={() => {
                  onSwitchUser("admin@supportticket.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">Rafsan Ahmed</div>
                  <div className="text-[10px] text-slate-400">admin@supportticket.com</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700">
                  ADMIN
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchUser("agent@supportticket.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">Rahat Ahmed</div>
                  <div className="text-[10px] text-slate-400">agent@supportticket.com</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                  AGENT
                </span>
              </button>

              <button
                onClick={() => {
                  onSwitchUser("arif@example.com");
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-700/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">Arif Rahman</div>
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
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifMenuOpen(!notifMenuOpen);
              setUserMenuOpen(false);
            }}
            className="relative w-9 h-9 rounded-xl border border-slate-700/80 bg-[#161922] hover:bg-[#1C202B] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-[#1E222D]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dynamic Notification Dropdown */}
          {notifMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#232733] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setNotifMenuOpen(false)}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-[#1C202B] border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">System Activity Feed</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-[#00897B] hover:text-teal-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-slate-700/30 cursor-pointer transition-colors flex items-start gap-3 ${
                      !notif.read ? "bg-slate-700/15" : "opacity-75"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.type === "ai" ? (
                        <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      ) : notif.type === "alert" ? (
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : notif.type === "system" ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate text-xs">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00897B] shrink-0 mt-1.5"></span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-[#1C202B] border-t border-slate-700/80 text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  Live Event Feed • Powered by Support Ticket Engine
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


