import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0a0f1a]">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/5 to-transparent rounded-full" />
            </div>

            {/* Hero Section */}
            <header className="relative">
                {/* Navigation */}
                <nav className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-white tracking-tight">
                            <span className="text-emerald-400 text-3xl font-light">ν</span>ous
                        </div>
                        <div className="flex items-center gap-8">
                            <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                Features
                            </Link>
                            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                Pricing
                            </Link>
                            <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                                Sign in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400 text-sm font-medium tracking-wide">νοῦς — The Cosmic Mind</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        The Mind Behind
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                            Your Workflow
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Enterprise-grade AI Agent Orchestrator with Multi-Agent collaboration,
                        RAG knowledge bases, and intelligent HR scoring.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-medium rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1"
                        >
                            Start Building
                            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-lg font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
                        >
                            Learn More
                        </Link>
                    </div>

                    <p className="text-gray-600 mt-8 italic text-lg">
                        &quot;Reason in Motion&quot;
                    </p>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        {[
                            { value: '8', label: 'Backend Modules' },
                            { value: '92', label: 'Tests Passing' },
                            { value: '25+', label: 'API Endpoints' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Build, deploy, and monitor AI-powered workflows with enterprise-grade reliability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🔄',
                                title: 'Workflow Orchestration',
                                description: 'Visual DAG builder with automatic retries, idempotency, and parallel execution.',
                                gradient: 'from-blue-500/20 to-transparent',
                            },
                            {
                                icon: '🧠',
                                title: 'RAG Knowledge Base',
                                description: 'Ingest documents, generate embeddings, and answer questions with citations.',
                                gradient: 'from-purple-500/20 to-transparent',
                            },
                            {
                                icon: '👥',
                                title: 'HR Scoring',
                                description: 'AI-powered candidate evaluation with customizable rubrics and rankings.',
                                gradient: 'from-pink-500/20 to-transparent',
                            },
                            {
                                icon: '🔌',
                                title: 'Tool Integrations',
                                description: 'Connect Slack, Gmail, Sheets, and HTTP webhooks with scoped permissions.',
                                gradient: 'from-orange-500/20 to-transparent',
                            },
                            {
                                icon: '📊',
                                title: 'Observability',
                                description: 'Structured logging, audit trails, and real-time run monitoring.',
                                gradient: 'from-cyan-500/20 to-transparent',
                            },
                            {
                                icon: '🔐',
                                title: 'Enterprise Security',
                                description: 'RBAC, encrypted secrets, API keys, and multi-tenant isolation.',
                                gradient: 'from-red-500/20 to-transparent',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative">
                                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture Preview */}
            <section className="py-24 bg-gray-900/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Built with Modern Architecture
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Clean, maintainable code following Domain-Driven Design principles.
                                Every module is testable, scalable, and production-ready.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'NestJS + Next.js monorepo',
                                    'PostgreSQL with pgvector',
                                    'BullMQ for job queues',
                                    'OpenAI for AI features',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 font-mono text-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <pre className="text-gray-400 overflow-x-auto">
                                {`nous/
├── apps/
│   ├── api/          # NestJS
│   ├── web/          # Next.js
│   └── workers/      # BullMQ
├── packages/
│   ├── shared/       # Types
│   └── ui/           # Components
└── docker-compose.yml`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 blur-3xl" />
                        <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Ready to Orchestrate Intelligence?
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Join teams using Nous to automate complex workflows with AI.
                            </p>
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-medium rounded-xl transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1"
                            >
                                Get Started Free
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="text-xl font-bold text-white">
                        <span className="text-emerald-400 text-2xl font-light">ν</span>ous
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 Nous. Built with ❤️ for enterprise AI orchestration.
                    </p>
                </div>
            </footer>
        </div>
    );
}
