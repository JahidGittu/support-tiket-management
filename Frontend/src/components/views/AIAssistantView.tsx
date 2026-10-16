import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Copy,
  Check,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Ticket } from "../../types";

interface AIAssistantViewProps {
  tickets: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  tickets,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    tickets[0]?.id || ""
  );
  const [activePrompt, setActivePrompt] = useState<"reply" | "summary" | "actions">("reply");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftReply, setDraftReply] = useState<string>("");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  React.useEffect(() => {
    if (selectedTicket) {
      setDraftReply(
        selectedTicket.aiSuggestedReply ||
          `Dear ${selectedTicket.customer?.name || "Customer"},\n\nThank you for reaching out to ResolveDesk Support. We have verified your inquiry regarding "${selectedTicket.title}".\n\nOur technical team is reviewing this ticket with priority ${selectedTicket.priority}. We will update you with resolution details shortly.\n\nBest regards,\nResolveDesk Support Team`
      );
    }
  }, [selectedTicketId, selectedTicket]);

  const handleCopy = () => {
    navigator.clipboard.writeText(draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (activePrompt === "reply") {
        setDraftReply(
          `Hi ${selectedTicket?.customer?.name || "Valued User"},\n\nWe acknowledge the issue reported: "${selectedTicket?.title}".\n\nOur automated diagnostics have escalated this under category ${selectedTicket?.category}. An engineer has been allocated to resolve this issue within our SLA turnaround window.\n\nThank you for your patience.\nCustomer Operations`
        );
      }
    }, 600);
  };

  const mockKnowledgeMatches = [
    {
      title: "Troubleshooting Gateway & Transaction Deductions",
      category: "Billing",
      matchScore: "98% Match",
      link: "#",
    },
    {
      title: "Database Connection Timeouts & High Latency Fix",
      category: "Technical",
      matchScore: "91% Match",
      link: "#",
    },
    {
      title: "Password Reset & Multi-Factor Auth Flow",
      category: "Account",
      matchScore: "84% Match",
      link: "#",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 text-white border border-purple-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              Gemini 2.5 Flash Copilot
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Triage
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI Assistant & Triage Copilot
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            Context-aware AI support agent: instant classification, contextual draft responses, issue summaries, and suggested knowledge base solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <div className="text-[11px] text-purple-200 font-medium">Model Latency</div>
            <div className="text-sm font-bold text-white">~340 ms (Avg)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <div className="text-[11px] text-purple-200 font-medium">Accuracy</div>
            <div className="text-sm font-bold text-emerald-400">96.8% Confidence</div>
          </div>
        </div>
      </div>

      {/* 3-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ticket Selector */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3 h-[680px] flex flex-col shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Ticket ({tickets.length})
            </h3>
            <span className="text-[10px] text-slate-400">Recent Queue</span>
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {tickets.map((ticket) => {
              const isSelected = ticket.id === (selectedTicket?.id || "");
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs"
                      : "bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/70 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      #{ticket.id.slice(0, 6)}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        ticket.priority === "URGENT" || ticket.priority === "HIGH"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 line-clamp-1">{ticket.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ticket.customer?.name || "Customer"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: AI Copilot Workbench */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 h-[680px] flex flex-col shadow-xs">
          {selectedTicket ? (
            <>
              {/* Selected Ticket Header */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      #{selectedTicket.id.slice(0, 8)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700">
                      {selectedTicket.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Customer: <strong className="text-slate-700">{selectedTicket.customer?.name}</strong>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{selectedTicket.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{selectedTicket.description}</p>
              </div>

              {/* Action Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActivePrompt("reply")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activePrompt === "reply"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Suggested Reply
                </button>
                <button
                  onClick={() => setActivePrompt("summary")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activePrompt === "summary"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Ticket Summary
                </button>
                <button
                  onClick={() => setActivePrompt("actions")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activePrompt === "actions"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Action Checklist
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                {activePrompt === "reply" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Generated Response Draft
                      </span>
                      <button
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                    </div>

                    <textarea
                      value={draftReply}
                      onChange={(e) => setDraftReply(e.target.value)}
                      rows={10}
                      className="w-full text-xs text-slate-800 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        * Human Review Required before sending to customer.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Draft
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activePrompt === "summary" && (
                  <div className="space-y-4">
                    <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Executive Summary
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedTicket.aiSummary ||
                          `Customer ${selectedTicket.customer?.name} encountered an issue with "${selectedTicket.title}". Categorized as ${selectedTicket.category} with ${selectedTicket.priority} urgency. Immediate verification is underway.`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Key Incident Data
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Category</span>
                          <strong className="text-slate-800 font-semibold">{selectedTicket.category}</strong>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Assigned Priority</span>
                          <strong className="text-rose-600 font-semibold">{selectedTicket.priority}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePrompt === "actions" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">
                      Recommended Steps for Support Agent:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block">Verify Customer Identity</strong>
                          <span className="text-slate-500 text-[11px]">
                            Check registered email ({selectedTicket.customer?.email}) and account verification history.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block">Cross-reference Logs</strong>
                          <span className="text-slate-500 text-[11px]">
                            Inspect payment gateway records or backend server stack trace for matching error.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block">Respond within SLA Window</strong>
                          <span className="text-slate-500 text-[11px]">
                            Post reply to prevent SLA breach. Status will update to In Progress.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
              <Bot className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs">Select a ticket from the left queue to begin AI Triage.</p>
            </div>
          )}
        </div>

        {/* Right Column: Knowledge Base & Model Confidence */}
        <div className="lg:col-span-3 space-y-5">
          {/* AI Confidence Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              AI Model Confidence
            </h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Classification</span>
                  <span className="font-bold text-slate-800">98% High</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full w-[98%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Urgency Detection</span>
                  <span className="font-bold text-slate-800">94% Urgent</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full w-[94%]"></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Fallback engine: Keyword Heuristics
            </div>
          </div>

          {/* Suggested Knowledge Base Articles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Suggested Knowledge Articles
            </h4>
            <div className="space-y-2">
              {mockKnowledgeMatches.map((art, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-purple-50/50 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-600">{art.category}</span>
                    <span className="text-emerald-600 font-bold">{art.matchScore}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-800 line-clamp-2">
                    {art.title}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
