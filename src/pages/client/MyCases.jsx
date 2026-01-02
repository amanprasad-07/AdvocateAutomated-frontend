import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const ClientMyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data.data); // { success, count, data }
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
        { label: "Home", path: "/client" },
        { label: "Book Appointment", path: "/client/book-appointment" },
        { label: "My Appointments", path: "/client/my-appointments" },
        { label: "My Payments", path: "/client/my-payments" },
      ]}
    >
      {loading && <p>Loading cases...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && cases.length === 0 && (
        <p>No cases created for you yet.</p>
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
                <strong>Advocate:</strong>{" "}
                {c.advocate?.name} ({c.advocate?.email})
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

export default ClientMyCases;
