import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Sidebar from "../components/Sidebar"

const TaskDetailsPage = () => {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "GET",
      })
      const data = await response.json()
      setTask(data)
    }
    fetchTasks()
  }, [taskId])

  return (
    <div>
      <Sidebar />
      <p>{task?.title}</p>
    </div>
  )
}

export default TaskDetailsPage
