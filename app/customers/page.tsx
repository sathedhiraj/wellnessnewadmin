"use client";
import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  Search, Mail, MapPin, ChevronLeft, ChevronRight, Eye,
  Package, RefreshCw, User, ShoppingBag, TrendingUp, Phone,
} from "lucide-react";
import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  quantity: number;
  price: number;
  variant: {
    name: string;
    sku: string;
    product: {
      title: string;
      handle: string;
      images: { url: string }[];
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];

}

interface Address {
  id: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  city: string | null;
  orderCount: number;
  totalSpend: number;
  addresses: Address[];
  orders: Order[];
  phone: string;
}

const STATUS_COLOR: Record<string, string> = {
  Placed: "bg-blue-50 text-blue-700 border-blue-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Shipped: "bg-purple-50 text-purple-700 border-purple-100",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
};

const PAGE_SIZE = 8;

// ─── Customer Detail Modal ────────────────────────────────────────────────────

function CustomerDetailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-warmgray-100">
          <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xl shrink-0">
            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-forest truncate">{customer.name}</h3>
            <p className="text-sm text-warmgray-500">{customer.email}</p>
          </div>
          <button onClick={onClose} className="p-2 text-warmgray-400 hover:text-warmgray-700 hover:bg-warmgray-100 rounded-lg transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-forest text-white rounded-xl p-4 text-center">
              <p className="text-xs opacity-70 mb-1">Orders</p>
              <p className="text-2xl font-bold">{customer.orderCount}</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-4 text-center">
              <p className="text-xs text-warmgray-500 mb-1">Total Spend</p>
              <p className="text-xl font-bold text-sage-700">₹{customer.totalSpend.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-warmgray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-warmgray-500 mb-1">Joined</p>
              <p className="text-sm font-semibold text-forest">
                {new Date(customer.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-warmgray-500 uppercase tracking-wider">Contact</h4>
            <div className="flex items-center gap-3 text-sm text-warmgray-700">
              <Mail size={15} className="text-sage-500 shrink-0" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3 text-sm text-warmgray-700">
                <Phone size={15} className="text-sage-500 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.addresses.length > 0 && (
              <div className="flex items-start gap-3 text-sm text-warmgray-700">
                <MapPin size={15} className="text-sage-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {customer.addresses.map((addr) => (
                    <p key={addr.id}>
                      {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          {customer.orders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-warmgray-500 uppercase tracking-wider mb-3">Order History</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {customer.orders.map((order) => (
                  <div key={order.id} className="border border-warmgray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-forest text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-warmgray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${STATUS_COLOR[order.status] ?? "bg-warmgray-50 text-warmgray-600 border-warmgray-200"}`}>
                          {order.status}
                        </span>
                        <p className="text-sm font-bold text-forest mt-1">₹{order.total.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    {/* Line items */}
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-warmgray-600">
                          <div className="w-1 h-1 rounded-full bg-warmgray-300 shrink-0" />
                          <span className="font-medium text-forest">{item.variant.product.title}</span>
                          <span className="text-warmgray-400">({item.variant.name})</span>
                          <span className="ml-auto shrink-0">×{item.quantity}</span>
                          <span className="font-medium text-forest shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customer.orders.length === 0 && (
            <div className="text-center py-6 bg-warmgray-50 rounded-xl">
              <ShoppingBag size={28} className="text-warmgray-300 mx-auto mb-2" />
              <p className="text-sm text-warmgray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/customers");
      setCustomers(res.data.data ?? []);
    } catch (err: any) {
      console.error("Failed to fetch customers:", err);
      setError(err.response?.data?.error ?? "Failed to load customers. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount = customers.length; // All registered users are "active"
  const totalOrders = customers.reduce((a, c) => a + c.orderCount, 0);
  const totalRevenue = customers.reduce((a, c) => a + c.totalSpend, 0);

  return (
    <AdminLayout>
      {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Customers</h2>
          <p className="text-sm text-warmgray-500 mt-1">Real-time data from your database.</p>
        </div>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 text-sm text-warmgray-600 bg-white border border-warmgray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-warmgray-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: customers.length, icon: User, color: "bg-forest text-white" },
          { label: "Registered Users", value: activeCount, icon: User, color: "bg-emerald-50 text-emerald-700" },
          { label: "Total Orders", value: totalOrders, icon: Package, color: "bg-blue-50 text-blue-700" },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "bg-sage-50 text-sage-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 shadow-sm`}>
            <p className="text-xs font-medium opacity-70 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        {/* Search */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Total Spend</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-warmgray-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-warmgray-100 rounded" />
                          <div className="h-2.5 w-36 bg-warmgray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5].map(j => (
                      <td key={j} className="px-6 py-4"><div className="h-3 w-20 bg-warmgray-100 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <User size={32} className="text-warmgray-200 mx-auto mb-2" />
                    <p className="text-warmgray-400 text-sm">
                      {search ? "No customers match your search." : "No registered customers yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-warmgray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xs shrink-0">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-forest">{c.name}</p>
                          <p className="text-xs text-warmgray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warmgray-600">{c.city ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-medium text-forest">
                        <Package size={13} className="text-sage-500" />
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-warmgray-700 font-medium">
                      ₹{c.totalSpend.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-warmgray-600">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelected(c)}
                        className="p-1.5 text-warmgray-400 hover:text-sage-600 transition-colors rounded-md hover:bg-sage-50"
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

        {/* Pagination */}
        <div className="p-4 border-t border-warmgray-100 flex items-center justify-between text-sm text-warmgray-500">
          <p>
            {filtered.length === 0
              ? "No customers"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} customers`}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md border border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
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
