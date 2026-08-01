"use client";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Plus, Search, Edit2, Trash2, X, Bold, Italic, Link as LinkIcon, Image as ImageIcon, AlignLeft } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
  excerpt: string;
  status: "Published" | "Draft";
};

const INITIAL_POSTS: BlogPost[] = [
  { id: "1", slug: "benefits-of-natural-skincare", title: "5 Benefits of Natural Skincare", author: "Admin", publishDate: "2026-07-10", tags: ["skincare", "wellness"], excerpt: "Explore why natural ingredients are better for your skin long-term.", status: "Published" },
  { id: "2", slug: "morning-wellness-routine", title: "Build Your Morning Wellness Routine", author: "Admin", publishDate: "2026-07-20", tags: ["routine", "wellness"], excerpt: "Start your day right with these simple wellness habits.", status: "Published" },
  { id: "3", slug: "summer-haircare-tips", title: "Summer Haircare Tips 2026", author: "Admin", publishDate: "2026-07-25", tags: ["haircare", "summer"], excerpt: "Keep your hair healthy and shiny through the summer heat.", status: "Draft" },
];

const AVAILABLE_TAGS = ["skincare", "wellness", "haircare", "routine", "summer", "natural", "tips", "beauty"];

function CreatePostModal({ onClose, onSave }: { onClose: () => void; onSave: (post: BlogPost) => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTitleChange = (v: string) => {
    setTitle(v);
    setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!body.trim()) e.body = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: Date.now().toString(),
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      author,
      publishDate: new Date().toISOString().split("T")[0],
      tags: selectedTags,
      excerpt,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warmgray-100 shrink-0">
          <h3 className="text-lg font-bold text-forest">Create New Post</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-warmgray-400 hover:text-warmgray-700 hover:bg-warmgray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Post Title *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 ${errors.title ? "border-rose-300" : "border-warmgray-200"}`}
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Slug + Author row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1.5">URL Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 text-warmgray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Excerpt *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Brief summary shown in listings..."
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none ${errors.excerpt ? "border-rose-300" : "border-warmgray-200"}`}
            />
            {errors.excerpt && <p className="text-rose-500 text-xs mt-1">{errors.excerpt}</p>}
          </div>

          {/* Rich text area */}
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-1.5">Content *</label>
            <div className={`border rounded-lg overflow-hidden ${errors.body ? "border-rose-300" : "border-warmgray-200"}`}>
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 bg-warmgray-50 border-b border-warmgray-100">
                {[
                  { icon: Bold, label: "Bold" },
                  { icon: Italic, label: "Italic" },
                  { icon: LinkIcon, label: "Link" },
                  { icon: ImageIcon, label: "Image" },
                  { icon: AlignLeft, label: "Align" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    className="w-7 h-7 flex items-center justify-center rounded text-warmgray-500 hover:bg-warmgray-200 hover:text-forest transition-colors"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 text-sm text-warmgray-700 focus:outline-none resize-none"
              />
            </div>
            {errors.body && <p className="text-rose-500 text-xs mt-1">{errors.body}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedTags.includes(tag) ? "bg-sage-600 text-white border-sage-600" : "bg-white text-warmgray-600 border-warmgray-200 hover:border-sage-400 hover:text-sage-600"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Publish status */}
          <div>
            <label className="block text-sm font-medium text-warmgray-700 mb-2">Publish Status</label>
            <div className="flex gap-3">
              {(["Draft", "Published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${status === s ? "bg-forest text-white border-forest" : "bg-white text-warmgray-600 border-warmgray-200 hover:border-forest"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warmgray-100 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-warmgray-600 hover:text-warmgray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-forest-dark transition-colors"
          >
            {status === "Published" ? "Publish Post" : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"Blog Posts" | "Static Pages">("Blog Posts");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (post: BlogPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <AdminLayout>
      {showModal && <CreatePostModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-forest">Content</h2>
          <p className="text-sm text-warmgray-500 mt-1">Manage blog posts, articles, and CMS pages.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-warmgray-100 overflow-hidden">
        <div className="p-4 border-b border-warmgray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {(["Blog Posts", "Static Pages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? "bg-sage-50 text-forest" : "text-warmgray-500 hover:text-forest"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative max-w-[220px] w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-1.5 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500"
            />
          </div>
        </div>

        {activeTab === "Static Pages" ? (
          <div className="px-6 py-16 text-center text-warmgray-400">
            <p className="text-sm">Static pages management coming soon.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-warmgray-50 border-b border-warmgray-200 text-warmgray-600">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Author</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Tags</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-warmgray-400">No posts found.</td>
                  </tr>
                ) : (
                  filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-warmgray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-forest">{post.title}</p>
                        <p className="text-xs text-warmgray-500">/{post.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-warmgray-700">{post.author}</td>
                      <td className="px-6 py-4 text-warmgray-700 whitespace-nowrap">
                        {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-sage-50 text-sage-600 rounded-full text-[10px] font-medium border border-sage-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${post.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-warmgray-400 hover:text-sage-600 transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-1.5 text-warmgray-400 hover:text-rose-600 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
