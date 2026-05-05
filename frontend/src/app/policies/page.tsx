"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Policy, type Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PoliciesPage() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ productId: "", age: "", smoker: false, isSportsVehicle: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<Policy[]>(`/api/dashboard/policies/user/${user.id}`),
      api.get<Product[]>("/api/admin/products"),
    ])
      .then(([p, pr]) => {
        setPolicies(p);
        setProducts(pr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handlePurchase = async () => {
    if (!form.productId || !form.age) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post<Policy>("/api/policies/purchase", {
        userId: user!.id,
        productId: parseInt(form.productId),
        age: parseInt(form.age),
        smoker: form.smoker,
        isSportsVehicle: form.isSportsVehicle,
      });
      setShowModal(false);
      setForm({ productId: "", age: "", smoker: false, isSportsVehicle: false });
      const updated = await api.get<Policy[]>(`/api/dashboard/policies/user/${user!.id}`);
      setPolicies(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Policies</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Purchase Policy
        </button>
      </div>

      {policies.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-lg">No policies yet. Purchase your first policy!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400">{p.policyNumber}</span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${p.status === "ACTIVE" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{p.productName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{p.userName}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Premium</span><span className="font-semibold text-gray-900 dark:text-white">${p.premium}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Start</span><span className="text-gray-900 dark:text-white">{new Date(p.startDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">End</span><span className="text-gray-900 dark:text-white">{new Date(p.endDate).toLocaleDateString()}</span></div>
              </div>
              {p.pdfPath && (
                <a href={`http://localhost:8081${p.pdfPath}`} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Purchase Policy</h3>
            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product</label>
                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} - ${p.basePremium}/mo</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Age</label>
                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.smoker} onChange={(e) => setForm({ ...form, smoker: e.target.checked })} className="rounded" /> Smoker</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isSportsVehicle} onChange={(e) => setForm({ ...form, isSportsVehicle: e.target.checked })} className="rounded" /> Sports Vehicle</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setError(""); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handlePurchase} disabled={submitting || !form.productId || !form.age} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? "Processing..." : "Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
