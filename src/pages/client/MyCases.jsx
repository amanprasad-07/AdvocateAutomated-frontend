import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ----------
   Maps case status values to semantic border
   and text colors for quick visual identification.
*/
const STATUS_STYLES = {
  open: "border-l-primary text-primary",
  in_progress: "border-l-warning text-warning",
  closed: "border-l-success text-success",
};

const ClientMyCases = () => {
  // Stores all cases retrieved for the authenticated client
  const [cases, setCases] = useState([]);

  // Controls loading state during initial data fetch
  const [loading, setLoading] = useState(true);

  // Stores API or fetch-related errors
  const [error, setError] = useState("");

  // Router helpers for navigation and URL-based filtering
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetches all cases accessible to the client.
   * Runs once on component mount.
   */
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data.data || []);
      } catch {
        setError("Failed to load cases.");
      } finally {
        // Ensures loading spinner is removed
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  /* ---------- Filters ---------- */

  // Reads the status filter from URL query parameters
  const statusParam = searchParams.get("status");

  /**
   * Filters cases based on selected status.
   * Supports comma-separated values for multi-status filters.
   */
  const filteredCases = statusParam
    ? cases.filter(c =>
        statusParam.split(",").includes(c.status)
      )
    : cases;

  /**
   * Updates URL query params to apply or clear case status filters
   */
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <DashboardLayout
      title="My Cases"
      navItems={[
        { label: "Dashboard", path: "/client" },
        { label: "Book Appointment", path: "/client/book-appointment" },
        { label: "My Appointments", path: "/client/my-appointments" },
        { label: "Past Appointments", path: "/client/past-appointments" },
        { label: "My Cases", path: "/client/my-cases" },
      ]}
    >
      {/* Global loading indicator */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          {/* Status-based case filtering buttons */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  !statusParam
                    ? "bg-primary text-text-primary"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("open")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  statusParam === "open"
                    ? "bg-surfaceElevated text-primary"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Open
            </button>

            <button
              onClick={() => setFilter("in_progress")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  statusParam === "in_progress"
                    ? "bg-surfaceElevated text-warning"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              In Progress
            </button>

            <button
              onClick={() => setFilter("closed")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  statusParam === "closed"
                    ? "bg-surfaceElevated text-success"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Closed
            </button>
          </div>

          {/* ---------- Error ---------- */}
          {/* Displays API or fetch errors */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {/* Shown when no cases match current filter */}
          {filteredCases.length === 0 && (
            <p className="text-text-muted">
              No cases match this filter.
            </p>
          )}

          {/* ---------- Case List ---------- */}
          {/* Renders clickable case cards */}
          <div className="space-y-3">
            {filteredCases.map(c => (
              <div
                key={c._id}
                onClick={() =>
                  navigate(`/client/my-cases/${c._id}`)
                }
                className={`
                  cursor-pointer
                  rounded-xl border border-border
                  border-l-4
                  bg-surface
                  p-4
                  hover:bg-surfaceElevated
                  transition-colors
                  ${STATUS_STYLES[c.status] || ""}
                `}
              >
                <p className="font-semibold text-text-primary">
                  {c.caseNumber} • {c.title}
                </p>

                <div className="mt-1 space-y-1 text-sm text-text-secondary">
                  <p>
                    <strong>Advocate:</strong>{" "}
                    {c.advocate?.name || "Not assigned"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize font-medium">
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ClientMyCases;
