import React from 'react';
import { colors } from '../tokens';

export interface SpinnerProps {
    size?: number | 'sm' | 'md' | 'lg';
    color?: string;
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 40,
};

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = colors.primary,
}) => {
    const sizeValue = typeof size === 'number' ? size : sizeMap[size];

    return (
        <svg
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'agentops-spin 1s linear infinite' }}
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="3"
                strokeOpacity="0.25"
            />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <style>{`
        @keyframes agentops-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </svg>
    );
};

// Full page loading spinner
export const LoadingScreen: React.FC<{ message?: string }> = ({
    message = 'Loading...',
}) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: colors.bg,
            gap: '1rem',
        }}
    >
        <Spinner size="lg" />
        <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>{message}</p>
    </div>
);
