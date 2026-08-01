"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Search, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: "C001", name: "Ananya Sharma", email: "ananya@example.com", phone: "+91 98765 43210", city: "Mumbai", orders: 8, totalSpend: 12450, joined: "2025-11-10", status: "Active" },
  { id: "C002", name: "Rohan Patel", email: "rohan.p@example.com", phone: "+91 87654 32109", city: "Ahmedabad", orders: 3, totalSpend: 3200, joined: "2026-01-22", status: "Active" },
  { id: "C003", name: "Priya Singh", email: "priya.s@example.com", phone: "+91 76543 21098", city: "Delhi", orders: 15, totalSpend: 28900, joined: "2025-08-05", status: "Active" },
  { id: "C004", name: "Vikram Mehta", email: "vikram@example.com", phone: "+91 65432 10987", city: "Bangalore", orders: 6, totalSpend: 9800, joined: "2025-12-18", status: "Active" },
  { id: "C005", name: "Neha Gupta", email: "neha.g@example.com", phone: "+91 54321 09876", city: "Pune", orders: 2, totalSpend: 1500, joined: "2026-03-07", status: "Inactive" },
  { id: "C006", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 43210 98765", city: "Chennai", orders: 11, totalSpend: 18700, joined: "2025-09-14", status: "Active" },
  { id: "C007", name: "Sonal Desai", email: "sonal.d@example.com", phone: "+91 32109 87654", city: "Hyderabad", orders: 4, totalSpend: 6100, joined: "2026-02-28", status: "Active" },
  { id: "C008", name: "Rajesh Nair", email: "rajesh.n@example.com", phone: "+91 21098 76543", city: "Kolkata", orders: 1, totalSpend: 999, joined: "2026-06-01", status: "Active" },
  { id: "C009", name: "Meera Krishnan", email: "meera.k@example.com", phone: "+91 11987 65432", city: "Kochi", orders: 9, totalSpend: 14300, joined: "2025-10-20", status: "Active" },
  { id: "C010", name: "Deepak Verma", email: "deepak.v@example.com", phone: "+91 90876 54321", city: "Jaipur", orders: 0, totalSpend: 0, joined: "2026-07-15", status: "Inactive" },
];

const PAGE_SIZE = 7;

type Customer = typeof MOCK_CUSTOMERS[0];

function CustomerDetailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-warmgray-400 hover:text-warmgray-700">✕</button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xl">
            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-forest">{customer.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${customer.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-warmgray-100 text-warmgray-500"}`}>
              {customer.status}
            </span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-warmgray-600">
            <Mail size={16} className="text-sage-500 shrink-0" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-warmgray-600">
            <Phone size={16} className="text-sage-500 shrink-0" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-warmgray-600">
            <MapPin size={16} className="text-sage-500 shrink-0" />
            <span>{customer.city}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-warmgray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-warmgray-500 mb-1">Orders</p>
            <p className="text-xl font-bold text-forest">{customer.orders}</p>
          </div>
          <div className="bg-sage-50 rounded-xl p-3 text-center">
            <p className="text-xs text-warmgray-500 mb-1">Total Spend</p>
            <p className="text-lg font-bold text-sage-700">₹{customer.totalSpend.toLocaleString()}</p>
          </div>
          <div className="bg-warmgray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-warmgray-500 mb-1">Joined</p>
            <p className="text-sm font-semibold text-forest">{new Date(customer.joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout>
      {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Customers</h2>
          <p className="text-sm text-warmgray-500 mt-1">View and manage your customer base.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-warmgray-600 bg-white border border-warmgray-200 px-4 py-2 rounded-lg shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          {MOCK_CUSTOMERS.filter((c) => c.status === "Active").length} Active Customers
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: MOCK_CUSTOMERS.length, color: "bg-forest text-white" },
          { label: "Active", value: MOCK_CUSTOMERS.filter(c => c.status === "Active").length, color: "bg-emerald-50 text-emerald-700" },
          { label: "Total Orders", value: MOCK_CUSTOMERS.reduce((a, c) => a + c.orders, 0), color: "bg-blue-50 text-blue-700" },
          { label: "Total Revenue", value: `₹${MOCK_CUSTOMERS.reduce((a, c) => a + c.totalSpend, 0).toLocaleString()}`, color: "bg-sage-50 text-sage-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 shadow-sm`}>
            <p className="text-xs font-medium opacity-70 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        <div className="p-4 border-b border-warmgray-100">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, or city..."
              className="w-full pl-10 pr-4 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Total Spend</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-warmgray-400">No customers found.</td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-warmgray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xs shrink-0">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-forest">{c.name}</p>
                          <p className="text-xs text-warmgray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warmgray-600">{c.city}</td>
                    <td className="px-6 py-4 text-warmgray-700 font-medium">{c.orders}</td>
                    <td className="px-6 py-4 text-warmgray-700 font-medium">₹{c.totalSpend.toLocaleString()}</td>
                    <td className="px-6 py-4 text-warmgray-600">
                      {new Date(c.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${c.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-warmgray-100 text-warmgray-500 border-warmgray-200"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelected(c)}
                        className="p-1.5 text-warmgray-400 hover:text-sage-600 transition-colors"
                        title="View customer"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-warmgray-100 flex items-center justify-between text-sm text-warmgray-500">
          <p>Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} customers</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${p === page ? "bg-forest text-white" : "border border-warmgray-200 text-warmgray-600 hover:bg-warmgray-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
