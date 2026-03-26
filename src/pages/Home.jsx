import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import WaterIcon from "../assets/icons/glass-water.svg?react"
import TaskIcon from "../assets/icons/layout-list.svg?react"
import TaskCheckIcon from "../assets/icons/list-checks.svg?react"
import LoaderIcon from "../assets/icons/loader-circle2.svg?react"
import AddTaskDialog from "../components/AddTaskDialog"
import EmptyState from "../components/EmptyState"
import Header from "../components/Header"
import TaskSummaryCard from "../components/TaskSummaryCard"
import WaterGoalCard from "../components/WaterGoalCard"
import {
  clearTasks,
  getNextTaskStatus,
  getTasks,
  getTaskStats,
  sortTasks,
  updateTaskStatus,
} from "../lib/tasks"
import {
  clearStoredWaterSelection,
  createWaterOptions,
  getStoredWaterSelection,
  persistWaterSelection,
} from "../lib/water"
import Dashboard from "./Dashboard"

const INITIAL_WATER_OPTIONS = [
  { id: 1, label: "250 ml", valueMl: 250 },
  { id: 2, label: "500 ml", valueMl: 500 },
  { id: 3, label: "1 litro", valueMl: 1000 },
  { id: 4, label: "1.5 litros", valueMl: 1500 },
  { id: 5, label: "2 litros", valueMl: 2000 },
  { id: 6, label: "2.5 litros", valueMl: 2500 },
]

const WATER_GOAL_ML = 2500

const HomePage = () => {
  const queryClient = useQueryClient()

  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)
  const [waterOptions, setWaterOptions] = useState(() =>
    createWaterOptions(INITIAL_WATER_OPTIONS, getStoredWaterSelection())
  )

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ nextStatus, taskId }) =>
      updateTaskStatus(taskId, nextStatus),
    onSuccess: (_data, variables) => {
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
    mutationFn: () => clearTasks(tasks),
    onSuccess: () => {
      queryClient.setQueryData(["tasks"], [])
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Tarefas limpas com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao limpar tarefas. Por favor, tente novamente.")
    },
  })

  useEffect(() => {
    const selectedMl = Math.max(
      0,
      ...waterOptions
        .filter((option) => option.checked)
        .map((option) => option.valueMl)
    )

    persistWaterSelection(selectedMl)
  }, [waterOptions])

  const handleTaskCheckboxClick = (taskId) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId)

    if (!task) {
      return
    }

    toggleStatusMutation.mutate({
      taskId,
      nextStatus: getNextTaskStatus(task.status),
    })
  }

  const handleWaterOptionToggle = (optionId) => {
    setWaterOptions((previousOptions) => {
      const clickedOption = previousOptions.find(
        (option) => option.id === optionId
      )

      if (!clickedOption) {
        return previousOptions
      }

      if (!clickedOption.checked) {
        return createWaterOptions(INITIAL_WATER_OPTIONS, clickedOption.valueMl)
      }

      const previousCheckedOption = [...previousOptions]
        .filter(
          (option) => option.checked && option.valueMl < clickedOption.valueMl
        )
        .at(-1)

      return createWaterOptions(
        INITIAL_WATER_OPTIONS,
        previousCheckedOption?.valueMl ?? 0
      )
    })
  }

  const handleWaterReset = () => {
    clearStoredWaterSelection()
    setWaterOptions(createWaterOptions(INITIAL_WATER_OPTIONS, 0))
    toast.success("Controle de água resetado para hoje.")
  }

  const handleClearTasks = () => {
    if (tasks.length === 0) {
      toast("Nenhuma tarefa para limpar.")
      return
    }

    if (!window.confirm("Deseja realmente remover todas as tarefas?")) {
      return
    }

    clearTasksMutation.mutate()
  }

  const handleDialogClosed = () => {
    setAddTaskDialogIsOpen(false)
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

  const waterSelectedMl = useMemo(() => {
    return Math.max(
      0,
      ...waterOptions
        .filter((option) => option.checked)
        .map((option) => option.valueMl)
    )
  }, [waterOptions])

  const waterPercentage = Math.round((waterSelectedMl / WATER_GOAL_ML) * 100)
  const sortedTasks = useMemo(() => sortTasks(tasks), [tasks])
  const taskStats = useMemo(() => getTaskStats(tasks), [tasks])

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <Header
        subtitle="Dashboard"
        title="Controle a rotina com mais clareza"
        description="Uma visão consolidada das tarefas e do seu ritmo diário. Organize o que importa, acompanhe a execução e mantenha a hidratação em dia."
        stats={[
          {
            label: "Tarefas ativas",
            value: `${taskStats.total}`,
          },
          {
            label: "Concluídas",
            value: `${taskStats.completed}`,
          },
          {
            label: "Em andamento",
            value: `${taskStats.inProgress}`,
          },
        ]}
        onClearTasks={handleClearTasks}
        onOpenDialog={() => setAddTaskDialogIsOpen(true)}
        clearDisabled={tasks.length === 0 || clearTasksMutation.isPending}
      />

      {isLoading ? (
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur">
          <p className="text-sm text-brand-muted">
            Carregando dados do dashboard...
          </p>
        </section>
      ) : null}

      {isError ? (
        <section className="rounded-[2rem] border border-brand-danger/20 bg-white/85 p-8 shadow-card backdrop-blur">
          <p className="text-sm text-brand-danger">
            Erro ao carregar dados: {error?.message || "desconhecido"}
          </p>
        </section>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Dashboard
              icon={<TaskIcon className="h-5 w-5" />}
              mainText={String(taskStats.total)}
              secondaryText="Tarefas disponíveis"
              supportText={taskStats.total > 0 ? "Agenda viva" : "Comece agora"}
            />

            <Dashboard
              icon={<TaskCheckIcon className="h-5 w-5" />}
              mainText={String(taskStats.completed)}
              secondaryText="Tarefas concluídas"
              supportText={`${taskStats.completionRate}%`}
            />

            <Dashboard
              icon={<LoaderIcon className="h-5 w-5" />}
              mainText={String(taskStats.inProgress)}
              secondaryText="Tarefas em andamento"
              supportText="Foco atual"
            />

            <Dashboard
              icon={<WaterIcon className="h-5 w-5" />}
              mainText={`${waterPercentage}%`}
              secondaryText="Meta de água"
              supportText={`${waterSelectedMl} ml`}
            />
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              title="Seu painel ainda está vazio"
              description="Cadastre a primeira tarefa para transformar este projeto em um organizador real de rotina."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(360px,1fr)]">
              <TaskSummaryCard
                tasks={sortedTasks}
                completionRate={taskStats.completionRate}
                handleCheckboxClick={handleTaskCheckboxClick}
              />

              <WaterGoalCard
                options={waterOptions}
                selectedMl={waterSelectedMl}
                goalMl={WATER_GOAL_ML}
                onReset={handleWaterReset}
                onToggleOption={handleWaterOptionToggle}
              />
            </div>
          )}
        </>
      ) : null}

      <AddTaskDialog
        isOpen={addTaskDialogIsOpen}
        onClose={handleDialogClosed}
        onSubmitSuccess={onTaskSubmitSuccess}
        onSubmitError={onTaskSubmitError}
      />
    </main>
  )
}

export default HomePage
