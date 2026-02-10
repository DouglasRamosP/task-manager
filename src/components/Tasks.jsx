import { useEffect, useState } from "react"
import { toast } from "sonner"

import AddIcon from "../assets/icons/Add.svg?react"
import CloudIcon from "../assets/icons/cloud-sun.svg?react"
import MoonIcon from "../assets/icons/moon.svg?react"
import SunIcon from "../assets/icons/sun.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import AddTaskDialog from "./AddTaskDialog"
import Button from "./Button"
import TaskItem from "./TaskItem"
import TasksSeparator from "./TasksSeparator"

const Tasks = () => {
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "GET",
      })
      const tasks = await response.json()
      setTasks(tasks)
    }
    fetchTasks()
  }, [])

  const morningTasks = tasks.filter((task) => task.time === "morning")
  const afternoonTasks = tasks.filter((task) => task.time === "afternoon")
  const eveningTasks = tasks.filter((task) => task.time === "evening")

  const handleTaskDeleteClick = (taskId) => {
    const newtask = tasks.filter((task) => task.id !== taskId)

    setTasks(newtask)
    toast.success("Tarefa deletada com sucesso!")
  }

  const handleDialogClosed = () => {
    setAddTaskDialogIsOpen(false)
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

  const handleAddTaskSubmit = (task) => {
    setTasks([...tasks, task])
    toast.success("Tarefa adicionado com sucesso!")
  }

  return (
    <div className="w-full px-8 py-16">
      <div className="flex justify-between pb-6">
        <div>
          <span className="text-xs font-semibold text-brand-primary">
            Minhas Tarefas
          </span>
          <h2 className="text-xl font-semibold">Minhas Tarefas</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button color="ghost" text="Limpar tarefas" icon={<TrashIcon />} />
          <Button
            color="primary"
            text="Nova tarefa"
            icon={<AddIcon />}
            onClick={() => setAddTaskDialogIsOpen(true)}
          />
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

          <AddTaskDialog
            isOpen={addTaskDialogIsOpen}
            onClose={handleDialogClosed}
            handleSubmit={handleAddTaskSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default Tasks
