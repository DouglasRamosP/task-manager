import { forwardRef } from "react"

import InputErrorMessage from "./InputErrorMessage"
import InputLabel from "./InputLabel"

export const fieldClassName =
  "w-full rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-ink shadow-sm outline-none transition duration-200 placeholder:text-brand-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"

const Input = forwardRef(
  (
    {
      as = "input",
      className,
      error,
      hint,
      inputClassName,
      label,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const Element = as

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <InputLabel htmlFor={rest.id}>{label}</InputLabel>

        <Element
          className={[
            fieldClassName,
            error ? "border-brand-danger focus:border-brand-danger" : "",
            as === "textarea" ? "resize-y" : "",
            inputClassName,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          ref={ref}
          rows={as === "textarea" ? rows : undefined}
          {...rest}
        />

        {hint ? <p className="text-xs text-brand-muted">{hint}</p> : null}
        {error ? <InputErrorMessage>{error.message}</InputErrorMessage> : null}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
