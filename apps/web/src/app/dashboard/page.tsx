import Link from 'next/link';

export default function DashboardPage() {
    const stats = [
        { label: 'Active Workflows', value: '12', change: '+2', trend: 'up', icon: '🔄' },
        { label: 'Runs Today', value: '47', change: '+8', trend: 'up', icon: '▶️' },
        { label: 'Success Rate', value: '98.2%', change: '+0.4%', trend: 'up', icon: '✅' },
        { label: 'KB Documents', value: '156', change: '+12', trend: 'up', icon: '📚' },
    ];

    const recentRuns = [
        { id: 'run_1', workflow: 'HR Candidate Scoring', status: 'succeeded', time: '2 min ago', duration: '12s' },
        { id: 'run_2', workflow: 'Document Ingestion', status: 'running', time: '5 min ago', duration: '—' },
        { id: 'run_3', workflow: 'Weekly Report', status: 'succeeded', time: '1 hour ago', duration: '45s' },
        { id: 'run_4', workflow: 'Slack Notification', status: 'failed', time: '2 hours ago', duration: '3s' },
        { id: 'run_5', workflow: 'Data Sync', status: 'succeeded', time: '3 hours ago', duration: '28s' },
    ];

    const statusColors: Record<string, string> = {
        succeeded: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        failed: 'bg-red-500/10 text-red-400 border-red-500/20',
        queued: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/20 p-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome back! 👋</h1>
                    <p className="text-gray-400">Here&apos;s what&apos;s happening with your workflows today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Runs */}
                <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Runs</h2>
                        <Link href="/dashboard/runs" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {recentRuns.map((run) => (
                            <div key={run.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${run.status === 'running' ? 'animate-pulse bg-blue-400' : run.status === 'succeeded' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        <div>
                                            <p className="text-sm font-medium text-white">{run.workflow}</p>
                                            <p className="text-xs text-gray-500">{run.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">{run.duration}</span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[run.status]}`}>
                                            {run.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/workflows"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="text-xl">➕</span>
                                <div>
                                    <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Create Workflow</p>
                                    <p className="text-xs text-gray-500">Design a new automation</p>
                                </div>
                            </Link>
                            <Link
                                href="/dashboard/knowledge"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="text-xl">📤</span>
                                <div>
                                    <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Upload Document</p>
                                    <p className="text-xs text-gray-500">Expand your knowledge base</p>
                                </div>
                            </Link>
                            <Link
                                href="/dashboard/hr"
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="text-xl">👤</span>
                                <div>
                                    <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Score Candidates</p>
                                    <p className="text-xs text-gray-500">AI-powered evaluation</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                        <h2 className="text-lg font-semibold text-white mb-4">System Health</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'API', status: 'healthy', latency: '23ms' },
                                { name: 'Database', status: 'healthy', latency: '5ms' },
                                { name: 'Redis', status: 'healthy', latency: '1ms' },
                                { name: 'Workers', status: 'healthy', latency: '—' },
                            ].map((service) => (
                                <div key={service.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-sm text-gray-300">{service.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{service.latency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
