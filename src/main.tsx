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
import SubscriptionPlans from "./pages/dev/SubscriptionPlans";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Postings from "./pages/admin/Postings";
import JobDetail from "./pages/admin/JobDetail";
import Applicants from "./pages/admin/Applicants";
import VerifyEmail from "./pages/VerifyEmail";
import UserRoute from "./components/common/UserRoute";
import UserLayout from "./components/common/UserLayout";
import DashboardOverview from "./components/common/DashboardOverview";
import Jobs from "./pages/Jobs";
import Home from "./pages/Home";

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);