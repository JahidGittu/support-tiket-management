import React from "react";
import {
  Sparkles,
  PenSquare,
  Search,
  BarChart2,
  UserPlus,
  ChevronRight,
} from "lucide-react";

interface RightPanelProps {
  onOpenCreate: () => void;
  onOpenAiSuggestion: () => void;
  statusCounts?: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    total: number;
  };
  priorityCounts?: {
    high: number;
    medium: number;
    low: number;
    total: number;
  };
}

export const RightPanel: React.FC<RightPanelProps> = ({
  onOpenCreate,
  onOpenAiSuggestion,
  statusCounts = { open: 48, inProgress: 32, resolved: 36, closed: 8, total: 124 },
  priorityCounts = { high: 28, medium: 56, low: 40, total: 124 },
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const openPct = 0.38;
  const inProgPct = 0.26;
  const resPct = 0.29;
  const closedPct = 0.07;

  const openStroke = openPct * circumference;
  const inProgStroke = inProgPct * circumference;
  const resStroke = resPct * circumference;
  const closedStroke = closedPct * circumference;

  const openOffset = 0;
  const inProgOffset = -openStroke;
  const resOffset = -(openStroke + inProgStroke);
  const closedOffset = -(openStroke + inProgStroke + resStroke);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Tickets by Status</h3>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="11"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#1D68FE"
                strokeWidth="11"
                strokeDasharray={`${openStroke} ${circumference}`}
                strokeDashoffset={openOffset}
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#8B5CF6"
                strokeWidth="11"
                strokeDasharray={`${inProgStroke} ${circumference}`}
                strokeDashoffset={inProgOffset}
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#10B981"
                strokeWidth="11"
                strokeDasharray={`${resStroke} ${circumference}`}
                strokeDashoffset={resOffset}
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#94A3B8"
                strokeWidth="11"
                strokeDasharray={`${closedStroke} ${circumference}`}
                strokeDashoffset={closedOffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-slate-900 leading-none">
                {statusCounts.total}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total</span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D68FE]"></span>
                <span className="text-slate-600 font-medium">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{statusCounts.open}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">38%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                <span className="text-slate-600 font-medium">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{statusCounts.inProgress}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">26%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-slate-600 font-medium">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{statusCounts.resolved}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">29%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                <span className="text-slate-600 font-medium">Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{statusCounts.closed}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Tickets by Priority</h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-slate-700 font-medium">High</span>
            </div>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: "23%" }}></div>
            </div>
            <div className="flex items-center gap-2 w-16 justify-end shrink-0">
              <span className="font-bold text-slate-800">{priorityCounts.high}</span>
              <span className="text-slate-400 text-[11px]">23%</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-slate-700 font-medium">Medium</span>
            </div>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "45%" }}></div>
            </div>
            <div className="flex items-center gap-2 w-16 justify-end shrink-0">
              <span className="font-bold text-slate-800">{priorityCounts.medium}</span>
              <span className="text-slate-400 text-[11px]">45%</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-medium">Low</span>
            </div>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "32%" }}></div>
            </div>
            <div className="flex items-center gap-2 w-16 justify-end shrink-0">
              <span className="font-bold text-slate-800">{priorityCounts.low}</span>
              <span className="text-slate-400 text-[11px]">32%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-indigo-100/90 p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-900">AI Suggestion</span>
          <span className="bg-purple-100 text-purple-700 font-bold text-[10px] px-2 py-0.2 rounded-md">
            Beta
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          This ticket might be related to <span className="font-semibold text-slate-800">'Payment Gateway Issues'</span> based on similar past tickets.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiSuggestion}
            className="bg-[#1D68FE] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs shadow-blue-500/20"
          >
            View Similar Tickets
          </button>
          <button className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Dismiss
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>

        <div className="space-y-1">
          <button
            onClick={onOpenCreate}
            className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <PenSquare className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                Create New Ticket
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors group text-left">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                Search Knowledge Base
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors group text-left">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                View Reports
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors group text-left">
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                Invite Team Member
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
