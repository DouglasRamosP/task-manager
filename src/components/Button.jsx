const Button = ({
  icon,
  text,
  color = "primary",
  size = "small",
  type = "button",
  onClick,
  className,
  disabled = false,
  ...rest
}) => {
  const colorClasses = {
    primary:
      "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 hover:bg-brand-primary/90",
    ghost:
      "border border-brand-line bg-white/80 text-brand-ink hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-white",
    secondary:
      "border border-brand-line bg-brand-background/80 text-brand-ink hover:-translate-y-0.5 hover:border-brand-primary/20",
    delete:
      "bg-brand-danger text-white shadow-lg shadow-brand-danger/15 hover:-translate-y-0.5 hover:bg-brand-danger/90",
  }

  const sizeClasses = {
    small: "min-h-10 rounded-2xl px-4 text-sm",
    large: "min-h-12 rounded-2xl px-5 text-sm",
  }

  const classes = [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 focus:ring-offset-transparent",
    colorClasses[color],
    sizeClasses[size],
    disabled &&
      "cursor-not-allowed opacity-60 hover:translate-y-0 hover:opacity-60",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {text ? <span>{text}</span> : null}
    </button>
  )
}

export default Button
