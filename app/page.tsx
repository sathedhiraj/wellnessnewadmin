"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { TrendingUp, ShoppingCart, AlertCircle, Users, RefreshCw } from "lucide-react";
import api from "../lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard-stats");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-forest">Dashboard</h2>
          <p className="text-sm text-warmgray-500 mt-1">Real-time store performance overview.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-warmgray-600 bg-white border border-warmgray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-warmgray-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">Total Sales (Today)</p>
            <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-sage-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">₹ {data?.stats?.totalSalesToday?.toLocaleString("en-IN") ?? 0}</h3>
          <p className="text-xs text-sage-600 mt-2 font-medium">Calculated from completed checkout orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">Orders (Today)</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={16} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">{data?.stats?.todayOrdersCount ?? 0}</h3>
          <p className="text-xs text-sage-600 mt-2 font-medium">Placed checkouts today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">New Customers</p>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">{data?.stats?.newCustomersCount ?? 0}</h3>
          <p className="text-xs text-warmgray-400 mt-2">Registered customer base</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-rose-600">Low Stock Alerts</p>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertCircle size={16} className="text-rose-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-600">{data?.stats?.lowStockAlertsCount ?? 0}</h3>
          <p className="text-xs text-rose-500 mt-2 font-medium">Inventory items with &lt; 15 units</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-warmgray-100 p-6">
          <h3 className="text-lg font-semibold text-forest mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-warmgray-100 text-warmgray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-warmgray-400 animate-pulse">
                      Loading recent orders...
                    </td>
                  </tr>
                ) : !data?.recentOrders || data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-warmgray-400">
                      No orders placed today.
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-warmgray-50 transition-colors">
                      <td className="py-4 font-medium text-forest">{order.orderNumber}</td>
                      <td className="py-4 text-warmgray-600">{order.email}</td>
                      <td className="py-4 text-warmgray-600">₹ {order.total.toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          order.status === "Placed" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          order.status === "Packed" ? "bg-blue-50 text-blue-700 border-blue-100" :
                          order.status === "Shipped" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link href="/orders" className="text-sage-600 hover:text-forest text-xs font-medium">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 p-6">
          <h3 className="text-lg font-semibold text-forest mb-4">Low Stock Variants</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-warmgray-400 animate-pulse">Loading low stock items...</p>
            ) : !data?.lowStockVariants || data.lowStockVariants.length === 0 ? (
              <p className="text-sm text-warmgray-400">All products have sufficient stock (&gt;= 15).</p>
            ) : (
              data.lowStockVariants.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between border-b border-warmgray-50 pb-4">
                  <div>
                    <p className="text-sm font-medium text-forest truncate max-w-[160px]">{item.productTitle}</p>
                    <p className="text-xs text-warmgray-500">{item.variantName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-rose-600">{item.stock} left</p>
                  </div>
                </div>
              ))
            )}
            <Link href="/products" className="block w-full text-center text-sm font-medium text-sage-600 mt-2 py-2 hover:bg-sage-50 rounded-lg transition-colors">
              Manage Products
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
