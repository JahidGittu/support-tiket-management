import { useState, useEffect } from "react";
import { User, Ticket } from "./types";
import { api } from "./services/api";
import { Navbar } from "./components/Navbar";
import { TicketStats } from "./components/TicketStats";
import { TicketFilters } from "./components/TicketFilters";
import { TicketList } from "./components/TicketList";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { TicketDetailModal } from "./components/TicketDetailModal";
import { LoginModal } from "./components/LoginModal";

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Initial user check or auto-login with default demo persona
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
    setLoadingTickets(true);
    try {
      const data = await api.getTickets({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        search: searchQuery,
      });
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [currentUser, statusFilter, priorityFilter, categoryFilter, searchQuery]);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Stats Overview */}
        <TicketStats tickets={tickets} />

        {/* Filter Toolbar */}
        <TicketFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCreate={() => setIsCreateOpen(true)}
        />

        {/* Tickets Feed */}
        <TicketList
          tickets={tickets}
          loading={loadingTickets}
          onSelectTicket={handleSelectTicket}
        />
      </main>

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
