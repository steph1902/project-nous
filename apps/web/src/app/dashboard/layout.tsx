'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Workflows', href: '/dashboard/workflows', icon: '🔄' },
    { name: 'Runs', href: '/dashboard/runs', icon: '▶️' },
    { name: 'Knowledge', href: '/dashboard/knowledge', icon: '📚' },
    { name: 'HR Scoring', href: '/dashboard/hr', icon: '👥' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0f1a] flex">
            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-40
          bg-[#0d1424]/95 backdrop-blur-xl
          border-r border-gray-800/50
          transition-all duration-300 ease-out
          ${collapsed ? 'w-20' : 'w-64'}
        `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800/50">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-xl">ν</span>
                        </div>
                        {!collapsed && (
                            <span className="text-white font-semibold text-lg tracking-tight">Nous</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }
                `}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                {!collapsed && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                                {isActive && !collapsed && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                {!collapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/50">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">D</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Demo User</p>
                                <p className="text-xs text-gray-500 truncate">demo@nous.ai</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main
                className={`
          flex-1 transition-all duration-300
          ${collapsed ? 'ml-20' : 'ml-64'}
        `}
            >
                {/* Top Bar */}
                <header className="h-16 border-b border-gray-800/50 bg-[#0d1424]/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="h-full px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-white">
                                {navigation.find((n) => n.href === pathname)?.name || 'Dashboard'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
                                🔔
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
                                ❓
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
