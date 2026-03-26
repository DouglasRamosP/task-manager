import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

import Sidebar from "./Sidebar"

const AppShell = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-background text-brand-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="absolute right-[-5rem] top-[12rem] h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-brand-primary/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Sidebar />

        <div className="relative flex-1">
          <Outlet />
        </div>
      </div>

      <Toaster
        closeButton
        position="top-right"
        richColors
        toastOptions={{
          className:
            "!border !border-brand-line !bg-white !text-brand-ink !shadow-xl",
        }}
      />
    </div>
  )
}

export default AppShell
