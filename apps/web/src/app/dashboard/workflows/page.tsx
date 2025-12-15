'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for workflows
const mockWorkflows = [
    {
        id: 'wf_001',
        name: 'HR Candidate Scoring',
        description: 'Automated candidate evaluation using AI',
        status: 'PUBLISHED',
        version: 3,
        lastRun: '2024-12-15T10:30:00Z',
        runCount: 145,
    },
    {
        id: 'wf_002',
        name: 'Document Ingestion Pipeline',
        description: 'Process and embed documents for RAG',
        status: 'PUBLISHED',
        version: 2,
        lastRun: '2024-12-15T09:15:00Z',
        runCount: 89,
    },
    {
        id: 'wf_003',
        name: 'Customer Support Triage',
        description: 'Route support tickets to appropriate teams',
        status: 'DRAFT',
        version: 1,
        lastRun: null,
        runCount: 0,
    },
];

export default function WorkflowsPage() {
    const [workflows] = useState(mockWorkflows);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    const filteredWorkflows = workflows.filter((wf) => {
        if (filter === 'all') return true;
        return filter === 'published' ? wf.status === 'PUBLISHED' : wf.status === 'DRAFT';
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workflows</h1>
                    <p className="text-gray-400 mt-1">Manage your AI workflow definitions</p>
                </div>
                <Link
                    href="/dashboard/workflows/new"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                    New Workflow
                </Link>
            </div>

            <div className="flex gap-2 mb-6">
                {(['all', 'published', 'draft'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredWorkflows.map((workflow) => (
                    <div
                        key={workflow.id}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${workflow.status === 'PUBLISHED'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-yellow-500/10 text-yellow-400'
                                            }`}
                                    >
                                        {workflow.status}
                                    </span>
                                    <span className="text-gray-500 text-sm">v{workflow.version}</span>
                                </div>
                                <p className="text-gray-400 mt-1">{workflow.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/dashboard/workflows/${workflow.id}`}
                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                                >
                                    Edit
                                </Link>
                                <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm rounded-lg transition-colors">
                                    Run
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                            <span>Runs: {workflow.runCount}</span>
                            {workflow.lastRun && (
                                <span>Last run: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
