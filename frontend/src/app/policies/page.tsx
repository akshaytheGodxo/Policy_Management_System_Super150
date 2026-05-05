'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Policy {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
  author: string;
}

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  const policies: Policy[] = [
    {
      id: '1',
      name: 'Data Protection Act 2024',
      category: 'Compliance',
      status: 'active',
      lastUpdated: '2024-05-01',
      author: 'John Doe',
    },
    {
      id: '2',
      name: 'Employee Code of Conduct',
      category: 'HR',
      status: 'active',
      lastUpdated: '2024-04-28',
      author: 'Jane Smith',
    },
    {
      id: '3',
      name: 'Information Security Policy',
      category: 'Security',
      status: 'active',
      lastUpdated: '2024-04-25',
      author: 'Mike Johnson',
    },
    {
      id: '4',
      name: 'Remote Work Guidelines',
      category: 'HR',
      status: 'draft',
      lastUpdated: '2024-04-20',
      author: 'Sarah Williams',
    },
    {
      id: '5',
      name: 'Financial Control Procedures',
      category: 'Finance',
      status: 'active',
      lastUpdated: '2024-04-18',
      author: 'Robert Brown',
    },
    {
      id: '6',
      name: 'Social Media Policy',
      category: 'Communications',
      status: 'archived',
      lastUpdated: '2024-03-15',
      author: 'Emily Davis',
    },
  ];

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || policy.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badgeStyles = {
      active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      draft: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      archived: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    };
    return badgeStyles[status as keyof typeof badgeStyles] || badgeStyles.active;
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Compliance: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      HR: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      Security: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
      Finance: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300',
      Communications: 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300',
    };
    return colors[category] || colors.Compliance;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Policies
          </h1>
          <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            + New Policy
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {/* Filters Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Policy Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy) => (
                    <tr
                      key={policy.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {policy.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(
                            policy.category,
                          )}`}
                        >
                          {policy.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            policy.status,
                          )}`}
                        >
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {policy.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(policy.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mr-4">
                          View
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No policies found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPolicies.length} of {policies.length} policies
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
