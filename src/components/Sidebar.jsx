import HomeIcon from "../assets/icons/home.svg?react"
import TasksIcon from "../assets/icons/tasks.svg?react"
import SidebarButton from "./SidebarButton"

const Sidebar = () => {
  return (
    <aside className="sticky top-0 z-20 w-full border-b border-white/10 bg-brand-surface-strong/95 text-white shadow-soft backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/20 text-lg font-semibold text-brand-primary ring-1 ring-brand-primary/20">
            TM
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] text-white">
              Task Manager
            </h1>
          </div>
        </div>

        <div className="flex justify-end lg:ml-auto">
          <nav className="flex min-w-0 items-center gap-2 overflow-x-auto rounded-[1.6rem] border border-white/10 bg-white/5 p-1.5 [scrollbar-width:none] sm:w-fit">
            <SidebarButton to="/">
              <HomeIcon className="h-5 w-5" />
              Dashboard
            </SidebarButton>

            <SidebarButton to="/tasks">
              <TasksIcon className="h-5 w-5" />
              Tarefas
            </SidebarButton>
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
