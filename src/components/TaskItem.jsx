import { useState } from "react"
import { Link } from "react-router-dom"

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
      onDeleteSuccess?.(task.id)
    } finally {
      setDeleteTaskIsLoading(false)
    }
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg bg-opacity-10 px-4 py-3 text-sm transition sm:flex-row sm:items-center sm:justify-between ${getStatusClasses()}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
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

        <span className="break-words">{task.title}</span>
      </div>

      <div className="flex w-full shrink-0 justify-end gap-2 sm:w-auto">
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

        <Link
          to={`/tasks/${task.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-black/5"
        >
          <DetailsIcon />
        </Link>
      </div>
    </div>
  )
}

export default TaskItem
