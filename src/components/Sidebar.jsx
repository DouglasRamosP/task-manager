import HomeIcon from "../assets/icons/home.svg?react"
import TasksIcon from "../assets/icons/tasks.svg?react"
import SidebarButton from "./SidebarButton"

const Sidebar = () => {
  return (
    <aside className="w-full border-b border-black/5 bg-white px-4 py-4 shadow-sm lg:h-full lg:min-h-screen lg:border-b-0 lg:border-r lg:border-black/5 lg:px-6 lg:py-8 lg:shadow-none">
      <div className="flex flex-col gap-4 lg:px-8 lg:py-6">
        <div>
          <h1 className="mb-2 text-xl font-semibold text-brand-primary">
            Task Manager
          </h1>
          <p className="text-sm text-brand-dark-blue">
            Um simples{" "}
            <span className="text-brand-primary">organizador de tarefas</span>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:p-2">
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
    </aside>
  )
}

export default Sidebar
