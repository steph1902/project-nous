'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'team' | 'integrations' | 'api'>('general');

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your organization settings</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-gray-700">
                {(['general', 'team', 'integrations', 'api'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-emerald-400 border-b-2 border-emerald-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Organization Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name</label>
                                <input
                                    type="text"
                                    defaultValue="Acme Corp"
                                    className="w-full max-w-md px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Default Timezone</label>
                                <select className="w-full max-w-md px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
                                    <option>UTC</option>
                                    <option>America/New_York</option>
                                    <option>Europe/London</option>
                                    <option>Asia/Tokyo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Settings */}
            {activeTab === 'team' && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Team Members</h3>
                        <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg">
                            Invite Member
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Demo User', email: 'demo@nous.ai', role: 'Owner' },
                            { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
                            { name: 'Bob Smith', email: 'bob@example.com', role: 'Operator' },
                        ].map((member) => (
                            <div key={member.email} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div>
                                    <p className="text-white">{member.name}</p>
                                    <p className="text-sm text-gray-400">{member.email}</p>
                                </div>
                                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
                <div className="grid gap-4">
                    {[
                        { name: 'Slack', icon: '💬', status: 'connected' },
                        { name: 'Gmail', icon: '📧', status: 'not_connected' },
                        { name: 'Google Sheets', icon: '📊', status: 'not_connected' },
                        { name: 'HTTP Webhook', icon: '🔗', status: 'connected' },
                    ].map((integration) => (
                        <div
                            key={integration.name}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{integration.icon}</span>
                                <div>
                                    <p className="text-white font-medium">{integration.name}</p>
                                    <p className="text-sm text-gray-400">
                                        {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${integration.status === 'connected'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    }`}
                            >
                                {integration.status === 'connected' ? 'Configure' : 'Connect'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">API Keys</h3>
                        <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg">
                            Create Key
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Production API Key', prefix: 'ak_prod_...', created: '2024-12-01' },
                            { name: 'Development Key', prefix: 'ak_dev_...', created: '2024-12-10' },
                        ].map((key) => (
                            <div key={key.prefix} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div>
                                    <p className="text-white">{key.name}</p>
                                    <code className="text-sm text-emerald-400">{key.prefix}</code>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400">Created {key.created}</span>
                                    <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
