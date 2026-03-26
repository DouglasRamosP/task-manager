import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useDeferredValue, useMemo, useState } from "react"
import { toast } from "sonner"

import CloudIcon from "../assets/icons/cloud-sun.svg?react"
import MoonIcon from "../assets/icons/moon.svg?react"
import SunIcon from "../assets/icons/sun.svg?react"
import {
  clearTasks,
  deleteTask,
  filterTasks,
  getNextTaskStatus,
  getTasks,
  getTaskStats,
  groupTasksByTime,
  sortTasks,
  TASK_STATUS_META,
  TASK_TIME_PERIODS,
  updateTaskStatus,
} from "../lib/tasks"
import AddTaskDialog from "./AddTaskDialog"
import Button from "./Button"
import EmptyState from "./EmptyState"
import Header from "./Header"
import { fieldClassName } from "./Input"
import TaskItem from "./TaskItem"
import TasksSeparator from "./TasksSeparator"

const Tasks = () => {
  const queryClient = useQueryClient()
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const taskStats = useMemo(() => getTaskStats(tasks), [tasks])

  const filteredTasks = useMemo(
    () =>
      filterTasks(tasks, {
        search: deferredSearchQuery,
        status: statusFilter,
      }),
    [deferredSearchQuery, statusFilter, tasks]
  )

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
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
    mutationFn: ({ nextStatus, taskId }) =>
      updateTaskStatus(taskId, nextStatus),
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
        toast.success("Tarefa concluida com sucesso!")
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

  const groupedTasks = useMemo(() => {
    const sortedFilteredTasks = sortTasks(filteredTasks)
    const grouped = groupTasksByTime(sortedFilteredTasks)

    return TASK_TIME_PERIODS.map((period) => ({
      ...period,
      tasks: grouped[period.value] ?? [],
    }))
  }, [filteredTasks])

  const visibleTasksCount = filteredTasks.length
  const hasActiveFilters =
    searchQuery.trim().length > 0 || statusFilter !== "all"

  const handleTaskDeleteClick = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId)

    if (
      !window.confirm(`Deseja realmente excluir a tarefa "${task?.title}"?`)
    ) {
      return
    }

    await deleteTaskMutation.mutateAsync(taskId)
  }

  const handleDialogClosed = () => {
    setAddTaskDialogIsOpen(false)
  }

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

  const handleClearTasks = () => {
    if (tasks.length === 0) {
      toast("Nenhuma tarefa para limpar.")
      return
    }

    if (
      !window.confirm("Deseja realmente remover todas as tarefas da lista?")
    ) {
      return
    }

    clearTasksMutation.mutate()
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
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur">
          <p className="text-sm text-brand-muted">Carregando tarefas...</p>
        </section>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="rounded-[2rem] border border-brand-danger/20 bg-white/85 p-8 shadow-card backdrop-blur">
          <p className="text-sm text-brand-danger">
            Erro ao carregar tarefas: {error?.message || "desconhecido"}
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <Header
        subtitle="Workspace"
        title="Gerencie todas as tarefas em um unico lugar"
        description="Filtre, revise e atualize o andamento dos itens da sua rotina. A tela foi organizada para funcionar melhor em uso continuo, nao apenas como demonstracao."
        stats={[
          {
            label: "Total",
            value: `${taskStats.total}`,
          },
          {
            label: "Visiveis",
            value: `${visibleTasksCount}`,
          },
          {
            label: "Concluidas",
            value: `${taskStats.completed}`,
          },
        ]}
        onClearTasks={handleClearTasks}
        onOpenDialog={() => setAddTaskDialogIsOpen(true)}
        clearDisabled={tasks.length === 0 || clearTasksMutation.isPending}
      />

      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
        <div className="grid gap-4 border-b border-brand-line pb-6 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
              Buscar tarefa
            </span>
            <input
              className={fieldClassName}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Busque por titulo ou descricao"
              type="search"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
              Status
            </span>
            <select
              className={fieldClassName}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Todos os status</option>
              {Object.entries(TASK_STATUS_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button
              color="ghost"
              text="Limpar filtros"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
              disabled={!hasActiveFilters}
              className="w-full lg:w-auto"
            />
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="pt-6">
            <EmptyState
              title="Nenhuma tarefa cadastrada"
              description="Crie a primeira tarefa para comecar a usar a lista de forma pratica no dia a dia."
            />
          </div>
        ) : visibleTasksCount === 0 ? (
          <div className="pt-6">
            <EmptyState
              title="Nenhum resultado encontrado"
              description="Ajuste os filtros para visualizar mais tarefas ou limpe a busca atual."
              action={
                <Button
                  color="secondary"
                  text="Limpar filtros"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                />
              }
            />
          </div>
        ) : (
          <div className="space-y-8 pt-6">
            {groupedTasks.map((group) => {
              const icon =
                group.value === "morning" ? (
                  <SunIcon className="h-5 w-5" />
                ) : group.value === "afternoon" ? (
                  <CloudIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )

              return (
                <section key={group.value} className="space-y-4">
                  <TasksSeparator title={group.label} icon={icon} />

                  {group.tasks.length === 0 ? (
                    <p className="rounded-2xl bg-brand-background px-4 py-4 text-sm text-brand-muted">
                      Nenhuma tarefa correspondente para este periodo.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {group.tasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          handleCheckboxClick={handleTaskCheckboxClick}
                          onDeleteSuccess={handleTaskDeleteClick}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}

        <AddTaskDialog
          isOpen={addTaskDialogIsOpen}
          onClose={handleDialogClosed}
          onSubmitSuccess={onTaskSubmitSuccess}
          onSubmitError={onTaskSubmitError}
        />
      </section>
    </div>
  )
}

export default Tasks
