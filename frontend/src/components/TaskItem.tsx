import { useState } from 'react'
import type { NewTask, Task } from '../api'
import '../style.css'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, task: Partial<NewTask>) => void
}

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  low: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  high: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
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
    ? new Date(task.due_date).toLocaleDateString()
    : 'Нема рок'

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
      <div className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDateValue}
            onChange={(e) => setDueDateValue(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={saveEdit}
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
      />

      <div className="min-w-0 flex-1">
        <h3
          className={`text-sm font-semibold ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="text-xs text-gray-400">{dueDate}</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={startEdit}
          className="rounded-md p-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-md p-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}