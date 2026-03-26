import { TASK_STATUS_META } from "../lib/tasks"
import EmptyState from "./EmptyState"
import TaskItem from "./TaskItem"

const TaskSummaryCard = ({
  tasks = [],
  completionRate = 0,
  handleCheckboxClick,
  onDeleteSuccess,
}) => {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
      <div className="mb-6 flex flex-col gap-4 border-b border-brand-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-ink">
            Visão geral das tarefas
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            Acompanhe as prioridades do dia e avance com clareza.
          </p>
        </div>

        <div className="rounded-2xl bg-brand-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
            Progresso total
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-brand-ink">
            {completionRate}%
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="Nenhuma tarefa cadastrada"
          description="Adicione a primeira tarefa para começar a organizar a rotina e visualizar seu progresso por aqui."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.values(TASK_STATUS_META).map((status) => (
              <div
                key={status.label}
                className="rounded-full border border-brand-line bg-white px-3 py-1.5 text-xs font-medium text-brand-muted"
              >
                {status.label}
              </div>
            ))}
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
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
        </div>
      )}
    </section>
  )
}

export default TaskSummaryCard
