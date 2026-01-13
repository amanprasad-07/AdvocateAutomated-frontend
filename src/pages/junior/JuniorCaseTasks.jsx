import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
// Maps task status to left-border styling for quick visual identification
const STATUS_STYLES = {
  pending: "border-l-border",
  in_progress: "border-l-warning",
  completed: "border-l-success",
};

const JuniorCaseTasks = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // URL search params for status-based filtering
  const [searchParams, setSearchParams] = useSearchParams();

  // Stores tasks assigned to the junior advocate for this case
  const [tasks, setTasks] = useState([]);

  // Loading state while fetching tasks
  const [loading, setLoading] = useState(true);

  // Error message for fetch/update failures
  const [error, setError] = useState("");

  // Tracks which task is currently being updated to prevent double actions
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  /**
   * Fetch tasks related to the current case.
   * Access is restricted by backend role and assignment rules.
   */
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

  // Load tasks on initial render and when case ID changes
  useEffect(() => {
    fetchTasks();
  }, [caseId]);

  /* ---------- Filters ---------- */
  // Current status filter from query params
  const statusParam = searchParams.get("status");

  // Apply status-based filtering if active
  const filteredTasks = statusParam
    ? tasks.filter((t) => t.status === statusParam)
    : tasks;

  // Update URL search params to reflect selected filter
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  /**
   * Update task status.
   * Prevents concurrent updates by locking on updatingTaskId.
   */
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
  // Display spinner while tasks are loading
  if (loading) {
    return (
      <DashboardLayout title="Case Tasks">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
  // Display error message if task fetch/update fails
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
        { label: "Dashboard", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
        {
          label: "Back to Case",
          path: `/junior_advocate/cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Filters ---------- */}
      {/* Allows filtering tasks by current progress status */}
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
      {/* Displayed when no tasks match the current filter */}
      {filteredTasks.length === 0 && (
        <p className="text-text-muted">
          No tasks match this filter.
        </p>
      )}

      {/* ---------- Task List ---------- */}
      {/* Render each task with status-aware actions */}
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

            {/* Optional task description */}
            {task.description && (
              <p className="mt-1 text-sm text-text-muted">
                {task.description}
              </p>
            )}

            {/* Task metadata */}
            <div className="mt-2 space-y-1 text-sm text-text-secondary">
              <p className="capitalize">
                <strong>Status:</strong>{" "}
                {task.status.replace(/_/g, " ")}
              </p>
            </div>

            {/* ---------- Actions ---------- */}
            {/* Status transitions allowed only in valid order */}
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
