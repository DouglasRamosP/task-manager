import "./AddTaskDialog.css"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { CSSTransition } from "react-transition-group"

import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import { createTask, TASK_TIME_PERIODS } from "../lib/tasks"
import Button from "./Button"
import Input, { fieldClassName } from "./Input"
import InputLabel from "./InputLabel"

const AddTaskDialog = ({ isOpen, onClose, onSubmitSuccess, onSubmitError }) => {
  const nodeRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isLoading },
  } = useForm({
    defaultValues: {
      title: "",
      time: "",
      description: "",
    },
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscapeKeyDown = (event) => {
      if (event.key === "Escape") {
        reset()
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleEscapeKeyDown)

    return () => {
      window.removeEventListener("keydown", handleEscapeKeyDown)
    }
  }, [isOpen, onClose, reset])

  const handleSaveClick = async (data) => {
    try {
      const createdTask = await createTask(data)

      reset()
      onSubmitSuccess?.(createdTask)
    } catch (error) {
      console.error(error)
      onSubmitError?.()
    }
  }

  const handleClose = () => {
    reset()
    onClose?.()
  }

  return createPortal(
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      classNames="add-task-dialog"
      unmountOnExit
    >
      <div
        className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-brand-surface-strong/45 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          ref={nodeRef}
          className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-soft"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-brand-line bg-brand-background/80 px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">
              Nova tarefa
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-brand-ink">
              Adicione um item importante para a rotina
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
              Preencha os campos abaixo para incluir uma tarefa organizada,
              clara e pronta para acompanhar no dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSaveClick)}>
            <div className="space-y-5 px-6 py-6 sm:px-8">
              <Input
                id="title"
                label="Titulo"
                placeholder="Ex.: Revisar proposta do cliente"
                {...register("title", {
                  required: "O titulo e obrigatorio.",
                  validate: (value) =>
                    value.trim() !== "" || "O titulo nao pode ser vazio.",
                })}
                error={errors.title}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <InputLabel htmlFor="time">Periodo do dia</InputLabel>
                <select
                  id="time"
                  className={[
                    fieldClassName,
                    errors.time
                      ? "border-brand-danger focus:border-brand-danger"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  {...register("time", {
                    required: "O periodo e obrigatorio.",
                  })}
                >
                  <option value="">Selecione um periodo</option>
                  {TASK_TIME_PERIODS.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>

                {errors.time ? (
                  <p className="text-xs font-medium text-brand-danger">
                    {errors.time.message}
                  </p>
                ) : null}
              </div>

              <Input
                as="textarea"
                id="description"
                label="Descricao"
                placeholder="Descreva o objetivo, contexto ou proximo passo."
                {...register("description", {
                  required: "A descricao e obrigatoria.",
                  validate: (value) =>
                    value.trim() !== "" || "A descricao nao pode ser vazia.",
                })}
                error={errors.description}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-brand-line pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={handleClose}
                  color="secondary"
                  className="w-full sm:w-auto"
                  size="large"
                  text="Cancelar"
                  disabled={isLoading}
                />
                <Button
                  className="w-full sm:w-auto"
                  type="submit"
                  size="large"
                  text="Salvar tarefa"
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : null
                  }
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </CSSTransition>,
    document.body
  )
}

export default AddTaskDialog
