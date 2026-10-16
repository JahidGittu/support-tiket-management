import React from "react";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

interface AiHelpBannerProps {
  onOpenAi: () => void;
}

export const AiHelpBanner: React.FC<AiHelpBannerProps> = ({ onOpenAi }) => {
  return (
    <div className="bg-linear-to-r from-blue-50 via-indigo-50/60 to-purple-50 border border-blue-100/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
      <div className="flex items-center gap-4">
        {/* Robot Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center text-[#1D68FE] shrink-0 relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Let AI Help You
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Get instant answers, suggest solutions, and automate repetitive tasks with our AI assistant.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAi}
        className="bg-[#1D68FE] hover:bg-blue-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-blue-500/25 transition-all shrink-0"
      >
        <span>Try AI Assistant</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
