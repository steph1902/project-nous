import React from 'react';
import { clsx } from 'clsx';
import { colors, radius, spacing, shadow } from '../tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
    default: {
        backgroundColor: colors.panel,
        border: `1px solid ${colors.border}`,
    },
    elevated: {
        backgroundColor: colors.panel,
        border: 'none',
        boxShadow: shadow.md,
    },
    outlined: {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.border}`,
    },
};

const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: spacing[3] },
    md: { padding: spacing[4] },
    lg: { padding: spacing[6] },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            padding = 'md',
            hoverable = false,
            children,
            style,
            className,
            ...props
        },
        ref
    ) => {
        const baseStyles: React.CSSProperties = {
            borderRadius: radius.lg,
            transition: 'all 200ms ease',
            ...variantStyles[variant],
            ...paddingStyles[padding],
            ...style,
        };

        return (
            <div
                ref={ref}
                style={baseStyles}
                className={clsx('agentops-card', hoverable && 'hoverable', className)}
                {...props}
            >
                {children}
                {hoverable && (
                    <style>{`
            .agentops-card.hoverable:hover {
              background-color: ${colors.panelHover};
              border-color: ${colors.borderHover};
              transform: translateY(-2px);
            }
          `}</style>
                )}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    style,
    ...props
}) => (
    <div
        style={{
            borderBottom: `1px solid ${colors.border}`,
            padding: spacing[4],
            marginBottom: spacing[4],
            ...style,
        }}
        {...props}
    >
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    children,
    style,
    ...props
}) => (
    <h3
        style={{
            color: colors.text,
            fontSize: '1.125rem',
            fontWeight: 600,
            margin: 0,
            ...style,
        }}
        {...props}
    >
        {children}
    </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    children,
    style,
    ...props
}) => (
    <p
        style={{
            color: colors.textSecondary,
            fontSize: '0.875rem',
            margin: '0.25rem 0 0 0',
            ...style,
        }}
        {...props}
    >
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    style,
    ...props
}) => (
    <div style={style} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    style,
    ...props
}) => (
    <div
        style={{
            borderTop: `1px solid ${colors.border}`,
            padding: spacing[4],
            marginTop: spacing[4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: spacing[2],
            ...style,
        }}
        {...props}
    >
        {children}
    </div>
);
