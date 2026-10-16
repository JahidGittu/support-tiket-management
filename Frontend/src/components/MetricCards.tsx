import React from "react";
import { Ticket, Hourglass, CheckCircle2, AlertTriangle } from "lucide-react";

interface MetricCardsProps {
  totalCount?: number;
  openCount?: number;
  inProgressCount?: number;
  resolvedCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalCount = 124,
  openCount = 48,
  inProgressCount = 32,
  resolvedCount = 36,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">মোট টিকিট সংখ্যা</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ ১২% এই সপ্তাহে</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1D68FE] flex items-center justify-center">
          <Ticket className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">অ্যাকশন প্রয়োজন (ওপেন)</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{openCount}</div>
          <span className="text-[11px] text-slate-400 font-medium">জরুরি রিভিউ সাপেক্ষ</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Hourglass className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">চলমান সমাধান (প্রোগ্রেস)</span>
          <div className="text-2xl font-black text-[#8B5CF6] mt-1">{inProgressCount}</div>
          <span className="text-[11px] text-slate-400 font-medium">এজেন্টরা কাজ করছে</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">সমাধান সম্পন্ন</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">৯৮% সন্তুষ্টি রেট</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
