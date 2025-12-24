// Design Tokens dari Figma - Update dengan nilai dari design Anda
export const designTokens = {
  // Colors - Extract dari Figma Color Styles
  colors: {
    primary: '#3b82f6',      // Blue 500
    primaryDark: '#2563eb',  // Blue 600
    secondary: '#6366f1',    // Indigo 500
    accent: '#06b6d4',       // Cyan 500
    success: '#10b981',      // Emerald 500
    warning: '#f59e0b',      // Amber 500
    error: '#ef4444',        // Red 500
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
  },

  // Typography - Extract dari Figma Text Styles
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing - Extract dari Figma Spacing tokens
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border Radius - Extract dari Figma Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },

  // Shadows - Extract dari Figma Shadow effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Breakpoints - Sesuaikan dengan design Anda
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Utility functions untuk menggunakan tokens
export const getColor = (colorName) => designTokens.colors[colorName];
export const getSpacing = (size) => designTokens.spacing[size];
export const getFontSize = (size) => designTokens.typography.fontSize[size];
export const getBorderRadius = (size) => designTokens.borderRadius[size];