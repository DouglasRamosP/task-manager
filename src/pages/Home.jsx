import { Toaster } from "sonner"

import Sidebar from "../components/Sidebar"

const HomePage = () => {
  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
    </div>
  )
}

export default HomePage
