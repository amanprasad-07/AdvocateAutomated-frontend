import DashboardLayout from "../../components/DashboardLayout";

const ClientDashboard = () => {
  const navItems = [
    { label: "Book Appointment", path: "/client/book-appointment" },
    { label: "My Appointment", path: "/client/my-appointments" },
    { label: "My Cases", path: "/client/my-cases" },
    { label: "Payments", path: "#" },
  ];

  return (
    <DashboardLayout title="Client Dashboard" navItems={navItems}>
      <p>
        Welcome, Client. You can book appointments, track your cases,
        and manage payments from here.
      </p>
    </DashboardLayout>
  );
};

export default ClientDashboard;
