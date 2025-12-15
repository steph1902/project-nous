'use client';

import Link from 'next/link';

// Mock data for dashboard
const stats = {
    workflows: 12,
    runs: { total: 1245, running: 3, succeeded: 1180, failed: 62 },
    documents: 45,
    candidates: 89,
};

const recentRuns = [
    { id: 'run_001', workflow: 'HR Candidate Scoring', status: 'SUCCEEDED', time: '2 min ago' },
    { id: 'run_002', workflow: 'Document Ingestion', status: 'RUNNING', time: '5 min ago' },
    { id: 'run_003', workflow: 'Email Triage', status: 'FAILED', time: '12 min ago' },
];

const statusColors: Record<string, string> = {
    RUNNING: 'bg-blue-500/10 text-blue-400',
    SUCCEEDED: 'bg-emerald-500/10 text-emerald-400',
    FAILED: 'bg-red-500/10 text-red-400',
};

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Workflows</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.workflows}</p>
                        </div>
                        <span className="text-3xl">🔄</span>
                    </div>
                    <Link href="/dashboard/workflows" className="text-emerald-400 text-sm hover:underline mt-3 block">
                        View all →
                    </Link>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Runs</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.runs.total}</p>
                        </div>
                        <span className="text-3xl">▶️</span>
                    </div>
                    <div className="flex gap-3 mt-3 text-sm">
                        <span className="text-emerald-400">{stats.runs.succeeded} ✓</span>
                        <span className="text-blue-400">{stats.runs.running} ⟳</span>
                        <span className="text-red-400">{stats.runs.failed} ✗</span>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">KB Documents</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.documents}</p>
                        </div>
                        <span className="text-3xl">🧠</span>
                    </div>
                    <Link href="/dashboard/knowledge" className="text-emerald-400 text-sm hover:underline mt-3 block">
                        Manage KB →
                    </Link>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Candidates Scored</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.candidates}</p>
                        </div>
                        <span className="text-3xl">👥</span>
                    </div>
                    <Link href="/dashboard/hr" className="text-emerald-400 text-sm hover:underline mt-3 block">
                        View rankings →
                    </Link>
                </div>
            </div>

            {/* Recent Runs & Quick Actions */}
            <div className="grid grid-cols-2 gap-6">
                {/* Recent Runs */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent Runs</h2>
                        <Link href="/dashboard/runs" className="text-emerald-400 text-sm hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentRuns.map((run) => (
                            <div
                                key={run.id}
                                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                            >
                                <div>
                                    <p className="text-white">{run.workflow}</p>
                                    <code className="text-emerald-400 text-xs">{run.id}</code>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[run.status]}`}>
                                        {run.status}
                                    </span>
                                    <p className="text-gray-400 text-xs mt-1">{run.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/dashboard/workflows/new"
                            className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-center transition-colors"
                        >
                            <span className="text-2xl block mb-2">➕</span>
                            <span className="text-white text-sm">New Workflow</span>
                        </Link>
                        <Link
                            href="/dashboard/knowledge"
                            className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-center transition-colors"
                        >
                            <span className="text-2xl block mb-2">📄</span>
                            <span className="text-white text-sm">Upload Document</span>
                        </Link>
                        <Link
                            href="/dashboard/hr"
                            className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-center transition-colors"
                        >
                            <span className="text-2xl block mb-2">👤</span>
                            <span className="text-white text-sm">Add Candidate</span>
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-center transition-colors"
                        >
                            <span className="text-2xl block mb-2">🔗</span>
                            <span className="text-white text-sm">Connect Tool</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
