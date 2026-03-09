import { Toaster } from "sonner"

import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks"

function TasksPage() {
  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
      <Tasks />
    </div>
  )
}

export default TasksPage
