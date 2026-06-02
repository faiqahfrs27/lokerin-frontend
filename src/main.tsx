import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import "./styles/admin.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Register from './pages/Register';
import RegisterCompany from './pages/RegisterCompany';
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Postings from "./pages/admin/Postings";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register/company",
    element: <RegisterCompany />,
  },
  {
    path: "/login",
    element: <div>Login page coming soon</div>,
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
  </StrictMode>,
)