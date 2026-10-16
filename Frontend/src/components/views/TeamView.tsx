import React from "react";
import { User, Ticket } from "../../types";
import { UserCheck, Mail, CheckCircle2, Shield, AlertTriangle, Clock } from "lucide-react";

interface TeamViewProps {
  staffList: User[];
  tickets: Ticket[];
  currentUser: User | null;
}

export const TeamView: React.FC<TeamViewProps> = ({ staffList, tickets, currentUser }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Support Team & Agent Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage agents, track real-time ticket assignments, capacity, and online duty status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>{staffList.length} Active Staff Members</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffList.map((staff) => {
          // Dynamic calculation: assigned tickets and active (open/in progress)
          const assignedTickets = tickets.filter((t) => t.assignedToId === staff.id);
          const activeAssigned = assignedTickets.filter(
            (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
          ).length;
          const resolvedAssigned = assignedTickets.filter((t) => t.status === "RESOLVED").length;

          const isCurrent = currentUser?.id === staff.id;

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                isCurrent ? "border-teal-400 ring-2 ring-teal-500/10" : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1D24] text-white flex items-center justify-center font-bold text-base tracking-wider shadow-xs">
                      {staff.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {staff.name}
                        </h3>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{staff.email}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      staff.role === "ADMIN"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {staff.role}
                  </span>
                </div>

                {/* Assignment Capacity & Stats */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Workload (Active Tickets)</span>
                    <span className="font-bold text-slate-800">{activeAssigned} tickets</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00897B] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(15, activeAssigned * 25))}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="font-extrabold text-slate-800">{resolvedAssigned}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Resolved</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="font-extrabold text-slate-800">
                      {activeAssigned > 0 ? "Under Triage" : "Available"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Availability</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active & Online
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  ID: #{staff.id.slice(0, 6)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
