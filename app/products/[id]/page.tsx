"use client";
import { useState, useEffect, use } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  //export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {

  //const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    tagline: "",
    description: "",
    ingredients: "",
    howToUse: "",
    benefits: "",
    isBestseller: false,
    images: "",
    variants: [{ name: "", sku: "", price: 0, mrp: 0, stock: 0 }]
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Find all products then filter (because our backend only has getProductByHandle, not by ID, 
        // but for editing we have the ID from the URL. Let's just fetch all and find it for now, 
        // or we can adjust this to fetch by handle if the URL is /products/handle instead of /products/id.
        // Wait, the page list passes product.id to the URL.
        const { data } = await axios.get("http://localhost:5000/api/v1/products");
        const product = data.find((p: any) => p.id === id);

        if (product) {
          setFormData({
            title: product.title || "",
            handle: product.handle || "",
            tagline: product.tagline || "",
            description: product.description || "",
            ingredients: product.ingredients || "",
            howToUse: product.howToUse || "",
            benefits: Array.isArray(product.benefits) ? product.benefits.join(", ") : "",
            isBestseller: product.isBestseller || false,
            images: Array.isArray(product.images) ? product.images.join(", ") : "",
            variants: product.variants?.length ? product.variants : [{ name: "", sku: "", price: 0, mrp: 0, stock: 0 }]
          });
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split(",").map(s => s.trim()).filter(Boolean),
        // For images and variants, full updates require custom backend logic to delete and recreate.
        // We will just send the basic fields that standard Prisma update handles easily for now.
        title: formData.title,
        handle: formData.handle,
        tagline: formData.tagline,
        description: formData.description,
        ingredients: formData.ingredients,
        howToUse: formData.howToUse,
        isBestseller: formData.isBestseller,
      };

      await axios.put(`http://localhost:5000/api/v1/products/${id}`, payload);
      router.push("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-warmgray-500">Loading product data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="p-2 text-warmgray-500 hover:text-forest hover:bg-warmgray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-forest">Edit Product</h2>
          <p className="text-sm text-warmgray-500 mt-1">Update {formData.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warmgray-100 space-y-4">
          <h3 className="text-lg font-semibold text-forest mb-4 border-b border-warmgray-50 pb-2">Basic Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Handle (URL Slug) *</label>
              <input required value={formData.handle} onChange={e => setFormData({ ...formData, handle: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1">Tagline</label>
            <input value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1">Description *</label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1">Benefits (Comma separated)</label>
              <input value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} type="text" className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-warmgray-700">
            <input type="checkbox" checked={formData.isBestseller} onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })} className="rounded text-sage-600 focus:ring-sage-500" />
            Is Bestseller
          </label>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-forest text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-70">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
