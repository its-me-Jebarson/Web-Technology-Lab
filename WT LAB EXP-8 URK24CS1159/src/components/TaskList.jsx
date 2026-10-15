import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export default function TaskList({ tasks, toggleTask, deleteTask, filter, setFilter }) {
  const visible = tasks.filter(t => filter === "all" ? true : filter === "active" ? !t.done : t.done);

  return (
    <div className="panel task-panel">
      <div className="panel-head">
        <div><h3>Tasks</h3><p>Keep your academic work on track</p></div>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All tasks</option><option value="active">Active</option><option value="done">Completed</option>
        </select>
      </div>
      <div className="task-list">
        {visible.length === 0 && <div className="empty">No tasks in this view.</div>}
        {visible.map(task => (
          <div className={`task-row ${task.done ? "done" : ""}`} key={task.id}>
            <button className="check" onClick={() => toggleTask(task.id)}>
              {task.done ? <CheckCircle2 size={21} /> : <Circle size={21} />}
            </button>
            <div className="task-main"><strong>{task.title}</strong><span>{task.course} • {task.date}</span></div>
            <span className={`priority ${task.priority}`}>{task.priority}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}><Trash2 size={17} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}