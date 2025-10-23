import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Page from "./Page.tsx"
import HelloPage from "./pages/HelloPage.tsx";
import { VideoPage } from "./pages/VideoPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HelloPage />
  },
  {
    path: "/categories",
    element: <VideoPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
