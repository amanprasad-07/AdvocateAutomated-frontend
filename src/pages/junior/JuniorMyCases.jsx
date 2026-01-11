import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles ---------- */
const STATUS_STYLES = {
  open: "border-l-primary text-primary",
  in_progress: "border-l-warning text-warning",
  closed: "border-l-success text-success",
};

const JuniorMyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  /* ---------- Filter Logic ---------- */
  const statusParam = searchParams.get("status");

  const filteredCases = statusParam
    ? cases.filter((c) =>
      statusParam.split(",").includes(c.status)
    )
    : cases;

  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <DashboardLayout
      title="My Assigned Cases"
      navItems={[
        { label: "Home", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          <div className="mb-4 flex flex-row flex-wrap gap-2 justify-center lg:justify-normal">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${!statusParam
                  ? "bg-primary text-white"
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
                ${statusParam === "open"
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
                ${statusParam === "in_progress"
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
                ${statusParam === "closed"
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
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {filteredCases.length === 0 && (
            <p className="text-text-muted">
              No cases match this filter.
            </p>
          )}

          {/* ---------- Case List ---------- */}
          <div className="space-y-3">
            {filteredCases.map(c => (
              <div
                key={c._id}
                onClick={() =>
                  navigate(`/junior_advocate/cases/${c._id}`)
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
                    <strong>Client:</strong>{" "}
                    {c.client?.name} ({c.client?.email})
                  </p>

                  <p className="capitalize">
                    <strong>Type:</strong> {c.caseType}
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

export default JuniorMyCases;
