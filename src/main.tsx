import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import DevLayout from "./components/dev/DevLayout";
import DevRoute from "./components/dev/DevRoute";
import "./index.css";
import Applicants from "./pages/admin/Applicants";
import JobDetail from "./pages/admin/JobDetail";
import Postings from "./pages/admin/Postings";
import AssessmentDetail from "./pages/dev/AssessmentDetail";
import AssessmentList from "./pages/dev/AssessmentList";
import SubscriptionPlans from "./pages/dev/SubscriptionPlans";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterCompany from "./pages/RegisterCompany";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import "./styles/admin.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/register/company", element: <RegisterCompany /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/jobs", element: <Jobs /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "postings", element: <Postings /> },
      { path: "postings/:id", element: <JobDetail /> },
      { path: "applicants", element: <Applicants /> },
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
      { path: "subscription-plans", element: <SubscriptionPlans /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);