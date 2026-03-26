import { NavLink } from "react-router-dom"

const SidebarButton = ({ children, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex min-w-fit shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[1.1rem] border px-4 py-3 text-sm font-medium transition duration-200 [&_svg]:shrink-0",
          isActive
            ? "border-brand-primary/30 bg-brand-primary/15 text-white shadow-lg shadow-black/20"
            : "border-transparent bg-transparent text-white/75 hover:border-white/10 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  )
}

export default SidebarButton
