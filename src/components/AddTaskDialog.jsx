import "./AddTaskDialog.css"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import { toast } from "sonner"
import { v4 } from "uuid"

import Button from "./Button"
import Input from "./Input"
import InputLabel from "./InputLabel"

const AddTaskDialog = ({ isOpen, onClose, handleSubmit }) => {
  const [time, setTime] = useState("morning")
  const [errors, setErrors] = useState([])

  const nodeRef = useRef()
  const titleRef = useRef()
  const descriptionRef = useRef()

  useEffect(() => {
    if (!isOpen) {
      setTime("morning")
    }
  }, [isOpen])

  useEffect(() => {
    console.log("Erros atualizados:", errors)
  }, [errors])

  const handleSaveClick = () => {
    const newErrors = []

    if (!titleRef.current.value.trim()) {
      newErrors.push({ inputName: "title", message: "O título é obrigatório." })
    }

    if (!time.trim()) {
      newErrors.push({ inputName: "time", message: "O horário é obrigatório." })
    }

    if (!descriptionRef.current.value.trim()) {
      newErrors.push({
        inputName: "description",
        message: "A descrição é obrigatória.",
      })
    }

    setErrors(newErrors)

    if (newErrors.length > 0) {
      return
    }

    handleSubmit({
      id: v4(),
      title: titleRef.current.value,
      description: descriptionRef.current.value.trim(),
      time,
      status: "not_started",
    })

    toast.success("Tarefa adicionada com sucesso!")
    onClose()
  }

  const titleError = errors.find((error) => error.inputName === "title")
  const timeError = errors.find((error) => error.inputName === "time")
  const descriptionError = errors.find(
    (error) => error.inputName === "description"
  )

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

              <div className="flex w-[336px] flex-col space-y-4">
                <Input
                  id="title"
                  label="Título"
                  placeholder="Insira o título"
                  error={titleError}
                  ref={titleRef}
                />

                <div className="flex flex-col gap-1 text-left">
                  <InputLabel htmlFor="horario">Horário</InputLabel>
                  <select
                    className="rounded-lg border border-solid border-[#ECECEC] px-4 py-3 outline-brand-primary placeholder:text-sm placeholder:text-brand-text-gray"
                    name=""
                    id="horario"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    error={timeError}
                  >
                    <option value="morning">Manhã</option>
                    <option value="afternoon">Tarde</option>
                    <option value="evening">Noite</option>
                  </select>
                </div>
                <Input
                  id="description"
                  label="Descrição"
                  placeholder="Descreva a tarefa"
                  error={descriptionError}
                  ref={descriptionRef}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    color="secondary"
                    className="w-full"
                    size={"large"}
                    text={"Cancelar"}
                  />
                  <Button
                    className="w-full"
                    size={"large"}
                    text={"Salvar"}
                    onClick={() => handleSaveClick()}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </CSSTransition>
  )
}

export default AddTaskDialog
