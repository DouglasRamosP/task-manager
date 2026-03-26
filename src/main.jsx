import "./index.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import AppShell from "./components/AppShell.jsx"
import HomePage from "./pages/Home.jsx"
import TaskDetailsPage from "./pages/task-details.jsx"
import TasksPage from "./pages/Tasks.jsx"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/tasks/:taskId",
        element: <TaskDetailsPage />,
      },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
