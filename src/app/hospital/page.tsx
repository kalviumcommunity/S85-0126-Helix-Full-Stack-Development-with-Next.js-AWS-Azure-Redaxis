"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Package, Users, AlertCircle } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  dashboardStats,
  bloodInventory,
  requestStatusCards,
} from "@/data/hospital";
import { ToastMessage, ToastViewport } from "@/components/ui/Toast";

const statusColors: Record<string, string> = {
  healthy: "bg-emerald-500/20 text-emerald-700",
  low: "bg-amber-500/20 text-amber-700",
  critical: "bg-[var(--accent)]/20 text-[var(--accent-deep)]",
};

const requestStatusLabel: Record<string, string> = {
  fulfilled: "Fulfilled",
  pending: "Pending",
  in_progress: "In progress",
};

type MeResponse = {
  id: number;
  name: string;
  email: string;
  role: "HOSPITAL" | "DONOR" | "NGO";
  hospital?: { id: number; name: string; city: string; userId: number } | null;
};

type InventoryItem = {
  id: number;
  bloodGroup: string;
  units: number;
  hospitalId: number;
  expiryDate?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HospitalPage() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [loadingInv, setLoadingInv] = useState(true);
  const [invError, setInvError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    bloodGroup: "",
    units: 0,
    expiryDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [requestForm, setRequestForm] = useState({
    bloodGroup: "",
    units: 1,
    urgency: "Medium",
  });
  const [creatingRequest, setCreatingRequest] = useState(false);

  const pushToast = (toast: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [
      ...prev,
      { ...toast, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadMe = async () => {
    try {
      setLoadingMe(true);
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load user");
      setMe(data?.data as MeResponse);
    } catch (e: any) {
      setMe(null);
      pushToast({
        title: "Could not load session",
        description: e?.message || "Please refresh and try again.",
        variant: "error",
      });
    } finally {
      setLoadingMe(false);
    }
  };

  const loadInventories = async () => {
    try {
      setLoadingInv(true);
      setInvError(null);

      const res = await fetch("/api/inventory", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load inventory");

      setInventories((data?.data ?? []) as InventoryItem[]);
    } catch (e: any) {
      setInvError(e?.message || "Failed to load inventory");
      pushToast({
        title: "Could not load inventory",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    } finally {
      setLoadingInv(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadMe();
      await loadInventories();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hospitalId = me?.hospital?.id ?? null;

  const myInventories = useMemo(() => {
    if (!hospitalId) return [];
    return inventories.filter((i) => i.hospitalId === hospitalId);
  }, [inventories, hospitalId]);

  const openAdd = () => {
    setForm({ bloodGroup: "", units: 0, expiryDate: "" });
    setAddOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    const expiry = item.expiryDate ?? item.expiresAt ?? "";
    setForm({
      bloodGroup: item.bloodGroup,
      units: item.units,
      expiryDate: expiry ? new Date(expiry).toISOString().slice(0, 10) : "",
    });
    setEditOpen(true);
  };

  const createInventory = async () => {
    if (!hospitalId) {
      pushToast({
        title: "Hospital not found",
        description: "Your account is missing hospital info.",
        variant: "error",
      });
      return;
    }

    if (!form.bloodGroup.trim()) {
      pushToast({ title: "Blood group is required", variant: "error" });
      return;
    }

    if (form.units < 0) {
      pushToast({
        title: "Units cannot be negative",
        description: "Please enter a non-negative value.",
        variant: "error",
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          bloodGroup: form.bloodGroup,
          units: Math.max(0, Number(form.units)),
          expiryDate: form.expiryDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add inventory");

      pushToast({ title: "Stock added", variant: "success" });
      setAddOpen(false);
      await loadInventories();
    } catch (e: any) {
      pushToast({
        title: "Add failed",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateInventory = async () => {
    if (!editingId) return;

    if (!form.bloodGroup.trim()) {
      pushToast({ title: "Blood group is required", variant: "error" });
      return;
    }

    if (form.units < 0) {
      pushToast({
        title: "Units cannot be negative",
        description: "Please enter a non-negative value.",
        variant: "error",
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/inventory/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup: form.bloodGroup,
          units: Math.max(0, Number(form.units)),
          expiryDate: form.expiryDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update inventory");

      pushToast({ title: "Stock updated", variant: "success" });
      setEditOpen(false);
      setEditingId(null);
      await loadInventories();
    } catch (e: any) {
      pushToast({
        title: "Update failed",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteInventory = async (id: number) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete inventory");

      pushToast({ title: "Stock deleted", variant: "success" });
      await loadInventories();
    } catch (e: any) {
      pushToast({
        title: "Delete failed",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    }
  };

  const createRequest = async () => {
    if (!requestForm.bloodGroup.trim()) {
      pushToast({ title: "Blood group is required", variant: "error" });
      return;
    }

    if (requestForm.units < 1) {
      pushToast({
        title: "Units must be at least 1",
        variant: "error",
      });
      return;
    }

    try {
      setCreatingRequest(true);
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup: requestForm.bloodGroup,
          units: Number(requestForm.units),
          urgency:
            requestForm.urgency === "Low"
              ? "LOW"
              : requestForm.urgency === "High"
                ? "HIGH"
                : "MEDIUM",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create request");

      pushToast({
        title: "Request created",
        description: "Status set to PENDING.",
        variant: "success",
      });
      setRequestForm({ bloodGroup: "", units: 1, urgency: "Medium" });
    } catch (e: any) {
      pushToast({
        title: "Request creation failed",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    } finally {
      setCreatingRequest(false);
    }
  };

  return (
    <>
      <Nav />
      <ToastViewport toasts={toasts} onClose={closeToast} />
      <main
        className="min-h-screen px-6 pt-28 pb-20 md:px-12 lg:px-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            Hospital dashboard
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Blood inventory and request status
          </p>

          {/* Dashboard stat cards with animated counters */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.06}>
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--muted)]">
                      {stat.label}
                    </span>
                    {i === 0 && <Activity className="h-5 w-5 text-[var(--accent)]" />}
                    {i === 1 && <Package className="h-5 w-5 text-[var(--accent)]" />}
                    {i === 2 && <Users className="h-5 w-5 text-[var(--accent)]" />}
                    {i === 3 && <AlertCircle className="h-5 w-5 text-[var(--accent)]" />}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">
                    {typeof stat.value === "number" ? (
                      <AnimatedCounter value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{stat.trend}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Blood inventory grid */}
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Blood inventory
          </h2>
          <p className="mt-1 text-[var(--muted)]">Current stock by type</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bloodInventory.map((item, i) => (
              <GlassCard key={item.type} delay={0.03 * i} hover={false}>
                <div className="p-5">
                  <span className="text-lg font-bold text-[var(--foreground)]">
                    {item.type}
                  </span>
                  <p className="mt-2 text-2xl font-bold text-[var(--accent-deep)]">
                    <AnimatedCounter value={item.units} />
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-lg px-2 py-0.5 text-xs font-medium ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Request status cards + placeholder image */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                Request status
              </h2>
              <p className="mt-1 text-[var(--muted)]">Recent blood requests</p>
              <div className="mt-6 space-y-4">
                {requestStatusCards.map((req, i) => (
                  <GlassCard key={req.id} delay={0.05 * i}>
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {req.patientRef} · {req.bloodType}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {req.units} unit{req.units > 1 ? "s" : ""} ·{" "}
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                          req.status === "fulfilled"
                            ? "bg-emerald-500/20 text-emerald-700"
                            : req.status === "in_progress"
                              ? "bg-amber-500/20 text-amber-700"
                              : "bg-[var(--accent-soft)] text-[var(--accent-deep)]"
                        }`}
                      >
                        {requestStatusLabel[req.status]}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                Overview
              </h2>
              <p className="mt-1 text-[var(--muted)]">Visual placeholder</p>
              <div className="mt-6">
                            <img
                src="https://i.pinimg.com/736x/58/43/07/584307f1dbe565d5d53fb245c36f75c3.jpg"
                  // aspectRatio="video"
                  // label="Charts / Map"
                  className="rounded-[var(--radius-lg)]"
                />
              </div>
            </div>
          </div>

          {/* Inventory Management UI (API-driven) */}
          <div className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  Inventory management
                </h2>
                <p className="mt-1 text-[var(--muted)]">
                  View, add, update, and delete stock (from APIs)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadInventories}
                  className="rounded-xl border border-[var(--glass-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--accent-deep)] backdrop-blur transition hover:bg-white/90"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={openAdd}
                  className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)] disabled:opacity-60"
                  disabled={loadingMe || !me?.hospital}
                >
                  Add stock
                </button>
              </div>
            </div>

            {loadingInv ? (
              <div className="mt-6 rounded-2xl border border-[var(--glass-border)] bg-white/70 px-5 py-4 text-sm text-[var(--muted)]">
                Loading inventory...
              </div>
            ) : invError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                {invError}
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-white/70 shadow-[var(--shadow-soft)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/80">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          Blood group
                        </th>
                        <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          Units available
                        </th>
                        <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          Expiry date
                        </th>
                        <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myInventories.length === 0 ? (
                        <tr>
                          <td
                            className="px-4 py-4 text-[var(--muted)]"
                            colSpan={4}
                          >
                            No inventory found for your hospital.
                          </td>
                        </tr>
                      ) : (
                        myInventories.map((item) => {
                          const expiry =
                            item.expiryDate ?? item.expiresAt ?? null;
                          return (
                            <tr
                              key={item.id}
                              className="border-t border-[var(--glass-border)]"
                            >
                              <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                                {item.bloodGroup}
                              </td>
                              <td className="px-4 py-3 text-[var(--foreground)]">
                                {item.units}
                              </td>
                              <td className="px-4 py-3 text-[var(--muted)]">
                                {expiry ? new Date(expiry).toLocaleDateString() : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEdit(item)}
                                    className="rounded-lg bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--accent)] hover:text-white"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteInventory(item.id)}
                                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Blood Request Creation (API-driven) */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Create blood request
            </h2>
            <p className="mt-1 text-[var(--muted)]">
              Create a new request for donors/NGOs to view
            </p>

            <div className="mt-6 grid gap-4 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-white/70 p-6 shadow-[var(--shadow-soft)] sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]">
                  Blood group
                </label>
                <input
                  value={requestForm.bloodGroup}
                  onChange={(e) =>
                    setRequestForm((p) => ({ ...p, bloodGroup: e.target.value }))
                  }
                  placeholder="e.g. O+"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]">
                  Units needed
                </label>
                <input
                  type="number"
                  min={1}
                  value={requestForm.units}
                  onChange={(e) =>
                    setRequestForm((p) => ({
                      ...p,
                      units: Number(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)]">
                  Urgency
                </label>
                <select
                  value={requestForm.urgency}
                  onChange={(e) =>
                    setRequestForm((p) => ({ ...p, urgency: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={createRequest}
                  disabled={creatingRequest}
                  className="rounded-xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)] disabled:opacity-60"
                >
                  {creatingRequest ? "Creating..." : "Create request"}
                </button>
              </div>
              <p className="sm:col-span-3 text-xs text-[var(--muted)]">
                Note: current backend request schema stores blood group + units and sets status to PENDING.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add stock</h3>
                <p className="text-sm text-gray-500">
                  Add blood stock for your hospital.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Blood group
                </label>
                <input
                  value={form.bloodGroup}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bloodGroup: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  placeholder="e.g. A+"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Units available
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.units}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, units: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Negative units are not allowed.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Expiry date
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expiryDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional. Leave blank if unknown.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createInventory}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-deep)] disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit stock</h3>
                <p className="text-sm text-gray-500">
                  Update blood group or units.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setEditingId(null);
                }}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Blood group
                </label>
                <input
                  value={form.bloodGroup}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bloodGroup: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Units available
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.units}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, units: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Negative units are not allowed.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Expiry date
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expiryDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional. Leave blank if unknown.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setEditingId(null);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateInventory}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-deep)] disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
