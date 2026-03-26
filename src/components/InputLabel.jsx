const InputLabel = ({ children, ...rest }) => {
  return (
    <label
      className="text-sm font-semibold tracking-[-0.01em] text-brand-ink"
      {...rest}
    >
      {children}
    </label>
  )
}

export default InputLabel
