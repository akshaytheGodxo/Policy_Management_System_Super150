"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Policy, type Claim } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<Policy[]>(`/api/dashboard/policies/user/${user.id}`),
      api.get<Claim[]>(`/api/dashboard/claims/user/${user.id}`).catch(() => []),
    ])
      .then(([p, c]) => {
        setPolicies(p);
        setClaims(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
  const totalPremium = policies.reduce((sum, p) => sum + parseFloat(p.premium), 0);
  const pendingClaims = claims.filter((c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length;

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome, {user?.name}!</h2>
        <p className="text-gray-500 dark:text-gray-400">Here&apos;s your insurance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Policies" value={policies.length} color="indigo" />
        <StatCard label="Active Policies" value={activePolicies} color="green" />
        <StatCard label="Total Premium" value={`$${totalPremium.toFixed(2)}`} color="blue" />
        <StatCard label="Pending Claims" value={pendingClaims} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Policies</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {policies.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-500">No policies yet</p>
            ) : (
              policies.slice(0, 5).map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.policyNumber}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${p.premium}</p>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Claims</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {claims.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-500">No claims yet</p>
            ) : (
              claims.slice(0, 5).map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{c.policyNumber}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">${c.claimAmount}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${colors[color]?.split(" ").filter((c) => !c.startsWith("bg")).join(" ") || "text-gray-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    SUBMITTED: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
    UNDER_REVIEW: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    APPROVED: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    REJECTED: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
    DISBURSED: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    EXPIRED: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
