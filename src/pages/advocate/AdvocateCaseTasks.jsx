import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
const STATUS_STYLES = {
  pending: "border-l-border",
  in_progress: "border-l-warning",
  completed: "border-l-success",
};

const AdvocateCaseTasks = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/case/${caseId}`);
        setTasks(res.data.data || []);
      } catch {
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [caseId]);

  /* ---------- Filters ---------- */
  const statusParam = searchParams.get("status");

  const filteredTasks = statusParam
    ? tasks.filter((t) => t.status === statusParam)
    : tasks;

  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <DashboardLayout
      title="Case Tasks"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        {
          label: "Back to Case",
          path: `/advocate/my-cases/${caseId}`,
        },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              [null, "All"],
              ["pending", "Pending"],
              ["in_progress", "In Progress"],
              ["completed", "Completed"],
            ].map(([key, label]) => (
              <button
                key={key || "all"}
                onClick={() => setFilter(key)}
                className={`
                  rounded-lg border border-border
                  px-3 py-1 text-sm
                  ${
                    statusParam === key || (!key && !statusParam)
                      ? "bg-surfaceElevated text-text-primary"
                      : "text-text-secondary hover:bg-surfaceElevated"
                  }
                  transition-colors
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ---------- Error ---------- */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {filteredTasks.length === 0 && (
            <p className="text-text-muted">
              No tasks match this filter.
            </p>
          )}

          {/* ---------- Task List ---------- */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`
                  rounded-xl border border-border
                  border-l-4
                  bg-surface
                  p-4
                  ${STATUS_STYLES[task.status] || ""}
                `}
              >
                <p className="font-medium text-text-primary">
                  {task.title}
                </p>

                <div className="mt-1 space-y-1 text-sm text-text-secondary">
                  <p>
                    <strong>Assigned to:</strong>{" "}
                    {task.assignedTo?.name || "N/A"}
                  </p>

                  {task.dueDate && (
                    <p>
                      <strong>Due:</strong>{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <p className="capitalize">
                    <strong>Status:</strong>{" "}
                    <span className="font-medium">
                      {task.status.replace(/_/g, " ")}
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

export default AdvocateCaseTasks;
