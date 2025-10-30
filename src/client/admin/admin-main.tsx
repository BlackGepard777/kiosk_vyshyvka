import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Login from "./pages/Login";
import AdminPage from "./AdminPage";


const router = createBrowserRouter([ 
  {
    path: "admin",
    element: <AdminPage/>,
    // Component: AdminLayout,
  },
  {
    path: "admin/login",
    element: <Login />,
  }
], {
  basename: import.meta.env.VITE_BASE_URL
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
