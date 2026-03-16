import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks"

const TasksPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-background lg:flex-row">
      <div className="shrink-0 lg:w-72">
        <Sidebar />
      </div>

      <main className="w-full flex-1">
        <Tasks />
      </main>
    </div>
  )
}

export default TasksPage
