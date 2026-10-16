import React, { useState } from "react";
import { Settings, Sparkles, Bell, Shield, Sliders, CheckCircle2 } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [deskName, setDeskName] = useState("ResolveDesk ERP");
  const [supportEmail, setSupportEmail] = useState("support@resolvedesk.com");
  const [autoTriageEnabled, setAutoTriageEnabled] = useState(true);
  const [autoDraftEnabled, setAutoDraftEnabled] = useState(true);
  const [confidence, setConfidence] = useState(85);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            System & Helpdesk Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure platform parameters, Gemini AI auto-classification rules, and SLA targets.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Helpdesk General Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#00897B]" />
            <h2 className="text-sm font-bold text-slate-900">General Helpdesk Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Support Desk Portal Title
              </label>
              <input
                type="text"
                value={deskName}
                onChange={(e) => setDeskName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Central Inbound Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B]"
              />
            </div>
          </div>
        </div>

        {/* Gemini AI Auto-Triage Engine Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Google Gemini AI Engine</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Gemini 2.5 Flash
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <div className="font-bold text-slate-800">Auto-Categorization & Priority Triage</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Automatically classify incoming ticket title and issue text into categories and priorities.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoTriageEnabled}
                onChange={(e) => setAutoTriageEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#00897B] focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <div className="font-bold text-slate-800">AI Suggested Response Drafting</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Pre-generate polite, context-aware solution drafts for support agents.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoDraftEnabled}
                onChange={(e) => setAutoDraftEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#00897B] focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">AI Confidence Threshold</span>
                <span className="font-extrabold text-[#00897B]">{confidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-[#00897B] cursor-pointer"
              />
              <div className="text-[10px] text-slate-400">
                Tickets categorized with confidence lower than {confidence}% will flag an agent for manual review.
              </div>
            </div>
          </div>
        </div>

        {/* SLA & Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">SLA Operational Target Windows</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
              <div className="font-bold text-red-700">Urgent SLA</div>
              <div className="text-lg font-black text-slate-900 mt-1">60 Minutes</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Payment & security blocks</div>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
              <div className="font-bold text-amber-700">High SLA</div>
              <div className="text-lg font-black text-slate-900 mt-1">4 Hours</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Core feature disruptions</div>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <div className="font-bold text-emerald-700">Medium & Low SLA</div>
              <div className="text-lg font-black text-slate-900 mt-1">12-24 Hours</div>
              <div className="text-[10px] text-slate-400 mt-0.5">General inquiries</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#00897B] hover:bg-teal-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
