import React, { useState } from "react";
import { Search, BookOpen, ChevronRight, FileText, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

interface Article {
  id: string;
  category: "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL";
  title: string;
  excerpt: string;
  content: string;
  views: number;
}

const ARTICLES: Article[] = [
  {
    id: "kb-1",
    category: "BILLING",
    title: "How refunds and invoice disputes are handled",
    excerpt: "Learn how the automatic gateway refund process works and timeline for credit cards.",
    content: "All refund requests submitted via customer portal are reviewed within 4 hours. Once approved by Super Admin, Stripe or SSLCommerz automatically credits the customer bank card within 3-5 business days.",
    views: 1240,
  },
  {
    id: "kb-2",
    category: "TECHNICAL",
    title: "Resolving 502 Bad Gateway and webhook connection timeouts",
    excerpt: "Steps to diagnose external webhook retries and endpoint firewall whitelist.",
    content: "When experiencing webhook failures, verify that your server permits inbound POST requests on port 443 with TLS 1.3. ResolveDesk retries failed webhook deliveries exponentially up to 5 times.",
    views: 980,
  },
  {
    id: "kb-3",
    category: "ACCOUNT",
    title: "Resetting Two-Factor Authentication (2FA) and recovery keys",
    excerpt: "Guide for customers and agents who lost access to their authenticator app.",
    content: "Super Admins can trigger an emergency OTP verification email to the user's registered address to reset the TOTP authenticator device securely.",
    views: 810,
  },
  {
    id: "kb-4",
    category: "GENERAL",
    title: "SLA Response Times and Priority Escalation Rules",
    excerpt: "Definitions of Low, Medium, High, and Urgent SLA resolution windows.",
    content: "Urgent tickets must receive first agent response within 60 minutes. High priority tickets within 4 hours, Medium within 12 hours, and Low within 24 hours.",
    views: 1540,
  },
  {
    id: "kb-5",
    category: "TECHNICAL",
    title: "Database connection pooling and Prisma migration guidelines",
    excerpt: "Best practices for maintaining PostgreSQL pool sizing under high ticket volume.",
    content: "Always run 'prisma migrate deploy' in production environments and configure connection limits based on available PostgreSQL worker threads.",
    views: 650,
  },
  {
    id: "kb-6",
    category: "BILLING",
    title: "Updating recurring subscription payment methods and VAT tax info",
    excerpt: "How corporate customers can update company registration details on billing.",
    content: "Customers can access Account Settings -> Billing Information to attach revised TIN/BIN documents and add backup payment cards.",
    views: 430,
  },
];

export const KnowledgeBaseView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = ARTICLES.filter((art) => {
    const matchesSearch =
      !search ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.content.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ResolveDesk Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Search our curated guides, technical troubleshooting steps, and customer support documentation.
          </p>

          <div className="pt-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. refund, webhook, 2FA, SLA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/95 text-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-400 shadow-md font-medium"
            />
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "BILLING", "TECHNICAL", "ACCOUNT", "GENERAL"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-[#00897B] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-teal-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100">
                  {art.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{art.views} reads</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00897B] transition-colors leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00897B]">
              <span>Read Solution</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedArticle.content}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#00897B] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal-700"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
