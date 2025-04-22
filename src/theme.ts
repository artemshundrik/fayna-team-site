import { createTheme } from '@mui/material/styles';
import { TypographyVariantsOptions, TypographyVariants } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    navLink: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    navLink?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    navLink: true;
  }
}

// Add custom typography variant for fontWeightSemiBold
declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontWeightSemiBold: number;
  }
  interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      light: '#FF5C77',
      main: '#FE294F',
      dark: '#B8002C',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#333333',
      main: '#111111',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    error: {
      light: '#f87171',
      main: '#f04438',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    success: {
      light: '#6ee7b7',
      main: '#12B76A',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#fde68a',
      main: '#facc15',
      dark: '#ca8a04',
      contrastText: '#000000',
    },
    info: {
      light: '#93c5fd',
      main: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#111111',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
  },
  typography: {
    fontFamily: 'FixelDisplay, sans-serif',
    fontWeightSemiBold: 600,
    h1: { fontWeight: 700, fontSize: '3rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2.25rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.4 },
    h4: { fontWeight: 500, fontSize: '1.5rem', lineHeight: 1.5 },
    h5: { fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.6 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.6 },
    subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.75, textTransform: 'uppercase' },
    caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.35 },
    overline: { fontWeight: 500, fontSize: '0.75rem', letterSpacing: '1px', lineHeight: 2, textTransform: 'uppercase' },
    navLink: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          font-family: 'FixelDisplay', sans-serif;
        }
        @font-face {
          font-family: 'FixelDisplay';
          src: url('/fonts/FixelDisplay-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'FixelDisplay';
          src: url('/fonts/FixelDisplay-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: 'FixelDisplay';
          src: url('/fonts/FixelDisplay-SemiBold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'FixelDisplay';
          src: url('/fonts/FixelDisplay-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
        }
      `,
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'navLink' },
          style: ({ theme }) => ({
            fontSize: theme.typography.h6.fontSize,
            fontWeight: theme.typography.h6.fontWeight,
            lineHeight: theme.typography.h6.lineHeight,
            textTransform: theme.typography.button.textTransform,
            letterSpacing: theme.typography.overline.letterSpacing,
            cursor: 'pointer',
            transition: theme.transitions.create(['color', 'textDecoration'], {
              duration: theme.transitions.duration.short,
            }),
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              textUnderlineOffset: theme.spacing(0.5),
            },
          }),
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'uppercase',
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
          lineHeight: 1.5,
        },
        sizeMedium: {
          padding: '6px 16px',
          fontSize: '0.875rem',
          lineHeight: 1.75,
        },
        sizeLarge: {
          padding: '8px 22px',
          fontSize: '1rem',
          lineHeight: 1.75,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(17, 17, 17, 0.9)',
          color: '#fff',
          padding: '6px 10px',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
        arrow: {
          color: 'rgba(17, 17, 17, 0.9)',
        },
      },
    },
  },
});

export default theme;