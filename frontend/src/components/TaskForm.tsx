import { useState, type FormEvent } from 'react'
import type { NewTask } from '../api'

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
      className="form-card"
    >
      <div className="form-title">
        <span>➕</span> Додади нова задача
      </div>

      <div className="form-grid">
        <div>
          <input
            type="text"
            placeholder="Наслов на задачата"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`form-field ${titleInvalid ? 'field-error' : ''}`}
          />
          {titleInvalid && (
            <span className="error-msg">Насловот е задолжителен</span>
          )}
        </div>

        <textarea
          rows={2}
          placeholder="Опис (опционално)..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-field"
        />

        <div className="form-row">
          <div className="field">
            <select
              value={form.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="form-field"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className="form-field"
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          ➕ Додади задача
        </button>
      </div>
    </form>
  )
}