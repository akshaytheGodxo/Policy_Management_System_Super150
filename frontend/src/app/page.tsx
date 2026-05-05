import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#2b2b2b] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">InsureTech</h1>
        <div className="space-x-6">
          <button className="hover:text-gray-300">Products</button>
          <button className="hover:text-gray-300">Compare</button>
          <button className="hover:text-gray-300">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Smart Insurance, Simplified
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Buy, manage, and claim your insurance seamlessly with our fully
          digital platform. No paperwork. No delays.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold">
            Get Started
          </button>
          <button className="border border-gray-500 px-6 py-3 rounded-xl">
            Compare Plans
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-16">
        {[
          "Instant Premium Calculation",
          "Digital Policy Issuance",
          "Fast Claim Processing",
        ].map((feature, i) => (
          <div key={i} className="bg-[#333333] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">{feature}</h3>
            <p className="text-gray-400">
              Experience a modern insurance workflow designed for speed and
              transparency.
            </p>
          </div>
        ))}
      </section>

      {/* Products */}
      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Insurance Products
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Life Insurance", "Health Insurance", "Vehicle Insurance"].map(
            (item, i) => (
              <div
                key={i}
                className="bg-[#333333] p-6 rounded-2xl hover:scale-105 transition"
              >
                <h3 className="text-xl font-semibold mb-3">{item}</h3>
                <p className="text-gray-400 mb-4">
                  Comprehensive coverage tailored to your needs.
                </p>
                <button className="bg-white text-black px-4 py-2 rounded-lg">
                  View Plans
                </button>
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 bg-[#333333]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Secure Your Future?
        </h2>
        <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold">
          Buy a Policy Now
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-700 text-gray-400">
        © 2026 InsureTech. All rights reserved.
      </footer>
    </div>
  );
}
