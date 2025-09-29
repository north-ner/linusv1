import axios from "axios";
import { API_BASE_URL } from "../config";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
}
export interface TaskFormData {
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
}

const BASE = `${API_BASE_URL}/api/tasks`;

export const getTasks = () => axios.get<Task[]>(BASE);
export const createTask = (task: TaskFormData) => axios.post<Task>(BASE, task);
export const updateTask = (id: number, task: TaskFormData) => axios.put<Task>(`${BASE}/${id}`, task);
export const deleteTask = (id: number) => axios.delete(`${BASE}/${id}`);
