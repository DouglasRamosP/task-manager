import TaskItem from "../components/TaskItem"

const TaskSummaryCard = ({
  tasks = [],
  handleCheckboxClick,
  onDeleteSuccess,
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-brand-dark-blue">Tarefas</h3>
        <p className="text-sm text-brand-text-gray">
          Resumo das tarefas disponíveis
        </p>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-brand-text-gray">
          Nenhuma tarefa cadastrada.
        </p>
      ) : (
        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleCheckboxClick}
              onDeleteSuccess={onDeleteSuccess}
              showDeleteButton={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskSummaryCard
