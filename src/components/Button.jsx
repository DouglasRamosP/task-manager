const Button = ({
  icon,
  text,
  variant = "primary",
  size = "small",
  onClick,
  className,
  ...rest
}) => {
  const getVariantClasses = () => {
    if (variant === "primary") {
      return "bg-[#00ADB5] text-white"
    }

    if (variant === "ghost") {
      return "bg-transparent text-[#818181]"
    }
  }

  const getSizeClasses = () => {
    if (size === "small") {
      return "px-3 py-1 text-xs"
    }

    if (size === "large") {
      return "px-3 py-2 text-sm"
    }
  }

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-md font-semibold transition hover:opacity-75 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {text}
      {icon}
    </button>
  )
}

export default Button
