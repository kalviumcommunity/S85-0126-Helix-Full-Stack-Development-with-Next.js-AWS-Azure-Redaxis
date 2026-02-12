"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Menu, X } from "lucide-react";

type UserRole = "DONOR" | "HOSPITAL" | "NGO";

type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
} | null;

const baseNavLinks = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const data = await res.json();
        const u = data?.data;

        if (isMounted && u) {
          setUser({ id: u.id, name: u.name, role: u.role });
        } else if (isMounted) {
          setUser(null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    // Server route will clear cookie and redirect to /login
    router.push("/logout");
  };

  const dashboardHref =
    user?.role === "DONOR"
      ? "/donor"
      : user?.role === "HOSPITAL"
        ? "/hospital"
        : user?.role === "NGO"
          ? "/ngo"
          : "/";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-10 md:py-4"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2 md:px-6 md:py-3 backdrop-blur-xl shadow-[var(--shadow-soft)]"
          style={{ maxWidth: "1280px" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight text-[var(--accent-deep)] transition hover:text-[var(--accent)] flex-shrink-0"
          >
            <Droplets className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
            <span className="hidden sm:inline">RedAxis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            {baseNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)]"
              >
                {link.label}
              </Link>
            ))}

            {!loadingUser && !user && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)]"
                >
                  Register
                </Link>
              </>
            )}

            {!loadingUser && user && (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)]"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--accent-soft)] transition flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[var(--accent-deep)]" />
            ) : (
              <Menu className="h-5 w-5 text-[var(--accent-deep)]" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-16 left-4 right-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col">
                {baseNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)] border-b border-[var(--glass-border)] last:border-b-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {!loadingUser && !user && (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)] border-b border-[var(--glass-border)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-3 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}

                {!loadingUser && user && (
                  <>
                    <Link
                      href={dashboardHref}
                      className="px-4 py-3 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)] border-b border-[var(--glass-border)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-deep)] text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
