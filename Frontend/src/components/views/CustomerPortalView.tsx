import React, { useState } from "react";
import {
  Plus,
  Send,
  ChevronDown,
  Reply as ReplyIcon,
  RotateCcw,
  MessageSquare,
  Paperclip,
  User as UserIcon,
  Shield,
  LogOut,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Loader2,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Ticket, User, Category, Priority } from "../../types";
import { api } from "../../services/api";

interface CustomerPortalViewProps {
  currentUser: User | null;
  tickets: Ticket[];
  onOpenCreate: () => void;
  onSwitchToAdmin: () => void;
  onSwitchUser: (email: string) => void;
  onLogout: () => void;
  onRefreshTicket: (ticketId: string) => void;
  onTicketCreated?: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  currentUser,
  tickets,
  onOpenCreate,
  onSwitchToAdmin,
  onSwitchUser,
  onLogout,
  onRefreshTicket,
  onTicketCreated,
}) => {
  // Filter tickets for current customer portal view (backend already scopes tickets by user)
  const customerTickets = tickets;

  // Default viewMode: "CREATE" so customer immediately sees the Support Ticket Submission Form!
  const [viewMode, setViewMode] = useState<"CREATE" | "THREAD">("CREATE");

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    customerTickets[0]?.id || ""
  );

  // Create Ticket Form States
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createCategory, setCreateCategory] = useState<Category>("GENERAL");
  const [createPriority, setCreatePriority] = useState<Priority>("MEDIUM");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Conversation Reply States
  const [commentMessage, setCommentMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const activeTicket =
    customerTickets.find((t) => t.id === selectedTicketId) || customerTickets[0];

  // AI Auto-Classification for new ticket
  const handleAiTriage = async () => {
    if (createTitle.trim().length < 3 || createDescription.trim().length < 5) {
      setCreateError("Please enter a short title and description first to run AI triage.");
      return;
    }

    setCreateError(null);
    setAiAnalyzing(true);
    setAiSuccess(false);

    try {
      const result = await api.classifyTicket(createTitle, createDescription);
      setCreateCategory(result.category);
      setCreatePriority(result.priority);
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 4000);
    } catch {
      setCreateError("AI triage service temporarily unavailable. You can choose category manually.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Submit Support Ticket Form
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createTitle.trim().length < 5) {
      setCreateError("Issue title must be at least 5 characters long");
      return;
    }

    if (createDescription.trim().length < 10) {
      setCreateError("Please describe your problem with at least 10 characters");
      return;
    }

    setCreatingTicket(true);
    setCreateError(null);

    try {
      const newTicket = await api.createTicket({
        title: createTitle.trim(),
        description: createDescription.trim(),
        category: createCategory,
        priority: createPriority,
      });

      // Clear Form
      setCreateTitle("");
      setCreateDescription("");
      setCreateCategory("GENERAL");
      setCreatePriority("MEDIUM");

      // Notify App to reload tickets
      if (onTicketCreated) onTicketCreated();

      // Automatically select the new ticket and switch to tracking thread!
      setSelectedTicketId(newTicket.id);
      setViewMode("THREAD");
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to submit ticket");
    } finally {
      setCreatingTicket(false);
    }
  };

  // Customer reply submission
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim() || !activeTicket) return;

    setSubmitting(true);
    try {
      await api.addComment(activeTicket.id, commentMessage, false);
      setCommentMessage("");
      onRefreshTicket(activeTicket.id);
    } catch (err) {
      console.error("Failed to post customer reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {/* 1. TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200/90 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-emerald-500/20">
              S
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">
              Support Ticket <span className="text-emerald-600 font-normal">Management</span>
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setViewMode("CREATE")}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "CREATE"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submit Ticket Form</span>
            </button>

            {customerTickets.length > 0 && (
              <button
                onClick={() => setViewMode("THREAD")}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "THREAD"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Track Tickets ({customerTickets.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls: User Profile Pill */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "CU"}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                {currentUser?.name || "Customer"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser?.email}</div>
                  <div className="mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold">
                    Customer Account
                  </div>
                </div>

                <div className="p-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Persona Switch
                  </div>
                  <button
                    onClick={() => {
                      onSwitchUser("arif@example.com");
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Arif Rahman (Customer)</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">User</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser("admin@supportticket.com");
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Rafsan Ahmed (Super Admin)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-mono">Admin</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 p-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT (Centered Container, No Sidebars) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thin Icon Navigation Bar - Commented out per user request */}
        {/*
        <aside className="w-16 bg-white border-r border-slate-200/90 flex flex-col items-center py-6 gap-6 shrink-0 hidden sm:flex">
          ...
        </aside>
        */}

        {/* Center Main View: Either Ticket Creation Form OR Ticket Conversation Thread */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ======================================================== */}
            {/* VIEW MODE 1: DEDICATED TICKET SUBMISSION FORM (DEFAULT) */}
            {/* ======================================================== */}
            {viewMode === "CREATE" ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                {/* Form Title & Context */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <FileText className="w-4 h-4" />
                    <span>Customer Support Ticket</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Submit a Support Ticket
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in your problem details below. Your ticket will enter our FIFO queue and be assigned to an available support specialist.
                  </p>

                  {/* Previous Tickets Reminder (if any exist) */}
                  {customerTickets.length > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
                      <span className="text-emerald-800 font-medium">
                        You have <strong>{customerTickets.length}</strong> previous ticket(s) on file.
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewMode("THREAD")}
                        className="px-3 py-1 bg-white text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold border border-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View My Tickets</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {createError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{createError}</span>
                  </div>
                )}

                {/* The Ticket Form */}
                <form onSubmit={handleCreateSubmit} className="space-y-5">
                  {/* 1. Issue Subject / Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Issue Title / Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cannot complete payment with bKash gateway error 502"
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* 2. Service Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "TECHNICAL", label: "Technical Support", desc: "Bugs & Errors" },
                        { id: "BILLING", label: "Billing & Payment", desc: "Refunds & Invoices" },
                        { id: "ACCOUNT", label: "Account Services", desc: "Login & Access" },
                        { id: "GENERAL", label: "General Inquiry", desc: "Other Questions" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCreateCategory(item.id as Category)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            createCategory === item.id
                              ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold shadow-2xs ring-1.5 ring-emerald-500/20"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Priority Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Urgency / Priority
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "LOW", label: "Low", color: "text-slate-600" },
                        { id: "MEDIUM", label: "Medium", color: "text-blue-600" },
                        { id: "HIGH", label: "High", color: "text-amber-600" },
                        { id: "URGENT", label: "Urgent", color: "text-rose-600" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setCreatePriority(p.id as Priority)}
                          className={`py-2 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            createPriority === p.id
                              ? "border-slate-900 bg-slate-900 text-white shadow-2xs"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 " + p.color
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Issue Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Detailed Description <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAiTriage}
                        disabled={aiAnalyzing}
                        className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{aiAnalyzing ? "Analyzing with AI..." : "AI Auto-Triage"}</span>
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      placeholder="Please provide full details about the issue you are facing, steps to reproduce, or any relevant order numbers..."
                      value={createDescription}
                      onChange={(e) => setCreateDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans leading-relaxed"
                      required
                    />

                    {aiSuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>AI successfully classified category as {createCategory} and priority as {createPriority}!</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={creatingTicket}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all cursor-pointer"
                    >
                      {creatingTicket ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing ticket to support queue...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Ticket to Support Team</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ======================================================== */
              /* VIEW MODE 2: TICKET STATUS & CONVERSATION TRACKING PANEL */
              /* ======================================================== */
              activeTicket ? (
                <>
                  {/* Top Bar: Ticket Switcher & Back to Create Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    {/* My Tickets Horizontal Switcher */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                        My Tickets ({customerTickets.length}):
                      </span>
                      {customerTickets.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTicketId(t.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                            t.id === activeTicket?.id
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          #TKT-{t.id.slice(0, 6)}: {t.title.slice(0, 20)}...
                        </button>
                      ))}
                    </div>

                    {/* Back to Form Button */}
                    <button
                      type="button"
                      onClick={() => setViewMode("CREATE")}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Ticket</span>
                    </button>
                  </div>

                  {/* Clean Ticket Header & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          #TKT-{activeTicket.id.slice(0, 6)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {activeTicket.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            activeTicket.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-700"
                              : activeTicket.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {activeTicket.status}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            activeTicket.priority === "URGENT" || activeTicket.priority === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {activeTicket.priority} Priority
                        </span>
                      </div>

                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                        {activeTicket.title}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="#reply-box"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ReplyIcon className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </a>
                      <button
                        onClick={() => onRefreshTicket(activeTicket.id)}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* ORIGINAL TICKET ISSUE CARD */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {activeTicket.customer?.name?.slice(0, 2).toUpperCase() || "CU"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{activeTicket.customer?.name || "Customer"}</span>
                            <span className="text-[10px] font-normal text-slate-400">Created request</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(activeTicket.createdAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          activeTicket.priority === "URGENT" || activeTicket.priority === "HIGH"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}
                      >
                        {activeTicket.priority} Priority
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {activeTicket.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Submitted by {activeTicket.customer?.name || "Customer"}</span>
                      <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">Initial Issue Description</span>
                    </div>
                  </div>

                  {/* CONVERSATION TIMELINE REPLIES */}
                  {activeTicket.comments && activeTicket.comments.length > 0 && (
                    <div className="space-y-4">
                      {activeTicket.comments.map((comment) => {
                        const isStaff = comment.user?.role !== "CUSTOMER";
                        return (
                          <div
                            key={comment.id}
                            className={`rounded-2xl border p-6 shadow-2xs space-y-3 ${
                              isStaff
                                ? "bg-emerald-50/40 border-emerald-200/80"
                                : "bg-white border-slate-200/90"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                                    isStaff ? "bg-emerald-600" : "bg-slate-700"
                                  }`}
                                >
                                  {comment.user?.name ? comment.user.name.slice(0, 2).toUpperCase() : "AG"}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <span>{comment.user?.name || "Support Team"}</span>
                                    {isStaff ? (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full border border-emerald-200">
                                        Support Staff
                                      </span>
                                    ) : (
                                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full">
                                        Customer
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {comment.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* CUSTOMER REPLY FORM */}
                  <div id="reply-box" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "CU"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Reply to conversation</div>
                        <div className="text-[11px] text-slate-400">Your message will alert the assigned agent</div>
                      </div>
                    </div>

                    <form onSubmit={handleSendReply} className="space-y-3">
                      <textarea
                        rows={4}
                        placeholder="Type your message, follow-up information, or verification details..."
                        value={commentMessage}
                        onChange={(e) => setCommentMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans leading-relaxed"
                        required
                      />

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Paperclip className="w-4 h-4 text-slate-400" />
                          <span>Attachments permitted (&lt; 15 MB)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCommentMessage("")}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={submitting || !commentMessage.trim()}
                            className="px-6 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                          >
                            {submitting ? (
                              <span>Posting...</span>
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Reply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">No Active Support Tickets</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You do not have any open tickets right now. Need assistance? Click below to submit your request.
                  </p>
                  <button
                    onClick={() => setViewMode("CREATE")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 mt-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Ticket</span>
                  </button>
                </div>
              )
            )}
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR WIDGET - Commented out per user request */}
        {/*
        <aside className="w-72 bg-white border-l border-slate-200/90 p-6 space-y-6 hidden lg:block overflow-y-auto">
          ...
        </aside>
        */}
      </div>

      {/* 5. MINIMALIST FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-8 flex items-center justify-center text-xs text-slate-400">
        <div className="text-center text-slate-400 text-xs">
          Support Ticket Management — Customer Support Portal
        </div>
      </footer>
    </div>
  );
};
