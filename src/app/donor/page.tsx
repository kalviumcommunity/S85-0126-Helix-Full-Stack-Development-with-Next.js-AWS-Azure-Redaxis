"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Droplets, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { donorProfile, nearbyHospitals } from "@/data/donor";

export default function DonorPage() {
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
        </motion.div>
      </main>
    </>
  );
}
