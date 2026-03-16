import AddIcon from "../assets/icons/Add.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "./Button"

const Header = ({ subtitle, title, onClearTasks, onOpenDialog }) => {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <span className="text-xs font-semibold text-brand-primary">
          {subtitle}
        </span>
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button
          color="ghost"
          text="Limpar tarefas"
          icon={<TrashIcon />}
          onClick={onClearTasks}
          className="w-full justify-center sm:w-auto"
        />

        <Button
          color="primary"
          text="Nova tarefa"
          icon={<AddIcon />}
          onClick={onOpenDialog}
          className="w-full justify-center sm:w-auto"
        />
      </div>
    </div>
  )
}

export default Header
