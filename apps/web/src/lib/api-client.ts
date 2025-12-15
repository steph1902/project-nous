/**
 * API Client for Nous Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    headers?: Record<string, string>;
}

interface ApiError {
    message: string;
    statusCode: number;
}

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    getToken(): string | null {
        if (this.token) return this.token;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const token = this.getToken();
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error: ApiError = await response.json().catch(() => ({
                message: 'An error occurred',
                statusCode: response.status,
            }));
            throw new Error(error.message);
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        const result = await this.request<{ accessToken: string; user: unknown }>('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        this.setToken(result.accessToken);
        return result;
    }

    async register(name: string, email: string, password: string) {
        const result = await this.request<{ accessToken: string; user: unknown }>('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        });
        this.setToken(result.accessToken);
        return result;
    }

    async logout() {
        this.setToken(null);
    }

    async getMe() {
        return this.request<{ user: unknown }>('/auth/me');
    }

    // Workflows
    async getWorkflows(cursor?: string) {
        const query = cursor ? `?cursor=${cursor}` : '';
        return this.request<{ workflows: unknown[]; nextCursor?: string }>(`/workflows${query}`);
    }

    async getWorkflow(id: string) {
        return this.request<{ workflow: unknown }>(`/workflows/${id}`);
    }

    async createWorkflow(name: string, description?: string) {
        return this.request<{ workflow: unknown }>('/workflows', {
            method: 'POST',
            body: { name, description },
        });
    }

    async publishWorkflowVersion(workflowId: string, dag: unknown) {
        return this.request<{ version: unknown }>(`/workflows/${workflowId}/versions`, {
            method: 'POST',
            body: { dag },
        });
    }

    // Runs
    async getRuns(cursor?: string, status?: string) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (status) params.set('status', status);
        const query = params.toString() ? `?${params}` : '';
        return this.request<{ runs: unknown[]; nextCursor?: string }>(`/runs${query}`);
    }

    async getRun(id: string) {
        return this.request<{ run: unknown }>(`/runs/${id}`);
    }

    async startRun(workflowVersionId: string, input?: unknown, idempotencyKey?: string) {
        return this.request<{ run: unknown }>('/runs', {
            method: 'POST',
            body: { workflowVersionId, input, idempotencyKey },
        });
    }

    async cancelRun(id: string) {
        return this.request<{ run: unknown }>(`/runs/${id}/cancel`, {
            method: 'POST',
        });
    }

    // Knowledge Base
    async getDocuments(cursor?: string, tags?: string[]) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (tags?.length) params.set('tags', tags.join(','));
        const query = params.toString() ? `?${params}` : '';
        return this.request<{ documents: unknown[]; nextCursor?: string }>(`/knowledge-base/documents${query}`);
    }

    async ingestDocument(title: string, content: string, sourceType: string, tags?: string[]) {
        return this.request<{ document: unknown }>('/knowledge-base/documents', {
            method: 'POST',
            body: { title, content, sourceType, tags },
        });
    }

    async queryKnowledgeBase(query: string, topK?: number) {
        return this.request<{ results: unknown[] }>('/knowledge-base/query', {
            method: 'POST',
            body: { query, topK },
        });
    }

    // HR Scoring
    async getCandidates(cursor?: string) {
        const query = cursor ? `?cursor=${cursor}` : '';
        return this.request<{ candidates: unknown[]; nextCursor?: string }>(`/hr/candidates${query}`);
    }

    async getRankings() {
        return this.request<{ rankings: unknown[] }>('/hr/rankings');
    }

    async submitCandidate(name: string, email: string, answers: Record<string, string>) {
        return this.request<{ candidate: unknown; submission: unknown }>('/hr/candidates', {
            method: 'POST',
            body: { name, email, answers },
        });
    }

    // Integrations
    async getIntegrations() {
        return this.request<{ integrations: unknown[] }>('/integrations');
    }

    async createIntegration(
        name: string,
        type: string,
        configJson: unknown,
        permissions?: string[],
        secrets?: Array<{ key: string; value: string }>
    ) {
        return this.request<{ integrationId: string }>('/integrations', {
            method: 'POST',
            body: { name, type, configJson, permissions, secrets },
        });
    }

    async executeIntegration(integrationId: string, action: string, params: unknown, scope: string) {
        return this.request<{ success: boolean; data?: unknown }>(`/integrations/${integrationId}/execute`, {
            method: 'POST',
            body: { action, params, scope },
        });
    }

    // Audit
    async getAuditEvents(filters?: {
        eventType?: string;
        entityType?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        cursor?: string;
    }) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.set(key, String(value));
            });
        }
        const query = params.toString() ? `?${params}` : '';
        return this.request<{ events: unknown[]; total: number; nextCursor?: string }>(`/audit/events${query}`);
    }
}

export const apiClient = new ApiClient();
export default apiClient;
