/**
 * Design Tokens for Premium SaaS UI
 * 
 * Design Philosophy:
 * - Modern, premium, calm, spacious
 * - High-contrast typography
 * - Subtle gradients and soft shadows
 * - Glassy surfaces with backdrop blur
 * - Rounded-2xl corners for warmth
 * - Tasteful motion and transitions
 */

export const designTokens = {
  // Spacing scale (in rem)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Border radius
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows (using CSS variables for color adaptation)
  shadows: {
    sm: '0 1px 2px 0 hsl(var(--shadow-color) / 0.05)',
    md: '0 4px 6px -1px hsl(var(--shadow-color) / 0.1), 0 2px 4px -2px hsl(var(--shadow-color) / 0.1)',
    lg: '0 10px 15px -3px hsl(var(--shadow-color) / 0.1), 0 4px 6px -4px hsl(var(--shadow-color) / 0.1)',
    xl: '0 20px 25px -5px hsl(var(--shadow-color) / 0.1), 0 8px 10px -6px hsl(var(--shadow-color) / 0.1)',
    glow: '0 0 20px hsl(var(--primary) / 0.3)',
    'glow-sm': '0 0 10px hsl(var(--primary) / 0.2)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'GeistMono', 'SF Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1.1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Z-index scale
  zIndex: {
    dropdown: 50,
    sticky: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
    toast: 500,
  },
} as const;

// Glass effect classes
export const glassEffect = {
  light: 'bg-white/70 backdrop-blur-xl border border-white/20',
  dark: 'bg-slate-900/70 backdrop-blur-xl border border-white/10',
  subtle: 'bg-background/80 backdrop-blur-md',
};

// Gradient presets
export const gradients = {
  primary: 'bg-gradient-to-br from-primary to-primary/80',
  subtle: 'bg-gradient-to-b from-muted/50 to-muted',
  radial: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]',
  mesh: 'bg-gradient-to-br from-primary/5 via-transparent to-accent/5',
};

export type DesignTokens = typeof designTokens;
