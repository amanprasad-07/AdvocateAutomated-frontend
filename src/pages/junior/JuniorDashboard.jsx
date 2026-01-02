import DashboardLayout from "../../components/DashboardLayout";

const JuniorDashboard = () => {
  const navItems = [
    { label: "Assigned Tasks", path: "#" },
    { label: "Case Details", path: "#" },
    { label: "Evidence", path: "#" },
  ];

  return (
    <DashboardLayout title="Junior Advocate Dashboard" navItems={navItems}>
      <p>
        Welcome, Junior Advocate. Here you can view assigned tasks,
        case details, and related evidence.
      </p>
    </DashboardLayout>
  );
};

export default JuniorDashboard;
