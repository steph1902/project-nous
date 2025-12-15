import React from 'react';
import { clsx } from 'clsx';
import { colors, radius, fontSize, spacing } from '../tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
}

const variantStyles: Record<string, React.CSSProperties> = {
    default: {
        backgroundColor: colors.panelHover,
        color: colors.text,
    },
    success: {
        backgroundColor: colors.successMuted,
        color: colors.success,
    },
    warning: {
        backgroundColor: colors.warningMuted,
        color: colors.warning,
    },
    danger: {
        backgroundColor: colors.dangerMuted,
        color: colors.danger,
    },
    info: {
        backgroundColor: colors.infoMuted,
        color: colors.info,
    },
};

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
        padding: `${spacing[0.5]} ${spacing[2]}`,
        fontSize: fontSize.xs,
    },
    md: {
        padding: `${spacing[1]} ${spacing[2.5]}`,
        fontSize: fontSize.sm,
    },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'default', size = 'md', children, style, className, ...props }, ref) => {
        const baseStyles: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[1],
            borderRadius: radius.full,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            ...variantStyles[variant],
            ...sizeStyles[size],
            ...style,
        };

        return (
            <span
                ref={ref}
                style={baseStyles}
                className={clsx('agentops-badge', className)}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

// Status badge with dot indicator
export interface StatusBadgeProps extends BadgeProps {
    status: 'active' | 'inactive' | 'pending' | 'error';
}

const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    error: { variant: 'danger', label: 'Error' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} {...props}>
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                }}
            />
            {config.label}
        </Badge>
    );
};
