import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks"

const TasksPage = () => {
  return (
    <div className="flex min-h-screen bg-brand-background">
      <div className="w-72 shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1">
        <Tasks />
      </main>
    </div>
  )
}

export default TasksPage
