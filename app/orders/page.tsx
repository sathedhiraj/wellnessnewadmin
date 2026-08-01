"use client";
import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Search, Filter, Download, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";

const ALL_STATUSES = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

const MOCK_ORDERS = [
  { id: "WOW10451", date: "2026-07-30T10:30:00Z", customer: "Ananya Sharma", email: "ananya@example.com", total: 1499, status: "Placed", items: 2 },
  { id: "WOW10450", date: "2026-07-29T14:15:00Z", customer: "Rohan Patel", email: "rohan.p@example.com", total: 899, status: "Packed", items: 1 },
  { id: "WOW10449", date: "2026-07-29T09:20:00Z", customer: "Priya Singh", email: "priya.s@example.com", total: 2499, status: "Shipped", items: 3 },
  { id: "WOW10448", date: "2026-07-28T18:45:00Z", customer: "Vikram Mehta", email: "vikram@example.com", total: 3299, status: "Delivered", items: 4 },
  { id: "WOW10447", date: "2026-07-28T11:10:00Z", customer: "Neha Gupta", email: "neha.g@example.com", total: 749, status: "Cancelled", items: 1 },
  { id: "WOW10446", date: "2026-07-27T16:00:00Z", customer: "Amit Kumar", email: "amit.k@example.com", total: 1899, status: "Placed", items: 2 },
  { id: "WOW10445", date: "2026-07-27T09:45:00Z", customer: "Sonal Desai", email: "sonal.d@example.com", total: 4299, status: "Shipped", items: 5 },
  { id: "WOW10444", date: "2026-07-26T14:30:00Z", customer: "Rajesh Nair", email: "rajesh.n@example.com", total: 999, status: "Delivered", items: 1 },
];

const STATUS_STYLES: Record<string, string> = {
  Placed: "bg-amber-50 text-amber-700 border-amber-200",
  Packed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_DOT: Record<string, string> = {
  Placed: "bg-amber-400",
  Packed: "bg-blue-400",                                                                                        
  Shipped: "bg-indigo-400",
  Delivered: "bg-emerald-400",
  Cancelled: "bg-rose-400",
};

const PAGE_SIZE = 5;

function StatusDropdown({ orderId, current, onChange }: { orderId: string; current: string; onChange: (id: string, s: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all hover:shadow-sm cursor-pointer ${STATUS_STYLES[current]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[current]}`} />
        {current}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-warmgray-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(orderId, s); setOpen(false); }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs text-left hover:bg-warmgray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                <span className={s === current ? "font-semibold text-forest" : "text-warmgray-700"}>{s}</span>
              </span>
              {s === current && <Check size={12} className="text-forest" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterStatus]);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Orders</h2>
          <p className="text-sm text-warmgray-500 mt-1">View and manage customer orders.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-warmgray-200 text-forest px-4 py-2 rounded-lg text-sm font-medium hover:bg-warmgray-50 transition-colors shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-warmgray-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, or Email..."
              className="w-full pl-10 pr-4 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-warmgray-200 rounded-lg text-sm font-medium text-warmgray-600 hover:bg-warmgray-50 w-full sm:w-auto justify-between sm:justify-start"
            >
              <Filter size={16} />
              {filterStatus === "All" ? "Filter by Status" : filterStatus}
              <ChevronDown size={14} className={`ml-1 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-warmgray-200 rounded-lg shadow-lg z-20 py-1">
                {["All", ...ALL_STATUSES].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-warmgray-50 transition-colors"
                  >
                    <span className={s === filterStatus ? "font-semibold text-forest" : "text-warmgray-700"}>{s}</span>
                    {s === filterStatus && <Check size={14} className="text-forest" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-warmgray-400">
                    No orders match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-warmgray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-forest">{order.id}</td>
                    <td className="px-6 py-4 text-warmgray-600 whitespace-nowrap">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-warmgray-800">{order.customer}</p>
                      <p className="text-xs text-warmgray-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-warmgray-800 font-medium">
                      ₹ {order.total.toLocaleString()}{" "}
                      <span className="text-xs text-warmgray-400 font-normal">({order.items} items)</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown
                        orderId={order.id}
                        current={order.status}
                        onChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-warmgray-100 flex items-center justify-between text-sm text-warmgray-500">
          <p>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-forest text-white"
                    : "border border-warmgray-200 text-warmgray-600 hover:bg-warmgray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
