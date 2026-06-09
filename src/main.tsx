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
import UserRoute from "./components/common/UserRoute";
import UserLayout from "./components/common/UserLayout";
import DashboardOverview from "./components/common/DashboardOverview";
import Assessments from "./pages/user/Assessments";
import TakeAssessment from "./pages/user/TakeAssessment";
import ResultPage from "./pages/user/ResultPage";
import MyResults from "./pages/user/MyResults";
import ProfilePage from "./pages/Profile";
import Tests from "./pages/admin/Tests";
import TestDetail from "./pages/admin/TestDetail";
import TakeTest from "./pages/user/TakeTest";
import VerifyCertificate from "./pages/VerifyCertificate";
import NotFound from "./pages/NotFound";
import JobDetailPage from "./pages/JobDetailPage";
import CompanyProfile from "./pages/admin/CompanyProfile";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";

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
  { path: "/verify/:code", element: <VerifyCertificate /> },
  { path: "/jobs/:jobId", element: <JobDetailPage /> },
  {
    path: "/jobs/:id/test",
    element: (
      <UserRoute>
        <TakeTest />
      </UserRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <UserRoute>
        <UserLayout />
      </UserRoute>
    ),
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "applications", element: <Applications /> },
      { path: "applications/:id", element: <ApplicationDetail /> },
      { path: "saved", element: <div>Saved Jobs — coming soon</div> },
      { path: "assessments", element: <Assessments /> },
      { path: "assessments/:id/take", element: <TakeAssessment /> },
      { path: "results/:id", element: <ResultPage /> },
      { path: "my-results", element: <MyResults /> },
      { path: "settings", element: <div>Settings — coming soon</div> },
    ],
  },
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
      { path: "tests", element: <Tests /> },
      { path: "tests/:id", element: <TestDetail /> },
      { path: "company-profile", element: <CompanyProfile /> },
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
  {
    path: "*",
    element: <NotFound />,
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
