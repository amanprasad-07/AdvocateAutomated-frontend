import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdvocateAddTask = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [juniors, setJuniors] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchJuniors = async () => {
      const res = await api.get("/users/getJuniors");
      setJuniors(res.data.data);
    };

    fetchJuniors();
  }, []);

  const handleSubmit = async () => {
    if (!title || !assignedTo) return;

    const payload = {
      title,
      caseId,
      assignedTo,
    };

    if (description) payload.description = description;
    if (priority) payload.priority = priority;
    if (dueDate) payload.dueDate = dueDate;

    await api.post("/tasks", payload);

    navigate(`/advocate/my-cases/${caseId}`);
  };

  return (
    <DashboardLayout
      title="Add Task"
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
      <div className="mx-auto sm:mx-0 max-w-md space-y-5">
        {/* ---------- Task Title ---------- */}
        <input
          type="text"
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            placeholder:text-text-muted
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        />

        {/* ---------- Description ---------- */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            placeholder:text-text-muted
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        />

        {/* ---------- Assign Junior ---------- */}
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        >
          <option value="">Select Junior Advocate *</option>
          {juniors.map((j) => (
            <option key={j._id} value={j._id}>
              {j.name}
            </option>
          ))}
        </select>

        {/* ---------- Priority ---------- */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* ---------- Due Date ---------- */}
        <input
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => setDueDate(e.target.value)}
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        />

        {/* ---------- Actions ---------- */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            className="
              rounded-lg
              bg-primary
              px-4 py-2
              text-sm font-medium text-white
              hover:bg-primary-hover
              transition-colors
            "
          >
            Create Task
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              rounded-lg
              border border-border
              px-4 py-2
              text-sm text-text-secondary
              hover:bg-surface-elevated
              hover:text-text-primary
              transition-colors
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvocateAddTask;
