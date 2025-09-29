import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Toast from "./components/Toast";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";
import type { Task, TaskFormData, TaskStatus } from "./services/api";

const statusOptions: (TaskStatus | "ALL")[] = ["ALL", "TODO", "IN_PROGRESS", "DONE"];
const sortOptions = [
  { value: "dueDateAsc", label: "Due Date (Earliest First)" },
  { value: "dueDateDesc", label: "Due Date (Latest First)" },
  { value: "titleAsc", label: "Title (A-Z)" },
  { value: "titleDesc", label: "Title (Z-A)" },
];
const TASKS_PER_PAGE = 5;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("dueDateAsc");
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => setError("Failed to fetch tasks"));
  };

  const handleAddTask = (taskData: TaskFormData) => {
    setLoading(true);
    setError(null);
    createTask(taskData)
      .then(() => {
        fetchTasks();
        setShowAddModal(false);
        showToast("Task added!", "success");
      })
      .catch(() => {
        setError("Failed to add task");
        showToast("Failed to add task", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTask = (id: number) => {
    setDeletingId(id);
    setError(null);
    deleteTask(id)
      .then(() => {
        fetchTasks();
        showToast("Task deleted!", "success");
      })
      .catch(() => {
        setError("Failed to delete task");
        showToast("Failed to delete task", "error");
      })
      .finally(() => setDeletingId(null));
  };

  const handleEditTask = (id: number, data: TaskFormData) => {
    setEditingId(id);
    setEditError(null);
    updateTask(id, data)
      .then(() => {
        fetchTasks();
        showToast("Task updated!", "success");
      })
      .catch(() => {
        setEditError("Failed to update task");
        showToast("Failed to update task", "error");
      })
      .finally(() => setEditingId(null));
  };

  const handleStatusChange = (id: number, status: TaskStatus) => {
    setStatusUpdatingId(id);
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    updateTask(id, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status,
    })
      .then(() => {
        fetchTasks();
        showToast("Status updated!", "success");
      })
      .catch(() => {
        setError("Failed to update status");
        showToast("Failed to update status", "error");
      })
      .finally(() => setStatusUpdatingId(null));
  };

  // Search, filter, and sort
  const filteredTasks = tasks
    .filter(task =>
      (filterStatus === "ALL" ? true : task.status === filterStatus)
      && (
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
        || (task.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDateAsc") {
      return (a.dueDate || "").localeCompare(b.dueDate || "");
    }
    if (sortBy === "dueDateDesc") {
      return (b.dueDate || "").localeCompare(a.dueDate || "");
    }
    if (sortBy === "titleAsc") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "titleDesc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / TASKS_PER_PAGE));
  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  // Reset pagination if filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy, tasks.length]);

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pb-10">
  {/* HEADER */}
      <header className="bg-gradient-to-r from-sky-800 to-blue-900 shadow-lg px-8 py-12 rounded-b-3xl mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title & Tagline */}
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl font-extrabold font-sans tracking-tight mb-0 leading-none text-amber-300">
              Taskger
            </h1>
            <p className="font-medium italic mt-3 mb-0 leading-none text-amber-100">
              just a task manager by @devbrath.singh.danu
            </p>
          </div>
          {/* Add Task Button */}
          <div>
            <button
              className="bg-amber-400 text-sky-900 font-semibold px-8 py-3 rounded-2xl shadow-lg hover:bg-amber-300 hover:text-blue-900 transition-all text-xl"
              onClick={() => setShowAddModal(true)}
            >
              + Add Task
            </button>
          </div>
        </div>
      </header>


      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md">
          <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border-2 border-blue-400 mx-4">
            <button
              className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-blue-700 focus:outline-none"
              onClick={() => setShowAddModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <TaskForm
              onSubmit={handleAddTask}
              loading={loading}
              error={error}
              submitLabel="Add Task"
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 md:px-0 pb-16">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:justify-end gap-8 mb-16">
          <div className="flex flex-col md:flex-row gap-6 md:items-end w-full md:w-auto">
            <div>
              <label className="block text-base font-semibold mb-2 text-gray-700">Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Search tasks..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-2 text-gray-700">Status:</label>
              <select
                className="border-2 border-blue-200 px-6 py-3 rounded-xl min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as TaskStatus | "ALL")}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All" : status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-semibold mb-2 text-gray-700">Sort:</label>
              <select
                className="border-2 border-blue-200 px-6 py-3 rounded-xl min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Task List */}
        <TaskList
          tasks={paginatedTasks}
          onDelete={handleDeleteTask}
          deletingId={deletingId}
          onEdit={handleEditTask}
          editingId={editingId}
          editError={editError}
          onStatusChange={handleStatusChange}
          statusUpdatingId={statusUpdatingId}
        />
        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="py-2 px-4 text-xl font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}