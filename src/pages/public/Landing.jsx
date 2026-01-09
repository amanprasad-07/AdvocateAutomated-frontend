import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ---------- Header ---------- */}
      <header className="
        sticky top-0 z-10
        flex items-center justify-between
        border-b border-border
        bg-background/80 px-8 py-4
        backdrop-blur
      ">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Advocate Automated
        </h1>

        <nav className="flex items-center gap-3">
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
      </header>

      {/* ---------- Hero ---------- */}
      <section className="px-8 py-28 text-center">
        <h2 className="mx-auto mb-6 max-w-3xl text-4xl font-semibold leading-tight">
          A Structured Legal Workflow  
          <span className="text-primary"> From Appointment to Closure</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary">
          Advocate Automated is a role-based legal case management system
          designed to bring clarity, accountability, and structure to how
          clients, advocates, and junior advocates work together.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="
              rounded-xl border border-border bg-accent px-6 py-3
              text-lg font-medium text-primary
              hover:-translate-y-0.5 hover:shadow-md
              transition
            "
          >
            Register as Client
          </Link>

          <Link
            to="/register"
            className="
              rounded-xl border border-border px-6 py-3
              text-lg font-medium
              hover:bg-surfaceElevated
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

        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-4">
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

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
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
