"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Droplets, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { donorProfile, nearbyHospitals } from "@/data/donor";
import { ToastMessage, ToastViewport } from "@/components/ui/Toast";

type BloodRequest = {
  id: number;
  bloodGroup: string;
  units: number;
  status?: string;
  createdAt?: string;
  hospital?: {
    id: number;
    name: string;
    city?: string;
  } | null;
  urgency?: string;
};

export default function DonorPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (toast: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [
      ...prev,
      { ...toast, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      setRequestsError(null);

      const res = await fetch("/api/requests", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || "Failed to load requests";
        throw new Error(msg);
      }

      setRequests((data?.data ?? []) as BloodRequest[]);
    } catch (e: any) {
      setRequestsError(e?.message || "Failed to load requests");
      pushToast({
        title: "Could not load requests",
        description: e?.message || "Please try again.",
        variant: "error",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadRequests();
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestCards = useMemo(() => {
    return requests.map((r) => {
      const location = r.hospital?.city ? r.hospital.city : "—";
      const created = r.createdAt ? new Date(r.createdAt) : null;
      const urgencyOrStatus =
        typeof r.urgency === "string"
          ? r.urgency
          : r.status
            ? r.status
            : "—";

      return {
        key: r.id,
        hospitalName: r.hospital?.name || "Unknown hospital",
        location,
        bloodGroup: r.bloodGroup,
        units: r.units,
        urgencyOrStatus,
        createdLabel: created ? created.toLocaleString() : "—",
      };
    });
  }, [requests]);

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Donor dashboard
          </h1>
          <p className="mt-2 text-(--muted)">
            Your profile and nearby donation points
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Donor profile card */}
            <div className="lg:col-span-2">
              <GlassCard delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-6 p-6 md:p-8">
                  <div className="shrink-0">
                    <img
                      src="https://i.pinimg.com/736x/d1/5f/bb/d15fbb3cf5c8ef690818ce562ae19f8d.jpg"
                      className="h-28 w-28 rounded-2xl"
                      alt="Photo"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground">
                        {donorProfile.name}
                      </h2>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-xl bg-(--accent) px-3 py-1.5 text-sm font-bold text-white"
                        aria-label={`Blood group ${donorProfile.bloodGroup}`}
                      >
                        <Droplets className="h-4 w-4" />
                        {donorProfile.bloodGroup}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-6 text-sm text-(--muted)">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last donation: {donorProfile.lastDonation}
                      </span>
                      <span className="flex items-center gap-2">
                        Next eligible: {donorProfile.nextEligible}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground">
                      Total donations:{" "}
                      <strong>{donorProfile.totalDonations}</strong>
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick stat card */}
            <GlassCard delay={0.15}>
              <div className="flex h-full flex-col justify-center p-6 md:p-8">
                <p className="text-sm font-medium text-(--muted)">
                  Next eligible
                </p>
                <p className="mt-1 text-2xl font-bold text-(--accent-deep)">
                  {donorProfile.nextEligible}
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-(--accent-soft)">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-(--accent)"
                  />
                </div>
                <p className="mt-2 text-xs text-(--muted)">
                  ~70% of wait period completed
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Nearby hospitals */}
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-foreground">
            Nearby hospitals
          </h2>
          <p className="mt-1 text-(--muted)">
            Places you can donate
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyHospitals.map((hospital, i) => (
              <GlassCard key={hospital.id} delay={0.05 * i}>
                <div className="p-0">
                  <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
                    <img
                      src="https://i.pinimg.com/1200x/af/48/43/af48435a71106620efcfe205e38dab92.jpg"
                      className="h-full w-full rounded-t-lg rounded-b-none"
                      alt="Hospital"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground">
                      {hospital.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-(--muted)">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {hospital.address}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-(--muted)">
                        {hospital.distance} · {hospital.unitsAvailable} units
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-(--accent-soft) px-3 py-1.5 text-sm font-medium text-(--accent-deep) transition hover:bg-(--accent) hover:text-white"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Blood requests */}
          <div className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Blood requests
                </h2>
                <p className="mt-1 text-sm text-(--muted)">
                  Live requests from hospitals on the network
                </p>
              </div>
              <button
                type="button"
                onClick={loadRequests}
                className="rounded-xl border border-[var(--glass-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-(--accent-deep) backdrop-blur transition hover:bg-white/90"
              >
                Refresh
              </button>
            </div>

            {loadingRequests ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-white/70 shadow-[var(--shadow-soft)] animate-pulse"
                  />
                ))}
              </div>
            ) : requestsError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                {requestsError}
              </div>
            ) : requestCards.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--glass-border)] bg-white/70 px-5 py-4 text-sm text-(--muted)">
                No active requests right now.
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {requestCards.map((r, i) => (
                  <GlassCard key={r.key} delay={i * 0.04}>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-foreground truncate">
                            {r.hospitalName}
                          </p>
                          <p className="mt-1 text-sm text-(--muted)">
                            Location:{" "}
                            <span className="font-medium">{r.location}</span>
                          </p>
                        </div>
                        <span className="inline-flex rounded-xl bg-(--accent-soft) px-3 py-1.5 text-xs font-semibold text-(--accent-deep)">
                          {r.urgencyOrStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <p className="text-(--muted)">Blood group needed</p>
                          <p className="font-bold text-foreground">
                            {r.bloodGroup}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white/70 px-3 py-2">
                          <p className="text-(--muted)">Units required</p>
                          <p className="font-bold text-foreground">{r.units}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-(--muted)">
                        Created: {r.createdLabel}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </>
  );
}
