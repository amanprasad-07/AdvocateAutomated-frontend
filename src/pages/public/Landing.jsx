import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">
          Advocate Automated
        </h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-secondary hover:underline">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Register
          </Link>
          <ThemeToggle/>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-4xl font-semibold mb-4">
          Smart Legal Case Management
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto mb-8">
          A modern platform for advocates, junior advocates, and clients to
          manage cases, appointments, evidence, and payments — all in one place.
        </p>
        <Link
          to="/register"
          className="bg-accent text-black px-6 py-3 rounded text-lg"
        >
          Get Started
        </Link>
      </section>

      {/* Services */}
      <section className="px-8 py-16 bg-surface dark:bg-dark-surface">
        <h3 className="text-2xl font-semibold text-center mb-10">
          Our Capabilities
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 border border-border rounded">
            <h4 className="font-semibold mb-2">Case Management</h4>
            <p className="text-text-muted">
              Organize legal cases, tasks, and documents with complete clarity.
            </p>
          </div>

          <div className="p-6 border border-border rounded">
            <h4 className="font-semibold mb-2">Client Appointments</h4>
            <p className="text-text-muted">
              Seamless appointment booking and communication with advocates.
            </p>
          </div>

          <div className="p-6 border border-border rounded">
            <h4 className="font-semibold mb-2">Secure Evidence Handling</h4>
            <p className="text-text-muted">
              Upload and manage legal evidence with role-based access control.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center border-t border-border text-text-muted">
        © {new Date().getFullYear()} Advocate Automated. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
