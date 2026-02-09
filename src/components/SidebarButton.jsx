import { tv } from "tailwind-variants"

const SidebarButton = ({ children, color }) => {
  const sidebar = tv({
    base: "flex gap-2 rounded-lg px-6 py-3",
    variants: {
      color: {
        unselected: "text-brand-dark-blue",
        selected: "bg-[#E6F7F8] text-brand-primary",
      },
    },
  })

  return (
    <a href="#" className={sidebar({ color })}>
      {children}
    </a>
  )
}

export default SidebarButton
