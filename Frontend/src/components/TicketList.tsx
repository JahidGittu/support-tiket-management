import React from "react";
import { Ticket, Priority, TicketStatus, Category } from "../types";
import { MessageSquare, Sparkles, User, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  loading,
  onSelectTicket,
}) => {
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20";
      case "HIGH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "MEDIUM":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "LOW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> In Progress
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Closed
          </span>
        );
    }
  };

  const getCategoryBadge = (category: Category) => {
    switch (category) {
      case "BILLING":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "TECHNICAL":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "ACCOUNT":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "GENERAL":
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
        <p className="text-sm text-slate-500 font-medium">Loading tickets, please wait...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No tickets found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No support tickets match your current filters. Try adjusting your status, priority, or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Info */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority}
                </span>

                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getCategoryBadge(ticket.category)}`}>
                  {ticket.category}
                </span>

                {ticket.aiSummary && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-150">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    AI Triaged
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {ticket.title}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                {ticket.description}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{ticket.customer?.name || "Customer"}</span>
                </div>
                <span>•</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                {ticket.assignedTo && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium">Assigned to: {ticket.assignedTo.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Status & Comments */}
            <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{ticket._count?.comments || ticket.comments?.length || 0}</span>
              </div>

              <div>
                {getStatusBadge(ticket.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
