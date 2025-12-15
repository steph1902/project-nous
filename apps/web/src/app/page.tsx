import Link from 'next/link';

export default function Home() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            {/* Hero Section */}
            <div
                style={{
                    textAlign: 'center',
                    maxWidth: '800px',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}
                >
                    🤖
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6D5EF7 0%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem',
                    }}
                >
                    AgentOps
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '1.25rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                    }}
                >
                    Build, deploy, and manage AI agent workflows at scale.
                    <br />
                    Multi-agent orchestration • RAG knowledge base • HR scoring
                </p>

                {/* CTA Buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link
                        href="/dashboard"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 500,
                            transition: 'all 200ms ease',
                        }}
                    >
                        Get Started →
                    </Link>
                    <Link
                        href="/docs"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--color-panel)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 500,
                            transition: 'all 200ms ease',
                        }}
                    >
                        Documentation
                    </Link>
                </div>
            </div>

            {/* Feature Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1000px',
                    width: '100%',
                    marginTop: '4rem',
                }}
            >
                <FeatureCard
                    icon="🔄"
                    title="Workflow Orchestration"
                    description="Build complex DAG-based workflows with drag-and-drop. Automatic retries, idempotency, and parallel execution."
                />
                <FeatureCard
                    icon="🧠"
                    title="RAG Knowledge Base"
                    description="Ingest documents, generate embeddings, and query with citations. Reduce hallucinations with grounded answers."
                />
                <FeatureCard
                    icon="👥"
                    title="HR Scoring"
                    description="Score candidates automatically with customizable rubrics. Explainable AI with evidence-backed assessments."
                />
            </div>

            {/* Footer */}
            <footer
                style={{
                    marginTop: '4rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                }}
            >
                Built with Next.js, NestJS, and PostgreSQL
            </footer>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div
            style={{
                backgroundColor: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                transition: 'all 200ms ease',
            }}
        >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
            <h3
                style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                }}
            >
                {description}
            </p>
        </div>
    );
}
