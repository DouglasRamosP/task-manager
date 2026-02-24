import { tv } from "tailwind-variants"

const Button = ({
  icon,
  text,
  color = "primary",
  size = "small",
  onClick,
  className,
  ...rest
}) => {
  const button = tv({
    base: "flex items-center justify-center gap-2 rounded-md font-semibold transition hover:opacity-75",
    variants: {
      color: {
        primary: "bg-brand-primary text-white",
        ghost: "bg-transparent text-brand-dark-gray",
        secondary: "bg-brand-light-gray text-brand-dark-blue",
        delete: "bg-brand-danger text-brand-white",
      },
      size: {
        small: "px-3 py-1 text-xs",
        large: "px-3 py-2 text-sm",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed hover:opacity-50",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "small",
    },
  })

  return (
    <button
      className={button({ color, size, disabled: rest.disabled, className })}
      onClick={onClick}
      {...rest}
    >
      {text}
      {icon}
    </button>
  )
}

export default Button
