import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import CloudIcon from "../assets/icons/cloud-sun.svg?react"
import MoonIcon from "../assets/icons/moon.svg?react"
import SunIcon from "../assets/icons/sun.svg?react"
import AddTaskDialog from "./AddTaskDialog"
import Header from "./Header"
import TaskItem from "./TaskItem"
import TasksSeparator from "./TasksSeparator"

const API_URL = import.meta.env.VITE_API_URL

const Tasks = () => {
  const queryClient = useQueryClient()
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tasks`, { method: "GET" })

      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.")
      }

      return response.json()
    },
  })

  const { morningTasks, afternoonTasks, eveningTasks } = useMemo(() => {
    return {
      morningTasks: tasks.filter((task) => task.time === "morning"),
      afternoonTasks: tasks.filter((task) => task.time === "afternoon"),
      eveningTasks: tasks.filter((task) => task.time === "evening"),
    }
  }, [tasks])

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar tarefa.")
      }

      return taskId
    },
    onSuccess: (deletedTaskId) => {
      queryClient.setQueryData(["tasks"], (oldTasks = []) =>
        oldTasks.filter((task) => task.id !== deletedTaskId)
      )

      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Tarefa deletada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar tarefa. Por favor, tente novamente.")
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ taskId, nextStatus }) => {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar status.")
      }

      return response.json()
    },
    onSuccess: (_updatedTask, variables) => {
      queryClient.setQueryData(["tasks"], (oldTasks = []) =>
        oldTasks.map((task) =>
          task.id === variables.taskId
            ? { ...task, status: variables.nextStatus }
            : task
        )
      )

      if (variables.nextStatus === "in_progress") {
        toast.success("Tarefa iniciada com sucesso!")
      } else if (variables.nextStatus === "done") {
        toast.success("Tarefa concluída com sucesso!")
      } else {
        toast.success("Tarefa reiniciada com sucesso!")
      }

      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Erro ao atualizar tarefa. Por favor, tente novamente.")
    },
  })

  const clearTasksMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        tasks.map(async (task) => {
          const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Erro ao limpar tarefas.")
          }
        })
      )

      return true
    },
    onSuccess: () => {
      queryClient.setQueryData(["tasks"], [])
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Tarefas limpas com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao limpar tarefas. Por favor, tente novamente.")
    },
  })

  const handleTaskDeleteClick = async (taskId) => {
    await deleteTaskMutation.mutateAsync(taskId)
  }

  const handleDialogClosed = () => {
    setAddTaskDialogIsOpen(false)
  }

  const handleTaskCheckboxClick = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    let nextStatus = "not_started"

    if (task.status === "not_started") {
      nextStatus = "in_progress"
    } else if (task.status === "in_progress") {
      nextStatus = "done"
    } else if (task.status === "done") {
      nextStatus = "not_started"
    }

    toggleStatusMutation.mutate({ taskId, nextStatus })
  }

  const onTaskSubmitSuccess = (newTask) => {
    toast.success("Tarefa adicionada com sucesso!")
    setAddTaskDialogIsOpen(false)

    queryClient.setQueryData(["tasks"], (oldTasks = []) => [
      ...oldTasks,
      newTask,
    ])
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  const onTaskSubmitError = () => {
    toast.error("Erro ao adicionar tarefa. Por favor, tente novamente.")
  }

  if (isLoading) {
    return (
      <div className="w-full px-8 py-16">
        <p className="text-sm text-brand-text-gray">Carregando tarefas...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full px-8 py-16">
        <p className="text-sm text-red-600">
          Erro ao carregar tarefas: {error?.message || "desconhecido"}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full px-8 py-16">
      <Header
        subtitle="Minhas Tarefas"
        title="Minhas Tarefas"
        onClearTasks={() => clearTasksMutation.mutate()}
        onOpenDialog={() => setAddTaskDialogIsOpen(true)}
      />

      <div className="rounded-xl bg-white p-6">
        <div className="my-6 space-y-3">
          <TasksSeparator title="Manhã" icon={<SunIcon />} />

          {morningTasks.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa cadastrada para o período da manhã.
            </p>
          )}

          {morningTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              onDeleteSuccess={handleTaskDeleteClick}
            />
          ))}
        </div>

        <div className="my-6 space-y-3">
          <TasksSeparator title="Tarde" icon={<CloudIcon />} />

          {afternoonTasks.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa cadastrada para o período da tarde.
            </p>
          )}

          {afternoonTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              onDeleteSuccess={handleTaskDeleteClick}
            />
          ))}
        </div>

        <div className="my-6 space-y-3">
          <TasksSeparator title="Noite" icon={<MoonIcon />} />

          {eveningTasks.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa cadastrada para o período da noite.
            </p>
          )}

          {eveningTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckboxClick}
              onDeleteSuccess={handleTaskDeleteClick}
            />
          ))}
        </div>

        <AddTaskDialog
          isOpen={addTaskDialogIsOpen}
          onClose={handleDialogClosed}
          onSubmitSuccess={onTaskSubmitSuccess}
          onSubmitError={onTaskSubmitError}
        />
      </div>
    </div>
  )
}

export default Tasks
