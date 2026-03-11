import { useQuery } from "@tanstack/react-query"
import { Toaster } from "sonner"

import WaterIcon from "../assets/icons/glass-water.svg?react"
import TaskIcon from "../assets/icons/layout-list.svg?react"
import TaskCheckIcon from "../assets/icons/list-checks.svg?react"
import LoaderIcon from "../assets/icons/loader-circle2.svg?react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Dashboard from "./Dashboard"

const API_URL = "http://localhost:3000"

const HomePage = () => {
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tasks`)

      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.")
      }

      return response.json()
    },
  })

  const taskStats = tasks.reduce(
    (acc, task) => {
      acc.total += 1

      if (task.status === "done") {
        acc.completed += 1
      }

      if (task.status === "in_progress") {
        acc.inProgress += 1
      }

      return acc
    },
    {
      total: 0,
      completed: 0,
      inProgress: 0,
    }
  )

  return (
    <div className="flex">
      <Toaster />
      <Sidebar />

      <main className="w-full space-y-6 px-8 py-16">
        <Header subtitle="Dashboard" title="Início" />

        {isLoading && (
          <p className="text-sm text-brand-text-gray">
            Carregando dados do dashboard...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-600">
            Erro ao carregar dados: {error?.message || "desconhecido"}
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <Dashboard
              icon={<TaskIcon />}
              mainText={String(taskStats.total)}
              secundaryText="Tarefas disponíveis"
            />

            <Dashboard
              icon={<TaskCheckIcon />}
              mainText={String(taskStats.completed)}
              secundaryText="Tarefas concluídas"
            />

            <Dashboard
              icon={<LoaderIcon />}
              mainText={String(taskStats.inProgress)}
              secundaryText="Tarefas em andamento"
            />

            <Dashboard
              icon={<WaterIcon />}
              mainText="40%"
              secundaryText="Água"
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
