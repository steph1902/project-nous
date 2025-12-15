'use client';

import { useState } from 'react';

// Mock data for candidates
const mockCandidates = [
    {
        id: 'cand_001',
        name: 'Alice Johnson',
        overallScore: 92,
        categories: { experience: 24, skills: 23, communication: 22, cultureFit: 23 },
        submittedAt: '2024-12-15T09:00:00Z',
        hasRedFlags: false,
    },
    {
        id: 'cand_002',
        name: 'Bob Smith',
        overallScore: 78,
        categories: { experience: 20, skills: 19, communication: 18, cultureFit: 21 },
        submittedAt: '2024-12-14T14:30:00Z',
        hasRedFlags: false,
    },
    {
        id: 'cand_003',
        name: 'Carol Davis',
        overallScore: 85,
        categories: { experience: 22, skills: 21, communication: 21, cultureFit: 21 },
        submittedAt: '2024-12-14T10:00:00Z',
        hasRedFlags: true,
    },
    {
        id: 'cand_004',
        name: 'David Wilson',
        overallScore: 65,
        categories: { experience: 15, skills: 18, communication: 16, cultureFit: 16 },
        submittedAt: '2024-12-13T16:00:00Z',
        hasRedFlags: false,
    },
];

function getScoreColor(score: number): string {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
}

export default function HrDashboardPage() {
    const [candidates] = useState(mockCandidates);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">HR Scoring Dashboard</h1>
                    <p className="text-gray-400 mt-1">AI-powered candidate evaluation</p>
                </div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                    Add Candidate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Total Candidates</p>
                    <p className="text-3xl font-bold text-white mt-1">{candidates.length}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Average Score</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">
                        {Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)}
                    </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Top Performers (85+)</p>
                    <p className="text-3xl font-bold text-white mt-1">
                        {candidates.filter((c) => c.overallScore >= 85).length}
                    </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Red Flags</p>
                    <p className="text-3xl font-bold text-red-400 mt-1">
                        {candidates.filter((c) => c.hasRedFlags).length}
                    </p>
                </div>
            </div>

            {/* Rankings Table */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Rank</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Candidate</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Overall</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Experience</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Skills</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Communication</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Culture Fit</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates
                            .sort((a, b) => b.overallScore - a.overallScore)
                            .map((candidate, index) => (
                                <tr key={candidate.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">#{index + 1}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">{candidate.name}</span>
                                            {candidate.hasRedFlags && (
                                                <span className="text-red-400" title="Red flags detected">⚠️</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                                            {candidate.overallScore}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{candidate.categories.experience}/25</td>
                                    <td className="px-6 py-4 text-gray-400">{candidate.categories.skills}/25</td>
                                    <td className="px-6 py-4 text-gray-400">{candidate.categories.communication}/25</td>
                                    <td className="px-6 py-4 text-gray-400">{candidate.categories.cultureFit}/25</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(candidate.submittedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
