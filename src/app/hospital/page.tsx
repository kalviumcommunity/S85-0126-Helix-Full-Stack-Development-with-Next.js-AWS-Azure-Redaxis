"use client";

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

export default function HospitalPage() {
  return (
    <>
      <Nav />
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
                <ImagePlaceholder
                  aspectRatio="video"
                  label="Charts / Map"
                  className="rounded-[var(--radius-lg)]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
