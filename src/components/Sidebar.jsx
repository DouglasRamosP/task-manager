import HomeIcon from "../assets/icons/home.svg?react"
import TasksIcon from "../assets/icons/tasks.svg?react"
import SidebarButton from "./SidebarButton"

const Sidebar = () => {
  return (
    <div className="w-64 min-w-64 self-stretch bg-white">
      <div className="px-8 py-6">
        <h1 className="mb-4 text-xl font-semibold text-brand-primary">
          Task Manager
        </h1>
        <p>
          Um simples{" "}
          <span className="text-brand-primary">organizador de tarefas</span>
        </p>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <SidebarButton to="/">
          <HomeIcon />
          Inicio
        </SidebarButton>
        <SidebarButton to="/tasks">
          <TasksIcon />
          Minhas Tarefas
        </SidebarButton>
      </div>
    </div>
  )
}

export default Sidebar
