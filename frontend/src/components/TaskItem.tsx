import { useState } from 'react'
import type { NewTask, Task } from '../api'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, task: Partial<NewTask>) => void
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState<Task['priority']>(task.priority)
  const [dueDateValue, setDueDateValue] = useState(task.due_date ?? '')

  const dueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('mk-MK', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  function startEdit() {
    setIsEditing(true)
    setTitle(task.title)
    setDescription(task.description ?? '')
    setPriority(task.priority)
    setDueDateValue(task.due_date ?? '')
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  function saveEdit() {
    const updatedTask: Partial<NewTask> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDateValue || undefined,
    }

    onEdit(task.id, updatedTask)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="edit-card">
        <div className="form-grid" style={{ gap: '10px' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="edit-field"
            placeholder="Наслов"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="edit-field"
            placeholder="Опис"
          />
          <div className="form-row">
            <div className="field">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="edit-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="field">
              <input
                type="date"
                value={dueDateValue}
                onChange={(e) => setDueDateValue(e.target.value)}
                className="edit-field"
              />
            </div>
          </div>
          <div className="edit-actions">
            <button onClick={saveEdit} className="btn-save">
              💾 Зачувај
            </button>
            <button onClick={cancelEdit} className="btn-cancel">
              Откажи
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-top">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />

        <div className="task-content">
          <div className={`task-title ${task.completed ? 'done' : ''}`}>
            {task.title}
          </div>
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}
          <div className="task-meta">
            <span className={`priority-badge ${task.priority}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {dueDate && (
              <span className="due-badge">
                🗓 {dueDate}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button onClick={startEdit} className="btn-icon" title="Уреди">
            ✏️
          </button>
          <button onClick={() => onDelete(task.id)} className="btn-icon danger" title="Избриши">
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}