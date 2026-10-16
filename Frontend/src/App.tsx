import { useState, useEffect } from "react";
import { User, Ticket } from "./types";
import { api } from "./services/api";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { MetricCards } from "./components/MetricCards";
import { TicketsTable } from "./components/TicketsTable";
import { RightPanel } from "./components/RightPanel";
import { AiHelpBanner } from "./components/AiHelpBanner";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { TicketDetailModal } from "./components/TicketDetailModal";
import { LoginModal } from "./components/LoginModal";
import { Calendar } from "lucide-react";

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

  const firstName = currentUser?.name ? currentUser.name.split(" ")[0] : "Rafsan";

  return (
    <div className="flex h-screen bg-[#F4F7FB] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onOpenPersonaModal={() => setIsLoginOpen(true)}
        onOpenAiModal={() => setIsCreateOpen(true)}
        openTicketsCount={counts.closed + 4}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <TopHeader
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
        />

        <main className="p-7 max-w-[1700px] w-full mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
            <div className="xl:col-span-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    Good morning, {firstName} <span className="inline-block">👋</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Here's what's happening with your support today.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-2xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Wed, 16 Oct 2026</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200/70 text-emerald-700 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>System Online</span>
                  </div>
                </div>
              </div>

              <MetricCards
                totalCount={counts.all}
                openCount={counts.open}
                resolvedCount={counts.resolved}
                avgResponseTime="2h 14m"
              />

              <TicketsTable
                tickets={tickets}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onSelectTicket={handleSelectTicket}
                onOpenCreate={() => setIsCreateOpen(true)}
                counts={counts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <AiHelpBanner onOpenAi={() => setIsCreateOpen(true)} />
            </div>

            <div className="xl:col-span-4 space-y-6">
              <RightPanel
                onOpenCreate={() => setIsCreateOpen(true)}
                onOpenAiSuggestion={() => setIsCreateOpen(true)}
                statusCounts={{
                  open: counts.open,
                  inProgress: counts.inProgress,
                  resolved: counts.resolved,
                  closed: counts.closed,
                  total: counts.all,
                }}
                priorityCounts={{
                  high: 28,
                  medium: 56,
                  low: 40,
                  total: counts.all,
                }}
              />
            </div>
          </div>
        </main>
      </div>

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
