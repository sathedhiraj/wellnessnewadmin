"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    tagline: "",
    description: "",
    ingredients: "",
    howToUse: "",
    benefits: "", // Will be split by comma
    isBestseller: false,
    images: "", // Will be split by comma
    variants: [{ name: "Standard", sku: "", price: 0, mrp: 0, stock: 0 }]
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split(",").map(s => s.trim()).filter(Boolean),
        images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
        variants: formData.variants.map(v => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
          stock: Number(v.stock)
        }))
      };

      await api.post("/products", payload);
      router.push("/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="p-2 text-warmgray-500 hover:text-forest hover:bg-warmgray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-forest">Add Product</h2>
          <p className="text-sm text-warmgray-500 mt-1">Create a new product in your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100 space-y-4">
          <h3 className="text-lg font-semibold text-forest mb-4 border-b border-warmgray-50 pb-2">Basic Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" placeholder="e.g. Velvet Body Lotion" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Handle (URL Slug) *</label>
              <input required value={formData.handle} onChange={e => setFormData({ ...formData, handle: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" placeholder="e.g. velvet-body-lotion" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1">Tagline</label>
            <input value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" placeholder="Deep hydration without the sticky feel." />
          </div>

          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1">Description *</label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Benefits (Comma separated) *</label>
              <input required value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" placeholder="Repairs skin barrier, Non-greasy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Images (Comma separated URLs)</label>
              <input value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" placeholder="/body-lotion.png" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-warmgray-700">
            <input type="checkbox" checked={formData.isBestseller} onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })} className="rounded text-sage-600 focus:ring-sage-500" />
            Is Bestseller
          </label>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100 space-y-4">
          <h3 className="text-lg font-semibold text-forest mb-4 border-b border-warmgray-50 pb-2">Variants (Size, Color, etc.)</h3>

          {formData.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end bg-warmgray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-warmgray-700 mb-1">Name</label>
                <input required value={variant.name} onChange={e => handleVariantChange(index, 'name', e.target.value)} type="text" className="w-full px-3 py-1.5 border border-warmgray-200 rounded-lg text-sm" placeholder="200ml" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warmgray-700 mb-1">SKU</label>
                <input required value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} type="text" className="w-full px-3 py-1.5 border border-warmgray-200 rounded-lg text-sm" placeholder="VBL-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warmgray-700 mb-1">Price (₹)</label>
                <input required value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} type="number" className="w-full px-3 py-1.5 border border-warmgray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warmgray-700 mb-1">MRP (₹)</label>
                <input required value={variant.mrp} onChange={e => handleVariantChange(index, 'mrp', e.target.value)} type="number" className="w-full px-3 py-1.5 border border-warmgray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-warmgray-700 mb-1">Stock</label>
                <input required value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} type="number" className="w-full px-3 py-1.5 border border-warmgray-200 rounded-lg text-sm" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setFormData({ ...formData, variants: [...formData.variants, { name: "", sku: "", price: 0, mrp: 0, stock: 0 }] })} className="text-sm font-medium text-sage-600 hover:text-forest">
            + Add Another Variant
          </button>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-forest text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-70">
            <Save size={16} /> {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
