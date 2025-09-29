import { useState, useEffect } from "react";
import type { TaskStatus, TaskFormData, Task } from "../services/api";

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  loading?: boolean;
  error?: string | null;
  task?: Task | null;
  submitLabel?: string;
  onCancel?: () => void;
}

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const initialForm: TaskFormData = {
  title: "",
  description: "",
  status: "TODO",
  dueDate: "",
};

export default function TaskForm({
  onSubmit,
  loading,
  error,
  task,
  submitLabel = "Add Task",
  onCancel,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        status: task.status,
        dueDate: task.dueDate || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      return "Title is required.";
    }
    if (form.title.length > 100) {
      return "Title must be at most 100 characters.";
    }
    if (form.description && form.description.length > 500) {
      return "Description must be at most 500 characters.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    onSubmit({
      ...form,
      dueDate: form.dueDate ? form.dueDate : undefined,
    });
  };

  return (
    <form
      className="bg-white shadow rounded-xl p-8 max-w-xl mx-auto mb-6"
      onSubmit={handleSubmit}
      aria-label={submitLabel}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">{submitLabel}</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-700">Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          maxLength={100}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          maxLength={500}
        />
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      {(formError || error) && (
        <div className="mb-2 text-red-600">{formError || error}</div>
      )}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-bold transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? `${submitLabel.replace("Task", "...")}` : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}