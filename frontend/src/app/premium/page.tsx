"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type PremiumResponse } from "@/lib/api";

export default function PremiumPage() {
  const [form, setForm] = useState({ productId: "", age: "", smoker: false, coverageAmount: "", isSportsVehicle: false });
  const [result, setResult] = useState<PremiumResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculate = async () => {
    if (!form.productId || !form.age) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post<PremiumResponse>("/api/premium/calculate", {
        productId: parseInt(form.productId),
        age: parseInt(form.age),
        smoker: form.smoker,
        coverageAmount: form.coverageAmount ? parseFloat(form.coverageAmount) : undefined,
        isSportsVehicle: form.isSportsVehicle,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Premium Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enter Details</h3>
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product ID</label>
              <input type="number" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="e.g. 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.smoker} onChange={(e) => setForm({ ...form, smoker: e.target.checked })} className="rounded" /> Smoker (+30%)</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isSportsVehicle} onChange={(e) => setForm({ ...form, isSportsVehicle: e.target.checked })} className="rounded" /> Sports Vehicle (+25%)</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Coverage Amount (optional)</label>
              <input type="number" value={form.coverageAmount} onChange={(e) => setForm({ ...form, coverageAmount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="High coverage (+15%)" />
            </div>
            <button onClick={calculate} disabled={loading || !form.productId || !form.age} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Calculating..." : "Calculate Premium"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Premium Breakdown</h3>
            <div className="space-y-3">
              <Row label="Base Premium" value={result.basePremium} />
              {parseFloat(result.ageSurcharge) > 0 && <Row label="Age Surcharge (>50)" value={result.ageSurcharge} color="text-yellow-600" />}
              {parseFloat(result.smokerSurcharge) > 0 && <Row label="Smoker Surcharge" value={result.smokerSurcharge} color="text-red-600" />}
              {parseFloat(result.coverageSurcharge) > 0 && <Row label="High Coverage Surcharge" value={result.coverageSurcharge} color="text-yellow-600" />}
              {parseFloat(result.sportsVehicleSurcharge) > 0 && <Row label="Sports Vehicle Surcharge" value={result.sportsVehicleSurcharge} color="text-red-600" />}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Final Premium</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${result.finalPremium}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Premium Rules</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>Base premium from product</li>
          <li>Age &gt; 50: +20% surcharge</li>
          <li>Smoker: +30% surcharge</li>
          <li>High coverage (&gt;80% of max): +15% surcharge</li>
          <li>Sports vehicle (vehicle type only): +25% surcharge</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-medium ${color || "text-gray-900 dark:text-white"}`}>+${value}</span>
    </div>
  );
}