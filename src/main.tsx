import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/admin.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import RegisterCompany from "./pages/RegisterCompany";
import Login from "./pages/Login";
import AssessmentList from "./pages/dev/AssessmentList";
import AssessmentDetail from "./pages/dev/AssessmentDetail";
import DevRoute from "./components/dev/DevRoute";
import DevLayout from "./components/dev/DevLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Postings from "./pages/admin/Postings";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/register/company", element: <RegisterCompany /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "postings", element: <Postings /> },
    ],
  },
  {
    path: "/dev",
    element: (
      <DevRoute>
        <DevLayout />
      </DevRoute>
    ),
    children: [
      { path: "assessments", element: <AssessmentList /> },
      { path: "assessments/:id", element: <AssessmentDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
