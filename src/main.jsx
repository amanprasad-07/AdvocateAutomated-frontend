import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdvocateDashboard from "./pages/advocate/AdvocateDashboard";
import AdvocateMyAppointments from "./pages/advocate/MyAppointments";
import CreateCase from "./pages/advocate/CreateCase";
import AdvocateMyCases from "./pages/advocate/MyCases";

import ClientDashboard from "./pages/client/ClientDashboard";
import BookAppointment from "./pages/client/BookAppointment";
import MyAppointments from "./pages/client/MyAppointments";
import ClientMyCases from "./pages/client/MyCases";

import JuniorDashboard from "./pages/junior/JuniorDashboard";

import "./index.css";

const router = createBrowserRouter([
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
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
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
    path: "/client/my-cases",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientMyCases />
      </ProtectedRoute>
    ),
  },
  {
    path: "/junior_advocate",
    element: (
      <ProtectedRoute allowedRoles={["junior_advocate"]}>
        <JuniorDashboard />
      </ProtectedRoute>
    ),
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);