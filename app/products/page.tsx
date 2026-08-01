"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  handle: string;
  title: string;
  isBestseller: boolean;
  variants: { id: string; name: string; price: number; stock: number; sku: string }[];
  images: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/products");
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Products</h2>
          <p className="text-sm text-warmgray-500 mt-1">Manage your catalog, variants, and inventory.</p>
        </div>
        <Link href="/products/new" className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        <div className="p-4 border-b border-warmgray-100 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-warmgray-200 rounded-md text-sm font-medium text-warmgray-600 hover:bg-warmgray-50">
              Filter
            </button>
            <button className="px-3 py-1.5 border border-warmgray-200 rounded-md text-sm font-medium text-warmgray-600 hover:bg-warmgray-50">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Inventory</th>
                <th className="px-6 py-3 font-medium">Variants</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-warmgray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-warmgray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                  const isLowStock = totalStock > 0 && totalStock <= 10;
                  const isOutOfStock = totalStock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-warmgray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-warmgray-100 overflow-hidden relative shrink-0">
                            {/* Using simple img tag since we don't have next/image domains configured for backend url if it was remote */}
                            <img src={product.images[0] || '/placeholder.png'} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-forest">{product.title}</p>
                            <p className="text-xs text-warmgray-500">{product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span className={`${isOutOfStock ? 'text-rose-600' : 'text-warmgray-700'}`}>
                            {totalStock} in stock
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-warmgray-600">
                        {product.variants.map(v => v.name).join(', ')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product.id}`} className="p-1.5 text-warmgray-400 hover:text-sage-600 transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-warmgray-400 hover:text-rose-600 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-warmgray-100 flex items-center justify-between text-sm text-warmgray-500">
          <p>Showing {products.length} products</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-warmgray-200 rounded text-warmgray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-warmgray-200 rounded hover:bg-warmgray-50">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
