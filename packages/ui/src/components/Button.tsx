import React from 'react';
import { clsx } from 'clsx';
import { colors, radius, fontSize, fontWeight, transition } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
        backgroundColor: colors.primary,
        color: '#FFFFFF',
        border: 'none',
    },
    secondary: {
        backgroundColor: colors.panel,
        color: colors.text,
        border: `1px solid ${colors.border}`,
    },
    danger: {
        backgroundColor: colors.danger,
        color: '#FFFFFF',
        border: 'none',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: colors.text,
        border: 'none',
    },
};

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
        padding: '0.375rem 0.75rem',
        fontSize: fontSize.sm,
    },
    md: {
        padding: '0.5rem 1rem',
        fontSize: fontSize.base,
    },
    lg: {
        padding: '0.75rem 1.5rem',
        fontSize: fontSize.lg,
    },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            disabled,
            children,
            style,
            className,
            ...props
        },
        ref
    ) => {
        const baseStyles: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            borderRadius: radius.md,
            fontWeight: fontWeight.medium,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            opacity: disabled || loading ? 0.5 : 1,
            transition: `all ${transition.fast}`,
            width: fullWidth ? '100%' : 'auto',
            ...variantStyles[variant],
            ...sizeStyles[size],
            ...style,
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                style={baseStyles}
                className={clsx('agentops-button', className)}
                {...props}
            >
                {loading && <Spinner size={size === 'sm' ? 14 : 16} />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

// Internal spinner for button loading state
function Spinner({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 1s linear infinite' }}
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.3"
            />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
    );
}
