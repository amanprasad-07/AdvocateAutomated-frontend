import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const FILE_TYPE_BADGE = {
  document: "text-blue-600",
  image: "text-green-600",
  audio: "text-purple-600",
  video: "text-orange-600",
  other: "text-gray-600",
};

const AdminEvidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvidence = async () => {
    const res = await api.get("/evidence");
    setEvidence(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  return (
    <DashboardLayout
      title="Evidence Audit"
      navItems={[
        { label: "Dashboard", path: "/admin" },
        { label: "Pending Approvals", path: "/admin/pending-approvals" },
        { label: "Verified Advocates", path: "/admin/verified" },
        { label: "All Users", path: "/admin/users" },
        { label: "Cases (Read Only)", path: "/admin/cases" },
        { label: "Payments", path: "/admin/payments" },
        { label: "Evidence", path: "/admin/evidence" },
        { label: "Audit Logs", path: "/admin/audit-logs" },
      ]}
    >
      {loading && (
        <p className="text-sm text-muted">
          Loading evidence records…
        </p>
      )}

      {!loading && evidence.length === 0 && (
        <p className="text-sm text-muted">
          No evidence has been uploaded yet.
        </p>
      )}

      {!loading && evidence.length > 0 && (
        <div className="space-y-3">
          {evidence.map((e) => (
            <div
              key={e._id}
              className="
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-text-primary">
                    {e.title}
                  </p>

                  <p className="mt-0.5 text-sm text-text-secondary">
                    Case #{e.case?.caseNumber} • {e.case?.title}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium capitalize ${FILE_TYPE_BADGE[e.fileType] || "text-muted"
                    }`}
                >
                  {e.fileType}
                </span>
              </div>

              {/* Metadata */}
              <div className="mt-3 text-xs text-muted space-y-0.5">
                <p>
                  Uploaded by: {e.uploadedBy?.name || "N/A"} (
                  {e.uploadedBy?.role?.replace("_", " ")})
                </p>
                <p>
                  Uploaded on{" "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action */}
              <div className="mt-3">
                <a
                  href={`http://localhost:5000/${e.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-block rounded-lg border border-border
                    px-3 py-1.5 text-sm
                    text-text-secondary
                    hover:bg-surface-elevated hover:text-text-primary
                    transition-colors
                  "
                >
                  Download file
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminEvidence;
