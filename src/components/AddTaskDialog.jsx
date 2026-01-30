import "./AddTaskDialog.css"

import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import { v4 } from "uuid"

import Button from "./Button"
import Input from "./Input"
import InputLabel from "./InputLabel"

const AddTaskDialog = ({ isOpen, onClose, handleSubmit }) => {
  const [title, setTitle] = useState()
  const [time, setTime] = useState("morning")
  const [description, setDescription] = useState()

  const nodeRef = useRef()

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
              <h2 className="text-xl font-semibold text-[#35383E]">
                Nova Tarefa
              </h2>
              <p className="mb-4 mt-1 text-sm text-[#9A9C9F]">
                Insira as informações abaixo
              </p>

              <div className="flex w-[336px] flex-col space-y-4">
                <Input
                  id="title"
                  label="Título"
                  placeholder="Insira o título"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <div className="flex flex-col gap-1 text-left">
                  <InputLabel htmlFor="horário">Horário</InputLabel>
                  <select
                    className="rounded-lg border border-solid border-[#ECECEC] px-4 py-3 outline-[#00ADB5] placeholder:text-sm placeholder:text-[#9A9C9F]"
                    name=""
                    id="horario"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
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
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="secondary"
                    className="w-full"
                    size={"large"}
                    text={"Cancelar"}
                  />
                  <Button
                    className="w-full"
                    size={"large"}
                    text={"Salvar"}
                    onClick={() => {
                      handleSubmit({
                        id: v4(),
                        title,
                        description,
                        time,
                        status: "not_started",
                      })
                      onClose()
                    }}
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
