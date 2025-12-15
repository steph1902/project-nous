import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                <nav className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-white">
                            <span className="text-emerald-400">ν</span>ous
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                                Sign in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="text-sm text-emerald-400 font-medium mb-4 tracking-wider uppercase">
                        νοῦς — The Cosmic Mind
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        The Mind Behind<br />
                        <span className="text-emerald-400">Your Workflow</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Enterprise-grade AI Agent Orchestrator with Multi-Agent collaboration,
                        RAG knowledge bases, and intelligent HR scoring.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-medium rounded-xl transition-colors"
                        >
                            Start Building
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-medium rounded-xl transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>

                    <p className="text-gray-500 mt-8 italic">
                        &quot;Reason in Motion&quot;
                    </p>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Build, deploy, and monitor AI-powered workflows with enterprise-grade reliability.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🔄',
                                title: 'Workflow Orchestration',
                                description:
                                    'Visual DAG builder with automatic retries, idempotency, and parallel execution.',
                            },
                            {
                                icon: '🧠',
                                title: 'RAG Knowledge Base',
                                description:
                                    'Ingest documents, generate embeddings, and answer questions with citations.',
                            },
                            {
                                icon: '👥',
                                title: 'HR Scoring',
                                description:
                                    'AI-powered candidate evaluation with customizable rubrics and rankings.',
                            },
                            {
                                icon: '🔌',
                                title: 'Tool Integrations',
                                description:
                                    'Connect Slack, Gmail, Sheets, and HTTP webhooks with scoped permissions.',
                            },
                            {
                                icon: '📊',
                                title: 'Observability',
                                description:
                                    'Structured logging, audit trails, and real-time run monitoring.',
                            },
                            {
                                icon: '🔐',
                                title: 'Enterprise Security',
                                description:
                                    'RBAC, encrypted secrets, API keys, and multi-tenant isolation.',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors"
                            >
                                <span className="text-4xl mb-4 block">{feature.icon}</span>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Orchestrate Intelligence?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Join teams using Nous to automate complex workflows with AI.
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-medium rounded-xl transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="text-xl font-bold text-white">
                        <span className="text-emerald-400">ν</span>ous
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 Nous. Built with ❤️ for enterprise AI orchestration.
                    </p>
                </div>
            </footer>
        </div>
    );
}
