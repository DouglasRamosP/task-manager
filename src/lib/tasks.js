const API_URL = import.meta.env.VITE_API_URL

export const TASK_STATUS_META = {
  not_started: {
    label: "Não iniciada",
    description: "Pronta para sair do papel",
  },
  in_progress: {
    label: "Em andamento",
    description: "Já está em execução",
  },
  done: {
    label: "Concluída",
    description: "Finalizada com sucesso",
  },
}

export const TASK_STATUS_ORDER = {
  in_progress: 0,
  not_started: 1,
  done: 2,
}

export const TASK_TIME_PERIODS = [
  {
    value: "morning",
    label: "Manhã",
    description: "Rotina de abertura e foco",
  },
  {
    value: "afternoon",
    label: "Tarde",
    description: "Execução e acompanhamento",
  },
  {
    value: "evening",
    label: "Noite",
    description: "Fechamento e revisão",
  },
]

const ensureApiUrl = () => {
  if (!API_URL) {
    throw new Error("A variável VITE_API_URL não foi configurada.")
  }
}

const getRequestErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json()

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message
    }
  } catch {
    return fallbackMessage
  }

  return fallbackMessage
}

const request = async (path, options = {}) => {
  ensureApiUrl()

  const {
    body,
    errorMessage = "Não foi possível concluir a solicitação.",
    headers,
    ...rest
  } = options

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: body
      ? {
          "Content-Type": "application/json",
          ...headers,
        }
      : headers,
    body,
  })

  if (!response.ok) {
    throw new Error(await getRequestErrorMessage(response, errorMessage))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const buildTaskPayload = (taskData) => ({
  title: taskData.title.trim(),
  description: taskData.description.trim(),
  time: taskData.time,
  status: taskData.status ?? "not_started",
})

export const getTasks = () =>
  request("/tasks", {
    method: "GET",
    errorMessage: "Erro ao buscar tarefas.",
  })

export const getTask = (taskId) =>
  request(`/tasks/${taskId}`, {
    method: "GET",
    errorMessage: "Erro ao carregar a tarefa.",
  })

export const createTask = (taskData) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify({
      id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}`,
      ...buildTaskPayload(taskData),
    }),
    errorMessage: "Erro ao criar tarefa.",
  })

export const updateTask = (taskId, taskData) =>
  request(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(buildTaskPayload(taskData)),
    errorMessage: "Erro ao atualizar tarefa.",
  })

export const updateTaskStatus = (taskId, nextStatus) =>
  request(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: nextStatus }),
    errorMessage: "Erro ao atualizar status da tarefa.",
  })

export const deleteTask = async (taskId) => {
  await request(`/tasks/${taskId}`, {
    method: "DELETE",
    errorMessage: "Erro ao remover tarefa.",
  })

  return taskId
}

export const clearTasks = async (tasks) => {
  await Promise.all(tasks.map((task) => deleteTask(task.id)))
  return true
}

export const getNextTaskStatus = (status) => {
  if (status === "not_started") return "in_progress"
  if (status === "in_progress") return "done"
  return "not_started"
}

export const sortTasks = (tasks = []) =>
  [...tasks].sort((taskA, taskB) => {
    const statusSort =
      (TASK_STATUS_ORDER[taskA.status] ?? Number.MAX_SAFE_INTEGER) -
      (TASK_STATUS_ORDER[taskB.status] ?? Number.MAX_SAFE_INTEGER)

    if (statusSort !== 0) {
      return statusSort
    }

    return taskA.title.localeCompare(taskB.title, "pt-BR")
  })

export const groupTasksByTime = (tasks = []) =>
  TASK_TIME_PERIODS.reduce((groups, period) => {
    groups[period.value] = tasks.filter((task) => task.time === period.value)
    return groups
  }, {})

export const filterTasks = (tasks = [], filters = {}) => {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? ""
  const selectedStatus = filters.status ?? "all"

  return tasks.filter((task) => {
    const matchesStatus =
      selectedStatus === "all" ? true : task.status === selectedStatus

    const matchesSearch =
      normalizedSearch.length === 0
        ? true
        : [task.title, task.description].some((value) =>
            value?.toLowerCase().includes(normalizedSearch)
          )

    return matchesStatus && matchesSearch
  })
}

export const getTaskStats = (tasks = []) => {
  const stats = tasks.reduce(
    (accumulator, task) => {
      accumulator.total += 1

      if (task.status === "done") {
        accumulator.completed += 1
      }

      if (task.status === "in_progress") {
        accumulator.inProgress += 1
      }

      if (task.status === "not_started") {
        accumulator.notStarted += 1
      }

      return accumulator
    },
    {
      total: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    }
  )

  return {
    ...stats,
    completionRate:
      stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100),
  }
}
