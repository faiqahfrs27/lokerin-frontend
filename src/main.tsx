import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Register from './pages/Register';
import RegisterCompany from './pages/RegisterCompany';

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
]);

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
  </StrictMode>,
)
