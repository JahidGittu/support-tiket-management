import React from "react";
import { Ticket } from "../../types";
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface ReportsViewProps {
  tickets: Ticket[];
  counts: {
    all: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tickets, counts }) => {
  const total = tickets.length || 1;
  const resolutionRate = Math.round(((counts.resolved + counts.closed) / total) * 100);

  // Dynamic category calculations
  const billingCount = tickets.filter((t) => t.category === "BILLING").length;
  const techCount = tickets.filter((t) => t.category === "TECHNICAL").length;
  const accountCount = tickets.filter((t) => t.category === "ACCOUNT").length;
  const generalCount = tickets.filter((t) => t.category === "GENERAL").length;

  // Dynamic priority calculations
  const highCount = tickets.filter((t) => t.priority === "HIGH" || t.priority === "URGENT").length;
  const medCount = tickets.filter((t) => t.priority === "MEDIUM").length;
  const lowCount = tickets.filter((t) => t.priority === "LOW").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Support Analytics & Operational SLA Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metric synthesis, workload distribution, and resolution performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Last 30 Days Cycle
          </span>
        </div>
      </div>

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Resolution Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{resolutionRate}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            ↑ 4.2% higher than target
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Resolution Time</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D68FE] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">1h 48m</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            ↘ 22m faster response
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">SLA Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00897B] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">97.8%</div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
            Tier-1 SLA target met
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">CSAT Customer Score</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">4.9 / 5.0</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            ★ Based on 84 ratings
          </span>
        </div>
      </div>

      {/* Grid: Status Distribution & Category Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Tickets Distribution by Status</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600">Open Tickets (Requires Action)</span>
                <span className="font-bold text-slate-900">
                  {counts.open} ({Math.round((counts.open / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1D68FE] h-full rounded-full"
                  style={{ width: `${Math.round((counts.open / total) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600">In Progress (Agent Assigned)</span>
                <span className="font-bold text-slate-900">
                  {counts.inProgress} ({Math.round((counts.inProgress / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#8B5CF6] h-full rounded-full"
                  style={{ width: `${Math.round((counts.inProgress / total) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600">Resolved & Closed (Complete)</span>
                <span className="font-bold text-slate-900">
                  {counts.resolved + counts.closed} ({resolutionRate}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full rounded-full"
                  style={{ width: `${resolutionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Ticket Priority Volume Breakdown</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  High & Urgent Priority
                </span>
                <span className="font-bold text-slate-900">
                  {highCount} tickets ({Math.round((highCount / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${Math.round((highCount / total) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Medium Priority
                </span>
                <span className="font-bold text-slate-900">
                  {medCount} tickets ({Math.round((medCount / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.round((medCount / total) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Low Priority
                </span>
                <span className="font-bold text-slate-900">
                  {lowCount} tickets ({Math.round((lowCount / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.round((lowCount / total) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
