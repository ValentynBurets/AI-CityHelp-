export const COLORS = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
} as const

export const PASTEL_COLORS = {
  blue: {
    background: 'rgba(147, 197, 253, 0.3)',
    backgroundHover: 'rgba(147, 197, 253, 0.4)',
    backgroundExpanded: 'rgba(147, 197, 253, 0.08)',
    icon: '#3b82f6',
    expandIcon: {
      background: 'rgba(147, 197, 253, 0.2)',
      backgroundHover: 'rgba(147, 197, 253, 0.4)',
      icon: '#3b82f6',
    },
  },
  pink: {
    background: 'rgba(251, 207, 232, 0.3)',
    backgroundHover: 'rgba(251, 207, 232, 0.4)',
    backgroundExpanded: 'rgba(251, 207, 232, 0.08)',
    icon: '#ec4899',
    expandIcon: {
      background: 'rgba(251, 207, 232, 0.2)',
      backgroundHover: 'rgba(251, 207, 232, 0.4)',
      icon: '#ec4899',
    },
  },
  yellow: {
    background: 'rgba(254, 240, 138, 0.3)',
    backgroundHover: 'rgba(254, 240, 138, 0.4)',
    backgroundExpanded: 'rgba(254, 240, 138, 0.08)',
    icon: '#f59e0b',
    expandIcon: {
      background: 'rgba(254, 240, 138, 0.2)',
      backgroundHover: 'rgba(254, 240, 138, 0.4)',
      icon: '#f59e0b',
    },
  },
  green: {
    background: 'rgba(187, 247, 208, 0.3)',
    backgroundHover: 'rgba(187, 247, 208, 0.4)',
    backgroundExpanded: 'rgba(187, 247, 208, 0.08)',
    icon: '#10b981',
    expandIcon: {
      background: 'rgba(187, 247, 208, 0.2)',
      backgroundHover: 'rgba(187, 247, 208, 0.4)',
      icon: '#10b981',
    },
  },
} as const

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
  primaryHover: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
  text: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
  card: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
  resultCard: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
} as const

export const SIZES = {
  icon: {
    small: 20,
    medium: 28,
    large: 32,
    xlarge: 36,
  },
  container: {
    iconBox: 48,
    expandIcon: 32,
    avatar: 32,
    maxWidth: 1200,
  },
  spacing: {
    accordionPadding: 3,
    cardPadding: { xs: 2, sm: 3, md: 4 },
    fabBottom: 24,
    fabRight: 24,
  },
} as const

export const TRANSITIONS = {
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    exit: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
  },
  duration: {
    fast: 200,
    normal: 300,
    medium: 400,
    slow: 500,
    slower: 600,
    slowest: 800,
  },
  standard: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  background: 'background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  transform: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  accordion: {
    root: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    collapse: 'height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    summary: 'min-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    content: 'margin 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    details: 'padding 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
} as const

export const SHADOWS = {
  small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  medium: '0 4px 20px rgba(99, 102, 241, 0.3)',
  large: '0 8px 24px rgba(99, 102, 241, 0.4)',
  xlarge: '0 12px 32px rgba(99, 102, 241, 0.6)',
  hover: '0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  button: '0 8px 16px rgba(0, 0, 0, 0.15)',
  input: {
    primary: '0 4px 12px rgba(99, 102, 241, 0.15)',
    secondary: '0 4px 12px rgba(236, 72, 153, 0.15)',
    green: '0 4px 12px rgba(34, 197, 94, 0.15)',
  },
  card: '0 1px 3px rgba(0, 0, 0, 0.1)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.2)',
} as const

export const BORDER_RADIUS = {
  small: 2,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: '50%',
} as const

export const Z_INDEX = {
  fab: 1000,
  drawer: 1200,
  modal: 1300,
  tooltip: 1500,
} as const

export const TYPOGRAPHY = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
  },
} as const

export const ANIMATION_DELAYS = {
  fadeIn: 150,
  stagger: 100,
} as const

export const getPastelColorConfig = (color: keyof typeof PASTEL_COLORS) => {
  return PASTEL_COLORS[color]
}

export const createTransition = (
  properties: string | string[],
  duration: number = TRANSITIONS.duration.normal,
  easing: string = TRANSITIONS.easing.standard
) => {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  return `${props} ${duration}ms ${easing}`
}

