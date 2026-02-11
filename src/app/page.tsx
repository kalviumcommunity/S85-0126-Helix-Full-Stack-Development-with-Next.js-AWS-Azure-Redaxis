"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { heroContent, stats, processSteps, requirements } from "@/data/landing";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        {/* Hero — large empty background area + headline + CTA */}
        <section
          className="relative flex min-h-[90vh] flex-col justify-end px-6 pb-20 pt-28 md:flex-row md:items-end md:justify-between md:px-12 md:pb-24 lg:px-20"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Background image placeholder — generous empty space */}
          <div className="absolute inset-0 flex items-center justify-end overflow-hidden">
            <div className="absolute right-0 top-1/2 h-[70vh] w-[55vw] -translate-y-1/2 rounded-l-[var(--radius-xl)] bg-gradient-to-l from-[#fce7eb]/80 to-transparent" />
            <div className="absolute right-[8%] top-1/2 h-[60vh] w-[45vw] -translate-y-1/2 rounded-[var(--radius-lg)] shadow-2xl">
              <img
                src="https://i.pinimg.com/736x/69/f6/c6/69f6c6abd053ff2ec366fb05905248e1.jpg"
                alt="Hero visual"
                className="h-full w-full object-cover rounded-[var(--radius-lg)]"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl"
            >
              Give{" "}
              <span className="bg-gradient-to-r from-[var(--accent-deep)] to-[#f43f5e] bg-clip-text text-transparent">
                blood.
              </span>
              <br />
              Save lives.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 max-w-md text-lg text-[var(--muted)]"
            >
              {heroContent.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/donor"
                className="group flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-deep)] hover:shadow-lg"
              >
                {heroContent.primaryCta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#process"
                className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] bg-white/60 px-6 py-3.5 font-semibold text-[var(--foreground)] backdrop-blur-sm transition hover:bg-white/80"
              >
                {heroContent.secondaryCta}
              </a>
            </motion.div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-[var(--glass-border)] bg-white/50 px-6 py-12 backdrop-blur-sm md:px-12 lg:px-20">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[var(--accent-deep)] md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm font-medium text-[var(--muted)]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="px-6 py-24 md:px-12 lg:px-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl"
          >
            The donation process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 max-w-xl text-[var(--muted)]"
          >
            Four simple steps from registration to recovery.
          </motion.p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <GlassCard key={step.step} delay={i * 0.08}>
                <div className="p-6 md:p-8">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-deep)]">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Requirements + illustration placeholder */}
        <section
          id="requirements"
          className="px-6 py-24 md:px-12 lg:px-20"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                Requirements
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-2 text-[var(--muted)]"
              >
                By blood donation type
              </motion.p>
              <ul className="mt-8 space-y-4">
                {requirements.map((req, i) => (
                  <motion.li
                    key={req}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 text-[var(--foreground)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                      <Check className="h-3.5 w-3.5 text-[var(--accent-deep)]" />
                    </span>
                    {req}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="https://i.pinimg.com/736x/4f/61/bb/4f61bbca3a4868852c6192e1109a9df9.jpg"
                // aspectRatio="square"
                // label="Illustration"
                className="max-h-[380px] w-full max-w-md"
              />
            </motion.div>
          </div>
        </section>

        {/* Guide CTA + image placeholder */}
        <section className="px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 lg:flex-row">
            <div className="min-w-0 flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                Donor’s guide
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-4 max-w-md text-[var(--muted)]"
              >
                New to blood donation? Download our guide to understand the
                process and help patients safely.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-white transition hover:bg-[var(--accent-deep)]"
              >
                <Download className="h-4 w-4" />
                Download guide
              </motion.button>
            </div>
            <div className="w-full max-w-md flex-shrink-0">
              <img
                src="https://i.pinimg.com/736x/1d/66/e1/1d66e1eefc38a3348ec909d8d4fedca6.jpg"
                // aspectRatio="video"
                // label="Guide / Doctor"
                className="rounded-[var(--radius-lg)]"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--glass-border)] bg-gradient-to-b from-white/80 to-[var(--accent-soft)]/30 px-6 py-16 md:px-12 lg:px-20">
          <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-10">
            <div>
              <span className="text-xl font-bold text-[var(--accent-deep)]">
                RedAxis
              </span>
              <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">
                A platform ensuring no life is lost due to lack of blood.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Contact
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                info@redaxis.org · +91 90000 00000
              </p>
            </div>
            <p className="text-sm text-[var(--muted)]">© 2026 RedAxis</p>
          </div>
        </footer>
      </main>
    </>
  );
}
