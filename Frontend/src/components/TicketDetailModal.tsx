import React, { useState } from "react";
import { Ticket, User, TicketStatus } from "../types";
import { api } from "../services/api";
import {
  X,
  Sparkles,
  Send,
  Lock,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  currentUser: User | null;
  staffList: User[];
  onClose: () => void;
  onRefreshTicket: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  currentUser,
  staffList,
  onClose,
  onRefreshTicket,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigningAgent, setAssigningAgent] = useState(false);

  if (!ticket) return null;

  const canManageStatus = currentUser?.role === "AGENT" || currentUser?.role === "ADMIN";
  const canAssign = currentUser?.role === "ADMIN";

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setUpdatingStatus(true);
    try {
      await api.updateTicketStatus(ticket.id, newStatus);
      onRefreshTicket(ticket.id);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignAgent = async (assignedToId: string) => {
    setAssigningAgent(true);
    try {
      const targetId = assignedToId === "UNASSIGNED" ? null : assignedToId;
      await api.assignTicket(ticket.id, targetId);
      onRefreshTicket(ticket.id);
    } catch (err) {
      console.error("Failed to assign agent", err);
    } finally {
      setAssigningAgent(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSendingComment(true);
    try {
      await api.addComment(ticket.id, commentText, isInternal);
      setCommentText("");
      setIsInternal(false);
      onRefreshTicket(ticket.id);
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setSendingComment(false);
    }
  };

  const handleUseAiReply = () => {
    if (ticket.aiSuggestedReply) {
      setCommentText(ticket.aiSuggestedReply);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-400">#TKT-{ticket.id.slice(0, 6)}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1D68FE] border border-blue-100">
                {ticket.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                {ticket.priority}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{ticket.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Management Toolbar */}
          {canManageStatus && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">স্ট্যাটাস আপডেট:</span>
                {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as TicketStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={updatingStatus || ticket.status === st}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      ticket.status === st
                        ? "bg-[#00897B] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {st === "OPEN" ? "ওপেন" : st === "IN_PROGRESS" ? "প্রোগ্রেস" : st === "RESOLVED" ? "সমাধান" : "ক্লোজড"}
                  </button>
                ))}
              </div>

              {canAssign && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600">এজেন্ট নির্ধারণ:</span>
                  <select
                    value={ticket.assignedToId || "UNASSIGNED"}
                    onChange={(e) => handleAssignAgent(e.target.value)}
                    disabled={assigningAgent}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700"
                  >
                    <option value="UNASSIGNED">নির্ধারিত নয়</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Original Issue Description */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                  {ticket.customer?.name?.[0] || "C"}
                </div>
                <span className="font-semibold text-slate-800">{ticket.customer?.name}</span>
                <span className="text-[11px] text-slate-400">({ticket.customer?.email})</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pt-1">
              {ticket.description}
            </p>
          </div>

          {/* AI Insights and Reply Assistant */}
          {(ticket.aiSummary || ticket.aiSuggestedReply) && (
            <div className="p-4 bg-linear-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/80 rounded-2xl border border-teal-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Gemini AI ট্রায়াজ ও উত্তর পরামর্শক</span>
                </div>
                {ticket.aiSuggestedReply && canManageStatus && (
                  <button
                    onClick={handleUseAiReply}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-white/90 hover:bg-white px-3 py-1 rounded-lg border border-teal-200 transition-all shadow-2xs"
                  >
                    <span>উত্তরে AI ড্রাফট ব্যবহার করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {ticket.aiSummary && (
                <div className="text-xs text-teal-900">
                  <span className="font-semibold">AI বিশ্লেষণ সারসংক্ষেপ: </span>
                  {ticket.aiSummary}
                </div>
              )}

              {ticket.aiSuggestedReply && (
                <div className="text-xs bg-white/80 p-3 rounded-xl border border-teal-100 text-slate-700 italic">
                  "{ticket.aiSuggestedReply}"
                </div>
              )}
            </div>
          )}

          {/* Timeline of Comments */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              আলোচনা ও কার্যকলাপ ({ticket.comments?.length || 0})
            </h4>

            {ticket.comments && ticket.comments.length > 0 ? (
              <div className="space-y-3">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                      comment.isInternal
                        ? "bg-amber-50/80 border-amber-200 text-amber-950"
                        : comment.user?.role === "CUSTOMER"
                        ? "bg-white border-slate-200/80 text-slate-900"
                        : "bg-teal-50/50 border-teal-100 text-teal-950"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{comment.user?.name || "Support"}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
                          {comment.user?.role}
                        </span>
                        {comment.isInternal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> অভ্যন্তরীণ নোট
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-normal text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700 pt-1">
                      {comment.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">কোনো বার্তা নেই।</p>
            )}
          </div>
        </div>

        {/* Reply Box Footer */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <form onSubmit={handleSendComment} className="space-y-3">
            <textarea
              rows={3}
              placeholder="আপনার সমাধান বা মতামত লিখুন..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B] transition-all"
              required
            />

            <div className="flex items-center justify-between">
              {canManageStatus ? (
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-slate-300 text-[#00897B] focus:ring-teal-500"
                  />
                  <span className="font-medium flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    অভ্যন্তরীণ স্টাফ নোট (কাস্টমার দেখতে পাবে না)
                  </span>
                </label>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={sendingComment || !commentText.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#00897B] hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-xs"
              >
                {sendingComment ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
