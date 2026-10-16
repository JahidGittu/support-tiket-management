import React, { useState } from "react";
import {
  Zap,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { StaffLoad, ActivityLog, Ticket } from "../types";

interface SmartQueueWidgetProps {
  queueTickets: Ticket[];
  staffLoads: StaffLoad[];
  activityLogs: ActivityLog[];
  onAssignFromQueue: () => Promise<void>;
  onToggleAvailability: (staffId: string, status: "AVAILABLE" | "ON_LEAVE") => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const SmartQueueWidget: React.FC<SmartQueueWidgetProps> = ({
  queueTickets,
  staffLoads,
  activityLogs,
  onAssignFromQueue,
  onToggleAvailability,
  onRefresh,
  isLoading = false,
}) => {
  const [assigning, setAssigning] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "warning"; message: string } | null>(null);

  const handleAssignClick = async () => {
    setAssigning(true);
    setNotification(null);
    try {
      await onAssignFromQueue();
    } catch (err: any) {
      setNotification({
        type: "warning",
        message: err.message || "Failed to auto-assign from queue.",
      });
    } finally {
      setAssigning(false);
    }
  };

  const queueCount = queueTickets.length;
  const availableStaff = staffLoads.filter(
    (s) => s.availabilityStatus === "AVAILABLE" && !s.isAtCapacity
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-7">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Smart Queue & Staff Bandwidth Manager
              </h2>
              <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                FIFO Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated workload distribution, staff capacity guardrails, and conflict detection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Refresh queue and load data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
          </button>

          {/* FIFO Assign Next Button */}
          <button
            onClick={handleAssignClick}
            disabled={assigning || queueCount === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              queueCount > 0
                ? "bg-[#22C55E] hover:bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 stroke-[2]" />
            <span>{assigning ? "Matching Staff..." : "Assign From Queue"}</span>
            {queueCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {queueCount} waiting
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast if present */}
      {notification && (
        <div
          className={`mt-4 p-3 rounded-xl text-xs flex items-center justify-between border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Grid: Waiting Queue + Staff Capacity + Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Waiting Queue Overview (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50/70 rounded-xl p-4 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Waiting Queue Status
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  queueCount > 0
                    ? "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}
              >
                {queueCount > 0 ? `${queueCount} In Queue` : "Queue Clear"}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Tickets awaiting agent assignment are strictly ordered by creation timestamp (FIFO).
            </p>

            {queueTickets.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-lg border border-dashed border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <div className="text-xs font-semibold text-slate-700">No Tickets Waiting</div>
                <div className="text-[11px] text-slate-400">All customer tickets are assigned!</div>
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {queueTickets.slice(0, 3).map((t, idx) => (
                  <div
                    key={t.id}
                    className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        By {t.customer?.name} • {t.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 ml-2 shrink-0">
                      Just now
                    </span>
                  </div>
                ))}
                {queueTickets.length > 3 && (
                  <div className="text-center text-[10px] font-semibold text-slate-400 pt-1">
                    + {queueTickets.length - 3} more in queue
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Available Capacity:</span>
            <span className="font-bold text-slate-800">
              {availableStaff} of {staffLoads.length} staff available
            </span>
          </div>
        </div>

        {/* Staff Load & Capacity Guards (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Staff Daily Load (Max 5 Tickets)
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Guardrail: 5/5
              </span>
            </div>

            <div className="space-y-2.5">
              {staffLoads.map((staff) => {
                const percentage = Math.min(100, Math.round((staff.currentLoad / staff.dailyCapacity) * 100));
                const isFull = staff.isAtCapacity;
                const isOnLeave = staff.availabilityStatus === "ON_LEAVE";

                return (
                  <div
                    key={staff.id}
                    className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{staff.name}</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          ({staff.serviceType})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Label (OK vs Booked) */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isOnLeave
                              ? "bg-slate-100 text-slate-600 border-slate-300"
                              : isFull
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isOnLeave ? "On Leave" : isFull ? "Booked" : "OK"}
                        </span>

                        {/* Availability Toggle */}
                        <button
                          onClick={() =>
                            onToggleAvailability(
                              staff.id,
                              staff.availabilityStatus === "AVAILABLE" ? "ON_LEAVE" : "AVAILABLE"
                            )
                          }
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 underline"
                          title="Toggle Available vs On Leave"
                        >
                          {staff.availabilityStatus === "AVAILABLE" ? "Set Leave" : "Set Active"}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull
                              ? "bg-rose-500"
                              : percentage >= 80
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 w-12 text-right">
                        {staff.currentLoad} / {staff.dailyCapacity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-slate-400" />
            <span>Over-allocation triggers warning and redirects to waiting queue.</span>
          </div>
        </div>

        {/* Live Activity Log (3 Cols) */}
        <div className="lg:col-span-3 bg-slate-50/70 rounded-xl p-4 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                Live Activity Log
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <div className="text-[11px] text-slate-400 text-center py-4">No recent activity logs.</div>
              ) : (
                activityLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="text-[11px] p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs leading-snug"
                  >
                    <span className="text-slate-700 font-medium">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-right">
            Audit trail synced with Neon DB
          </div>
        </div>
      </div>
    </div>
  );
};
