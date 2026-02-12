"use client";

import { motion } from "framer-motion";
import { Heart, CheckCircle2, AlertCircle, Droplet } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function DonorGuidePage() {
  const sections = [
    {
      id: 1,
      title: "Who Can Donate Blood?",
      icon: <Heart className="h-6 w-6" />,
      content: [
        "You are 18–55 years old",
        "Your weight is 50 kg or more",
        "You are in good physical health",
        "You have not donated blood in the last 3 months",
        "You are free from major illnesses or infections",
      ],
    },
    {
      id: 2,
      title: "Before Donating Blood",
      icon: <Droplet className="h-6 w-6" />,
      content: [
        "Get proper sleep (6–8 hours)",
        "Eat a light and healthy meal",
        "Drink plenty of water",
        "Avoid alcohol, smoking, or heavy exercise",
        "Carry a valid ID proof",
      ],
    },
    {
      id: 3,
      title: "During the Donation Process",
      icon: <CheckCircle2 className="h-6 w-6" />,
      content: [
        "Registration and basic health check",
        "Hemoglobin and blood pressure test",
        "Blood collection (takes 8–10 minutes)",
        "Rest and refreshment",
        "The process is safe, painless, and supervised by professionals",
      ],
    },
    {
      id: 4,
      title: "After Donating Blood",
      icon: <Heart className="h-6 w-6" />,
      content: [
        "Rest for 10–15 minutes",
        "Drink fluids and juice",
        "Avoid heavy lifting for 24 hours",
        "Keep the bandage for a few hours",
        "Eat iron-rich food",
      ],
    },
    {
      id: 5,
      title: "Benefits of Blood Donation",
      icon: <CheckCircle2 className="h-6 w-6" />,
      content: [
        "Saves up to 3 lives",
        "Improves blood circulation",
        "Free basic health check",
        "Reduces risk of certain diseases",
        "Gives a strong sense of social responsibility",
      ],
    },
  ];

  const myths = [
    {
      myth: "Blood donation causes weakness",
      fact: "The body replaces donated blood quickly",
    },
    {
      myth: "Blood donation is painful",
      fact: "Only a small needle prick is felt",
    },
    {
      myth: "Donating blood is unsafe",
      fact: "All equipment is sterile and disposable",
    },
  ];

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
          className="mx-auto max-w-4xl"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <Droplet className="h-16 w-16 text-[var(--accent)]" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              Blood Donation Guide
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Everything you need to know to become a life-saving donor
            </p>
          </div>

          {/* Guide Sections */}
          <div className="mt-16 space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <GlassCard delay={0.05 * i}>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[var(--accent)]">{section.icon}</div>
                      <h2 className="text-2xl font-bold text-[var(--foreground)]">
                        {section.id}. {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[var(--muted)]"
                        >
                          <CheckCircle2 className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Myths Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-8">
              Common Myths (Busted)
            </h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {myths.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  <GlassCard delay={0.35 + i * 0.1}>
                    <div className="p-6">
                      <div className="mb-4 flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="font-semibold text-[var(--foreground)]">
                          {item.myth}
                        </p>
                      </div>
                      <div className="ml-9 flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[var(--muted)]">
                          {item.fact}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Emergency Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-16"
          >
            <GlassCard delay={0.65}>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-[var(--accent)]" />
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    7. Emergency Situations
                  </h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[var(--muted)]">
                    <CheckCircle2 className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <span>Hospitals and NGOs can raise real-time requests</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--muted)]">
                    <CheckCircle2 className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <span>Registered donors are notified instantly</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--muted)]">
                    <CheckCircle2 className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <span>Faster response saves lives</span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-16 text-center"
          >
            <GlassCard delay={0.75}>
              <div className="p-8 md:p-12">
                <Heart className="h-12 w-12 text-[var(--accent)] mx-auto mb-4" />
                <blockquote className="text-2xl font-bold text-[var(--foreground)] mb-6">
                  "A single blood donation can be the reason someone gets a second chance at life."
                </blockquote>
                <div className="space-y-3 text-lg text-[var(--muted)]">
                  <p>Become a donor today.</p>
                  <p className="text-[var(--accent)] font-semibold">
                    Your blood can save lives.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-12 flex justify-center gap-4"
          >
            <a
              href="/donor"
              className="rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            >
              Become a Donor
            </a>
            {/* <a
              href="/"
              className="rounded-xl border border-[var(--glass-border)] bg-white/70 px-8 py-3 text-sm font-semibold text-[var(--accent-deep)] backdrop-blur transition hover:bg-white/90"
            >
              Back Home
            </a> */}
            
<Link
  href="/"
  className="rounded-xl border border-[var(--glass-border)] bg-white/70 px-8 py-3 text-sm font-semibold text-[var(--accent-deep)] backdrop-blur transition hover:bg-white/90"
>
  Back Home
</Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
