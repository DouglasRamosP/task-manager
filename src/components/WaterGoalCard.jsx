const formatWaterLabel = (valueMl) => {
  if (valueMl >= 1000) {
    const liters = valueMl / 1000
    return Number.isInteger(liters)
      ? `${liters} litro${liters > 1 ? "s" : ""}`
      : `${liters}L`
  }

  return `${valueMl} ml`
}

const WaterGoalCard = ({
  options,
  selectedMl,
  goalMl,
  onReset,
  onToggleOption,
}) => {
  const progressPercentage = Math.min((selectedMl / goalMl) * 100, 100)

  return (
    <section className="flex h-full min-h-[420px] flex-col rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-ink">
            Meta de hidratação
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            Controle rápido da água consumida ao longo do dia.
          </p>
        </div>

        <button
          className="rounded-full border border-brand-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted transition hover:border-brand-primary/20 hover:text-brand-primary"
          type="button"
          onClick={onReset}
        >
          Resetar
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="rounded-[1.75rem] bg-brand-background p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
                Progresso de hoje
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-brand-ink">
                {Math.round(progressPercentage)}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-brand-primary">
                {formatWaterLabel(selectedMl)}
              </p>
              <p className="text-sm text-brand-muted">
                de {formatWaterLabel(goalMl)}
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggleOption(option.id)}
              className={`flex w-full items-center gap-3 rounded-[1.4rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 ${
                option.checked
                  ? "border-brand-primary/20 bg-brand-primary/10"
                  : "border-brand-line bg-white"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  option.checked
                    ? "bg-brand-primary text-white"
                    : "bg-brand-background text-transparent"
                }`}
              >
                ✓
              </div>

              <div>
                <span className="text-sm font-semibold text-brand-ink">
                  {option.label}
                </span>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brand-muted">
                  {formatWaterLabel(option.valueMl)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WaterGoalCard
