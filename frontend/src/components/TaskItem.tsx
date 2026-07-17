import type { Task } from '../api'

interface Props {
    task: Task
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
    return (
        <div className="task-item">
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
            <div className="task-details">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    )
}
