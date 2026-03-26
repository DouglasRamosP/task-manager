const Dashboard = ({ icon, mainText, secondaryText, supportText }) => {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            {icon}
          </div>

          <div>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-brand-ink">
              {mainText}
            </p>
            <p className="mt-1 text-sm text-brand-muted">{secondaryText}</p>
          </div>
        </div>

        {supportText ? (
          <span className="rounded-full bg-brand-background px-3 py-1 text-xs font-semibold text-brand-muted">
            {supportText}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default Dashboard
