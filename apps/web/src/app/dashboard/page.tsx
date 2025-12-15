export default function DashboardPage() {
    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Overview of your agent workflows and runs
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem',
                }}
            >
                <StatCard label="Total Workflows" value="12" trend="+2 this week" />
                <StatCard label="Active Runs" value="3" trend="Running now" color="success" />
                <StatCard label="KB Documents" value="48" trend="+5 this month" />
                <StatCard label="Candidates Scored" value="156" trend="+23 this week" />
            </div>

            {/* Recent Activity */}
            <div
                style={{
                    backgroundColor: 'var(--color-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                }}
            >
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Recent Runs
                </h2>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr
                            style={{
                                borderBottom: '1px solid var(--color-border)',
                                textAlign: 'left',
                            }}
                        >
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                Workflow
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                Status
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                Duration
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                Started
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <RunRow
                            workflow="HR Candidate Scoring"
                            status="succeeded"
                            duration="12s"
                            started="2 min ago"
                        />
                        <RunRow
                            workflow="Weekly Report Generator"
                            status="running"
                            duration="--"
                            started="5 min ago"
                        />
                        <RunRow
                            workflow="HR Candidate Scoring"
                            status="succeeded"
                            duration="8s"
                            started="1 hour ago"
                        />
                        <RunRow
                            workflow="Document Ingestion"
                            status="failed"
                            duration="3s"
                            started="2 hours ago"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    trend,
    color = 'default',
}: {
    label: string;
    value: string;
    trend: string;
    color?: 'default' | 'success' | 'warning' | 'danger';
}) {
    const colorMap = {
        default: 'var(--color-text)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
    };

    return (
        <div
            style={{
                backgroundColor: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
            }}
        >
            <p
                style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                }}
            >
                {label}
            </p>
            <p
                style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: colorMap[color],
                    marginBottom: '0.25rem',
                }}
            >
                {value}
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                {trend}
            </p>
        </div>
    );
}

function RunRow({
    workflow,
    status,
    duration,
    started,
}: {
    workflow: string;
    status: 'succeeded' | 'running' | 'failed' | 'queued';
    duration: string;
    started: string;
}) {
    const statusColors = {
        succeeded: { bg: 'rgba(46, 204, 113, 0.2)', text: 'var(--color-success)' },
        running: { bg: 'rgba(52, 152, 219, 0.2)', text: '#3498DB' },
        failed: { bg: 'rgba(255, 92, 119, 0.2)', text: 'var(--color-danger)' },
        queued: { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--color-text-muted)' },
    };

    return (
        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{workflow}</td>
            <td style={{ padding: '0.75rem 1rem' }}>
                <span
                    style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: statusColors[status].bg,
                        color: statusColors[status].text,
                        textTransform: 'capitalize',
                    }}
                >
                    {status}
                </span>
            </td>
            <td
                style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-secondary)',
                }}
            >
                {duration}
            </td>
            <td
                style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                }}
            >
                {started}
            </td>
        </tr>
    );
}
