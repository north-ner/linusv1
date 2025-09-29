import { useState } from "react";
import type { Task, TaskFormData, TaskStatus } from "../services/api";
import TaskForm from "./TaskForm";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  deletingId?: number | null;
  onEdit: (id: number, data: TaskFormData) => void;
  editingId?: number | null;
  editError?: string | null;
  onStatusChange: (id: number, status: TaskStatus) => void;
  statusUpdatingId?: number | null;
}

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function statusBadge(status: TaskStatus) {
  const styles = {
    TODO: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    DONE: "bg-green-100 text-green-700",
  }[status];
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${styles}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function TaskList({
  tasks,
  onDelete,
  deletingId,
  onEdit,
  editingId,
  editError,
  onStatusChange,
  statusUpdatingId,
}: TaskListProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  if (!tasks.length)
    return (
      <div className="text-center mt-12 text-lg text-gray-500 font-semibold">
        No tasks yet. Click "Add Task" to get started!
      </div>
    );

  return (
    <div>
      <ul className="space-y-6">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 transition hover:shadow-xl"
          >
            {/* Left section: Task info */}
            <div className="flex-1 min-w-0">
              {/* Title and badge in one row, spaced */}
              <div className="flex gap-3 items-center mb-2">
                <span className="text-2xl font-extrabold text-gray-800 truncate">{task.title}</span>
                
              </div>
              {/* Description under title+badge */}
              <div className="text-gray-600 mb-2 break-words">{task.description}</div>
              {/* Due date */}
              <div className="text-xs text-gray-400">
                {task.dueDate && (
                  <span>
                    Due: <span className="font-bold text-gray-700">{task.dueDate}</span>
                  </span>
                )}
              </div>
            </div>
            {/* Right section: Controls */}
            <div className="flex gap-3 items-center justify-end mt-4 md:mt-0">
              <select
                className="border border-gray-300 rounded-full px-4 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={task.status}
                onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
                disabled={statusUpdatingId === task.id}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-bold transition"
                onClick={() => setEditTask(task)}
                aria-label={`Edit task "${task.title}"`}
                disabled={editingId === task.id}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow font-bold transition disabled:opacity-50"
                onClick={() => setConfirmId(task.id)}
                disabled={deletingId === task.id}
                aria-label={`Delete task "${task.title}"`}
              >
                {deletingId === task.id ? "Deleting..." : "Delete"}
              </button>
            </div>

            {/* Confirmation Modal */}
            {confirmId === task.id && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs w-full border-2 border-red-200">
                  <h3 className="text-lg font-bold mb-2 text-red-600">Confirm Delete</h3>
                  <p className="mb-4 text-gray-700">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{task.title}</span>?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setConfirmId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                      onClick={() => {
                        onDelete(task.id);
                        setConfirmId(null);
                      }}
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {editTask && editTask.id === task.id && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="bg-white p-0 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl border-2 border-blue-400 mx-4">
                  <TaskForm
                    task={editTask}
                    onSubmit={(data) => {
                      onEdit(editTask.id, data);
                      setEditTask(null);
                    }}
                    loading={editingId === editTask.id}
                    error={editError}
                    submitLabel="Update Task"
                    onCancel={() => setEditTask(null)}
                  />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}