"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Product } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", basePremium: "", type: "LIFE", coverageAmount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Product[]>("/api/admin/products")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", basePremium: p.basePremium, type: p.type, coverageAmount: p.coverageAmount || "" });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.basePremium) return;
    setSubmitting(true);
    setError("");
    try {
      if (editing) {
        await api.put<Product>(`/api/admin/products/${editing.id}`, { ...form, coverageAmount: form.coverageAmount ? parseFloat(form.coverageAmount) : null });
      } else {
        await api.post<Product>("/api/admin/products", { ...form, coverageAmount: form.coverageAmount ? parseFloat(form.coverageAmount) : null });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ name: "", description: "", basePremium: "", type: "LIFE", coverageAmount: "" });
      setProducts(await api.get<Product[]>("/api/admin/products"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(await api.get<Product[]>("/api/admin/products"));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
        <button onClick={() => { setEditing(null); setForm({ name: "", description: "", basePremium: "", type: "LIFE", coverageAmount: "" }); setShowModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded">{p.type}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Delete</button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{p.name}</h3>
            {p.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{p.description}</p>}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Base Premium</span><span className="font-semibold text-gray-900 dark:text-white">${p.basePremium}</span></div>
              {p.coverageAmount && <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Max Coverage</span><span className="text-gray-900 dark:text-white">${p.coverageAmount}</span></div>}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-lg">No products yet. Add your first product!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Base Premium</label>
                  <input type="number" step="0.01" value={form.basePremium} onChange={(e) => setForm({ ...form, basePremium: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="LIFE">Life</option>
                    <option value="HEALTH">Health</option>
                    <option value="VEHICLE">Vehicle</option>
                    <option value="HOME">Home</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Max Coverage Amount</label>
                <input type="number" value={form.coverageAmount} onChange={(e) => setForm({ ...form, coverageAmount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditing(null); setError(""); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting || !form.name || !form.basePremium} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}