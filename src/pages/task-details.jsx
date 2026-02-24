import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ArrowLeftIcon from "../assets/icons/arrow-left.svg?react"
import ChevronRightIcon from "../assets/icons/chevron-right.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "../components/Button"
import Input from "../components/Input"
import InputLabel from "../components/InputLabel"
import Sidebar from "../components/Sidebar"

const TaskDetailsPage = () => {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)
  const navigate = useNavigate()
  const handleBackClick = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "GET",
      })
      const data = await response.json()
      setTask(data)
    }
    fetchTasks()
  }, [taskId])

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
            icon={<TrashIcon className="h-3.5 w-3.5" />}
          />
        </div>
        {/* dados da tarefa */}
        <div className="mt-6 space-y-6 rounded-xl bg-brand-white p-6">
          <div>
            <Input id="title" label="Título" value={task?.title} />
          </div>
          <div className="flex flex-col">
            <InputLabel htmlFor="horario">Horário</InputLabel>
            <select
              className="rounded-lg border border-solid border-[#ECECEC] px-4 py-3 outline-brand-primary placeholder:text-sm placeholder:text-brand-text-gray"
              name=""
              id="horario"
              defaultValue={task?.time}
            >
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="evening">Noite</option>
            </select>
          </div>
          <div>
            <Input
              id="tdescription"
              label="Descrição"
              value={task?.description}
            />
          </div>
        </div>
        <div className="flex w-full justify-end gap-3 pt-4">
          {/* botões cancelar e salvar */}
          <Button
            onClick={handleBackClick}
            color="secondary"
            size="large"
            text="Cancelar"
          />
          <Button color="primary" size="large" text="Salvar" />
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsPage
