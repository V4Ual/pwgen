"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Slider,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  AutoAwesomeRounded,
  BoltRounded,
  CheckCircleRounded,
  ContentCopyRounded,
  LockRounded,
  RefreshRounded,
  SecurityRounded,
  ShieldRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";

/* -------------------------------------------------------------------------- */
/*                                  CONFIG                                    */
/* -------------------------------------------------------------------------- */

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const actionButtonStyle = {
  width: {
    xs: 46,
    sm: 52,
  },
  height: {
    xs: 46,
    sm: 52,
  },
  borderRadius: "16px",
};

type Strength = {
  label: string;
  color: string;
  score: number;
};

const strengthLevels: Strength[] = [
  {
    label: "Very Weak",
    color: "#ef4444",
    score: 0,
  },
  {
    label: "Weak",
    color: "#f97316",
    score: 1,
  },
  {
    label: "Fair",
    color: "#facc15",
    score: 2,
  },
  {
    label: "Strong",
    color: "#22c55e",
    score: 3,
  },
  {
    label: "Very Strong",
    color: "#10b981",
    score: 4,
  },
];

/* -------------------------------------------------------------------------- */
/*                           PASSWORD GENERATOR                               */
/* -------------------------------------------------------------------------- */

const generatePassword = (
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
) => {
  let chars = "";

  if (useUpper) chars += CHARSETS.upper;
  if (useLower) chars += CHARSETS.lower;
  if (useNumbers) chars += CHARSETS.numbers;
  if (useSymbols) chars += CHARSETS.symbols;

  if (!chars) return "";

  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }

  return password;
};

/* -------------------------------------------------------------------------- */
/*                            PASSWORD STRENGTH                               */
/* -------------------------------------------------------------------------- */

const calculateStrength = (password: string): Strength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return strengthLevels[0];
  if (score <= 3) return strengthLevels[1];
  if (score <= 4) return strengthLevels[2];
  if (score <= 5) return strengthLevels[3];

  return strengthLevels[4];
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [password, setPassword] = useState("");

  const [length, setLength] = useState(18);

  const [useUpper, setUseUpper] = useState(true);

  const [useLower, setUseLower] = useState(true);

  const [useNumbers, setUseNumbers] = useState(true);

  const [useSymbols, setUseSymbols] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [copied, setCopied] = useState(false);

  const disabled = !useUpper && !useLower && !useNumbers && !useSymbols;

  const strength = useMemo(() => calculateStrength(password), [password]);

  const strengthPercentage = ((strength.score + 1) / 5) * 100;

  /* ---------------------------------------------------------------------- */
  /*                               GENERATE                                 */
  /* ---------------------------------------------------------------------- */

  const generate = useCallback(() => {
    const newPassword = generatePassword(
      length,
      useUpper,
      useLower,
      useNumbers,
      useSymbols,
    );

    setPassword(newPassword);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  /* ---------------------------------------------------------------------- */
  /*                               COPY                                     */
  /* ---------------------------------------------------------------------- */

  const copyPassword = async () => {
    if (!password) return;

    await navigator.clipboard.writeText(password);

    setCopied(true);
  };

  /* ---------------------------------------------------------------------- */
  /*                                 UI                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <Box
      sx={{
        minHeight: "100dvh",

        background: `
          radial-gradient(circle at top left, rgba(139,92,246,0.25), transparent 30%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.2), transparent 30%),
          linear-gradient(135deg, #050816 0%, #0f172a 100%)
        `,

        display: "flex",

        alignItems: {
          xs: "flex-start",
          md: "center",
        },

        justifyContent: "center",

        py: {
          xs: 2,
          sm: 4,
        },

        px: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters={isMobile}
        sx={{
          width: "100%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",

            borderRadius: {
              xs: "22px",
              sm: "32px",
            },

            backdropFilter: "blur(30px)",

            background: "rgba(15, 23, 42, 0.72)",

            border: "1px solid rgba(255,255,255,0.08)",

            boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 4,
                md: 5,
              },

              pt: {
                xs: 3,
                sm: 5,
              },

              pb: 2,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: {
                      xs: 48,
                      sm: 56,
                    },

                    height: {
                      xs: 48,
                      sm: 56,
                    },

                    borderRadius: "18px",

                    display: "grid",

                    placeItems: "center",

                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                  }}
                >
                  <SecurityRounded
                    sx={{
                      color: "#fff",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      color: "#fff",

                      lineHeight: 1,

                      fontSize: {
                        xs: "1.5rem",
                        sm: "2rem",
                      },
                    }}
                  >
                    SecurePass
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",

                      mt: 0.5,

                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    Production-ready secure password generator
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<ShieldRounded />}
                label="256-bit Secure"
                sx={{
                  background: "rgba(16,185,129,0.15)",

                  color: "#10b981",

                  border: "1px solid rgba(16,185,129,0.25)",

                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>

          {/* PASSWORD CARD */}

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 4,
                md: 5,
              },

              py: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <Box
              sx={{
                borderRadius: {
                  xs: "20px",
                  sm: "24px",
                },

                p: {
                  xs: 2,
                  sm: 3,
                },

                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",

                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockRounded
                    sx={{
                      color: "#8b5cf6",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.7)",

                      fontWeight: 600,
                    }}
                  >
                    Generated Password
                  </Typography>
                </Stack>

                {/* INPUT + ACTIONS */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1}
                  alignItems="stretch"
                >
                  <TextField
                    fullWidth
                    value={disabled ? "Select at least one option" : password}
                    type={showPassword ? "text" : "password"}
                    sx={{
                      flex: 1,

                      "& input": {
                        color: "#fff",
                      },
                    }}
                    InputProps={{
                      readOnly: true,

                      sx: {
                        borderRadius: "18px",

                        fontFamily: "monospace",

                        fontWeight: 700,

                        fontSize: {
                          xs: "0.82rem",
                          sm: "1rem",
                          md: "1.1rem",
                        },

                        letterSpacing: 1,

                        background: "rgba(255,255,255,0.03)",

                        "& fieldset": {
                          border: "1px solid rgba(255,255,255,0.08)",
                        },
                      },
                    }}
                  />

                  <Stack direction="row" spacing={1} justifyContent="center">
                    {/* SHOW */}

                    <Tooltip title="Show Password">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          ...actionButtonStyle,

                          background: "rgba(255,255,255,0.04)",

                          color: "#fff",

                          "&:hover": {
                            background: "rgba(255,255,255,0.08)",
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffRounded />
                        ) : (
                          <VisibilityRounded />
                        )}
                      </IconButton>
                    </Tooltip>

                    {/* COPY */}

                    <Tooltip title="Copy Password">
                      <span>
                        <IconButton
                          disabled={disabled}
                          onClick={copyPassword}
                          sx={{
                            ...actionButtonStyle,

                            background: "rgba(139,92,246,0.12)",

                            color: "#8b5cf6",

                            "&:hover": {
                              background: "rgba(139,92,246,0.2)",
                            },
                          }}
                        >
                          <ContentCopyRounded />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* GENERATE */}

                    <Tooltip title="Generate">
                      <IconButton
                        onClick={generate}
                        sx={{
                          ...actionButtonStyle,

                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",

                          color: "#fff",

                          "&:hover": {
                            transform: "scale(1.04)",
                          },
                        }}
                      >
                        <RefreshRounded />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {/* STRENGTH */}

                {!disabled && (
                  <Fade in>
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          Password Strength
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: strength.color,

                            fontWeight: 700,
                          }}
                        >
                          {strength.label}
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={strengthPercentage}
                        sx={{
                          height: 10,

                          borderRadius: 10,

                          background: "rgba(255,255,255,0.06)",

                          "& .MuiLinearProgress-bar": {
                            borderRadius: 10,

                            background: strength.color,
                          },
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </Stack>
            </Box>
          </Box>

          {/* CONTROLS */}

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 4,
                md: 5,
              },

              pb: {
                xs: 3,
                sm: 5,
              },
            }}
          >
            <Stack spacing={4}>
              {/* LENGTH */}

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Password Length
                  </Typography>

                  <Chip
                    label={`${length} Characters`}
                    sx={{
                      background: "rgba(139,92,246,0.12)",

                      color: "#a78bfa",

                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Slider
                  value={length}
                  min={6}
                  max={40}
                  onChange={(_, value) => setLength(value as number)}
                  sx={{
                    color: "#8b5cf6",

                    "& .MuiSlider-thumb": {
                      width: 20,
                      height: 20,
                    },
                  }}
                />
              </Box>

              {/* OPTIONS */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                  },

                  gap: {
                    xs: 1.5,
                    sm: 2,
                  },
                }}
              >
                {[
                  {
                    label: "Uppercase Letters",
                    checked: useUpper,
                    set: setUseUpper,
                  },

                  {
                    label: "Lowercase Letters",
                    checked: useLower,
                    set: setUseLower,
                  },

                  {
                    label: "Numbers",
                    checked: useNumbers,
                    set: setUseNumbers,
                  },

                  {
                    label: "Special Symbols",
                    checked: useSymbols,
                    set: setUseSymbols,
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 2,

                      borderRadius: "18px",

                      background: "rgba(255,255,255,0.03)",

                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        width: "100%",

                        m: 0,

                        justifyContent: "space-between",

                        "& .MuiTypography-root": {
                          color: "#fff",

                          fontWeight: 500,
                        },
                      }}
                      control={
                        <Switch
                          checked={item.checked}
                          onChange={() => item.set(!item.checked)}
                        />
                      }
                      label={item.label}
                      labelPlacement="start"
                    />
                  </Box>
                ))}
              </Box>

              {/* GENERATE BUTTON */}

              <Button
                fullWidth
                size={isMobile ? "medium" : "large"}
                disabled={disabled}
                onClick={generate}
                startIcon={<AutoAwesomeRounded />}
                sx={{
                  py: {
                    xs: 1.5,
                    sm: 1.8,
                  },

                  borderRadius: "18px",

                  fontWeight: 800,

                  fontSize: {
                    xs: "0.92rem",
                    sm: "1rem",
                  },

                  textTransform: "none",

                  color: "#fff",

                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",

                  boxShadow: "0 10px 30px rgba(99,102,241,0.35)",

                  "&:hover": {
                    transform: "translateY(-2px)",

                    boxShadow: "0 14px 40px rgba(99,102,241,0.45)",
                  },
                }}
              >
                Generate Secure Password
              </Button>

              {/* FEATURES */}

              <Box
                sx={{
                  display: "flex",

                  gap: 1,

                  flexWrap: "wrap",

                  justifyContent: "center",

                  "& .MuiChip-root": {
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  },
                }}
              >
                <Chip
                  icon={<BoltRounded />}
                  label="Fast Generation"
                  sx={{
                    color: "#fff",

                    background: "rgba(255,255,255,0.04)",
                  }}
                />

                <Chip
                  icon={<ShieldRounded />}
                  label="Crypto Secure"
                  sx={{
                    color: "#fff",

                    background: "rgba(255,255,255,0.04)",
                  }}
                />

                <Chip
                  icon={<CheckCircleRounded />}
                  label="Production Ready"
                  sx={{
                    color: "#fff",

                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              </Box>

              {/* WARNING */}

              {disabled && (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: "16px",
                  }}
                >
                  Select at least one character option
                </Alert>
              )}

              {/* FOOTER */}

              <Typography
                textAlign="center"
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.45)",

                  lineHeight: 1.8,

                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.95rem",
                  },
                }}
              >
                Use 16+ characters with uppercase, lowercase, numbers, and
                symbols for maximum protection.
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* SNACKBAR */}

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            icon={<CheckCircleRounded />}
            severity="success"
            sx={{
              borderRadius: "999px",
            }}
          >
            Password copied successfully
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
