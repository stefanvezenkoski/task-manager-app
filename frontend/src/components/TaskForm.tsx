import { useState, type FormEvent } from 'react'
import type { NewTask } from '../api'
import '../style.css'

interface Props {
  onAdd: (task: NewTask) => void
}

const initialState = {
  title: '',
  description: '',
  priority: 'medium' as NewTask['priority'],
  due_date: '',
}

const PRIORITIES: { value: NewTask['priority']; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function TaskForm({ onAdd }: Props) {
  const [form, setForm] = useState(initialState)
  const [touched, setTouched] = useState(false)

  function handleChange(field: keyof typeof initialState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)

    const title = form.title.trim()
    if (!title) return

    onAdd({
      title,
      description: form.description.trim() || undefined,
      priority: form.priority,
      due_date: form.due_date || undefined,
    })

    setForm(initialState)
    setTouched(false)
  }

  const titleInvalid = touched && !form.title.trim()

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-sm font-semibold text-gray-900">
          Наслов
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="На пр. Испрати понуда до клиент"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:ring-4 ${
            titleInvalid
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {titleInvalid && (
          <span className="text-xs text-red-600">Насловот е задолжителен</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-desc" className="text-sm font-semibold text-gray-900">
          Опис <span className="font-normal text-gray-400">(опционално)</span>
        </label>
        <textarea
          id="task-desc"
          rows={3}
          placeholder="Додади детали за задачата..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="task-priority" className="text-sm font-semibold text-gray-900">
            Приоритет
          </label>
          <select
            id="task-priority"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className={`w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${
              form.priority === 'low'
                ? 'text-green-600'
                : form.priority === 'medium'
                  ? 'text-amber-600'
                  : 'text-red-600'
            }`}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="task-date" className="text-sm font-semibold text-gray-900">
            Рок
          </label>
          <input
            id="task-date"
            type="date"
            value={form.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:translate-y-px"
      >
        Додади задача
      </button>
    </form>
  )
}