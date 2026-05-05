'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // TODO: Replace with actual user data from context/session
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Policy Management
            </h1>
          </div>

          {/* Right Section - Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Settings
                </Link>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => {
                    // TODO: Handle logout
                    console.log('Logging out...');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block transition-all duration-300 fixed h-[calc(100vh-4rem)] overflow-y-auto lg:sticky top-16`}
        >
          <nav className="p-6 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg font-medium text-indigo-600 dark:text-indigo-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0v-7m0 7l7 4m0-7v-7m0 7l7-4"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/policies"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Policies
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Reports
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a6 6 0 006 6h6a6 6 0 006-6V9h-6a4 4 0 00-4-4H9z"
                />
              </svg>
              Users
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your policies today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      Total Policies
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      24
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      Active Users
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      156
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a6 6 0 0112 0v2H6v-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      Pending Approvals
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      8
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      Compliance Rate
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      98%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-6 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                      P
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Policy Created: Data Protection Act 2024
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      A
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      User Approved: John Smith for Admin Role
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      5 hours ago
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      U
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Policy Updated: Employee Handbook v2.1
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
