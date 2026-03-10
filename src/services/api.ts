// ── API Service for Ghordaura Krishi Farm ──────────────────────────

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 
  (import.meta.env.PROD ? 'https://farm-099l.onrender.com/api' : 'http://localhost:3001/api');
const TOKEN_KEY = 'farm_token';

// ── Types ────────────────────────────────────────────────────────

export interface User {
    id: number;
    username: string;
    name: string;
    role: string;
    created_at?: string;
}

export interface Tree {
    id: number;
    tree_no: string;
    avocado_type: string;
    planted_date: string | null;
    location: string | null;
    harvest_interval_days: number;
    last_harvested: string | null;
    next_harvest_date: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    // Computed fields
    days_remaining: number | null;
    harvest_status: 'overdue' | 'today' | 'soon' | 'scheduled';
    total_harvests: number;
}

export interface Harvest {
    id: number;
    tree_id: number;
    harvest_date: string;
    quantity_kg: number | null;
    quality_grade: string | null;
    notes: string | null;
    recorded_by: number;
    created_at: string;
    // Joined fields (from GET /harvests)
    tree_no?: string;
    avocado_type?: string;
}

export interface DashboardStats {
    total_trees: number;
    total_harvests: number;
    total_kg_harvested: number;
    overdue_trees: number;
    due_soon_trees: number;
}

export interface HarvestAlert extends Tree {
    alert_type: 'overdue' | 'today' | 'soon';
}

export interface AlertsResponse {
    count: number;
    alerts: HarvestAlert[];
}

export interface RecordHarvestResponse {
    harvest: Harvest;
    tree: Tree;
    message: string;
}

// ── Core request function ────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data as T;
}

// ── Auth API ─────────────────────────────────────────────────────

export const authApi = {
    async login(username: string, password: string): Promise<{ token: string; user: User }> {
        const data = await request<{ token: string; user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
    },

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
    },

    async me(): Promise<User> {
        const data = await request<{ user: User }>('/auth/me');
        return data.user;
    },

    async register(username: string, password: string, name: string, role?: string): Promise<{ token: string; user: User }> {
        const data = await request<{ token: string; user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, name, role }),
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
    },

    isLoggedIn(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    },
};

// ── Trees API ────────────────────────────────────────────────────

export const treesApi = {
    async getAll(): Promise<Tree[]> {
        return request<Tree[]>('/trees');
    },

    async getOne(id: number): Promise<Tree & { harvests: Harvest[] }> {
        return request<Tree & { harvests: Harvest[] }>(`/trees/${id}`);
    },

    async create(data: Partial<Tree>): Promise<Tree> {
        return request<Tree>('/trees', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: number, data: Partial<Tree>): Promise<Tree> {
        return request<Tree>(`/trees/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    async delete(id: number): Promise<{ message: string }> {
        return request<{ message: string }>(`/trees/${id}`, {
            method: 'DELETE',
        });
    },

    async importCSV(trees: Record<string, string>[]): Promise<{
        message: string;
        imported_count: number;
        skipped_count: number;
        skipped: { tree_no: string; reason: string }[];
    }> {
        return request('/trees/import', {
            method: 'POST',
            body: JSON.stringify({ trees }),
        });
    },
};

// ── Harvests API ─────────────────────────────────────────────────

export const harvestsApi = {
    async record(data: {
        tree_id: number;
        harvest_date: string;
        quantity_kg?: number;
        quality_grade?: string;
        notes?: string;
    }): Promise<RecordHarvestResponse> {
        return request<RecordHarvestResponse>('/harvests', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getAll(treeId?: number): Promise<Harvest[]> {
        const params = treeId ? `?tree_id=${treeId}` : '';
        return request<Harvest[]>(`/harvests${params}`);
    },

    async getAlerts(): Promise<AlertsResponse> {
        return request<AlertsResponse>('/harvests/alerts');
    },

    async getStats(): Promise<DashboardStats> {
        return request<DashboardStats>('/harvests/stats');
    },

    async delete(id: number): Promise<{ message: string }> {
        return request<{ message: string }>(`/harvests/${id}`, {
            method: 'DELETE',
        });
    },
};

// ── Combined API export ──────────────────────────────────────────

const api = {
    auth: authApi,
    trees: treesApi,
    harvests: harvestsApi,
};

export default api;
