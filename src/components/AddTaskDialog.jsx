import "./AddTaskDialog.css"

import { useRef } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { CSSTransition } from "react-transition-group"
import { v4 } from "uuid"

import LoaderIcon from "../assets/icons/loader-circle.svg?react"
import Button from "./Button"
import Input from "./Input"
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

  const handleSaveClick = async (data) => {
    try {
      const task = {
        id: v4(),
        title: data.title.trim(),
        time: data.time,
        description: data.description.trim(),
        status: "not_started",
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      reset()
      onSubmitSuccess?.(task)
      onClose?.()
    } catch (error) {
      console.error(error)
      onSubmitError?.()
    }
  }

  const handleClose = () => {
    reset()
    onClose?.()
  }

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={500}
      classNames="add-task-dialog"
      unmountOnExit
    >
      <div>
        {createPortal(
          <div
            ref={nodeRef}
            className="fixed bottom-0 left-0 right-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur-sm"
          >
            <div className="rounded-xl bg-white p-5 text-center shadow">
              <h2 className="text-xl font-semibold text-brand-dark-blue">
                Nova Tarefa
              </h2>
              <p className="mb-4 mt-1 text-sm text-brand-text-gray">
                Insira as informações abaixo
              </p>

              <form onSubmit={handleSubmit(handleSaveClick)}>
                <div className="flex w-[336px] flex-col space-y-4">
                  <Input
                    id="title"
                    label="Título"
                    placeholder="Insira o título"
                    {...register("title", {
                      required: "O título é obrigatório.",
                      validate: (v) =>
                        v.trim() !== "" || "O título não pode ser vazio.",
                    })}
                    error={errors.title}
                  />

                  <div className="flex flex-col gap-1 text-left">
                    <InputLabel htmlFor="time">Horário</InputLabel>
                    <select
                      id="time"
                      className="rounded-lg border border-solid border-[#ECECEC] px-4 py-3 outline-brand-primary"
                      {...register("time", {
                        required: "O período é obrigatório.",
                      })}
                    >
                      <option value="">Selecione...</option>
                      <option value="morning">Manhã</option>
                      <option value="afternoon">Tarde</option>
                      <option value="evening">Noite</option>
                    </select>

                    {errors.time && (
                      <span className="text-xs text-brand-danger">
                        {errors.time.message}
                      </span>
                    )}
                  </div>

                  <Input
                    id="description"
                    label="Descrição"
                    placeholder="Descreva a tarefa"
                    {...register("description", {
                      required: "A descrição é obrigatória.",
                      validate: (v) =>
                        v.trim() !== "" || "A descrição não pode ser vazia.",
                    })}
                    error={errors.description}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleClose}
                      color="secondary"
                      className="w-full"
                      size="large"
                      text="Cancelar"
                      disabled={isLoading}
                    />
                    <Button
                      className="w-full"
                      type="submit"
                      size="large"
                      text="Salvar"
                      disabled={isLoading}
                      icon={
                        isLoading ? (
                          <LoaderIcon className="animate-spin" />
                        ) : null
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </CSSTransition>
  )
}

export default AddTaskDialog
