import axios from "axios";

// Adjust API_BASE_URL if your backend runs elsewhere
const API_BASE_URL = "http://localhost:8080/api/tasks";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}

export const getTasks = () => axios.get<Task[]>(API_BASE_URL);

export const createTask = (task: TaskFormData) => axios.post<Task>(API_BASE_URL, task);

export const updateTask = (id: number, task: TaskFormData) =>
  axios.put<Task>(`${API_BASE_URL}/${id}`, task);

export const deleteTask = (id: number) => axios.delete(`${API_BASE_URL}/${id}`);