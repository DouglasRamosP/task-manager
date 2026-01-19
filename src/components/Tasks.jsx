import Button from "./Button"
import AddIcon from "../assets/icons/Add.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import SunIcon from "../assets/icons/sun.svg?react"
import MoonIcon from "../assets/icons/moon.svg?react"
import CloudIcon from "../assets/icons/cloud-sun.svg?react"
import TasksSeparator from "./TasksSeparator"

const Tasks = () => {
  return (
    <div className="w-full px-8 py-16">
      <div className="flex justify-between pb-6">
        <div>
          <span className="text-xs font-semibold text-[#00ADB5]">
            Minhas Tarefas
          </span>
          <h2 className="text-xl font-semibold">Minhas Tarefas</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            text="Limpar tarefas"
            icon={<TrashIcon />}
          />
          <Button variant="ghost" text="Nova tarefa" icon={<AddIcon />} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6">
        {/* MANHÃ */}
        <div className="my-6 space-y-3">
          <TasksSeparator title="Manhã" icon={<SunIcon />} />
        </div>
        {/* TARDE */}
        <div className="my-6 space-y-3">
          <TasksSeparator title="Tarde" icon={<CloudIcon />} />
        </div>
        {/* NOITE */}
        <div className="my-6 space-y-3">
          <TasksSeparator title="Noite" icon={<MoonIcon />} />
        </div>
      </div>
    </div>
  )
}

export default Tasks
