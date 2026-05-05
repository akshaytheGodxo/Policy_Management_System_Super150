"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Claim } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ReportsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === "ADMIN" || user.role === "ADJUSTER" ? "/api/claims/all" : `/api/dashboard/claims/user/${user.id}`;
    api.get<Claim[]>(endpoint)
      .then(setClaims)
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filterStatus === "all" ? claims : claims.filter((c) => c.status === filterStatus);

  const total = claims.length;
  const approved = claims.filter((c) => c.status === "APPROVED" || c.status === "DISBURSED").length;
  const rejected = claims.filter((c) => c.status === "REJECTED").length;
  const totalAmount = claims.reduce((s, c) => s + parseFloat(c.claimAmount), 0);

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reports & Claims Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Claims" value={total} />
        <StatCard label="Approved" value={approved} color="green" />
        <StatCard label="Rejected" value={rejected} color="red" />
        <StatCard label="Total Amount" value={`$${totalAmount.toFixed(2)}`} color="blue" />
      </div>

      <div className="flex gap-4 mb-4">
        {["all", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterStatus === s ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Policy</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{c.policyNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.userName}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-semibold">${c.claimAmount}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-48 truncate">{c.reviewNotes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-6 py-8 text-center text-gray-500">No claims found</p>}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const textColor = color === "green" ? "text-green-600 dark:text-green-400" : color === "red" ? "text-red-600 dark:text-red-400" : color === "blue" ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
    </div>
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
