import AddIcon from "../assets/icons/Add.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "./Button"

const Header = ({ subtitle, title, onClearTasks, onOpenDialog }) => {
  return (
    <div className="flex justify-between pb-6">
      <div>
        <span className="text-xs font-semibold text-brand-primary">
          {subtitle}
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button
          color="ghost"
          text="Limpar tarefas"
          icon={<TrashIcon />}
          onClick={onClearTasks}
        />

        <Button
          color="primary"
          text="Nova tarefa"
          icon={<AddIcon />}
          onClick={onOpenDialog}
        />
      </div>
    </div>
  )
}

export default Header
