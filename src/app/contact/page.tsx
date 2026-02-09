"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In a real app you would POST to an API route here.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gray-50 px-4 pt-28 pb-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
          <section className="flex-1 rounded-2xl bg-white p-8 shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contact us
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Have a question about donations, hospital onboarding, or NGO
              partnerships? Send us a message and we&apos;ll get back to you.
            </p>

            {submitted && (
              <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Thank you for reaching out. We&apos;ll respond shortly.
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
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="Your full name"
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
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </section>

          <aside className="flex-1 rounded-2xl bg-white p-8 shadow md:max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Quick information
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              RedAxis connects donors, hospitals, and NGOs in real time so that
              no life is lost due to lack of blood.
            </p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium">Email</p>
                <p>support@redaxis.org</p>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p>+91 90000 00000</p>
              </div>
              <div>
                <p className="font-medium">Hours</p>
                <p>24/7 for emergencies</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

