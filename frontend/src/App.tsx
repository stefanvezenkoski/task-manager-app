import { useEffect, useState } from 'react'
import { api, type NewTask, type Task } from './api'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './style.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  async function loadTasks() {
    const data = await api.getTasks()
    setTasks(data)
  }

  useEffect(() => {
    void loadTasks()
  }, [])

  async function handleAdd(task: NewTask) {
    await api.createTask(task)
    await loadTasks()
  }

  async function handleToggle(id: number) {
    await api.toggleTask(id)
    await loadTasks()
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id)
    await loadTasks()
  }

  async function handleEdit(id: number, updatedTask: Partial<NewTask>) {
    await api.updateTask(id, updatedTask)
    await loadTasks()
  }

  return (
    <main className="app-shell">
      <h1>Task Manager</h1>
      <p>Додај, следи и заврши задачи.</p>

      <TaskForm onAdd={handleAdd} />
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
    </main>
  )
}
