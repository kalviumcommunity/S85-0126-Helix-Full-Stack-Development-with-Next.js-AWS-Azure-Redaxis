"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, BookOpen, Quote } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { heroContent, stats, processSteps, requirements } from "@/data/landing";

export default function HomePage() {
  const testimonials = [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Donor",
      avatar: "https://i.pinimg.com/736x/df/a0/f8/dfa0f81bdc6c37b006303de4bf562995.jpg",
      testimonial:
        "Donating blood through RedAxis was seamless. Knowing my donation helped someone in emergency gives me a sense of purpose.",
    },
    {
      id: 2,
      name: "CityCare Hospital",
      role: "Hospital",
      avatar: "https://i.pinimg.com/1200x/55/2b/c9/552bc933eda797cd941db8a8b10082db.jpg",
      testimonial:
        "Real-time inventory visibility has drastically reduced emergency response time. RedAxis truly bridges the coordination gap.",
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "NGO Volunteer",
      avatar: "https://i.pinimg.com/736x/e9/c5/1a/e9c51a0a6819c3b0032b44c46fd199b0.jpg",
      testimonial:
        "Organizing donation drives is now structured and transparent. The platform makes collaboration effortless.",
    },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        {/* Hero — large empty background area + headline + CTA */}
        <section
          className="relative flex min-h-[70vh] md:min-h-[90vh] flex-col justify-center md:justify-between px-4 md:px-12 pb-16 md:pb-20 pt-24 md:pt-28 md:flex-row md:items-end lg:px-20"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Background image placeholder — hidden on mobile, visible on desktop */}
          <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none">
            {/* Background gradient - always visible */}
            <div className="absolute right-0 top-1/2 h-[50vh] w-[70vw] md:h-[70vh] md:w-[55vw] -translate-y-1/2 rounded-l-xl bg-linear-to-l from-[#fce7eb]/80 to-transparent hidden md:block" />
            
            {/* Main image - hidden on mobile, visible on desktop */}
            <div className="absolute right-[5%] md:right-[8%] top-1/2 h-[50vh] w-[60vw] md:h-[60vh] md:w-[45vw] -translate-y-1/2 rounded-lg shadow-2xl overflow-hidden hidden md:block">
              <img
                src="https://i.pinimg.com/736x/69/f6/c6/69f6c6abd053ff2ec366fb05905248e1.jpg"
                alt="Hero visual"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-foreground"
            >
              Give{" "}
              <span className="bg-linear-to-r from-[var(--accent-deep)] to-[#f43f5e] bg-clip-text text-transparent">
                blood.
              </span>
              <br />
              Save lives.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 md:mt-6 max-w-md text-base md:text-lg text-[var(--muted)]"
            >
              {heroContent.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4"
            >
              <Link
                href="/donor"
                className="group flex items-center justify-center md:justify-start gap-2 rounded-2xl bg-[var(--accent)] px-5 md:px-6 py-3 md:py-3.5 font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-deep)] hover:shadow-lg w-full sm:w-auto"
              >
                {heroContent.primaryCta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 hidden sm:inline" />
              </Link>
              <a
                href="#process"
                className="flex items-center justify-center md:justify-start gap-2 rounded-2xl border border-[var(--glass-border)] bg-white/60 px-5 md:px-6 py-3 md:py-3.5 font-semibold text-[var(--foreground)] backdrop-blur-sm transition hover:bg-white/80 w-full sm:w-auto"
              >
                {heroContent.secondaryCta}
              </a>
            </motion.div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-[var(--glass-border)] bg-white/50 px-4 md:px-12 py-8 md:py-12 backdrop-blur-sm lg:px-20">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center md:justify-between gap-6 md:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--accent-deep)]">
                  {s.value}
                </div>
                <div className="mt-1 text-xs md:text-sm font-medium text-[var(--muted)]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="px-4 md:px-12 py-16 md:py-24 lg:px-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)]"
          >
            The donation process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 max-w-xl text-sm md:text-base text-[var(--muted)]"
          >
            Four simple steps from registration to recovery.
          </motion.p>
          <div className="mt-12 md:mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          className="px-4 md:px-12 py-16 md:py-24 lg:px-20"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:gap-16 lg:grid-cols-2">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
              >
                Requirements
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-2 text-sm md:text-base text-[var(--muted)]"
              >
                By blood donation type
              </motion.p>
              <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                {requirements.map((req, i) => (
                  <motion.li
                    key={req}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start md:items-center gap-3 text-sm md:text-base text-[var(--foreground)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)] flex-shrink-0 mt-0.5 md:mt-0">
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
              className="flex justify-center order-first lg:order-last"
            >
              <img
                src="https://i.pinimg.com/736x/4f/61/bb/4f61bbca3a4868852c6192e1109a9df9.jpg"
                alt="Requirements illustration"
                className="w-full max-w-sm md:max-w-md max-h-72 md:max-h-[380px] object-cover rounded-[var(--radius-lg)]"
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
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/donor-guide"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
                >
                  <BookOpen className="h-4 w-4" />
                  Read guide
                </Link>
              </motion.div>
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
        {/* Testimonials */}
        <section
          className="px-4 md:px-12 lg:px-20 py-16 md:py-24"
          style={{
            background:
              "linear-gradient(135deg, rgba(252, 231, 235, 0.3) 0%, rgba(252, 231, 235, 0.1) 100%)",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                Stories That Save Lives
              </h2>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-[var(--muted)]">
                Real experiences from donors, hospitals, and volunteers
              </p>
            </motion.div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <GlassCard delay={i * 0.1}>
                    <div className="relative p-6 md:p-8">
                      {/* Quote icon background */}
                      <Quote className="absolute top-4 right-4 h-10 w-10 md:h-12 md:w-12 text-[var(--accent)]/10" />

                      {/* Testimonial text */}
                      <p className="relative mb-6 text-xs md:text-sm text-[var(--muted)] leading-relaxed italic">
                        "{testimonial.testimonial}"
                      </p>

                      {/* Author info */}
                      <div className="flex items-center gap-3 md:gap-4 pt-6 border-t border-[var(--glass-border)]">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-[var(--accent)]/20 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--foreground)] text-xs md:text-sm">
                            {testimonial.name}
                          </p>
                          <span className="inline-block mt-1 rounded-full bg-[var(--accent-soft)] px-2 md:px-3 py-0.5 md:py-1 text-xs font-medium text-[var(--accent-deep)]">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--glass-border)] bg-gradient-to-b from-white/80 to-[var(--accent-soft)]/30 px-4 md:px-12 py-12 md:py-16 lg:px-20">
          <div className="mx-auto flex max-w-6xl flex-col md:flex-row flex-wrap items-start justify-between gap-8 md:gap-10">
            <div>
              <span className="text-lg md:text-xl font-bold text-[var(--accent-deep)]">
                RedAxis
              </span>
              <p className="mt-2 max-w-xs text-xs md:text-sm text-[var(--muted)]">
                A platform ensuring no life is lost due to lack of blood.
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-[var(--foreground)]">
                Contact
              </p>
              <p className="mt-1 text-xs md:text-sm text-[var(--muted)]">
                info@redaxis.org · +91 90000 00000
              </p>
            </div>
            <p className="text-xs md:text-sm text-[var(--muted)]">© 2026 RedAxis</p>
          </div>
        </footer>
      </main>
    </>
  );
}
