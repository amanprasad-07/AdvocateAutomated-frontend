import DashboardLayout from "../../components/DashboardLayout";

const AdvocateDashboard = () => {
  const navItems = [
    { label: "My Cases", path: "/advocate/my-cases" },
    { label: "Appointments", path: "/advocate/my-appointments" },
    { label: "Tasks", path: "#" },
    { label: "Evidence", path: "#" },
    { label: "Payments", path: "#" },
  ];

  return (
    <DashboardLayout title="Advocate Dashboard" navItems={navItems}>
      <p>
        Welcome, Advocate. From here you can manage cases, appointments,
        evidence, and junior advocates.
      </p>
    </DashboardLayout>
  );
};

export default AdvocateDashboard;
