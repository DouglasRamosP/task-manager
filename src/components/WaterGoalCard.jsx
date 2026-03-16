const formatWaterLabel = (valueMl) => {
  if (valueMl >= 1000) {
    const liters = valueMl / 1000
    return Number.isInteger(liters)
      ? `${liters} litro${liters > 1 ? "s" : ""}`
      : `${liters}L`
  }

  return `${valueMl} ml`
}

const WaterGoalCard = ({ options, selectedMl, goalMl, onToggleOption }) => {
  return (
    <div className="flex h-full min-h-[360px] flex-col rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-brand-dark-blue">Água</h3>
        <p className="text-sm text-brand-text-gray">
          Beba sua meta diária de água
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggleOption(option.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:opacity-90 ${
                option.checked ? "bg-[#dff5f6]" : "bg-[#f5f5f5]"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  option.checked
                    ? "bg-brand-primary text-white"
                    : "bg-[#e3e3e3] text-transparent"
                }`}
              >
                ✓
              </div>

              <span className="text-sm text-brand-dark-blue">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="h-2 w-full rounded-full bg-[#f0f0f0]">
            <div
              className="h-2 rounded-full bg-brand-primary transition-all"
              style={{
                width: `${Math.min((selectedMl / goalMl) * 100, 100)}%`,
              }}
            />
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <span className="text-sm font-semibold text-brand-primary">
              {formatWaterLabel(selectedMl)}
            </span>
            <span className="text-sm text-brand-text-gray">
              /{goalMl / 1000}L
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterGoalCard
