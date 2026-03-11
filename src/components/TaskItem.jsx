import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import CheckIcon from "../assets/icons/check.svg?react"
import DetailsIcon from "../assets/icons/details.svg?react"
import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "./Button"

const TaskItem = ({
  task,
  handleCheckboxClick,
  onDeleteSuccess,
  showDeleteButton = true,
}) => {
  const [deleteTaskIsLoading, setDeleteTaskIsLoading] = useState(false)

  const getStatusClasses = () => {
    if (task.status === "done") {
      return "bg-brand-primary text-brand-primary"
    }

    if (task.status === "in_progress") {
      return "bg-brand-process text-brand-process"
    }

    if (task.status === "not_started") {
      return "bg-[#2B2D42]/10 text-[#2B2D42]"
    }

    return "bg-[#2B2D42]/10 text-[#2B2D42]"
  }

  const handleDeleteClick = async () => {
    try {
      setDeleteTaskIsLoading(true)

      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        toast.error("Erro ao deletar a tarefa. Por favor, tente novamente.")
        return
      }

      onDeleteSuccess?.(task.id)
    } catch {
      toast.error("Erro ao deletar a tarefa. Por favor, tente novamente.")
    } finally {
      setDeleteTaskIsLoading(false)
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg bg-opacity-10 px-4 py-3 text-sm transition ${getStatusClasses()}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <label
          className={`relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg ${getStatusClasses()}`}
        >
          <input
            type="checkbox"
            checked={task.status === "done"}
            className="peer absolute h-full w-full cursor-pointer appearance-none rounded-lg"
            onChange={() => handleCheckboxClick(task.id)}
          />

          {task.status === "done" && <CheckIcon />}
          {task.status === "in_progress" && (
            <LoaderIcon className="animate-spin" />
          )}
        </label>

        <span className="truncate">{task.title}</span>
      </div>

      <div className="flex shrink-0 gap-2">
        {showDeleteButton && (
          <Button
            color="ghost"
            icon={
              deleteTaskIsLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon className="text-red-400" />
              )
            }
            onClick={handleDeleteClick}
            disabled={deleteTaskIsLoading}
          />
        )}

        <Link to={`/tasks/${task.id}`}>
          <DetailsIcon />
        </Link>
      </div>
    </div>
  )
}

export default TaskItem
