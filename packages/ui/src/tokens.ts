/**
 * AgentOps Design System Tokens
 * Dark theme with modern fintech aesthetic
 */

export const colors = {
    // Backgrounds
    bg: '#0B1020',
    bgSecondary: '#0D1428',
    panel: '#111833',
    panelHover: '#18214A',
    panelActive: '#1F2A5A',

    // Text
    text: '#E8EEFF',
    textSecondary: '#A9B4D0',
    textMuted: '#6B7394',

    // Brand
    primary: '#6D5EF7',
    primaryHover: '#7D6FFF',
    primaryMuted: 'rgba(109, 94, 247, 0.2)',

    // Status
    success: '#2ECC71',
    successMuted: 'rgba(46, 204, 113, 0.2)',
    warning: '#F5A524',
    warningMuted: 'rgba(245, 165, 36, 0.2)',
    danger: '#FF5C77',
    dangerMuted: 'rgba(255, 92, 119, 0.2)',
    info: '#3498DB',
    infoMuted: 'rgba(52, 152, 219, 0.2)',

    // Borders
    border: 'rgba(255, 255, 255, 0.10)',
    borderHover: 'rgba(255, 255, 255, 0.20)',
    borderFocus: '#6D5EF7',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const fontFamily = {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const fontSize = {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
} as const;

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

export const lineHeight = {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
} as const;

export const spacing = {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
} as const;

export const radius = {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
} as const;

export const shadow = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(109, 94, 247, 0.3)',
    glowSuccess: '0 0 20px rgba(46, 204, 113, 0.3)',
    glowDanger: '0 0 20px rgba(255, 92, 119, 0.3)',
} as const;

export const transition = {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
} as const;

export const zIndex = {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    toast: 600,
} as const;

// CSS Variables export
export const cssVariables = `
  :root {
    --color-bg: ${colors.bg};
    --color-bg-secondary: ${colors.bgSecondary};
    --color-panel: ${colors.panel};
    --color-panel-hover: ${colors.panelHover};
    --color-text: ${colors.text};
    --color-text-secondary: ${colors.textSecondary};
    --color-text-muted: ${colors.textMuted};
    --color-primary: ${colors.primary};
    --color-primary-hover: ${colors.primaryHover};
    --color-success: ${colors.success};
    --color-warning: ${colors.warning};
    --color-danger: ${colors.danger};
    --color-border: ${colors.border};
    --font-sans: ${fontFamily.sans};
    --font-mono: ${fontFamily.mono};
    --radius-sm: ${radius.sm};
    --radius-md: ${radius.md};
    --radius-lg: ${radius.lg};
  }
`;
