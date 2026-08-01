"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  FileText,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import { useAuth } from "../../components/auth/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Catalog", href: "/products", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Promotions", href: "/promotions", icon: Tag },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, adminUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const currentPage =
    NAV_ITEMS.find(
      (i) => pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href))
    )?.name || "Dashboard";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-forest-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center shadow-md">
            <Leaf size={20} className="text-cream-50" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-cream-50 leading-none block">
              Wave Admin
            </span>
            <span className="text-xs text-sage-400 leading-none">Back-Office V1.0</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                  ? "bg-sage-600 text-white shadow-sm"
                  : "text-sage-300 hover:bg-forest-dark hover:text-white"
                }`}
            >
              <item.icon
                size={18}
                className={isActive ? "text-sage-200" : "text-sage-500"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-forest-dark space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center text-cream-50 font-bold text-xs shrink-0">
            {adminUser?.name.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-cream-50 truncate leading-none mb-0.5">
              {adminUser?.name ?? "Admin User"}
            </p>
            <p className="text-xs text-sage-400 leading-none">{adminUser?.role ?? "Super Admin"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-sage-300 hover:text-white hover:bg-rose-900/40 transition-all rounded-xl text-left"
        >
          <LogOut size={18} className="text-sage-500" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-warmgray-50 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-forest flex-col shrink-0 shadow-xl z-20">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-forest flex flex-col z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-sage-400 hover:text-white hover:bg-forest-dark transition-colors z-10"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-warmgray-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              id="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-forest hover:bg-warmgray-100 transition-colors"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-forest">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xs">
              {adminUser?.name.slice(0, 2).toUpperCase() ?? "AD"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-forest leading-none mb-0.5">
                {adminUser?.name ?? "Admin User"}
              </p>
              <p className="text-xs text-warmgray-400 leading-none">
                {adminUser?.role ?? "Super Admin"}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-warmgray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
