import React, { useState } from "react";
import {
  Search,
  Plus,
  Mail,
  Bell,
  ChevronDown,
  Reply as ReplyIcon,
  Edit3,
  RotateCcw,
  ThumbsUp,
  MessageSquare,
  Eye,
  Paperclip,
  Lock,
  Pin,
  Home,
  BookOpen,
  User as UserIcon,
  Grid,
  BarChart2,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Maximize2,
  Shield,
  LogOut,
  Send,
  CheckCircle,
} from "lucide-react";
import { Ticket, User } from "../../types";
import { api } from "../../services/api";

interface CustomerPortalViewProps {
  currentUser: User | null;
  tickets: Ticket[];
  onOpenCreate: () => void;
  onSwitchToAdmin: () => void;
  onSwitchUser: (email: string) => void;
  onLogout: () => void;
  onRefreshTicket: (ticketId: string) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  currentUser,
  tickets,
  onOpenCreate,
  onSwitchToAdmin,
  onSwitchUser,
  onLogout,
  onRefreshTicket,
}) => {
  // Filter tickets belonging to current customer or all if demo
  const customerTickets = tickets.filter(
    (t) => currentUser?.role !== "CUSTOMER" || t.customerId === currentUser?.id || true
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    customerTickets[0]?.id || ""
  );
  const [commentMessage, setCommentMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [likesCount, setLikesCount] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const activeTicket =
    customerTickets.find((t) => t.id === selectedTicketId) || customerTickets[0];

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

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {/* 1. TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200/90 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-emerald-500/20">
              M
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm hidden sm:inline">
              SupportDesk <span className="text-emerald-600 font-normal">Portal</span>
            </span>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for help topics, categories, or ticket #..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-4">
          {/* Green New Ticket Button */}
          <button
            onClick={onOpenCreate}
            className="bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Ticket</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {/* Envelope Icon with Green Dot */}
          <div className="relative cursor-pointer text-slate-500 hover:text-slate-800 p-1.5">
            <Mail className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1 ring-2 ring-white"></span>
          </div>

          {/* Bell Icon with Orange Dot */}
          <div className="relative cursor-pointer text-slate-500 hover:text-slate-800 p-1.5">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1 ring-2 ring-white"></span>
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "CU"}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                {currentUser?.name || "Customer"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {/* Profile & Role Switcher Dropdown */}
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser?.email}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Role: {currentUser?.role}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      onSwitchToAdmin();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Go to Staff ERP (/admin)</span>
                  </button>

                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Persona:
                  </div>
                  <button
                    onClick={() => {
                      onSwitchUser("user@resolvedesk.com");
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-between"
                  >
                    <span>Arif Rahman (Customer)</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono">User</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser("admin@resolvedesk.com");
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-between"
                  >
                    <span>Rafsan Ahmed (Super Admin)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-mono">Admin</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
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

      {/* 2. BODY CONTENT (Left Icon Sidebar + Main Content + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thin Icon Navigation Bar */}
        <aside className="w-16 bg-white border-r border-slate-200/90 flex flex-col items-center py-6 gap-6 shrink-0 hidden sm:flex">
          <button
            onClick={onSwitchToAdmin}
            title="Go to Staff ERP Dashboard"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            title="Active Ticket Thread"
            className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50/80 transition-colors relative"
          >
            <MessageSquare className="w-5 h-5" />
            {/* Emerald vertical active indicator on right border */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-l"></span>
          </button>

          <button
            onClick={onOpenCreate}
            title="Submit New Request"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            title="Account Information"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <UserIcon className="w-5 h-5" />
          </button>

          <button
            title="Browse Knowledge Base"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={onSwitchToAdmin}
            title="Metrics & Admin Reports"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </aside>

        {/* Center Main Ticket & Thread View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {activeTicket ? (
              <>
                {/* Breadcrumbs & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs font-medium text-slate-500">
                    <span>All Categories</span>
                    <span className="mx-2 text-slate-300">/</span>
                    <span className="text-slate-700 font-semibold">{activeTicket.category}</span>
                    <span className="mx-2 text-slate-300">/</span>
                    <span className="text-slate-400">#TKT-{activeTicket.id.slice(0, 6)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="#reply-box"
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <ReplyIcon className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </a>
                    <button
                      onClick={() => onOpenCreate()}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Topic</span>
                    </button>
                    <button
                      onClick={() => onRefreshTicket(activeTicket.id)}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Ticket Title & Engagement Row */}
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                    {activeTicket.title}
                  </h1>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {activeTicket.comments?.length || 0} Replies
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                      {likesCount} People like this
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      24 Views
                    </span>
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
                          <span className="text-[10px] font-normal text-slate-400">Created topic</span>
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

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        hasLiked ? "text-emerald-600" : "text-emerald-600/80 hover:text-emerald-700"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{likesCount} People Upvoted this</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Original Request</span>
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
                              ? "bg-emerald-50/30 border-emerald-200/60"
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
                                {comment.user?.name?.slice(0, 2).toUpperCase() || "ST"}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                  <span>{comment.user?.name || "Support Staff"}</span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                      isStaff
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {isStaff ? "Support Agent" : "Replied"}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {new Date(comment.createdAt).toLocaleTimeString([], {
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

                {/* 3. RICH TEXT REPLY COMPOSER (Matching Screenshot exactly) */}
                <div id="reply-box" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser?.name?.slice(0, 2).toUpperCase() || "CU"}
                    </div>
                    <span className="text-xs font-bold text-slate-800">Reply to conversation</span>
                  </div>

                  {/* Rich Text Toolbar Mockup */}
                  <div className="flex items-center gap-1 border-b border-slate-100 pb-2.5 overflow-x-auto text-slate-500 text-xs">
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded font-bold"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded italic"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded underline"><Underline className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded"><List className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded"><LinkIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded"><ImageIcon className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                    <button type="button" className="p-1.5 hover:bg-slate-100 rounded"><Maximize2 className="w-3.5 h-3.5" /></button>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-4">
                    <textarea
                      rows={5}
                      value={commentMessage}
                      onChange={(e) => setCommentMessage(e.target.value)}
                      placeholder="Type something to reply to support agent..."
                      className="w-full text-xs md:text-sm text-slate-800 p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans leading-relaxed"
                    />

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Paperclip className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                        <span>&lt; 15 MB (Attachments permitted)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCommentMessage("")}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
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
                  onClick={onOpenCreate}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Your First Ticket</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR WIDGET (Matching Screenshot right column) */}
        <aside className="w-72 bg-white border-l border-slate-200/90 p-6 space-y-6 hidden lg:block overflow-y-auto">
          {/* Status & Pin Indicators */}
          <div className="space-y-3 pb-5 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Status:</span>
              <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                {activeTicket?.status || "Open"}
              </strong>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Pin className="w-4 h-4 text-slate-400" />
              <span>Category:</span>
              <strong className="text-slate-800">{activeTicket?.category || "General"}</strong>
            </div>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="space-y-2 pb-5 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-800">
              Notify me on reply?
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Instant email alerts</span>
              <button
                type="button"
                onClick={() => setNotifyToggle(!notifyToggle)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  notifyToggle ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifyToggle ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Participating Agents & Customers */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-800">
              Participating in this Ticket:
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                  AR
                </div>
                <div className="w-8 h-8 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  RA
                </div>
              </div>
              <span className="text-[11px] text-slate-500">2 People Active</span>
            </div>
          </div>

          {/* Customer's Other Tickets Directory */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Your Support Tickets ({customerTickets.length})
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {customerTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    t.id === activeTicket?.id
                      ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/10 font-medium"
                      : "bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>#TKT-{t.id.slice(0, 6)}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                        t.status === "CUSTOMER_REPLIED"
                          ? "bg-purple-100 text-purple-700"
                          : t.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 line-clamp-1">{t.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Staff ERP Link */}
          <div className="pt-2">
            <button
              onClick={onSwitchToAdmin}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Staff ERP</span>
            </button>
          </div>
        </aside>
      </div>

      {/* 5. MINIMALIST FOOTER (Matching Screenshot) */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-600">Careers</a>
          <a href="#" className="hover:text-slate-600">Support</a>
          <a href="#" className="hover:text-slate-600">Legal &amp; Privacy Policy</a>
        </div>
        <div>
          Copyrights © 2026 ResolveDesk AI &amp; DigitalHeaps.
        </div>
      </footer>
    </div>
  );
};
