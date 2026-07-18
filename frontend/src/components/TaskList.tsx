import type { NewTask, Task } from '../api'
import TaskItem from './TaskItem'
import '../style.css'

interface Props {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, task: Partial<NewTask>) => void
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
        <p className="text-sm text-gray-500">Нема задачи. Додади ја првата!</p>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Сите задачи
      </h3>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </section>
  )
}