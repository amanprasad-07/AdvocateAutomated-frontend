import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Neutral Status Styles ---------- */
const STATUS_STYLES = {
  open: "border-border bg-surface",
  in_progress: "border-border bg-surface",
  closed: "border-border bg-surface",
};

const JuniorMyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              [null, "All"],
              ["open", "Open"],
              ["in_progress", "In Progress"],
              ["closed", "Closed"],
            ].map(([key, label]) => (
              <button
                key={label}
                onClick={() => setFilter(key)}
                className={`
                  rounded-lg border border-border px-3 py-1 text-sm
                  ${
                    statusParam === key
                      ? "bg-primary text-white"
                      : "text-text-secondary"
                  }
                  hover:bg-surfaceElevated hover:text-text-primary
                  transition-colors
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ---------- Empty State ---------- */}
          {filteredCases.length === 0 && (
            <p className="text-sm text-muted">
              No cases match this filter.
            </p>
          )}

          {/* ---------- Case List ---------- */}
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c._id}
                onClick={() =>
                  navigate(
                    `/junior_advocate/cases/${c._id}`
                  )
                }
                className={`
                  cursor-pointer rounded-xl border p-4
                  ${STATUS_STYLES[c.status] || STATUS_STYLES.open}
                  transition hover:bg-surfaceElevated
                `}
              >
                <p className="font-medium text-text-primary">
                  {c.caseNumber}
                </p>

                <p className="text-sm text-text-secondary">
                  {c.title}
                </p>

                <p className="mt-2 text-sm capitalize text-text-secondary">
                  <strong>Status:</strong>{" "}
                  {c.status.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default JuniorMyCases;
