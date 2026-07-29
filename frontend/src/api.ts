export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
}

export interface NewTask {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T>{
    if (!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (res.status===204){
        return undefined as T
    }
    return res.json() as Promise<T>;
}

export const api = {
    getTasks: async (params?: {
        search?: string;
        priority?: "low" | "medium" | "high";
        skip?: number;
        limit?: number;
    }) => {
        let url = `${API_URL}/tasks`;
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append("search", params.search);
        if (params?.priority) searchParams.append("priority", params.priority);
        if (params?.skip) searchParams.append("skip", params.skip.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        const qs = searchParams.toString();
        if (qs) url += `?${qs}`;
        
        const res = await fetch(url);
        return handleResponse<Task[]>(res);
    },
    getTask: async (id: number) => {
        const res = await fetch(`${API_URL}/tasks/${id}`);
        return handleResponse<Task>(res);
    },
    createTask: async (task: NewTask) => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });
        return handleResponse<Task>(res);
    },
    updateTask: async (id: number, task: Partial<NewTask>) => {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });
        return handleResponse<Task>(res);
    },
    deleteTask: async (id: number) => {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });
        return handleResponse<void>(res);
    },
    toggleTask: async (id: number) => {
        const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
            method: "PATCH"
        });
        return handleResponse<Task>(res);
    },
    getStats: async () => {
        const res = await fetch(`${API_URL}/stats`);
        return handleResponse<{
            total: number;
            completed: number;
            remaining: number;
            completion_rate: number;
        }>(res);
    },
}