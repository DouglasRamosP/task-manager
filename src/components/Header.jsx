import AddIcon from "../assets/icons/Add.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import Button from "./Button"

const Header = ({
  subtitle,
  title,
  description,
  stats = [],
  onClearTasks,
  onOpenDialog,
  clearDisabled = false,
  clearLabel = "Limpar lista",
  createLabel = "Nova tarefa",
}) => {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-brand-primary/15 bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
            {subtitle}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-brand-ink sm:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="max-w-xl text-sm leading-7 text-brand-muted sm:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {stats.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-brand-line bg-brand-background/80 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-muted">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-brand-ink">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[13rem]">
          <Button
            color="primary"
            text={createLabel}
            icon={<AddIcon className="h-4 w-4" />}
            onClick={onOpenDialog}
            className="w-full"
          />

          <Button
            color="ghost"
            text={clearLabel}
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={onClearTasks}
            disabled={clearDisabled}
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}

export default Header
