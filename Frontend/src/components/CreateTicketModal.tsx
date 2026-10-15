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
    } catch (err: any) {
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

      // Reset form
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
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>
            <p className="text-xs text-slate-500">Submit an issue with automatic AI classification</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. bKash payment deducted but subscription not active"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe what happened, error messages, transaction IDs, or steps to reproduce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* AI Auto-Triage Button & Banner */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAiTriage}
              disabled={aiAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors"
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
              <div className="mt-3 p-3 bg-linear-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-violet-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    AI Triage Suggestion
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {aiResult.category}
                    </span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {aiResult.priority}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-violet-800 font-medium">{aiResult.aiSummary}</p>
              </div>
            )}
          </div>

          {/* Category & Priority Selector Overrides */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
              >
                <option value="GENERAL">General</option>
                <option value="BILLING">Billing</option>
                <option value="TECHNICAL">Technical</option>
                <option value="ACCOUNT">Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs shadow-indigo-100"
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
