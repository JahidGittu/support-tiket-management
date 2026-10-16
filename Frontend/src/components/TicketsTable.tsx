import React from "react";
import { Ticket, TicketStatus, Priority } from "../types";
import { Plus, ArrowRight, MoreVertical, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface TicketsTableProps {
  tickets: Ticket[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onOpenCreate: () => void;
  counts?: {
    all: number;
    open: number;
    inProgress: number;
    customerReplied?: number;
    resolved: number;
    closed: number;
  };
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  statusFilter,
  setStatusFilter,
  onSelectTicket,
  onOpenCreate,
  counts = { all: 124, open: 48, inProgress: 32, customerReplied: 6, resolved: 36, closed: 8 },
  searchQuery,
  setSearchQuery,
}) => {
  const tabs = [
    { id: "ALL", label: `All (${counts.all})` },
    { id: "OPEN", label: `Open (${counts.open})` },
    { id: "IN_PROGRESS", label: `In Progress (${counts.inProgress})` },
    { id: "CUSTOMER_REPLIED", label: `Customer Replied (${counts.customerReplied || 0})` },
    { id: "RESOLVED", label: `Resolved (${counts.resolved})` },
    { id: "CLOSED", label: `Closed (${counts.closed})` },
  ];

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]";
      case "MEDIUM":
        return "bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]";
      case "LOW":
        return "bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]";
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]";
      case "IN_PROGRESS":
        return "bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]";
      case "CUSTOMER_REPLIED":
        return "bg-[#FAF5FF] text-[#9333EA] border border-[#E9D5FF] font-semibold";
      case "RESOLVED":
        return "bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]";
      case "CLOSED":
        return "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]";
    }
  };

  const formatStatusText = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "CUSTOMER_REPLIED":
        return "Customer Replied";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
    }
  };

  const formatPriorityText = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
    }
  };

  const customerAvatars: Record<string, string> = {
    "Arif Rahman": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    "Nusrat Jahan": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    "Hasan Mahmud": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    "Sadia Islam": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    "Imran Hossain": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    "Tania Akter": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    "Fahim Rahman": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    "Jannatul Ferdous": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
  };

  const getRelativeTime = (index: number) => {
    const times = ["10m ago", "32m ago", "1h ago", "2h ago", "3h ago", "4h ago", "5h ago", "6h ago"];
    return times[index % times.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs mb-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Tickets</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage and track all support tickets from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {setSearchQuery && (
            <div className="relative w-56 hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68FE] transition-all"
              />
            </div>
          )}
          <button
            onClick={onOpenCreate}
            className="bg-[#1D68FE] hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Ticket</span>
          </button>
          <button className="text-xs font-semibold text-[#1D68FE] hover:text-blue-700 flex items-center gap-1 transition-colors">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                isActive
                  ? "bg-[#1D68FE] text-white font-semibold shadow-xs shadow-blue-500/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="pb-3.5 pl-2 font-medium">ID</th>
              <th className="pb-3.5 font-medium">Subject</th>
              <th className="pb-3.5 font-medium">Customer</th>
              <th className="pb-3.5 font-medium">Priority</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium pr-4">Updated</th>
              <th className="pb-3.5 pr-2 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {tickets.map((ticket, index) => {
              const customerName = ticket.customer?.name || "Customer";
              const avatar =
                customerAvatars[customerName] ||
                `https://images.unsplash.com/photo-${1534528741775 + index}?auto=format&fit=crop&q=80&w=150`;

              return (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pl-2 font-mono text-slate-500 text-[11px]">
                    #TKT-{1024 - index}
                  </td>

                  <td className="py-3.5 font-semibold text-slate-800 group-hover:text-[#1D68FE] transition-colors pr-4">
                    {ticket.title}
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={avatar}
                        alt={customerName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-100"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate text-xs">
                          {customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {ticket.customer?.email || "user@example.com"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {formatPriorityText(ticket.priority)}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {formatStatusText(ticket.status)}
                    </span>
                  </td>

                  <td className="py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {getRelativeTime(index)}
                  </td>

                  <td className="py-3.5 pr-2 text-right">
                    <button className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500 mt-2">
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#1D68FE] text-white font-semibold flex items-center justify-center shadow-xs">
            1
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            2
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            3
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            4
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            5
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-slate-400 text-xs">
          Showing 1 - {tickets.length} of {counts.all} tickets
        </div>
      </div>
    </div>
  );
};
