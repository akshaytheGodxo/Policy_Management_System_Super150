"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type User } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<User[]>("/api/admin/users")
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white w-64"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Smoker</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{u.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.age ?? "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.smoker ? "Yes" : "No"}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-6 py-8 text-center text-gray-500">No users found</p>}
      </div>
    </DashboardLayout>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
    ADJUSTER: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    CUSTOMER: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  };
  return <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${map[role] || "bg-gray-100 text-gray-700"}`}>{role}</span>;
}