import React from "react";
import { Ticket, Hourglass, CheckCircle2, User, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardsProps {
  totalCount?: number;
  openCount?: number;
  resolvedCount?: number;
  avgResponseTime?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalCount = 124,
  openCount = 48,
  resolvedCount = 68,
  avgResponseTime = "2h 14m",
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
      {/* Total Tickets */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D68FE] flex items-center justify-center mb-4">
          <Ticket className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500">Total Tickets</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalCount}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> 12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. last 7 days</p>
        </div>
      </div>

      {/* Open Tickets */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <Hourglass className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500">Open Tickets</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{openCount}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowDownRight className="w-3.5 h-3.5" /> 8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. last 7 days</p>
        </div>
      </div>

      {/* Resolved Tickets */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500">Resolved Tickets</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{resolvedCount}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> 18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. last 7 days</p>
        </div>
      </div>

      {/* Avg. Response Time */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
          <User className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500">Avg. Response Time</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{avgResponseTime}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowDownRight className="w-3.5 h-3.5" /> 32%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. last 7 days</p>
        </div>
      </div>
    </div>
  );
};
