// ---------- Core React & Router imports ----------
import { Link } from "react-router-dom";
import { useState } from "react";

// ---------- Shared UI components ----------
import ThemeToggle from "../../components/ThemeToggle";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";

// ---------- Assets ----------
import heroImage from "../../assets/hero001.webp";

const Landing = () => {
  // Controls mobile navigation drawer state
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text-primary">

      {/* ================= Header / Navigation ================= */}
      <header
        className="
          sticky top-0 z-20
          flex items-center justify-between
          border-b border-border
          bg-bg px-8 py-4
          backdrop-blur
        "
      >
        {/* Brand / Logo */}
        <h1 className="text-xl font-semibold  text-primary tracking-wide">
          Advocate Automated
        </h1>

        {/* ---------- Desktop Navigation ---------- */}
        <nav className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="
              rounded-lg border border-border
              px-4 py-2 text-sm font-medium
              text-text-secondary
              hover:bg-surfaceElevated hover:text-text-primary
              transition-colors
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              rounded-lg bg-primary px-4 py-2
              text-sm font-medium text-white
              hover:opacity-90 transition
            "
          >
            Register
          </Link>

          {/* Dark / Light theme toggle */}
          <ThemeToggle />
        </nav>

        {/* ---------- Mobile Hamburger Button ---------- */}
        <button
          onClick={() => setMenuOpen(true)}
          className="
            sm:hidden
            flex items-center justify-center
            w-10 h-10
            rounded-lg border border-border
            text-text-secondary
            hover:bg-surfaceElevated hover:text-text-primary
            transition-colors
          "
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* ================= Mobile Slide-in Menu ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">

          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Side drawer panel */}
          <div
            className="
              absolute top-0 right-0
              w-64 h-full
              bg-surface border-l border-border
              p-6
              flex flex-col gap-4
              animate-slideInRight
            "
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-primary">
                Menu
              </span>

              <div className="flex">
                <ThemeToggle />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="
                    ml-3 px-3
                    rounded-lg border border-border
                    text-text-secondary
                    hover:text-text-primary
                  "
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Drawer links */}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-lg border border-border
                px-4 py-2 text-sm font-medium
                text-text-secondary
                hover:bg-surfaceElevated hover:text-text-primary
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-lg bg-primary px-4 py-2
                text-sm font-medium text-white
                hover:opacity-90
              "
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* ================= Hero Section ================= */}
      <section className="px-8 py-28 text-center relative">

        {/* Background image */}
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover "
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 " />

        <div className="z-10 relative ">
          {/* Hero heading */}
          <h2 className="mx-auto mb-6 max-w-3xl text-3xl sm:text-4xl font-semibold leading-tigh text-white">
            Legal Work. Structured. Transparent.
            <span className="text-primary"> Human.</span>
          </h2>

          {/* Hero description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
            Advocate Automated is a modern legal services platform built to remove
            confusion, delays, and opacity from legal work — connecting clients
            with verified advocates through a system that values clarity,
            accountability, and trust.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="
              rounded-xl border border-primary
              bg-gray-950/70 px-6 py-3
              text-lg font-medium text-primary
              hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-950/95
              transition
            "
            >
              Register as Client
            </Link>

            <Link
              to="/register"
              className="
              rounded-xl border border-border
              px-6 py-3 bg-black/30
              text-lg font-medium text-white
              hover:bg-black/80 hover:shadow-md
              transition
            "
            >
              Join as Advocate
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Why Choose Us ================= */}
      <section className="bg-surface px-8 py-24 dark:bg-dark-surface">
        <h3 className="mb-14 text-center text-2xl font-semibold">
          Why Choose <span className="text-primary">Advocate Automated</span> 
        </h3>

        {/* Feature cards grid */}
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:grid-cols-4 items-stretch">
          {[
            {
              title: "Verified Legal Professionals",
              desc: "Every advocate on our platform goes through structured verification to ensure credibility, experience, and accountability.",
            },
            {
              title: "Transparency by Design",
              desc: "From case progress to payments, everything is visible, traceable, and documented — no guesswork, no blind trust.",
            },
            {
              title: "Built for Real Legal Work",
              desc: "Designed in collaboration with advocates, the platform reflects how legal work actually happens — not how software imagines it.",
            },
            {
              title: "Client-First Ethics",
              desc: "Clear billing, defined responsibilities, and controlled access ensure clients stay informed without being overwhelmed.",
            },
          ].map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <div
                className="
                  h-full flex flex-col
                  rounded-xl border border-border bg-bg p-6
                  hover:-translate-y-1 hover:shadow-lg
                  transition-transform
                "
              >
                <h4 className="mb-2 text-lg font-semibold">
                  {item.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= Who We Serve ================= */}
      <section className="px-8 py-24">
        <h3 className="mb-14 text-center text-2xl font-semibold">
          Who We Serve
        </h3>

        {/* Audience cards */}
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3 items-stretch">
          {[
            {
              title: "Clients",
              points: [
                "Access to verified legal professionals",
                "Clear visibility into case progress",
                "Transparent and documented billing",
                "Confidential handling of sensitive information",
              ],
            },
            {
              title: "Advocates",
              points: [
                "Engage with informed and serious clients",
                "Structured case handling and communication",
                "Clear documentation and responsibility boundaries",
                "Professional, ethics-first working environment",
              ],
            },
            {
              title: "Law Practices & Chambers",
              points: [
                "Organised case and client management",
                "Clear delegation and accountability",
                "Consistent communication standards",
                "Support for compliant and ethical operations",
              ],
            },
          ].map((group, index) => (
            <ScrollReveal key={group.title} y={60} delay={index * 0.12}>
              <div
                className="
                  h-full flex flex-col
                  rounded-xl border border-border bg-surface p-6
                  hover:-translate-y-1 hover:shadow-lg
                  transition-transform
                "
              >
                <h4 className="mb-4 text-lg font-semibold">
                  {group.title}
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {group.points.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= Trust Section ================= */}
      <section className="bg-surface px-8 py-20 dark:bg-dark-surface">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Built on Trust, Accountability, and Ethics
          </h3>
          <p className="text-text-secondary">
            Legal work demands trust. That’s why <span className="text-primary">Advocate Automated</span> is designed
            with clear accountability, role-based access, audit trails, and
            ethical safeguards — ensuring every action is intentional, visible,
            and responsible.
          </p>
        </div>
      </section>

      {/* ================= Final CTA ================= */}
      <section className="px-8 py-24 text-center">
        <h3 className="mb-6 text-2xl font-semibold">
          A Better Way to Experience Legal Services
        </h3>

        <Link
          to="/register"
          className="
            inline-block rounded-xl bg-primary px-8 py-3
            text-lg font-medium text-white
            hover:opacity-90 transition
          "
        >
          Create an Account
        </Link>
      </section>

      {/* ================= Footer ================= */}
      <Footer />
    </div>
  );
};

export default Landing;
