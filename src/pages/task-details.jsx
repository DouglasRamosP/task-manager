import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import ArrowLeftIcon from "../assets/icons/arrow-left.svg?react"
import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "../components/Button"
import EmptyState from "../components/EmptyState"
import Input, { fieldClassName } from "../components/Input"
import InputLabel from "../components/InputLabel"
import {
  deleteTask,
  getTask,
  TASK_STATUS_META,
  TASK_TIME_PERIODS,
  updateTask,
} from "../lib/tasks"

const TaskDetailsPage = () => {
  const queryClient = useQueryClient()

  const {
    register,
    formState: { errors, isSubmitting: isSubmittingForm },
    handleSubmit,
    reset,
  } = useForm()

  const { taskId } = useParams()
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  const {
    data: task,
    isLoading: isLoadingTask,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    enabled: Boolean(taskId),
    queryFn: () => getTask(taskId),
  })

  useEffect(() => {
    if (!task) {
      return
    }

    reset({
      title: task.title ?? "",
      time: task.time ?? "morning",
      status: task.status ?? "not_started",
      description: task.description ?? "",
    })
  }, [reset, task])

  const { mutateAsync: updateTaskMutation, isPending: isUpdatingTask } =
    useMutation({
      mutationFn: (formData) => updateTask(taskId, formData),
      onSuccess: (updatedTask) => {
        queryClient.setQueryData(["task", taskId], updatedTask)
        queryClient.setQueryData(["tasks"], (oldTasks = []) =>
          oldTasks.map((currentTask) =>
            currentTask.id === taskId ? updatedTask : currentTask
          )
        )
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
        toast.success("Tarefa atualizada com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao atualizar a tarefa. Por favor, tente novamente.")
      },
    })

  const handleSaveClick = async (data) => {
    await updateTaskMutation(data)
  }

  const { mutateAsync: deleteTaskMutation, isPending: isDeletingTask } =
    useMutation({
      mutationFn: () => deleteTask(taskId),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["task", taskId] })
        queryClient.setQueryData(["tasks"], (oldTasks = []) =>
          oldTasks.filter((currentTask) => currentTask.id !== taskId)
        )
        queryClient.invalidateQueries({ queryKey: ["tasks"] })
        toast.success("Tarefa deletada com sucesso!")
        navigate("/tasks")
      },
      onError: () => {
        toast.error("Erro ao deletar tarefa. Por favor, tente novamente.")
      },
    })

  const handleTaskDeleteClick = async () => {
    if (
      !window.confirm(`Deseja realmente excluir a tarefa "${task?.title}"?`)
    ) {
      return
    }

    await deleteTaskMutation()
  }

  const isBusy = isUpdatingTask || isDeletingTask || isSubmittingForm

  const statusBadgeClassName = {
    not_started: "bg-brand-background text-brand-muted",
    in_progress: "bg-brand-warning/15 text-brand-warning",
    done: "bg-brand-success/15 text-brand-success",
  }

  if (isLoadingTask) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur">
          <div className="flex items-center gap-2 text-brand-muted">
            <LoaderIcon className="h-5 w-5 animate-spin" />
            <span>Carregando tarefa...</span>
          </div>
        </section>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="rounded-[2rem] border border-brand-danger/20 bg-white/85 p-8 shadow-card backdrop-blur">
          <p className="text-brand-danger">
            {String(error?.message ?? "Erro ao carregar a tarefa.")}
          </p>
          <div className="mt-4">
            <Button
              color="secondary"
              size="large"
              text="Voltar"
              onClick={handleBackClick}
            />
          </div>
        </section>
      </main>
    )
  }

  if (!task) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <EmptyState
          title="Tarefa não encontrada"
          description="Não foi possível localizar este item. Ele pode ter sido removido ou ainda não estar disponível."
          action={
            <Button
              color="secondary"
              size="large"
              text="Voltar para tarefas"
              onClick={() => navigate("/tasks")}
            />
          }
        />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-line bg-white text-brand-ink transition hover:border-brand-primary/20 hover:text-brand-primary"
              onClick={handleBackClick}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                  statusBadgeClassName[task.status] ??
                  statusBadgeClassName.not_started
                }`}
              >
                {TASK_STATUS_META[task.status]?.label ?? "Status"}
              </span>

              <span className="rounded-full bg-brand-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                {
                  TASK_TIME_PERIODS.find((period) => period.value === task.time)
                    ?.label
                }
              </span>
            </div>

            <h1 className="mt-4 break-words text-3xl font-semibold tracking-[-0.05em] text-brand-ink sm:text-4xl">
              {task.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
              Edite os detalhes da tarefa, ajuste o período do dia e mantenha o
              status alinhado com o andamento real.
            </p>
          </div>

          <Button
            className="h-fit w-full justify-center self-start lg:w-auto"
            color="delete"
            size="small"
            text="Deletar tarefa"
            icon={
              isDeletingTask ? (
                <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <TrashIcon className="h-3.5 w-3.5" />
              )
            }
            onClick={handleTaskDeleteClick}
            disabled={isBusy}
          />
        </div>
      </section>

      <form
        onSubmit={handleSubmit(handleSaveClick)}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <section className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Input
                id="title"
                label="Título"
                {...register("title", {
                  required: "O título é obrigatório.",
                  validate: (value) => {
                    if (!value.trim()) return "O título não pode ser vazio."
                    return true
                  },
                })}
                error={errors.title}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="time">Período do dia</InputLabel>
              <select
                className={fieldClassName}
                id="time"
                {...register("time", {
                  required: "O período é obrigatório.",
                })}
              >
                {TASK_TIME_PERIODS.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="status">Status</InputLabel>
              <select
                className={fieldClassName}
                id="status"
                {...register("status", {
                  required: "O status é obrigatório.",
                })}
              >
                {Object.entries(TASK_STATUS_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                as="textarea"
                id="description"
                label="Descrição"
                {...register("description", {
                  required: "A descrição é obrigatória.",
                  validate: (value) => {
                    if (!value.trim()) return "A descrição não pode ser vazia."
                    return true
                  },
                })}
                error={errors.description}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 border-t border-brand-line pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              color="secondary"
              size="large"
              text="Cancelar"
              onClick={handleBackClick}
              disabled={isBusy}
              className="w-full justify-center sm:w-auto"
            />

            <Button
              type="submit"
              color="primary"
              size="large"
              text="Salvar"
              disabled={isBusy}
              className="w-full justify-center sm:w-auto"
              icon={
                isUpdatingTask ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : null
              }
            />
          </div>
        </section>

        <aside className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Resumo rápido
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-brand-ink">
              Contexto da tarefa
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-brand-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                Status atual
              </p>
              <p className="mt-2 text-base font-semibold text-brand-ink">
                {TASK_STATUS_META[task.status]?.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-brand-muted">
                {TASK_STATUS_META[task.status]?.description}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                Período
              </p>
              <p className="mt-2 text-base font-semibold text-brand-ink">
                {
                  TASK_TIME_PERIODS.find((period) => period.value === task.time)
                    ?.label
                }
              </p>
              <p className="mt-1 text-sm leading-6 text-brand-muted">
                {
                  TASK_TIME_PERIODS.find((period) => period.value === task.time)
                    ?.description
                }
              </p>
            </div>

            <div className="rounded-2xl bg-brand-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                Dica de uso
              </p>
              <p className="mt-2 text-sm leading-7 text-brand-muted">
                Use a descrição para registrar contexto suficiente para retomar
                a tarefa rapidamente sem depender da memória.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </main>
  )
}

export default TaskDetailsPage
