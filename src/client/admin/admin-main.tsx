import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Login from "./pages/Login";
import AdminPage from "./AdminPage";
import VideoEditorPage from "./components/VideoEditorPage";
import { AuthorizedRoute } from "./AuthorizedRoute";



const router = createBrowserRouter([ 
  {
    path: "admin",
    element: <AuthorizedRoute><Outlet /></AuthorizedRoute>,
    children: [
      {
        index: true,
        element: <AdminPage/>,
      },
      {
        path: "videos/new",
        element: <VideoEditorPage />,
      },
      {
        path: "videos/:id/edit",
        element: <VideoEditorPage />,
      }
    ]
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
