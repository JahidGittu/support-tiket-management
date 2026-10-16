import React, { useState } from "react";
import { api } from "../services/api";
import { Category, Priority, AiTriageResult } from "../types";
import { X, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("GENERAL");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiTriageResult | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiTriage = async () => {
    if (title.trim().length < 3 || description.trim().length < 5) {
      setErrorMessage("Please enter a short title and description first to run AI triage.");
      return;
    }

    setErrorMessage(null);
    setAiAnalyzing(true);

    try {
      const result = await api.classifyTicket(title, description);
      setAiResult(result);
      setCategory(result.category);
      setPriority(result.priority);
    } catch {
      setErrorMessage("AI triage service temporarily unavailable. You can choose category manually.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 5) {
      setErrorMessage("Title must be at least 5 characters long");
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage("Description must be at least 10 characters long");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await api.createTicket({
        title,
        description,
        category,
        priority,
      });

      setTitle("");
      setDescription("");
      setAiResult(null);
      setCategory("GENERAL");
      setPriority("MEDIUM");

      onTicketCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>
            <p className="text-xs text-slate-400 mt-0.5">Submit an issue with automatic AI classification</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Payment not working on checkout page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68FE] transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe what happened, error messages, or steps to reproduce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D68FE] transition-all"
              required
            />
          </div>

          {/* AI Auto-Triage Button & Banner */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAiTriage}
              disabled={aiAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-all"
            >
              {aiAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                  <span>Gemini AI Analyzing Ticket...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>Auto-Classify with Google Gemini AI</span>
                </>
              )}
            </button>

            {aiResult && (
              <div className="mt-3 p-3.5 bg-linear-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-violet-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    AI Triage Suggestion
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {aiResult.category}
                    </span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {aiResult.priority}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-violet-800 font-medium">{aiResult.aiSummary}</p>
              </div>
            )}
          </div>

          {/* Category & Priority Selector */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700"
              >
                <option value="GENERAL">General</option>
                <option value="BILLING">Billing</option>
                <option value="TECHNICAL">Technical</option>
                <option value="ACCOUNT">Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D68FE] hover:bg-blue-600 rounded-xl transition-all shadow-xs shadow-blue-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Ticket</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
