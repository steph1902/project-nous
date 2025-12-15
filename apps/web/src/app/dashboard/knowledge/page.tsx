'use client';

import { useState } from 'react';

// Mock data for documents
const mockDocuments = [
    {
        id: 'doc_001',
        title: 'Employee Handbook 2024',
        sourceType: 'PDF',
        chunkCount: 45,
        tags: ['hr', 'policy'],
        createdAt: '2024-12-10T08:00:00Z',
    },
    {
        id: 'doc_002',
        title: 'Product Documentation',
        sourceType: 'MARKDOWN',
        chunkCount: 128,
        tags: ['product', 'technical'],
        createdAt: '2024-12-12T14:30:00Z',
    },
    {
        id: 'doc_003',
        title: 'Customer FAQ',
        sourceType: 'HTML',
        chunkCount: 32,
        tags: ['support', 'faq'],
        createdAt: '2024-12-14T11:00:00Z',
    },
];

export default function KnowledgeBasePage() {
    const [documents] = useState(mockDocuments);
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState<null | { answer: string; sources: string[] }>(null);
    const [querying, setQuerying] = useState(false);

    const handleQuery = async () => {
        if (!query.trim()) return;
        setQuerying(true);

        // Mock query result
        setTimeout(() => {
            setQueryResult({
                answer:
                    'Based on the Employee Handbook, the standard PTO policy allows for 15 days of paid time off per year for full-time employees, with an additional 5 days after 3 years of service.',
                sources: ['Employee Handbook 2024'],
            });
            setQuerying(false);
        }, 1500);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
                    <p className="text-gray-400 mt-1">Manage documents for RAG queries</p>
                </div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                    Upload Document
                </button>
            </div>

            {/* Query Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Ask the Knowledge Base</h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What is the PTO policy?"
                        className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                    />
                    <button
                        onClick={handleQuery}
                        disabled={querying}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium rounded-lg transition-colors"
                    >
                        {querying ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {queryResult && (
                    <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                        <p className="text-white">{queryResult.answer}</p>
                        <div className="mt-2 flex gap-2">
                            {queryResult.sources.map((source) => (
                                <span
                                    key={source}
                                    className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded"
                                >
                                    📄 {source}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Documents List */}
            <h2 className="text-lg font-semibold text-white mb-4">Documents</h2>
            <div className="grid gap-4">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {doc.sourceType === 'PDF'
                                            ? '📄'
                                            : doc.sourceType === 'MARKDOWN'
                                                ? '📝'
                                                : '🌐'}
                                    </span>
                                    <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                        {doc.sourceType}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                    <span>{doc.chunkCount} chunks</span>
                                    <span>Added {new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {doc.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
