'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Workflows', href: '/dashboard/workflows', icon: '🔄' },
    { name: 'Runs', href: '/dashboard/runs', icon: '▶️' },
    { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: '🧠' },
    { name: 'HR Scoring', href: '/dashboard/hr', icon: '👥' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-16' : 'w-64'
                    } bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-200`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    {!collapsed && (
                        <Link href="/dashboard" className="text-xl font-bold text-white">
                            <span className="text-emerald-400">ν</span>ous
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-3 border-t border-gray-700">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            D
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">Demo User</p>
                                <p className="text-xs text-gray-400 truncate">demo@nous.ai</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
