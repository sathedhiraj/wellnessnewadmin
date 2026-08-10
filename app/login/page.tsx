"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthContext";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate slight network delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const success = await login(username, password);
    setLoading(false);

    if (success) {
      router.push("/");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #5D857A, transparent)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #7DA399, transparent)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-sage-500 flex items-center justify-center mb-4 shadow-lg">
            <Leaf size={32} className="text-cream-50" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-cream-50">Wave Admin</h1>
          <p className="text-sage-300 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(252, 250, 248, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(252, 250, 248, 0.12)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-sage-200 mb-2">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl text-cream-50 placeholder-sage-400 text-sm outline-none transition-all"
                style={{
                  background: "rgba(252, 250, 248, 0.08)",
                  border: "1px solid rgba(252, 250, 248, 0.15)",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(93, 133, 122, 0.7)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(93, 133, 122, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(252, 250, 248, 0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-sage-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-cream-50 placeholder-sage-400 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(252, 250, 248, 0.08)",
                    border: "1px solid rgba(252, 250, 248, 0.15)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(93, 133, 122, 0.7)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(93, 133, 122, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(252, 250, 248, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-forest transition-all mt-2 disabled:opacity-60"
              style={{
                background: loading
                  ? "rgba(93, 133, 122, 0.6)"
                  : "linear-gradient(135deg, #7DA399, #5D857A)",
                boxShadow: loading ? "none" : "0 4px 15px rgba(93, 133, 122, 0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-sage-400 mt-6">
            Demo credentials Adminpanel: <span className="text-sage-300 font-medium">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
