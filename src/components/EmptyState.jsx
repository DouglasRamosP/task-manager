const EmptyState = ({ title, description, action }) => {
  return (
    <div className="rounded-3xl border border-dashed border-brand-line bg-brand-surface/70 px-6 py-10 text-center">
      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
        <p className="text-sm leading-6 text-brand-muted">{description}</p>
      </div>

      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export default EmptyState
