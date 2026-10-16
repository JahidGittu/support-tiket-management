import { useState, useEffect } from "react";
import { User, Ticket } from "./types";
import { api } from "./services/api";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { MetricCards } from "./components/MetricCards";
import { TicketsTable } from "./components/TicketsTable";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { TicketDetailModal } from "./components/TicketDetailModal";
import { LoginModal } from "./components/LoginModal";
import { Calendar, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("resolvedesk_token");
      if (token) {
        try {
          const user = await api.getMe();
          setCurrentUser(user);
          loadStaff();
        } catch {
          localStorage.removeItem("resolvedesk_token");
          autoLoginDefault();
        }
      } else {
        autoLoginDefault();
      }
    };

    initAuth();
  }, []);

  const autoLoginDefault = async () => {
    try {
      const { user, token } = await api.login("admin@resolvedesk.com", "password123");
      localStorage.setItem("resolvedesk_token", token);
      setCurrentUser(user);
      loadStaff();
    } catch {
      setIsLoginOpen(true);
    }
  };

  const loadStaff = async () => {
    try {
      const staff = await api.getStaff();
      setStaffList(staff);
    } catch (err) {
      console.warn("Could not load staff list:", err);
    }
  };

  const loadTickets = async () => {
    if (!currentUser) return;
    try {
      const data = await api.getTickets({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [currentUser, statusFilter, searchQuery]);

  const handleSwitchUser = async (email: string) => {
    try {
      const { user, token } = await api.login(email, "password123");
      localStorage.setItem("resolvedesk_token", token);
      setCurrentUser(user);
      loadStaff();
    } catch (err) {
      console.error("Failed to switch persona", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("resolvedesk_token");
    setCurrentUser(null);
    setTickets([]);
    setIsLoginOpen(true);
  };

  const handleSelectTicket = async (ticket: Ticket) => {
    try {
      const fullTicket = await api.getTicketById(ticket.id);
      setSelectedTicket(fullTicket);
    } catch {
      setSelectedTicket(ticket);
    }
  };

  const handleRefreshSingleTicket = async (ticketId: string) => {
    try {
      const refreshed = await api.getTicketById(ticketId);
      setSelectedTicket(refreshed);
      loadTickets();
    } catch (err) {
      console.error("Failed to refresh ticket", err);
    }
  };

  const counts = {
    all: Math.max(124, tickets.length),
    open: 48,
    inProgress: 32,
    resolved: 36,
    closed: 8,
  };

  const displayName = currentUser?.name || "সুপার এডমিন";

  return (
    <div className="flex h-screen bg-[#F4F7FB] text-slate-800 font-sans overflow-hidden">
      {/* Left Sidebar matching user's ERP signature styling */}
      <Sidebar
        currentUser={currentUser}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onOpenPersonaModal={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        transactionCount={tickets.length}
        visaFileCount={counts.resolved}
        pendingCount={counts.open}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        {/* Top Header matching user's ERP signature styling */}
        <TopHeader
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
        />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Greeting & Quick Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                শুভ সকাল, {displayName} <span className="inline-block">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                সেন্ট্রাল হেড অফিস কন্ট্রোল প্যানেল ও কার্য পরিচালনা ড্যাশবোর্ড
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Wed, 16 Oct 2026</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200/70 text-emerald-700 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>সিস্টেম অনলাইন</span>
              </div>
            </div>
          </div>

          {/* Conditional View Based on Active Sidebar Tab */}
          {activeMenu === "Agents" ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    এজেন্ট ও সাপোর্ট টিম ডিরেক্টরি
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সিস্টেমে অনুমোদিত এজেন্ট ও স্টাফ সদস্যদের তালিকা
                  </p>
                </div>
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  className="text-xs font-bold text-[#00897B] hover:underline"
                >
                  ← ড্যাশবোর্ডে ফিরুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1A1D24] text-white flex items-center justify-center font-bold text-sm">
                      {staff.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {staff.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                          {staff.role}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> সক্রিয়
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* 4 Metric KPI Cards */}
              <MetricCards
                totalCount={counts.all}
                openCount={counts.open}
                inProgressCount={counts.inProgress}
                resolvedCount={counts.resolved}
              />

              {/* Tickets Table with Search & Filtering */}
              <TicketsTable
                tickets={tickets}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectTicket={handleSelectTicket}
                onOpenCreate={() => setIsCreateOpen(true)}
                counts={counts}
              />
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTicketCreated={() => loadTickets()}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        currentUser={currentUser}
        staffList={staffList}
        onClose={() => setSelectedTicket(null)}
        onRefreshTicket={handleRefreshSingleTicket}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginOpen(false);
          loadStaff();
        }}
      />
    </div>
  );
}

export default App;

