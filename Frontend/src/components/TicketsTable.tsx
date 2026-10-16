import React from "react";
import { Ticket, TicketStatus, Priority } from "../types";
import { Plus, MoreVertical, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface TicketsTableProps {
  tickets: Ticket[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onOpenCreate: () => void;
  counts?: {
    all: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onSelectTicket,
  onOpenCreate,
  counts = { all: 124, open: 48, inProgress: 32, resolved: 36, closed: 8 },
}) => {
  const tabs = [
    { id: "ALL", label: `সব টিকিট (${counts.all})` },
    { id: "OPEN", label: `ওপেন (${counts.open})` },
    { id: "IN_PROGRESS", label: `প্রোগ্রেস (${counts.inProgress})` },
    { id: "RESOLVED", label: `সমাধান (${counts.resolved})` },
    { id: "CLOSED", label: `ক্লোজড (${counts.closed})` },
  ];

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
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const formatStatusText = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "ওপেন";
      case "IN_PROGRESS":
        return "প্রোগ্রেস";
      case "RESOLVED":
        return "সমাধান";
      case "CLOSED":
        return "ক্লোজড";
    }
  };

  const formatPriorityText = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "জরুরি (High)";
      case "MEDIUM":
        return "মাঝারি (Medium)";
      case "LOW":
        return "স্বাভাবিক (Low)";
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
    const times = ["১০ মিনিট আগে", "৩২ মিনিট আগে", "১ ঘণ্টা আগে", "২ ঘণ্টা আগে", "৩ ঘণ্টা আগে", "৪ ঘণ্টা আগে", "৫ ঘণ্টা আগে", "৬ ঘণ্টা আগে"];
    return times[index % times.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            টিকিট ব্যবস্থাপনা ও লাইভ ট্র্যাকিং
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রাহকের সমস্যা পর্যবেক্ষণ, ট্রায়াজ ও সমাধান নিশ্চিত করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="টিকিট বা কাস্টমার খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B]"
            />
          </div>

          <button
            onClick={onOpenCreate}
            className="bg-[#00897B] hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>নতুন টিকিট তৈরি</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 border-b border-slate-100">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                isActive
                  ? "bg-[#00897B] text-white shadow-2xs"
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
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
              <th className="pb-3 pl-2">আইডি</th>
              <th className="pb-3">বিষয় ও সমস্যা</th>
              <th className="pb-3">কাস্টমার</th>
              <th className="pb-3">অগ্রাধিকার</th>
              <th className="pb-3">স্ট্যাটাস</th>
              <th className="pb-3">আপডেট সময়</th>
              <th className="pb-3 pr-2 text-right">অ্যাকশন</th>
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
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pl-2 font-mono text-slate-500 text-[11px]">
                    #TKT-{1024 - index}
                  </td>

                  <td className="py-3.5 font-bold text-slate-800 group-hover:text-[#00897B] transition-colors pr-4">
                    {ticket.title}
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={avatar}
                        alt={customerName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate text-xs">
                          {customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {ticket.customer?.email || "user@example.com"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {formatPriorityText(ticket.priority)}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(
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

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#00897B] text-white font-bold flex items-center justify-center">
            ১
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            ২
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-medium">
            ৩
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-slate-400 text-xs">
          মোট {counts.all} টির মধ্যে ১ - {tickets.length} টি দেখানো হচ্ছে
        </div>
      </div>
    </div>
  );
};
