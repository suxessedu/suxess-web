import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Requests from "./pages/Requests";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import AdminSetup from "./pages/AdminSetup";
import Dashboard from "./pages/Dashboard";
import ActivityLogs from "./pages/ActivityLogs";
import Analytics from "./pages/Analytics";
import LessonLogs from "./pages/LessonLogs";

const isAuthenticated = () => {
  try {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const user = isAuthenticated();
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "requests", element: <Requests /> },
      { path: "teachers", element: <Teachers /> },
      { path: "parents", element: <Parents /> },
      { path: "logs", element: <ActivityLogs /> },
      { path: "lesson-logs", element: <LessonLogs /> },
      { path: "analytics", element: <Analytics /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/setup-admin", element: <AdminSetup /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
