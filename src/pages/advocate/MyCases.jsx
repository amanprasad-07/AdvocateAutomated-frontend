import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdvocateMyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data.data); // backend returns { success, count, data }
      } catch (err) {
        setError("Failed to load cases");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <DashboardLayout
      title="My Cases"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
      ]}
    >
      {loading && <p>Loading cases...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && cases.length === 0 && (
        <p>No cases assigned yet.</p>
      )}

      {!loading && cases.length > 0 && (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c._id}
              className="border border-border p-4 rounded"
            >
              <p>
                <strong>Case Number:</strong> {c.caseNumber}
              </p>
              <p>
                <strong>Title:</strong> {c.title}
              </p>
              <p>
                <strong>Client:</strong>{" "}
                {c.client?.name} ({c.client?.email})
              </p>
              <p>
                <strong>Type:</strong>{" "}
                <span className="capitalize">{c.caseType}</span>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{c.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvocateMyCases;
