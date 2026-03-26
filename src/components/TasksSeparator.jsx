const TasksSeparator = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-3 border-b border-brand-line pb-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-background text-brand-primary">
        {icon}
      </div>

      <div>
        <p className="text-lg font-semibold text-brand-ink">{title}</p>
        <p className="text-sm text-brand-muted">
          Tarefas organizadas por período
        </p>
      </div>
    </div>
  )
}

export default TasksSeparator
