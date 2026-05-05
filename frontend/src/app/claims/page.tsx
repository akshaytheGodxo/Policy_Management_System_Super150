
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Claim, type Product, type Policy } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ policyId: "", description: "", claimAmount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const isAdjuster = user?.role === "ADJUSTER";

  useEffect(() => {
    if (!user) return;
    const promises = [api.get<Claim[]>(`/api/dashboard/claims/user/${user.id}`)];
    if (isAdmin || isAdjuster) promises.push(api.get<Claim[]>("/api/claims/all"));
    api.get<Policy[]>(`/api/dashboard/policies/user/${user.id}`).then((p) => setPolicies(p)).catch(() => {});
    Promise.all(promises)
      .then(([c, ac]) => {
        setClaims(c);
        if (ac) setAllClaims(ac);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const displayClaims = isAdmin || isAdjuster ? allClaims : claims;

  const handleSubmit = async () => {
    if (!form.policyId || !form.claimAmount) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post<Claim>("/api/claims", {
        policyId: parseInt(form.policyId),
        description: form.description,
        claimAmount: parseFloat(form.claimAmount),
      });
      setShowModal(false);
      setForm({ policyId: "", description: "", claimAmount: "" });
      const updated = await api.get<Claim[]>(`/api/dashboard/claims/user/${user!.id}`);
      setClaims(updated);
      if (isAdmin || isAdjuster) setAllClaims(await api.get<Claim[]>("/api/claims/all"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (claimId: number, status: string) => {
    setUpdating(claimId);
    try {
      await api.put<Claim>(`/api/claims/${claimId}/status`, { status, reviewNotes: "" });
      if (isAdmin || isAdjuster) setAllClaims(await api.get<Claim[]>("/api/claims/all"));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Claims</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + File Claim
        </button>
      </div>

      {displayClaims.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-lg">No claims yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Policy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Submitted</th>
                {(isAdmin || isAdjuster) && <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayClaims.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{c.policyNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${c.claimAmount}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : "-"}</td>
                  {(isAdmin || isAdjuster) && (
                    <td className="px-4 py-3">
                      {c.status === "SUBMITTED" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(c.id, "UNDER_REVIEW")} disabled={updating === c.id} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 disabled:opacity-50">Review</button>
                          <button onClick={() => updateStatus(c.id, "REJECTED")} disabled={updating === c.id} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 disabled:opacity-50">Reject</button>
                        </div>
                      )}
                      {c.status === "UNDER_REVIEW" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(c.id, "APPROVED")} disabled={updating === c.id} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 disabled:opacity-50">Approve</button>
                          <button onClick={() => updateStatus(c.id, "REJECTED")} disabled={updating === c.id} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 disabled:opacity-50">Reject</button>
                        </div>
                      )}
                      {c.status === "APPROVED" && (
                        <button onClick={() => updateStatus(c.id, "DISBURSED")} disabled={updating === c.id} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 disabled:opacity-50">Disburse</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">File a Claim</h3>
            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Policy</label>
                <select value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="">Select policy</option>
                  {policies.filter((p) => p.status === "ACTIVE").map((p) => <option key={p.id} value={p.id}>{p.policyNumber} - {p.productName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Claim Amount ($)</label>
                <input type="number" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setError(""); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting || !form.policyId || !form.claimAmount} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUBMITTED: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
    UNDER_REVIEW: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    APPROVED: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    REJECTED: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
    DISBURSED: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  };
  return <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}