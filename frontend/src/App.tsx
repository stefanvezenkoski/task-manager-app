import { useCallback, useEffect, useState } from 'react'
import { api, type NewTask, type Task } from './api'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './style.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [stats, setStats] = useState<{ total: number; completed: number; remaining: number } | null>(null)

  const loadTasks = useCallback(async () => {
    const data = await api.getTasks({
      search: search || undefined,
      priority: (priorityFilter as 'low' | 'medium' | 'high') || undefined,
    })
    setTasks(data)
  }, [search, priorityFilter])

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } catch {
      // stats API not critical
    }
  }, [])

  useEffect(() => {
    void loadTasks()
    void loadStats()
  }, [loadTasks, loadStats])

  async function handleAdd(task: NewTask) {
    await api.createTask(task)
    await loadTasks()
    await loadStats()
  }

  async function handleToggle(id: number) {
    await api.toggleTask(id)
    await loadTasks()
    await loadStats()
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id)
    await loadTasks()
    await loadStats()
  }

  async function handleEdit(id: number, updatedTask: Partial<NewTask>) {
    await api.updateTask(id, updatedTask)
    await loadTasks()
  }

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const remaining = total - completed

  return (
    <div id="app">
      <header className="app-header">
        <h1>
          <span className="icon">📝</span> Task Manager
        </h1>
        <p>Организирај ги твоите задачи со стил</p>
      </header>

      {/* Stats bar */}
      {(total > 0 || stats) && (
        <div className="stats-bar">
          <div className="stat-chip">
            <span className="dot" style={{ background: '#f5c518' }}></span>
            Вкупно <span className="num">{stats?.total ?? total}</span>
          </div>
          <div className="stat-chip">
            <span className="dot" style={{ background: '#4caf50' }}></span>
            Завршени <span className="num">{stats?.completed ?? completed}</span>
          </div>
          <div className="stat-chip">
            <span className="dot" style={{ background: '#ff9800' }}></span>
            Преостанати <span className="num">{stats?.remaining ?? remaining}</span>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="filter-bar">
        <div className="filter-search">
          <span className="filter-icon">🔍</span>
          <input
            type="text"
            placeholder="Пребарај задача..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="filter-clear">✕</button>
          )}
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Сите приоритети</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      <TaskForm onAdd={handleAdd} />
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  )
}