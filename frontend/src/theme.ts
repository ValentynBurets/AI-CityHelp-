import { createTheme } from '@mui/material/styles'
import {
  COLORS,
  TYPOGRAPHY,
  BORDER_RADIUS,
  TRANSITIONS,
  SHADOWS,
} from './constants/theme'

export const theme = createTheme({
  palette: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    text: COLORS.text,
  },
  typography: {
    fontFamily: TYPOGRAPHY.fontFamily,
    h4: {
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    },
    h5: {
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    h6: {
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
  },
  shape: {
    borderRadius: BORDER_RADIUS.large,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: TYPOGRAPHY.fontWeight.semibold,
          borderRadius: BORDER_RADIUS.medium,
          padding: '10px 24px',
          transition: TRANSITIONS.standard,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: SHADOWS.button,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.large,
          boxShadow: SHADOWS.small,
          transition: TRANSITIONS.standard,
          '&:hover': {
            boxShadow: SHADOWS.hover,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          transition: TRANSITIONS.accordion.root,
          '&.Mui-expanded': {
            margin: 0,
            transition: TRANSITIONS.accordion.root,
          },
          '& .MuiCollapse-root': {
            transition: `${TRANSITIONS.accordion.collapse} !important`,
            transitionTimingFunction: `${TRANSITIONS.easing.smooth} !important`,
          },
          '& .MuiCollapse-wrapper': {
            transition: `${TRANSITIONS.accordion.collapse} !important`,
            transitionTimingFunction: `${TRANSITIONS.easing.smooth} !important`,
          },
          '& .MuiCollapse-wrapperInner': {
            transition: `${TRANSITIONS.smooth} !important`,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          transition: TRANSITIONS.accordion.summary,
          '&.Mui-expanded': {
            minHeight: 64,
          },
        },
        content: {
          transition: TRANSITIONS.accordion.content,
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          transition: TRANSITIONS.accordion.details,
          padding: '16px 24px',
          '&.Mui-expanded': {
            padding: '16px 24px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.large,
          boxShadow: SHADOWS.card,
        },
      },
    },
  },
})

