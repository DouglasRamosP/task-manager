const InputErrorMessage = ({ children }) => {
  return (
    <p className="text-left text-xs font-medium text-brand-danger">
      {children}
    </p>
  )
}

export default InputErrorMessage
