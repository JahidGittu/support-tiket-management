import React, { useState, useEffect } from "react";
import { User, Ticket } from "../../types";
import { api } from "../../services/api";
import { Search, Users, Mail, Ticket as TicketIcon, Calendar, CheckCircle2 } from "lucide-react";

interface CustomersViewProps {
  tickets: Ticket[];
  onSelectCustomerTickets?: (customerEmail: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ tickets }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await api.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.warn("Could not fetch customers list from API:", err);
        // Fallback: extract distinct customers from tickets array
        const distinct: Record<string, any> = {};
        tickets.forEach((t) => {
          if (t.customer && !distinct[t.customer.id]) {
            distinct[t.customer.id] = {
              ...t.customer,
              createdAt: t.createdAt,
              _count: { createdTickets: 1 },
            };
          } else if (t.customer && distinct[t.customer.id]) {
            distinct[t.customer.id]._count.createdTickets += 1;
          }
        });
        setCustomers(Object.values(distinct));
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [tickets]);

  const filteredCustomers = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Customer Directory & Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered customer clients, contact records, and active support tickets history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            {customers.length} Registered Customers
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#00897B] transition-all"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          // Dynamic calculation: count tickets for this customer
          const customerTickets = tickets.filter(
            (t) => t.customer?.id === cust.id || t.customer?.email === cust.email
          );
          const openCount = customerTickets.filter((t) => t.status === "OPEN").length;
          const totalCount = Math.max(cust._count?.createdTickets || 0, customerTickets.length);

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1A1D24] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
                      {cust.name
                        ? cust.name
                            .split(" ")
                            .map((p: string) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "CU"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {cust.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[160px]">{cust.email}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <div className="text-base font-extrabold text-slate-900">{totalCount}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Total Tickets</div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <div
                      className={`text-base font-extrabold ${
                        openCount > 0 ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {openCount}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Active Issues</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(cust.createdAt || Date.now()).toLocaleDateString([], { month: "short", year: "numeric" })}
                </span>
                <span className="font-semibold text-[#00897B]">Active Account</span>
              </div>
            </div>
          );
        })}

        {filteredCustomers.length === 0 && !loading && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400 text-xs">
            No customers match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
