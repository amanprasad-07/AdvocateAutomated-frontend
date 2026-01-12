import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
const STATUS_STYLES = {
  pending: "border-l-border",
  in_progress: "border-l-warning",
  completed: "border-l-success",
};

const JuniorCaseTasks = () => {
  const { caseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/tasks/case/${caseId}`);
      setTasks(res.data.data || []);
    } catch {
      setError("Failed to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const updateStatus = async (taskId, status) => {
    if (updatingTaskId) return;

    setUpdatingTaskId(taskId);
    setError("");

    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await fetchTasks();
    } catch {
      setError("Failed to update task status.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <DashboardLayout title="Case Tasks">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <DashboardLayout title="Case Tasks">
        <p className="text-sm text-error">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Case Tasks"
      navItems={[
        { label: "Home", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
        {
          label: "Back to Case",
          path: `/junior_advocate/cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Filters ---------- */}
      <div className="mb-4 flex flex-wrap gap-3 justify-center">
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
              ${STATUS_STYLES[task.status] || STATUS_STYLES.pending}
            `}
          >
            <p className="font-medium text-text-primary">
              {task.title}
            </p>

            {task.description && (
              <p className="mt-1 text-sm text-text-muted">
                {task.description}
              </p>
            )}

            <div className="mt-2 space-y-1 text-sm text-text-secondary">
              <p className="capitalize">
                <strong>Status:</strong>{" "}
                {task.status.replace(/_/g, " ")}
              </p>
            </div>

            {/* ---------- Actions ---------- */}
            <div className="mt-3 flex gap-2">
              {task.status === "pending" && (
                <button
                  disabled={updatingTaskId === task._id}
                  onClick={() =>
                    updateStatus(task._id, "in_progress")
                  }
                  className="
                    rounded-lg border border-border
                    px-3 py-1 text-sm
                    text-text-secondary
                    hover:bg-surfaceElevated hover:text-text-primary
                    disabled:opacity-50
                    transition-colors
                  "
                >
                  Start
                </button>
              )}

              {task.status === "in_progress" && (
                <button
                  disabled={updatingTaskId === task._id}
                  onClick={() =>
                    updateStatus(task._id, "completed")
                  }
                  className="
                    rounded-lg border border-border
                    px-3 py-1 text-sm
                    text-text-secondary
                    hover:bg-surfaceElevated hover:text-text-primary
                    disabled:opacity-50
                    transition-colors
                  "
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default JuniorCaseTasks;
