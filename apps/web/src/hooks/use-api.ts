'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseApiOptions<T> {
    initialData?: T;
    autoFetch?: boolean;
}

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useApi<T>(
    fetcher: () => Promise<T>,
    options: UseApiOptions<T> = {}
): UseApiResult<T> {
    const { initialData = null, autoFetch = true } = options;
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => {
        if (autoFetch) {
            refetch();
        }
    }, [autoFetch, refetch]);

    return { data, loading, error, refetch };
}

// Specific hooks for each resource

export function useWorkflows() {
    return useApi(() => apiClient.getWorkflows());
}

export function useWorkflow(id: string) {
    return useApi(() => apiClient.getWorkflow(id));
}

export function useRuns(status?: string) {
    return useApi(() => apiClient.getRuns(undefined, status));
}

export function useRun(id: string) {
    return useApi(() => apiClient.getRun(id));
}

export function useDocuments(tags?: string[]) {
    return useApi(() => apiClient.getDocuments(undefined, tags));
}

export function useCandidates() {
    return useApi(() => apiClient.getCandidates());
}

export function useRankings() {
    return useApi(() => apiClient.getRankings());
}

export function useIntegrations() {
    return useApi(() => apiClient.getIntegrations());
}

export function useAuditEvents(filters?: {
    eventType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
}) {
    return useApi(() => apiClient.getAuditEvents(filters));
}
