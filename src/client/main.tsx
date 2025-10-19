import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Page from "./Page.tsx"
import HelloPage from "./pages/HelloPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HelloPage />
  },
  {
    path: "/categories",
    element: <CategoriesPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
