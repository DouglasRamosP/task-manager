import { useState } from "react"

import Button from "./Button"
import AddIcon from "../assets/icons/Add.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import SunIcon from "../assets/icons/sun.svg?react"
import MoonIcon from "../assets/icons/moon.svg?react"
import CloudIcon from "../assets/icons/cloud-sun.svg?react"
import TasksSeparator from "./TasksSeparator"
import TASKS from "../constants/tasks"
import TaskItem from "./TaskItem"
import { toast } from "sonner"

const Tasks = () => {
  const [tasks, setTasks] = useState(TASKS)
  const morningTasks = tasks.filter((task) => task.time === "morning")
  const afternoonTasks = tasks.filter((task) => task.time === "afternoon")
  const eveningTasks = tasks.filter((task) => task.time === "evening")

  const handleTaskDeleteClick = (taskId) => {
    const newtask = tasks.filter((task) => task.id !== taskId)

    setTasks(newtask)
    toast.success("Tarefa deletada com sucesso!")
  }

  const handleTaskCheckboxClick = (taskId) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task
      }
      if (task.status === "not_started") {
        return { ...task, status: "in_progress" }
      }
      if (task.status === "in_progress") {
        return { ...task, status: "done" }
      }
      if (task.status === "done") {
        return { ...task, status: "not_started" }
      }
      return { ...task, status: "done" }
    })

    setTasks(newTasks)
  }

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

          {morningTasks.map((task) => (
            <TaskItem
              status={task.status}
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              handleDeleteClick={handleTaskDeleteClick}
            />
          ))}
        </div>
        {/* TARDE */}
        <div className="my-6 space-y-3">
          <TasksSeparator title="Tarde" icon={<CloudIcon />} />

          {afternoonTasks.map((task) => (
            <TaskItem
              status={task.status}
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              handleDeleteClick={handleTaskDeleteClick}
            />
          ))}
        </div>
        {/* NOITE */}
        <div className="my-6 space-y-3">
          <TasksSeparator title="Noite" icon={<MoonIcon />} />

          {eveningTasks.map((task) => (
            <TaskItem
              status={task.status}
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              handleDeleteClick={handleTaskDeleteClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tasks
