// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MapPin, Clock, Droplets, Filter } from "lucide-react";
// import { Nav } from "@/components/layout/Nav";
// import { GlassCard } from "@/components/ui/GlassCard";
// import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
// import { globalRequests, filterOptions } from "@/data/ngo";

// const urgencyStyles: Record<string, string> = {
//   critical: "bg-[var(--accent)]/20 text-[var(--accent-deep)]",
//   high: "bg-amber-500/20 text-amber-700",
//   medium: "bg-sky-500/20 text-sky-700",
// };

// export default function NGOPage() {
//   const [activeFilter, setActiveFilter] = useState("all");

//   const filtered =
//     activeFilter === "all"
//       ? globalRequests
//       : globalRequests.filter((r) => r.urgency === activeFilter);

//   return (
//     <>
//       <Nav />
//       <main
//         className="min-h-screen px-6 pt-28 pb-20 md:px-12 lg:px-20"
//         style={{ background: "var(--gradient-hero)" }}
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mx-auto max-w-6xl"
//         >
//           <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
//             Global requests
//           </h1>
//           <p className="mt-2 text-[var(--muted)]">
//             Live feed of blood requests across the network
//           </p>

//           <div className="mt-12 grid gap-8 lg:grid-cols-3">
//             {/* Filters + timeline feed */}
//             <div className="lg:col-span-2">
//               <div className="flex flex-wrap items-center gap-2">
//                 <Filter className="h-4 w-4 text-[var(--muted)]" />
//                 {filterOptions.map((opt) => (
//                   <button
//                     key={opt.id}
//                     type="button"
//                     onClick={() => setActiveFilter(opt.id)}
//                     className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
//                       activeFilter === opt.id
//                         ? "bg-[var(--accent)] text-white"
//                         : "bg-white/70 text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
//                     }`}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>

//               <div className="mt-8 space-y-6">
//                 <AnimatePresence mode="wait">
//                   {filtered.length === 0 ? (
//                     <motion.p
//                       key="empty"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="text-[var(--muted)]"
//                     >
//                       No requests match this filter.
//                     </motion.p>
//                   ) : (
//                     filtered.map((req, i) => (
//                       <motion.div
//                         key={req.id}
//                         initial={{ opacity: 0, y: 12 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -8 }}
//                         transition={{ delay: i * 0.04 }}
//                       >
//                         <GlassCard delay={0}>
//                           <div className="flex flex-col sm:flex-row gap-4 p-5">
//                             <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
//                               <ImagePlaceholder
//                                 aspectRatio="square"
//                                 label="Hospital"
//                                 className="h-full w-full rounded-xl"
//                               />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <div className="flex flex-wrap items-center gap-2">
//                                 <h3 className="font-semibold text-[var(--foreground)]">
//                                   {req.hospital}
//                                 </h3>
//                                 <span
//                                   className={`rounded-lg px-2 py-0.5 text-xs font-medium ${urgencyStyles[req.urgency]}`}
//                                 >
//                                   {req.urgency}
//                                 </span>
//                               </div>
//                               <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
//                                 <span className="flex items-center gap-1">
//                                   <Droplets className="h-3.5 w-3.5" />
//                                   {req.bloodType} · {req.units} unit
//                                   {req.units > 1 ? "s" : ""}
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                   <MapPin className="h-3.5 w-3.5" />
//                                   {req.location}
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                   <Clock className="h-3.5 w-3.5" />
//                                   {req.timeAgo}
//                                 </span>
//                               </div>
//                               <button
//                                 type="button"
//                                 className="mt-3 rounded-lg bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent)] hover:text-white"
//                               >
//                                 Respond
//                               </button>
//                             </div>
//                           </div>
//                         </GlassCard>
//                       </motion.div>
//                     ))
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* Map / image placeholder */}
//             <div>
//               <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
//                 Map
//               </h2>
//               <p className="mt-1 text-sm text-[var(--muted)]">
//                 Request locations
//               </p>
//               <div className="mt-6">
//                <img
//   src="https://i.pinimg.com/736x/5b/6b/bf/5b6bbf21c1f8b8c9fb4aa260273f5f16.jpg"
//                   aspectRatio="video"
//                   label="Map view"
//                   className="rounded-[var(--radius-lg)] min-h-[280px]"
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </main>
//     </>
//   );
// }