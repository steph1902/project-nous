'use client';

import { useState } from 'react';

// Mock data for runs
const mockRuns = [
    {
        id: 'run_001',
        workflowName: 'HR Candidate Scoring',
        status: 'SUCCEEDED',
        startedAt: '2024-12-15T10:30:00Z',
        finishedAt: '2024-12-15T10:31:25Z',
        initiatedBy: 'demo@nous.ai',
        nodeCount: 5,
        completedNodes: 5,
    },
    {
        id: 'run_002',
        workflowName: 'Document Ingestion Pipeline',
        status: 'RUNNING',
        startedAt: '2024-12-15T10:28:00Z',
        finishedAt: null,
        initiatedBy: 'api-key',
        nodeCount: 4,
        completedNodes: 2,
    },
    {
        id: 'run_003',
        workflowName: 'HR Candidate Scoring',
        status: 'FAILED',
        startedAt: '2024-12-15T09:15:00Z',
        finishedAt: '2024-12-15T09:16:42Z',
        initiatedBy: 'demo@nous.ai',
        nodeCount: 5,
        completedNodes: 3,
    },
    {
        id: 'run_004',
        workflowName: 'Customer Support Triage',
        status: 'QUEUED',
        startedAt: '2024-12-15T10:32:00Z',
        finishedAt: null,
        initiatedBy: 'api-key',
        nodeCount: 3,
        completedNodes: 0,
    },
];

const statusColors: Record<string, string> = {
    QUEUED: 'bg-gray-500/10 text-gray-400',
    RUNNING: 'bg-blue-500/10 text-blue-400',
    SUCCEEDED: 'bg-emerald-500/10 text-emerald-400',
    FAILED: 'bg-red-500/10 text-red-400',
    CANCELED: 'bg-yellow-500/10 text-yellow-400',
};

export default function RunsPage() {
    const [runs] = useState(mockRuns);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredRuns = runs.filter((run) => {
        if (statusFilter === 'all') return true;
        return run.status === statusFilter;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Runs</h1>
                    <p className="text-gray-400 mt-1">Monitor workflow executions</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {['all', 'RUNNING', 'SUCCEEDED', 'FAILED', 'QUEUED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {status === 'all' ? 'All' : status}
                    </button>
                ))}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Run ID</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Workflow</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Progress</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Started</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRuns.map((run) => {
                            const duration = run.finishedAt
                                ? Math.round(
                                    (new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000
                                )
                                : null;

                            return (
                                <tr key={run.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <code className="text-emerald-400 text-sm">{run.id}</code>
                                    </td>
                                    <td className="px-6 py-4 text-white">{run.workflowName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[run.status]}`}>
                                            {run.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${(run.completedNodes / run.nodeCount) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                {run.completedNodes}/{run.nodeCount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(run.startedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {duration !== null ? `${duration}s` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
