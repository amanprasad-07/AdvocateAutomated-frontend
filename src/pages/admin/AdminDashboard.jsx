import DashboardLayout from "../../components/DashboardLayout";

const AdminDashboard = () => {
  const navItems = [
    { label: "Dashboard Overview", path: "#" },
    { label: "Manage Advocates", path: "#" },
    { label: "Approve Registrations", path: "#" },
    { label: "Payments", path: "#" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <p>
        Welcome, Admin. This dashboard allows you to manage advocates,
        approvals, and system-level activities.
      </p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
