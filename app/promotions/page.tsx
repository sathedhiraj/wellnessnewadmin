"use client";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Plus, Tag, Percent, Gift, Truck, Copy, ToggleLeft, ToggleRight, Trash2, X } from "lucide-react";

type PromoType = "Percentage" | "Fixed Amount" | "Free Shipping" | "Buy X Get Y";
type PromoStatus = "Active" | "Inactive" | "Scheduled" | "Expired";

type Promo = {
  id: string;
  code: string;
  type: PromoType;
  value: string;
  minOrder: number;
  uses: number;
  maxUses: number;
  validFrom: string;
  validTo: string;
  status: PromoStatus;
};

const INITIAL_PROMOS: Promo[] = [
  { id: "1", code: "WELCOME20", type: "Percentage", value: "20%", minOrder: 500, uses: 142, maxUses: 500, validFrom: "2026-07-01", validTo: "2026-07-31", status: "Active" },
  { id: "2", code: "FLAT100", type: "Fixed Amount", value: "₹100", minOrder: 800, uses: 89, maxUses: 200, validFrom: "2026-07-15", validTo: "2026-08-15", status: "Active" },
  { id: "3", code: "FREESHIP", type: "Free Shipping", value: "Free", minOrder: 299, uses: 210, maxUses: 1000, validFrom: "2026-06-01", validTo: "2026-12-31", status: "Active" },
  { id: "4", code: "SUMMER15", type: "Percentage", value: "15%", minOrder: 1000, uses: 0, maxUses: 300, validFrom: "2026-08-01", validTo: "2026-08-31", status: "Scheduled" },
  { id: "5", code: "WELLNESS10", type: "Percentage", value: "10%", minOrder: 0, uses: 500, maxUses: 500, validFrom: "2026-01-01", validTo: "2026-06-30", status: "Expired" },
];

const STATUS_STYLE: Record<PromoStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Inactive: "bg-warmgray-100 text-warmgray-500 border-warmgray-200",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  Expired: "bg-rose-50 text-rose-600 border-rose-100",
};

const TYPE_ICON: Record<PromoType, React.ReactNode> = {
  "Percentage": <Percent size={14} />,
  "Fixed Amount": <Tag size={14} />,
  "Free Shipping": <Truck size={14} />,
  "Buy X Get Y": <Gift size={14} />,
};

function CreatePromoModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Promo) => void }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<PromoType>("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const handleSave = () => {
    if (!code.trim() || !discountValue.trim()) return;
    onSave({
      id: Date.now().toString(),
      code: code.toUpperCase().trim(),
      type,
      value: type === "Percentage" ? `${discountValue}%` : type === "Fixed Amount" ? `₹${discountValue}` : "Free",
      minOrder: Number(minOrder) || 0,
      uses: 0,
      maxUses: Number(maxUses) || 999,
      validFrom: validFrom || new Date().toISOString().split("T")[0],
      validTo: validTo || "",
      status: "Active",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-warmgray-100">
          <h3 className="text-lg font-bold text-forest">Create Promotion</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-warmgray-400 hover:bg-warmgray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Promo Code *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
              className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm uppercase font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Discount Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Percentage", "Fixed Amount", "Free Shipping", "Buy X Get Y"] as PromoType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${type === t ? "bg-forest text-white border-forest" : "border-warmgray-200 text-warmgray-600 hover:border-forest"}`}
                >
                  {TYPE_ICON[t]} {t}
                </button>
              ))}
            </div>
          </div>

          {(type === "Percentage" || type === "Fixed Amount") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  {type === "Percentage" ? "Discount %" : "Amount (₹)"}
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={type === "Percentage" ? "20" : "100"}
                  className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Min. Order (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Max Uses</label>
              <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="500" className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Valid From</label>
              <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Valid To</label>
              <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warmgray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-warmgray-600 hover:text-warmgray-800">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest-dark transition-colors">
            Create Promotion
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>(INITIAL_PROMOS);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleToggle = (id: string) => {
    setPromos((prev) => prev.map((p) =>
      p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
    ));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this promotion?")) return;
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (p: Promo) => setPromos((prev) => [p, ...prev]);

  const activeCount = promos.filter((p) => p.status === "Active").length;

  return (
    <AdminLayout>
      {showModal && <CreatePromoModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Promotions</h2>
          <p className="text-sm text-warmgray-500 mt-1">Manage discount codes and promotional offers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Promos", value: promos.length, bg: "bg-forest text-white" },
          { label: "Active Now", value: activeCount, bg: "bg-emerald-50 text-emerald-700" },
          { label: "Total Uses", value: promos.reduce((a, p) => a + p.uses, 0), bg: "bg-sage-50 text-sage-700" },
          { label: "Scheduled", value: promos.filter((p) => p.status === "Scheduled").length, bg: "bg-blue-50 text-blue-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 shadow-sm`}>
            <p className="text-xs font-medium opacity-70 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Value</th>
                <th className="px-6 py-3 font-medium">Min Order</th>
                <th className="px-6 py-3 font-medium">Usage</th>
                <th className="px-6 py-3 font-medium">Validity</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-warmgray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-forest tracking-wider">{p.code}</span>
                      <button
                        onClick={() => handleCopy(p.code)}
                        className="text-warmgray-400 hover:text-sage-600 transition-colors"
                        title="Copy code"
                      >
                        {copied === p.code ? (
                          <span className="text-[10px] font-medium text-emerald-600">Copied!</span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-warmgray-600">
                      {TYPE_ICON[p.type]}
                      <span>{p.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-forest">{p.value}</td>
                  <td className="px-6 py-4 text-warmgray-600">{p.minOrder > 0 ? `₹${p.minOrder}` : "None"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-warmgray-700 text-xs">{p.uses} / {p.maxUses}</span>
                      <div className="w-24 h-1.5 bg-warmgray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage-500 rounded-full"
                          style={{ width: `${Math.min(100, (p.uses / p.maxUses) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-warmgray-600 text-xs whitespace-nowrap">
                    {p.validFrom} → {p.validTo || "∞"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${STATUS_STYLE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(p.id)}
                        className={`transition-colors ${p.status === "Active" ? "text-emerald-500 hover:text-warmgray-400" : "text-warmgray-400 hover:text-emerald-500"}`}
                        title={p.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        {p.status === "Active" ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-warmgray-400 hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
