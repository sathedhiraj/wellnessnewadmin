"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Store, Bell, Shield, Truck, CreditCard, Globe, Save, Check, Eye, EyeOff } from "lucide-react";

type Tab = "Store" | "Notifications" | "Shipping" | "Payments" | "Security" | "General";

const TABS: { name: Tab; icon: React.ReactNode }[] = [
  { name: "Store", icon: <Store size={16} /> },
  { name: "Notifications", icon: <Bell size={16} /> },
  { name: "Shipping", icon: <Truck size={16} /> },
  { name: "Payments", icon: <CreditCard size={16} /> },
  { name: "Security", icon: <Shield size={16} /> },
  { name: "General", icon: <Globe size={16} /> },
];

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-forest text-white hover:bg-forest-dark"}`}
    >
      {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-warmgray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-warmgray-100">
        <h3 className="font-semibold text-forest">{title}</h3>
        {description && <p className="text-xs text-warmgray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-warmgray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-warmgray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${checked ? "bg-sage-500" : "bg-warmgray-200"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out mt-0.5 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Store");
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Store settings state
  const [storeName, setStoreName] = useState("Wave of Wellness");
  const [storeEmail, setStoreEmail] = useState("hello@waveofwellness.in");
  const [storePhone, setStorePhone] = useState("+91 98765 43210");
  const [storeAddress, setStoreAddress] = useState("12, Wellness Street, Mumbai 400001");
  const [storeCurrency, setStoreCurrency] = useState("INR");
  const [storeTimezone, setStoreTimezone] = useState("Asia/Kolkata");

  // Notification toggles
  const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, newCustomer: false, orderShipped: true, reviews: false });

  // Shipping settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("299");
  const [standardRate, setStandardRate] = useState("49");
  const [expressRate, setExpressRate] = useState("99");
  const [codEnabled, setCodEnabled] = useState(true);

  // Payment settings
  const [razorpayKey, setRazorpayKey] = useState("rzp_live_••••••••••••");
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [netbankingEnabled, setNetbankingEnabled] = useState(true);

  // Security settings
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Settings</h2>
          <p className="text-sm text-warmgray-500 mt-1">Manage your store configuration and preferences.</p>
        </div>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-xl border border-warmgray-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {TABS.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === name ? "bg-forest text-white shadow-sm" : "text-warmgray-600 hover:bg-warmgray-50 hover:text-forest"}`}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* ── STORE ── */}
          {activeTab === "Store" && (
            <>
              <SectionCard title="Store Identity" description="Your store name and contact details.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Store Name">
                    <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  </Field>
                  <Field label="Support Email">
                    <Input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
                  </Field>
                  <Field label="Phone">
                    <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
                  </Field>
                  <Field label="Currency">
                    <select value={storeCurrency} onChange={(e) => setStoreCurrency(e.target.value)} className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
                      <option value="INR">INR – Indian Rupee</option>
                      <option value="USD">USD – US Dollar</option>
                      <option value="EUR">EUR – Euro</option>
                    </select>
                  </Field>
                </div>
                <Field label="Store Address">
                  <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                </Field>
                <Field label="Timezone">
                  <select value={storeTimezone} onChange={(e) => setStoreTimezone(e.target.value)} className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </Field>
              </SectionCard>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "Notifications" && (
            <SectionCard title="Email Notifications" description="Choose which events trigger an admin email alert.">
              {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
                const labels: Record<keyof typeof notifs, string> = {
                  newOrder: "New order placed",
                  lowStock: "Low stock alert (≤10 units)",
                  newCustomer: "New customer signup",
                  orderShipped: "Order marked as Shipped",
                  reviews: "New product review submitted",
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-warmgray-800">{labels[key]}</p>
                    </div>
                    <Toggle checked={val} onChange={(v) => setNotifs((prev) => ({ ...prev, [key]: v }))} />
                  </div>
                );
              })}
            </SectionCard>
          )}

          {/* ── SHIPPING ── */}
          {activeTab === "Shipping" && (
            <>
              <SectionCard title="Shipping Rates" description="Configure delivery pricing for your customers.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Free Shipping Threshold (₹)" hint="Orders above this get free shipping">
                    <Input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} />
                  </Field>
                  <Field label="Standard Rate (₹)">
                    <Input type="number" value={standardRate} onChange={(e) => setStandardRate(e.target.value)} />
                  </Field>
                  <Field label="Express Rate (₹)">
                    <Input type="number" value={expressRate} onChange={(e) => setExpressRate(e.target.value)} />
                  </Field>
                </div>
              </SectionCard>
              <SectionCard title="Delivery Options">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-warmgray-800">Cash on Delivery (COD)</p>
                    <p className="text-xs text-warmgray-500">Allow customers to pay on delivery</p>
                  </div>
                  <Toggle checked={codEnabled} onChange={setCodEnabled} />
                </div>
              </SectionCard>
            </>
          )}

          {/* ── PAYMENTS ── */}
          {activeTab === "Payments" && (
            <>
              <SectionCard title="Payment Gateway" description="Configure your Razorpay integration.">
                <Field label="Razorpay API Key">
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={razorpayKey}
                      onChange={(e) => setRazorpayKey(e.target.value)}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600">
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </SectionCard>
              <SectionCard title="Accepted Payment Methods">
                {[
                  { key: "upiEnabled", label: "UPI / QR", desc: "Google Pay, PhonePe, Paytm", val: upiEnabled, set: setUpiEnabled },
                  { key: "cardEnabled", label: "Credit / Debit Cards", desc: "Visa, Mastercard, RuPay", val: cardEnabled, set: setCardEnabled },
                  { key: "netbankingEnabled", label: "Net Banking", desc: "All major Indian banks", val: netbankingEnabled, set: setNetbankingEnabled },
                ].map(({ key, label, desc, val, set }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-warmgray-800">{label}</p>
                      <p className="text-xs text-warmgray-400">{desc}</p>
                    </div>
                    <Toggle checked={val} onChange={set} />
                  </div>
                ))}
              </SectionCard>
            </>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "Security" && (
            <>
              <SectionCard title="Change Password">
                <Field label="Current Password">
                  <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
                </Field>
                <Field label="New Password">
                  <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" />
                </Field>
                <Field label="Confirm New Password">
                  <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" />
                </Field>
                <button
                  onClick={() => alert("Password updated (demo)")}
                  className="px-4 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest-dark transition-colors"
                >
                  Update Password
                </button>
              </SectionCard>
              <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warmgray-800">Enable 2FA</p>
                    <p className="text-xs text-warmgray-400">Secure your login with an authenticator app</p>
                  </div>
                  <Toggle checked={twoFA} onChange={setTwoFA} />
                </div>
              </SectionCard>
            </>
          )}

          {/* ── GENERAL ── */}
          {activeTab === "General" && (
            <SectionCard title="General Preferences" description="Miscellaneous store preferences.">
              <Field label="Language">
                <select className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </Field>
              <Field label="Date Format">
                <select className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </Field>
              <Field label="Items Per Page">
                <select className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </Field>
            </SectionCard>
          )}

          <div className="flex justify-end pt-2">
            <SaveButton onClick={handleSave} saved={saved} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
