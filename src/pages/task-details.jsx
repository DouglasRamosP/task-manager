import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import ArrowLeftIcon from "../assets/icons/arrow-left.svg?react"
import ChevronRightIcon from "../assets/icons/chevron-right.svg?react"
import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "../components/Button"
import Input from "../components/Input"
import InputLabel from "../components/InputLabel"
import Sidebar from "../components/Sidebar"

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

  // =========================
  // 1) QUERY: buscar a tarefa
  // =========================
  const {
    data: task,
    isLoading: isLoadingTask,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/tasks/${taskId}`)

      return data
    },
  })

  // Preenche o formulário quando a task chegar
  useEffect(() => {
    if (!task) return

    reset({
      title: task.title ?? "",
      time: task.time ?? "morning",
      description: task.description ?? "",
    })
  }, [task, reset])

  // =================================
  // 2) MUTATION: atualizar (PATCH)
  // =================================
  const { mutateAsync: updateTaskMutation, isPending: isUpdatingTask } =
    useMutation({
      mutationFn: async (formData) => {
        const { data: updated } = await axios.patch(
          `http://localhost:3000/tasks/${taskId}`,
          formData
        )

        return updated
      },
      onSuccess: (updated) => {
        // Atualiza o cache da task individual
        queryClient.setQueryData(["task", taskId], updated)

        // Garante que a lista (se existir) reflita alterações
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

  // ==============================
  // 3) MUTATION: deletar (DELETE)
  // ==============================
  const { mutateAsync: deleteTaskMutation, isPending: isDeletingTask } =
    useMutation({
      mutationFn: async () => {
        await axios.delete(`http://localhost:3000/tasks/${taskId}`)

        return true
      },
      onSuccess: () => {
        // Remove cache da task
        queryClient.removeQueries({ queryKey: ["task", taskId] })

        // Atualiza lista
        queryClient.invalidateQueries({ queryKey: ["tasks"] })

        toast.success("Tarefa deletada com sucesso!")
        navigate(-1)
      },
      onError: () => {
        toast.error("Erro ao deletar tarefa. Por favor, tente novamente.")
      },
    })

  const handleTaskDeleteClick = async () => {
    await deleteTaskMutation()
  }

  // Estados de loading “certos”
  const isBusy = isUpdatingTask || isDeletingTask || isSubmittingForm

  if (isLoadingTask) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-full px-8 py-16">
          <div className="flex items-center gap-2 text-brand-text-gray">
            <LoaderIcon className="h-5 w-5 animate-spin" />
            <span>Carregando tarefa...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-full px-8 py-16">
          <p className="text-red-600">
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
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full px-8 py-16">
        {/* barra do topo */}
        <div className="flex w-full justify-between">
          {/* parte da esquerda */}
          <div>
            <button
              className="mb-3 flex h-8 w-8 items-center rounded-full bg-brand-primary"
              onClick={handleBackClick}
            >
              <ArrowLeftIcon />
            </button>

            {/* breadcrumb */}
            <div className="flex items-baseline gap-1 text-xs">
              <span
                onClick={handleBackClick}
                className="cursor-pointer text-brand-text-gray"
              >
                Minhas tarefas
              </span>

              <ChevronRightIcon className="translate-y-[1px] text-brand-text-gray" />

              <span className="font-semibold text-brand-primary">
                {task?.title}
              </span>
            </div>

            {/* título */}
            <h1 className="mt-2 text-xl font-semibold">{task?.title}</h1>
          </div>

          {/* parte da direita */}
          <Button
            className="h-fit self-end"
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

        {/* dados da tarefa */}
        <form onSubmit={handleSubmit(handleSaveClick)}>
          <div className="mt-6 space-y-6 rounded-xl bg-brand-white p-6">
            <div>
              <Input
                id="title"
                label="Título"
                {...register("title", {
                  required: "O Título é obrigatório.",
                  validate: (value) => {
                    if (!value.trim()) return "O título não pode ser vazio."
                    return true
                  },
                })}
                error={errors?.title}
              />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="horario">Horário</InputLabel>
              <select
                className="rounded-lg border border-solid border-[#ECECEC] px-4 py-3 outline-brand-primary placeholder:text-sm placeholder:text-brand-text-gray"
                id="horario"
                {...register("time", {
                  required: "O Período é obrigatório.",
                })}
              >
                <option value="morning">Manhã</option>
                <option value="afternoon">Tarde</option>
                <option value="evening">Noite</option>
              </select>
            </div>

            <div>
              <Input
                id="description"
                label="Descrição"
                {...register("description", {
                  required: "A descrição é obrigatória.",
                  validate: (value) => {
                    if (!value.trim()) return "A descrição não pode ser vazia."
                    return true
                  },
                })}
                error={errors?.description}
              />
            </div>
          </div>

          <div className="flex w-full justify-end gap-3 pt-4">
            {/* botões cancelar e salvar */}
            <Button
              type="button"
              color="secondary"
              size="large"
              text="Cancelar"
              onClick={handleBackClick}
              disabled={isBusy}
            />

            <Button
              type="submit"
              color="primary"
              size="large"
              text="Salvar"
              disabled={isBusy}
              icon={
                isUpdatingTask ? <LoaderIcon className="animate-spin" /> : null
              }
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskDetailsPage
