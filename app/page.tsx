import { AdminLayout } from "../components/layout/AdminLayout";
import { TrendingUp, ShoppingCart, AlertCircle, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">Total Sales (Today)</p>
            <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-sage-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">₹ 42,500</h3>
          <p className="text-xs text-sage-600 mt-2 font-medium">↑ 12% vs yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">Orders (Today)</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={16} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">45</h3>
          <p className="text-xs text-sage-600 mt-2 font-medium">↑ 5% vs yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-warmgray-500">New Customers</p>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-forest">18</h3>
          <p className="text-xs text-warmgray-400 mt-2">Consistent with average</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-rose-600">Low Stock Alerts</p>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertCircle size={16} className="text-rose-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-600">3</h3>
          <p className="text-xs text-rose-500 mt-2 font-medium">Action required</p>
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="group hover:bg-warmgray-50 transition-colors">
                    <td className="py-4 font-medium text-forest">WOW1045{i}</td>
                    <td className="py-4 text-warmgray-600">ananya@example.com</td>
                    <td className="py-4 text-warmgray-600">₹ {(1299 + i * 100).toLocaleString()}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        Placed
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sage-600 hover:text-forest text-xs font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 p-6">
          <h3 className="text-lg font-semibold text-forest mb-4">Low Stock Variants</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-warmgray-50 pb-4">
              <div>
                <p className="text-sm font-medium text-forest">Glow Exfoliating Mist</p>
                <p className="text-xs text-warmgray-500">150ml</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-rose-600">12 left</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-warmgray-50 pb-4">
              <div>
                <p className="text-sm font-medium text-forest">Radiance Body Wash</p>
                <p className="text-xs text-warmgray-500">60ml (Travel)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-rose-600">5 left</p>
              </div>
            </div>
            <button className="w-full text-center text-sm font-medium text-sage-600 mt-2 py-2 hover:bg-sage-50 rounded-lg transition-colors">
              View Inventory
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
