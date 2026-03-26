import { useState } from "react"
import { Link } from "react-router-dom"

import CheckIcon from "../assets/icons/check.svg?react"
import DetailsIcon from "../assets/icons/details.svg?react"
import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import { TASK_STATUS_META, TASK_TIME_PERIODS } from "../lib/tasks"
import Button from "./Button"

const TaskItem = ({
  task,
  handleCheckboxClick,
  onDeleteSuccess,
  showDeleteButton = true,
}) => {
  const [deleteTaskIsLoading, setDeleteTaskIsLoading] = useState(false)

  const statusStyles = {
    done: {
      card: "border-brand-success/15 bg-brand-success/10",
      checkbox: "border-brand-success/20 bg-brand-success text-white",
      badge: "bg-brand-success/15 text-brand-success",
    },
    in_progress: {
      card: "border-brand-warning/15 bg-brand-warning/10",
      checkbox: "border-brand-warning/20 bg-brand-warning text-white",
      badge: "bg-brand-warning/15 text-brand-warning",
    },
    not_started: {
      card: "border-brand-line bg-white/70",
      checkbox: "border-brand-line bg-brand-background text-brand-muted",
      badge: "bg-brand-background text-brand-muted",
    },
  }

  const currentStatusStyle =
    statusStyles[task.status] ?? statusStyles.not_started
  const timeLabel =
    TASK_TIME_PERIODS.find((period) => period.value === task.time)?.label ??
    "Sem período"

  const handleDeleteClick = async () => {
    try {
      setDeleteTaskIsLoading(true)
      await onDeleteSuccess?.(task.id)
    } finally {
      setDeleteTaskIsLoading(false)
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 rounded-[1.5rem] border px-4 py-4 text-sm shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between ${currentStatusStyle.card}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <label
          className={`relative mt-0.5 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border ${currentStatusStyle.checkbox}`}
        >
          <input
            type="checkbox"
            checked={task.status === "done"}
            className="peer absolute h-full w-full cursor-pointer appearance-none rounded-2xl"
            onChange={() => handleCheckboxClick(task.id)}
          />

          {task.status === "done" && <CheckIcon />}
          {task.status === "in_progress" && (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          )}
        </label>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-semibold text-brand-ink">
              {task.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${currentStatusStyle.badge}`}
            >
              {TASK_STATUS_META[task.status]?.label ?? "Status"}
            </span>

            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-muted">
              {timeLabel}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">
            {task.description}
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 justify-end gap-2 sm:w-auto">
        {showDeleteButton && (
          <Button
            color="ghost"
            aria-label={`Excluir tarefa ${task.title}`}
            icon={
              deleteTaskIsLoading ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="h-4 w-4 text-brand-danger" />
              )
            }
            onClick={handleDeleteClick}
            disabled={deleteTaskIsLoading}
          />
        )}

        <Link
          to={`/tasks/${task.id}`}
          aria-label={`Abrir detalhes da tarefa ${task.title}`}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-line bg-white/80 text-brand-muted transition duration-200 hover:border-brand-primary/20 hover:bg-white hover:text-brand-primary"
        >
          <DetailsIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default TaskItem
