import React from 'react';
import { clsx } from 'clsx';
import { colors, radius, fontSize, spacing } from '../tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, fullWidth = false, style, className, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

        const containerStyles: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[1],
            width: fullWidth ? '100%' : 'auto',
        };

        const labelStyles: React.CSSProperties = {
            color: colors.text,
            fontSize: fontSize.sm,
            fontWeight: 500,
        };

        const inputStyles: React.CSSProperties = {
            backgroundColor: colors.bgSecondary,
            border: `1px solid ${error ? colors.danger : colors.border}`,
            borderRadius: radius.md,
            color: colors.text,
            fontSize: fontSize.base,
            padding: `${spacing[2]} ${spacing[3]}`,
            outline: 'none',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            width: fullWidth ? '100%' : 'auto',
            ...style,
        };

        const hintStyles: React.CSSProperties = {
            color: colors.textMuted,
            fontSize: fontSize.xs,
        };

        const errorStyles: React.CSSProperties = {
            color: colors.danger,
            fontSize: fontSize.xs,
        };

        return (
            <div style={containerStyles}>
                {label && (
                    <label htmlFor={inputId} style={labelStyles}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    style={inputStyles}
                    className={clsx('agentops-input', className)}
                    {...props}
                />
                {hint && !error && <span style={hintStyles}>{hint}</span>}
                {error && <span style={errorStyles}>{error}</span>}
                <style>{`
          .agentops-input:focus {
            border-color: ${colors.primary};
            box-shadow: 0 0 0 3px ${colors.primaryMuted};
          }
          .agentops-input::placeholder {
            color: ${colors.textMuted};
          }
        `}</style>
            </div>
        );
    }
);

Input.displayName = 'Input';

// Textarea variant
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, fullWidth = false, style, className, id, ...props }, ref) => {
        const inputId = id || `textarea-${Math.random().toString(36).slice(2)}`;

        const containerStyles: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[1],
            width: fullWidth ? '100%' : 'auto',
        };

        const labelStyles: React.CSSProperties = {
            color: colors.text,
            fontSize: fontSize.sm,
            fontWeight: 500,
        };

        const textareaStyles: React.CSSProperties = {
            backgroundColor: colors.bgSecondary,
            border: `1px solid ${error ? colors.danger : colors.border}`,
            borderRadius: radius.md,
            color: colors.text,
            fontSize: fontSize.base,
            padding: `${spacing[2]} ${spacing[3]}`,
            outline: 'none',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            width: fullWidth ? '100%' : 'auto',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
            ...style,
        };

        return (
            <div style={containerStyles}>
                {label && (
                    <label htmlFor={inputId} style={labelStyles}>
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    style={textareaStyles}
                    className={clsx('agentops-textarea', className)}
                    {...props}
                />
                {hint && !error && (
                    <span style={{ color: colors.textMuted, fontSize: fontSize.xs }}>{hint}</span>
                )}
                {error && (
                    <span style={{ color: colors.danger, fontSize: fontSize.xs }}>{error}</span>
                )}
                <style>{`
          .agentops-textarea:focus {
            border-color: ${colors.primary};
            box-shadow: 0 0 0 3px ${colors.primaryMuted};
          }
          .agentops-textarea::placeholder {
            color: ${colors.textMuted};
          }
        `}</style>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
