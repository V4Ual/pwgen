"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
    },
    background: {
      default: "transparent",
      paper: "rgba(18, 18, 24, 0.7)",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 800,
      fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
    },
    body1: {
      fontSize: "clamp(0.875rem, 4vw, 1rem)",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "40px",
          padding: "10px 24px",
          fontSize: "clamp(0.875rem, 4vw, 1rem)",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#8b5cf6",
          height: 6,
        },
        thumb: {
          height: 20,
          width: 20,
          backgroundColor: "#c084fc",
          "&:hover": {
            boxShadow: "0 0 0 8px rgba(139, 92, 246, 0.16)",
          },
        },
        track: {
          background: "linear-gradient(90deg, #8b5cf6, #c084fc)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 0,
          "&.Mui-checked": {
            transform: "translateX(18px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: "#8b5cf6",
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        },
        track: {
          borderRadius: 26,
          backgroundColor: "rgba(255,255,255,0.3)",
          opacity: 1,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
