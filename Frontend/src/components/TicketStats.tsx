import React from "react";
import { Ticket } from "../types";
import { Inbox, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface TicketStatsProps {
  tickets: Ticket[];
}

export const TicketStats: React.FC<TicketStatsProps> = ({ tickets }) => {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
  const urgent = tickets.filter((t) => t.priority === "URGENT" && t.status !== "RESOLVED" && t.status !== "CLOSED").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Total In Queue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          <Inbox className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Awaiting Action</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{open}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{inProgress}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{resolved}</p>
          {urgent > 0 && (
            <span className="text-[10px] text-red-600 font-semibold">{urgent} urgent pending</span>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
