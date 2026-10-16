import { useState, useEffect, useMemo } from "react";
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
import { TicketsView } from "./components/views/TicketsView";
import { CustomersView } from "./components/views/CustomersView";
import { SettingsView } from "./components/views/SettingsView";
import { CustomerPortalView } from "./components/views/CustomerPortalView";
import { SmartQueueWidget } from "./components/SmartQueueWidget";
import { AuthView } from "./components/views/AuthView";
import { StaffLoad, ActivityLog } from "./types";
import { Calendar } from "lucide-react";

export type AppRoute = "AUTH" | "CUSTOMER" | "ADMIN" | "AGENT";

export function getCustomerSlug(user?: User | null): string {
  if (!user || !user.name) return "portal";
  const slug = user.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "portal";
}

export function parseRoute(pathname: string): AppRoute {
  const p = pathname.toLowerCase();
  if (p === "/auth" || p.startsWith("/auth/") || p === "/login" || p.startsWith("/login/")) {
    return "AUTH";
  }
  if (p.startsWith("/admin")) {
    return "ADMIN";
  }
  if (p.startsWith("/agent") || p.startsWith("/support-agent")) {
    return "AGENT";
  }
  if (p.startsWith("/customer")) {
    return "CUSTOMER";
  }
  return "AUTH";
}

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Route state: /auth, /customer/:username, /admin, /agent
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname.toLowerCase();
      if (p !== "/" && p !== "") {
        return parseRoute(p);
      }
    }
    return "AUTH";
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Queue and staff load states
  const [queueTickets, setQueueTickets] = useState<Ticket[]>([]);
  const [staffLoads, setStaffLoads] = useState<StaffLoad[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  const loadQueueData = async () => {
    if (!currentUser) return;
    setIsLoadingQueue(true);
    try {
      const [queue, loads, logs] = await Promise.all([
        api.getWaitingQueue(),
        api.getStaffLoadSummary(),
        api.getActivityLogs(),
      ]);
      setQueueTickets(queue);
      setStaffLoads(loads);
      setActivityLogs(logs);
    } catch (err) {
      console.warn("Could not load queue data:", err);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  const handleAssignFromQueue = async () => {
    try {
      const res = await api.assignFromQueue();
      await Promise.all([loadTickets(), loadQueueData()]);
      if (!res.success) {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || "Failed to auto-assign from queue");
    }
  };

  const handleToggleAvailability = async (staffId: string, status: "AVAILABLE" | "ON_LEAVE") => {
    await api.toggleStaffAvailability(staffId, status);
    await loadQueueData();
  };

  const navigateToAuth = () => {
    window.history.pushState({}, "", "/auth");
    setCurrentRoute("AUTH");
  };

  const navigateToCustomer = (user?: User | null) => {
    const slug = getCustomerSlug(user || currentUser);
    window.history.pushState({}, "", `/customer/${slug}`);
    setCurrentRoute("CUSTOMER");
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, "", "/admin");
    setCurrentRoute("ADMIN");
  };

  const navigateToAgent = () => {
    window.history.pushState({}, "", "/agent");
    setCurrentRoute("AGENT");
  };

  const navigateForUserRole = (user: User) => {
    if (user.role === "CUSTOMER") {
      navigateToCustomer(user);
    } else if (user.role === "AGENT") {
      navigateToAgent();
    } else {
      navigateToAdmin();
    }
  };

  // Sync route on popstate (browser back / forward buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === "/" || p === "") {
        if (currentUser) {
          navigateForUserRole(currentUser);
        } else {
          navigateToAuth();
        }
        return;
      }
      setCurrentRoute(parseRoute(p));
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [currentUser]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("support_ticket_token") || localStorage.getItem("resolvedesk_token");
      if (token) {
        try {
          const user = await api.getMe();
          setCurrentUser(user);
          loadStaff();

          const initialPath = window.location.pathname.toLowerCase();
          if (initialPath === "/" || initialPath === "" || initialPath === "/auth" || initialPath === "/login") {
            navigateForUserRole(user);
          } else {
            setCurrentRoute(parseRoute(initialPath));
          }
        } catch {
          localStorage.removeItem("support_ticket_token");
          localStorage.removeItem("resolvedesk_token");
          setCurrentUser(null);
          navigateToAuth();
        }
      } else {
        setCurrentUser(null);
        const initialPath = window.location.pathname.toLowerCase();
        if (initialPath !== "/auth" && initialPath !== "/login") {
          navigateToAuth();
        } else {
          setCurrentRoute("AUTH");
        }
      }
      setAuthChecking(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setCurrentUser(null);
      localStorage.removeItem("support_ticket_token");
      localStorage.removeItem("resolvedesk_token");
      navigateToAuth();
    };
    window.addEventListener("auth_unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth_unauthorized", handleUnauthorized);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    loadStaff();
    loadQueueData();
    navigateForUserRole(user);
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
    loadQueueData();
  }, [currentUser, statusFilter, searchQuery]);

  const handleSwitchUser = async (email: string) => {
    try {
      const { user, token } = await api.login(email, "password123");
      localStorage.setItem("support_ticket_token", token);
      localStorage.setItem("resolvedesk_token", token);
      setCurrentUser(user);
      loadStaff();
      await Promise.all([loadTickets(), loadQueueData()]);
      navigateForUserRole(user);
    } catch (err) {
      console.error("Failed to switch persona", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("support_ticket_token");
    localStorage.removeItem("resolvedesk_token");
    setCurrentUser(null);
    setTickets([]);
    setQueueTickets([]);
    navigateToAuth();
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
      await Promise.all([loadTickets(), loadQueueData()]);
    } catch (err) {
      console.error("Failed to refresh ticket", err);
    }
  };

  // Dynamic calculations from live database tickets & queues (zero mock fallbacks)
  const counts = useMemo(() => {
    const rawAll = tickets.length;
    const rawOpen = tickets.filter((t) => t.status === "OPEN").length;
    const rawInProg = tickets.filter((t) => t.status === "IN_PROGRESS").length;
    const rawReplied = tickets.filter((t) => t.status === "CUSTOMER_REPLIED").length;
    const rawResolved = tickets.filter((t) => t.status === "RESOLVED").length;
    const rawClosed = tickets.filter((t) => t.status === "CLOSED").length;
    const rawWaiting = queueTickets.length;

    return {
      all: rawAll,
      open: rawOpen,
      inProgress: rawInProg,
      customerReplied: rawReplied,
      waitingQueue: rawWaiting,
      resolved: rawResolved,
      closed: rawClosed,
    };
  }, [tickets, queueTickets]);

  const priorityCounts = useMemo(() => {
    const rawHigh = tickets.filter((t) => t.priority === "HIGH" || t.priority === "URGENT").length;
    const rawMed = tickets.filter((t) => t.priority === "MEDIUM").length;
    const rawLow = tickets.filter((t) => t.priority === "LOW").length;

    return {
      high: rawHigh,
      medium: rawMed,
      low: rawLow,
      total: counts.all,
    };
  }, [tickets, counts]);

  const firstName = currentUser?.name ? currentUser.name.split(" ")[0] : "Rafsan";

  // 1. Loading screen while validating JWT token
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">Initializing Secure Session...</span>
        </div>
      </div>
    );
  }

  // 2. PUBLIC ROUTE GUARD: If at /auth or user is not authenticated, render dedicated AuthView
  if (currentRoute === "AUTH" || !currentUser) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  // 3. CUSTOMER PORTAL ROUTE: /customer or /customer/:username
  if (currentRoute === "CUSTOMER") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
        <CustomerPortalView
          currentUser={currentUser}
          tickets={tickets}
          onOpenCreate={() => setIsCreateOpen(true)}
          onSwitchToAdmin={navigateToAdmin}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          onRefreshTicket={handleRefreshSingleTicket}
          onTicketCreated={() => loadTickets()}
        />

        {/* Global Modals */}
        <CreateTicketModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onTicketCreated={() => loadTickets()}
        />

        <TicketDetailModal
          ticket={selectedTicket}
          currentUser={currentUser}
          staffList={staffList}
          staffLoads={staffLoads}
          onClose={() => setSelectedTicket(null)}
          onRefreshTicket={handleRefreshSingleTicket}
        />
      </div>
    );
  }

  // 2. If at "/admin" or "/support-agent", render the Staff ERP Dashboard
  return (
    <div className="flex h-screen bg-[#F4F7FB] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Sidebar with user's ERP signature design & ticket management navigation */}
      <Sidebar
        currentUser={currentUser}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onOpenPersonaModal={() => navigateToCustomer()}
        onOpenAiModal={() => setIsCreateOpen(true)}
        onLogout={handleLogout}
        openCount={counts.open}
        inProgressCount={counts.inProgress}
        pendingCount={counts.closed}
        openTicketsCount={counts.open}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        {/* Top Header with dynamic notification feed, persona switcher, and Customer Portal link */}
        <TopHeader
          currentUser={currentUser}
          tickets={tickets}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          onSelectTicket={handleSelectTicket}
          onSwitchToCustomerPortal={navigateToCustomer}
        />

        <main className="p-7 max-w-[1700px] w-full mx-auto">
          {/* Conditional rendering based on activeMenu */}
          {activeMenu === "Tickets" ? (
            <TicketsView
              tickets={tickets}
              onSelectTicket={handleSelectTicket}
              onOpenCreate={() => setIsCreateOpen(true)}
              counts={counts}
            />
          ) : activeMenu === "Customers" ? (
            <CustomersView tickets={tickets} />
          ) : activeMenu === "Settings" ? (
            <SettingsView />
          ) : (
            /* Default: Modern Support Ticket Dashboard Overview */
            <div className="space-y-7">
              {/* 1. Header greeting & system status bar (Full width) */}
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

              {/* 2. Top Metric Cards (Full width 4-card grid) */}
              <MetricCards
                totalCount={counts.all}
                openCount={counts.open}
                resolvedCount={counts.resolved}
                avgResponseTime="2h 14m"
              />

              {/* 3. Smart Queue & Staff Bandwidth Manager (FULL WIDTH MISSION CONTROL HERO) */}
              <SmartQueueWidget
                queueTickets={queueTickets}
                staffLoads={staffLoads}
                activityLogs={activityLogs}
                onAssignFromQueue={handleAssignFromQueue}
                onToggleAvailability={handleToggleAvailability}
                onRefresh={loadQueueData}
                isLoading={isLoadingQueue}
              />

              {/* 4. Operational Grid: Left Table (8 Cols) + Right Analytics Panel (4 Cols) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
                <div className="xl:col-span-8 space-y-6">
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
                      high: priorityCounts.high,
                      medium: priorityCounts.medium,
                      low: priorityCounts.low,
                      total: counts.all,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTicketCreated={() => loadTickets()}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        currentUser={currentUser}
        staffList={staffList}
        staffLoads={staffLoads}
        onClose={() => setSelectedTicket(null)}
        onRefreshTicket={handleRefreshSingleTicket}
      />
    </div>
  );
}

export default App;

