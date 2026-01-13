import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

/* ---------------- Public Pages ---------------- */
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

/* ---------------- Admin Pages ---------------- */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPendingApprovals from "./pages/admin/AdminPendingApprovals";
import VerifiedAdvocates from "./pages/admin/VerifiedAdvocates";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCases from "./pages/admin/AdminCases";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminEvidence from "./pages/admin/AdminEvidence";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

/* ---------------- Advocate Pages ---------------- */
import AdvocateDashboard from "./pages/advocate/AdvocateDashboard";
import AdvocateMyAppointments from "./pages/advocate/MyAppointments";
import CreateCase from "./pages/advocate/CreateCase";
import AdvocateMyCases from "./pages/advocate/MyCases";
import AdvocateCaseDetails from "./pages/advocate/AdvocateCaseDetails";
import AdvocateAddTask from "./pages/advocate/AdvocateAddTask";
import AdvocateCaseTasks from "./pages/advocate/AdvocateCaseTasks";
import AdvocateCaseEvidence from "./pages/advocate/AdvocateCaseEvidence";
import AdvocateAddEvidence from "./pages/advocate/AdvocateAddEvidence";
import AdvocateCreateBill from "./pages/advocate/AdvocateCreateBill";
import AdvocateCaseBills from "./pages/advocate/AdvocateCaseBills";
import VerificationProfile from "./pages/advocate/VerificationProfile";

/* ---------------- Client Pages ---------------- */
import ClientDashboard from "./pages/client/ClientDashboard";
import BookAppointment from "./pages/client/BookAppointment";
import MyAppointments from "./pages/client/MyAppointments";
import PastAppointments from "./pages/client/PastAppointments";
import ClientMyCases from "./pages/client/MyCases";
import ClientCaseDetails from "./pages/client/ClientCaseDetails";

/* ---------------- Junior Advocate Pages ---------------- */
import JuniorDashboard from "./pages/junior/JuniorDashboard";
import JuniorMyCases from "./pages/junior/JuniorMyCases";
import JuniorCaseDetails from "./pages/junior/JuniorCaseDetails";
import JuniorCaseTasks from "./pages/junior/JuniorCaseTasks";
import JuniorAddEvidence from "./pages/junior/JuniorAddEvidence";
import JuniorCaseEvidence from "./pages/junior/JuniorCaseEvidence";
import JuniorVerificationProfile from "./pages/junior/JuniorVerificationProfile";

/* ---------------- Global Styles ---------------- */
import "./index.css";

/**
 * Application Router Configuration
 *
 * Defines all application routes with role-based
 * access control enforced via ProtectedRoute.
 *
 * Public routes:
 * - Landing
 * - Login
 * - Register
 *
 * Protected routes:
 * - Admin
 * - Advocate
 * - Client
 * - Junior Advocate
 */
const router = createBrowserRouter([
  /* ---------------- Public Routes ---------------- */
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  /* ---------------- Admin Routes ---------------- */
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/pending-approvals",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPendingApprovals />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/verified",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <VerifiedAdvocates />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/cases",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminCases />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/payments",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/evidence",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminEvidence />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/audit-logs",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminAuditLogs />
      </ProtectedRoute>
    ),
  },

  /* ---------------- Advocate Routes ---------------- */
  {
    path: "/advocate",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-appointments",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateMyAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/create-case/:appointmentId",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <CreateCase />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateMyCases />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateCaseDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/add-task",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateAddTask />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/tasks",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateCaseTasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/evidence",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateCaseEvidence />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/add-evidence",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateAddEvidence />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/create-bill",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateCreateBill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/advocate/my-cases/:caseId/bills",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <AdvocateCaseBills />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verification/profile",
    element: (
      <ProtectedRoute allowedRoles={["advocate"]}>
        <VerificationProfile />
      </ProtectedRoute>
    ),
  },

  /* ---------------- Client Routes ---------------- */
  {
    path: "/client",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/book-appointment",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <BookAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/my-appointments",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <MyAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/past-appointments",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <PastAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/my-cases",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientMyCases />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/my-cases/:caseId",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientCaseDetails />
      </ProtectedRoute>
    ),
  },

  /* ---------------- Junior Advocate Routes ---------------- */
  {
    path: "/junior_advocate",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/cases",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorMyCases />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/cases/:caseId",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorCaseDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/cases/:caseId/tasks",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorCaseTasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/cases/:caseId/add-evidence",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorAddEvidence />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/cases/:caseId/evidence",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorCaseEvidence />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate/verification/profile",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorVerificationProfile />
      </ProtectedRoute>
    ),
  },
]);

/**
 * Application Bootstrap
 *
 * Renders the React application and wraps it with:
 * - ThemeProvider for global theming
 * - AuthProvider for authentication and authorization
 * - RouterProvider for client-side routing
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);
