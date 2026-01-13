import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ----------
   Maps task status values to semantic border colors
   for quick visual identification.
------------------------------------------------ */
const STATUS_STYLES = {
  pending: "border-l-border",
  in_progress: "border-l-warning",
  completed: "border-l-success",
};

const AdvocateCaseTasks = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // Navigation helper for programmatic routing
  const navigate = useNavigate();

  // Holds task list for the current case
  const [tasks, setTasks] = useState([]);

  // Indicates loading state while fetching tasks
  const [loading, setLoading] = useState(true);

  // Stores API or processing errors
  const [error, setError] = useState("");

  // URL search params used for task status filtering
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetch tasks associated with the given case ID.
   * Runs on initial mount and whenever caseId changes.
   */
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

  /* ---------- Filters ----------
     Supports filtering tasks by status
     using URL query parameters.
  ----------------------------- */
  const statusParam = searchParams.get("status");

  // Apply status filter if present
  const filteredTasks = statusParam
    ? tasks.filter((t) => t.status === statusParam)
    : tasks;

  /**
   * Updates URL search params to reflect
   * selected task status filter.
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
      title="Case Tasks"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        {
          label: "Back to Case",
          path: `/advocate/my-cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Loading ---------- */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
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
                {/* Task title */}
                <p className="text-sm sm:text-base font-medium text-text-primary">
                  {task.title}
                </p>

                {/* Task metadata */}
                <div className="mt-1 space-y-1 sm:space-y-2 text-sm text-text-secondary">
                  <p>
                    <strong>Assigned to:</strong>{" "}
                    {task.assignedTo?.name || "N/A"}
                  </p>

                  {/* Optional due date */}
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
