import { NavLink } from "react-router-dom"
import { tv } from "tailwind-variants"

const SidebarButton = ({ children, to }) => {
  const sidebar = tv({
    base: "flex min-w-fit items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 lg:px-6",
    variants: {
      color: {
        unselected: "text-brand-dark-blue",
        selected: "bg-[#E6F7F8] text-brand-primary",
      },
    },
  })

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        sidebar({ color: isActive ? "selected" : "unselected" })
      }
    >
      {children}
    </NavLink>
  )
}

export default SidebarButton
