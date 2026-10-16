import React, { useState } from "react";
import { Ticket, TicketStatus, Priority, Category } from "../../types";
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TicketsViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onOpenCreate: () => void;
  counts: {
    all: number;
    open: number;
    inProgress: number;
    customerReplied?: number;
    resolved: number;
    closed: number;
  };
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onSelectTicket,
  onOpenCreate,
  counts,
}) => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;
    const matchesPriority = selectedPriority === "ALL" || t.priority === selectedPriority;
    const matchesCategory = selectedCategory === "ALL" || t.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "bg-red-50 text-red-600 border border-red-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "LOW":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "IN_PROGRESS":
        return "bg-purple-50 text-purple-600 border border-purple-200";
      case "CUSTOMER_REPLIED":
        return "bg-purple-100 text-purple-700 border border-purple-300 font-semibold";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tickets Directory & Queue Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ticket triage, multi-criteria filtering, and lifecycle operations.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-[#00897B] hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket title, ID, or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters:</span>
            </div>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High / Urgent</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="BILLING">Billing</option>
              <option value="TECHNICAL">Technical</option>
              <option value="ACCOUNT">Account</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3">
          {[
            { id: "ALL", label: `All Tickets (${counts.all})` },
            { id: "OPEN", label: `Open (${counts.open})` },
            { id: "IN_PROGRESS", label: `In Progress (${counts.inProgress})` },
            { id: "CUSTOMER_REPLIED", label: `Customer Replied (${counts.customerReplied || 0})` },
            { id: "RESOLVED", label: `Resolved (${counts.resolved})` },
            { id: "CLOSED", label: `Closed (${counts.closed})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedStatus === tab.id
                  ? "bg-[#00897B] text-white shadow-xs font-semibold"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400">
                <th className="py-3 pl-4">ID</th>
                <th className="py-3">Subject & Details</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Category</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created Date</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pl-4 font-mono text-slate-500 text-[11px]">
                    #TKT-{ticket.id.slice(0, 6)}
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-slate-900 group-hover:text-[#00897B] transition-colors">
                      {ticket.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                      {ticket.description}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-slate-800">
                      {ticket.customer?.name || "Customer"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ticket.customer?.email}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {ticket.category}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 pr-4 text-right">
                    <button className="text-xs font-semibold text-[#00897B] hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No tickets match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredTickets.length} of {tickets.length} total tickets
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-1 rounded-md bg-[#00897B] text-white font-bold">1</span>
            <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
