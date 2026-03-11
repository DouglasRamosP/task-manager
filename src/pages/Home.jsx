import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast, Toaster } from "sonner"

import WaterIcon from "../assets/icons/glass-water.svg?react"
import TaskIcon from "../assets/icons/layout-list.svg?react"
import TaskCheckIcon from "../assets/icons/list-checks.svg?react"
import LoaderIcon from "../assets/icons/loader-circle2.svg?react"
import AddTaskDialog from "../components/AddTaskDialog"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TaskSummaryCard from "../components/TaskSummaryCard"
import WaterGoalCard from "../components/WaterGoalCard"
import Dashboard from "./Dashboard"

const API_URL = "http://localhost:3000"

const INITIAL_WATER_OPTIONS = [
  { id: 1, label: "500 ml", valueMl: 500, checked: true },
  { id: 2, label: "1 litro", valueMl: 1000, checked: true },
  { id: 3, label: "1.5 litros", valueMl: 1500, checked: false },
  { id: 4, label: "2 litros", valueMl: 2000, checked: false },
  { id: 5, label: "2.5 litros", valueMl: 2500, checked: false },
]

const WATER_GOAL_ML = 2500

const HomePage = () => {
  const queryClient = useQueryClient()

  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)
  const [waterOptions, setWaterOptions] = useState(INITIAL_WATER_OPTIONS)

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tasks`)

      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.")
      }

      return response.json()
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
    onSuccess: (_data, variables) => {
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
      toast.success("Tarefas limpas com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Erro ao limpar tarefas. Por favor, tente novamente.")
    },
  })

  const handleTaskCheckboxClick = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    let nextStatus = "not_started"

    if (task.status === "not_started") nextStatus = "in_progress"
    else if (task.status === "in_progress") nextStatus = "done"
    else if (task.status === "done") nextStatus = "not_started"

    toggleStatusMutation.mutate({ taskId, nextStatus })
  }

  const handleWaterOptionToggle = (optionId) => {
    setWaterOptions((prevOptions) => {
      const clickedOption = prevOptions.find((option) => option.id === optionId)
      if (!clickedOption) return prevOptions

      const nextCheckedState = !clickedOption.checked

      if (!nextCheckedState) {
        return prevOptions.map((option) =>
          option.valueMl >= clickedOption.valueMl
            ? { ...option, checked: false }
            : option
        )
      }

      return prevOptions.map((option) => ({
        ...option,
        checked: option.valueMl <= clickedOption.valueMl,
      }))
    })
  }

  const handleDialogClosed = () => {
    setAddTaskDialogIsOpen(false)
  }

  const onTaskSubmitSuccess = () => {
    toast.success("Tarefa adicionada com sucesso!")
    setAddTaskDialogIsOpen(false)
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  const onTaskSubmitError = () => {
    toast.error("Erro ao adicionar tarefa. Por favor, tente novamente.")
  }

  const waterSelectedMl = useMemo(() => {
    const checkedOptions = waterOptions.filter((option) => option.checked)

    if (checkedOptions.length === 0) return 0

    return Math.max(...checkedOptions.map((option) => option.valueMl))
  }, [waterOptions])

  const waterPercentage = Math.round((waterSelectedMl / WATER_GOAL_ML) * 100)

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = {
      in_progress: 0,
      not_started: 1,
      done: 2,
    }

    return statusOrder[a.status] - statusOrder[b.status]
  })

  const taskStats = tasks.reduce(
    (acc, task) => {
      acc.total += 1

      if (task.status === "done") {
        acc.completed += 1
      }

      if (task.status === "in_progress") {
        acc.inProgress += 1
      }

      return acc
    },
    {
      total: 0,
      completed: 0,
      inProgress: 0,
    }
  )

  return (
    <div className="flex min-h-screen bg-brand-background">
      <Toaster />

      <div className="w-72 shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 space-y-6 px-8 py-16">
        <Header
          subtitle="Dashboard"
          title="Início"
          onClearTasks={() => clearTasksMutation.mutate()}
          onOpenDialog={() => setAddTaskDialogIsOpen(true)}
        />

        {isLoading && (
          <p className="text-sm text-brand-text-gray">
            Carregando dados do dashboard...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-600">
            Erro ao carregar dados: {error?.message || "desconhecido"}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <Dashboard
                icon={<TaskIcon />}
                mainText={String(taskStats.total)}
                secondaryText="Tarefas disponíveis"
              />

              <Dashboard
                icon={<TaskCheckIcon />}
                mainText={String(taskStats.completed)}
                secondaryText="Tarefas concluídas"
              />

              <Dashboard
                icon={<LoaderIcon />}
                mainText={String(taskStats.inProgress)}
                secondaryText="Tarefas em andamento"
              />

              <Dashboard
                icon={<WaterIcon />}
                mainText={`${waterPercentage}%`}
                secondaryText="Água"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
              <TaskSummaryCard
                tasks={sortedTasks}
                handleCheckboxClick={handleTaskCheckboxClick}
              />

              <WaterGoalCard
                options={waterOptions}
                selectedMl={waterSelectedMl}
                goalMl={WATER_GOAL_ML}
                onToggleOption={handleWaterOptionToggle}
              />
            </div>
          </>
        )}

        <AddTaskDialog
          isOpen={addTaskDialogIsOpen}
          onClose={handleDialogClosed}
          onSubmitSuccess={onTaskSubmitSuccess}
          onSubmitError={onTaskSubmitError}
        />
      </main>
    </div>
  )
}

export default HomePage
