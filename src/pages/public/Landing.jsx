import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import heroImage from "../../assets/hero001.webp";


const Landing = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ---------- Header ---------- */}
      <header
        className="
    sticky top-0 z-10
    flex items-center justify-between
    border-b border-border
    bg-background/80 px-8 py-4
    backdrop-blur
  "
      >
        {/* Brand */}
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Advocate Automated
        </h1>

        {/* Desktop Nav */}
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
            Get Started
          </Link>

          <ThemeToggle />
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="
      sm:hidden
      flex items-center justify-center
      w-10 h-10
      rounded-lg border border-border
      text-text-secondary
      hover:bg-surfaceElevated
      hover:text-text-primary
      transition-colors
    "
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu panel */}
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
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-primary">
                Menu
              </span>
              <div className="flex ">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary px-3 ml-3 rounded-lg border border-border text-center"
              >
                ✕
              </button>
            </div>
              
            </div>

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
              Get Started
            </Link>
          </div>
        </div>
      )}


      {/* ---------- Hero ---------- */}
      <section className="px-8 py-28 text-center relative">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover -z-20"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 -z-10" />

        <h2 className="mx-auto mb-6 max-w-3xl text-3xl sm:text-4xl font-semibold leading-tigh text-white">
          A Structured Legal Workflow
          <span className="text-primary"> From Appointment to Closure</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
          Advocate Automated is a role-based legal case management system
          designed to bring clarity, accountability, and structure to how
          clients, advocates, and junior advocates work together.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="
              rounded-xl border border-primary bg-gray-950/70 px-6 py-3
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
              rounded-xl border border-border px-6 py-3 bg-black/30
              text-lg font-medium text-white
              hover:bg-black/80 hover:shadow-md 
              transition
            "
          >
            Join as Advocate
          </Link>
        </div>
      </section>

      {/* ---------- How It Works ---------- */}
      <section className="bg-surface px-8 py-24 dark:bg-dark-surface">
        <h3 className="mb-14 text-center text-2xl font-semibold">
          How the System Works
        </h3>

        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Book Appointment",
              desc: "Clients request appointments with verified advocates through a structured workflow.",
            },
            {
              step: "02",
              title: "Case Creation",
              desc: "Advocates convert approved appointments into formal legal cases.",
            },
            {
              step: "03",
              title: "Execution & Evidence",
              desc: "Tasks, junior assignments, and evidence are tracked in one place.",
            },
            {
              step: "04",
              title: "Billing & Closure",
              desc: "Transparent billing, secure payments, and case lifecycle tracking.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="
                rounded-xl border border-border bg-background p-6
              "
            >
              <p className="mb-2 text-sm font-medium text-primary">
                {item.step}
              </p>
              <h4 className="mb-2 text-lg font-semibold">
                {item.title}
              </h4>
              <p className="text-sm text-text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Role-Based Value ---------- */}
      <section className="px-8 py-24">
        <h3 className="mb-14 text-center text-2xl font-semibold">
          Designed for Every Role
        </h3>

        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "For Clients",
              points: [
                "Verified advocates only",
                "Transparent case status",
                "Clear billing & payments",
                "Secure evidence sharing",
              ],
            },
            {
              title: "For Advocates",
              points: [
                "Appointment control",
                "Case & task delegation",
                "Junior advocate management",
                "Billing & payment tracking",
              ],
            },
            {
              title: "For Junior Advocates",
              points: [
                "Assigned tasks only",
                "Controlled evidence access",
                "Clear responsibilities",
                "Progress-based workflows",
              ],
            },
          ].map((role) => (
            <div
              key={role.title}
              className="
                rounded-xl border border-border bg-surface p-6
              "
            >
              <h4 className="mb-4 text-lg font-semibold">
                {role.title}
              </h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                {role.points.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Trust Section ---------- */}
      <section className="bg-surface px-8 py-20 dark:bg-dark-surface">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Built for Accountability
          </h3>
          <p className="text-text-secondary">
            Role-based access control, audit logs, verification workflows,
            and payment traceability ensure that every action in the system
            is intentional, visible, and accountable.
          </p>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="px-8 py-24 text-center">
        <h3 className="mb-6 text-2xl font-semibold">
          Bring Structure to Legal Work
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

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border px-8 py-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} Advocate Automated. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
