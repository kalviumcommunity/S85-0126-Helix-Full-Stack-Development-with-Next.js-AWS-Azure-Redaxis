"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "DONOR",
    bloodGroup: "",
    city: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          bloodGroup: form.role === "DONOR" ? form.bloodGroup : undefined,
          city: form.city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push("/login");
    } catch {
      setError("Signup failed");
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
            src="https://i.pinimg.com/1200x/9b/96/13/9b9613c1d5bec31965995bb72b8e2ea3.jpg"
            alt="Donor registration illustration"
            className="w-full rounded-3xl shadow-2xl object-cover"
          />
          <p className="mt-6 text-sm font-medium text-rose-900/80">
            Join RedAxis to coordinate life-saving blood donations in real time.
          </p>
        </div>
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg px-8 py-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Register as a donor, hospital, or NGO to get started.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Full name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                onChange={handleChange}
                required
              />
            </div>

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
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                onChange={handleChange}
                value={form.role}
              >
                <option value="DONOR">Donor</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="NGO">NGO</option>
              </select>
            </div>

            {form.role === "DONOR" && (
              <>
                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Blood group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm bg-white focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    onChange={handleChange}
                    value={form.bloodGroup}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {form.role === "HOSPITAL" && (
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  placeholder="City"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-red-600 hover:text-red-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
