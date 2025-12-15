export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: '240px',
                    backgroundColor: 'var(--color-panel)',
                    borderRight: '1px solid var(--color-border)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>AgentOps</span>
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <NavItem href="/dashboard" icon="📊" label="Dashboard" />
                    <NavItem href="/dashboard/workflows" icon="🔄" label="Workflows" />
                    <NavItem href="/dashboard/runs" icon="▶️" label="Runs" />
                    <NavItem href="/dashboard/knowledge-base" icon="📚" label="Knowledge Base" />
                    <NavItem href="/dashboard/hr" icon="👥" label="HR Scoring" />
                    <NavItem href="/dashboard/integrations" icon="🔌" label="Integrations" />
                </nav>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Bottom nav */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <NavItem href="/dashboard/settings" icon="⚙️" label="Settings" />
                    <NavItem href="/dashboard/audit" icon="📋" label="Audit Log" />
                </nav>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}

function NavItem({
    href,
    icon,
    label,
}: {
    href: string;
    icon: string;
    label: string;
}) {
    return (
        <a
            href={href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                transition: 'all 150ms ease',
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </a>
    );
}
