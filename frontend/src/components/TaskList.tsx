import type { NewTask, Task } from '../api'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, task: Partial<NewTask>) => void
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="empty-list">
        <div className="emoji">📋</div>
        <p>Сеуште нема задачи. Додади ја првата!</p>
      </div>
    )
  }

  return (
    <section>
      <div className="section-title">
        Сите задачи ({tasks.length})
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </section>
  )
}