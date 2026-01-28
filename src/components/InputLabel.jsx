const InputLabel = ({ children, ...rest }) => {
  return (
    <label className="text-sm font-semibold text-[#35383E]" {...rest}>
      {children}
    </label>
  )
}

export default InputLabel
