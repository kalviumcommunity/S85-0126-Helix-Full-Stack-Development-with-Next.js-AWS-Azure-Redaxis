"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      router.push(`/${data.data.user.role.toLowerCase()}`);
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left image section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300">
        <div className="max-w-md px-8 text-center">
          <img
            src="https://i.pinimg.com/1200x/7c/39/1c/7c391c56219fd03af46338ffe888bef4.jpg"
            alt="Blood donation illustration"
            className="w-full rounded-3xl shadow-2xl object-cover"
          />
          <p className="mt-6 text-sm font-medium text-rose-900/80">
            Give blood, save lives. Secure access for donors, hospitals and NGOs.
          </p>
        </div>
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg px-8 py-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Login to access your RedAxis dashboard.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                onChange={handleChange}
                required
              />
            </div>

            <button
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="font-semibold text-red-600 hover:text-red-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
