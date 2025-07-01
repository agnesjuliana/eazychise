// Design System Constants and Utilities
// This file centralizes all design tokens used across the application

export const COLORS = {
  // Primary brand colors - EazyChise Red
  primary: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#EF5A5A", // Main brand color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Success colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#16a34a", // Updated to match globals.css
    600: "#15803d",
    700: "#166534",
    800: "#14532d",
    900: "#052e16",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#d97706", // Updated to match globals.css
    600: "#b45309",
    700: "#92400e",
    800: "#78350f",
    900: "#451a03",
  },

  // Error/Destructive colors
  destructive: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    primary: "var(--font-poppins, ui-sans-serif, system-ui, sans-serif)",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const SPACING = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const SHADOWS = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// Component variants
export const BUTTON_VARIANTS = {
  primary: {
    base: `bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500`,
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  secondary: {
    base: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  success: {
    base: "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  error: {
    base: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  outline: {
    base: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary-500",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  ghost: {
    base: "text-neutral-700 hover:bg-neutral-100 focus:ring-primary-500",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
} as const;

export const LOADING_STATES = {
  spinner: "animate-spin rounded-full border-2 border-muted border-t-primary",
  pulse: "animate-pulse bg-muted rounded",
  skeleton:
    "animate-pulse bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%]",
  skeletonBox: "animate-pulse bg-muted rounded",
  skeletonText: "animate-pulse bg-muted rounded",
} as const;

// Status colors mapping
export const STATUS_COLORS = {
  success: COLORS.success[500],
  destructive: COLORS.destructive[500],
  warning: COLORS.warning[500],
  info: COLORS.primary[500],
  pending: COLORS.warning[500],
  approved: COLORS.success[500],
  rejected: COLORS.destructive[500],
  waiting: COLORS.warning[500],
} as const;

// Helper functions
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "accepted":
    case "approved":
    case "success":
      return STATUS_COLORS.success;
    case "rejected":
    case "destructive":
    case "error":
      return STATUS_COLORS.destructive;
    case "pending":
    case "waiting":
      return STATUS_COLORS.waiting;
    default:
      return STATUS_COLORS.info;
  }
};

export const getStatusTextColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "accepted":
    case "approved":
    case "success":
      return "text-success";
    case "rejected":
    case "destructive":
    case "error":
      return "text-destructive";
    case "pending":
    case "waiting":
      return "text-warning";
    default:
      return "text-primary";
  }
};

export const getStatusBgColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "accepted":
    case "approved":
    case "success":
      return "bg-success/10";
    case "rejected":
    case "destructive":
    case "error":
      return "bg-destructive/10";
    case "pending":
    case "waiting":
      return "bg-warning/10";
    default:
      return "bg-primary/10";
  }
};

// Utility classes for consistent styling
export const UTILITY_CLASSES = {
  // Layout
  container: "min-h-screen bg-background flex justify-center",
  contentWrapper: "w-full max-w-md relative",
  mainContent: "pb-16", // Adjust for bottom navigation

  // Typography
  heading: {
    h1: "text-4xl font-bold text-foreground",
    h2: "text-3xl font-semibold text-foreground",
    h3: "text-2xl font-semibold text-foreground",
    h4: "text-xl font-medium text-foreground",
    h5: "text-lg font-medium text-foreground",
    h6: "text-base font-medium text-foreground",
  },
  text: {
    body: "text-base text-foreground font-poppins",
    small: "text-sm text-muted-foreground font-poppins",
    caption: "text-xs text-muted-foreground font-poppins",
    muted: "text-muted-foreground font-poppins",
  },

  // Interactive elements
  focusRing: "focus-ring",

  // Loading states
  loading: {
    spinner: "loading-spinner",
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
    container: "flex items-center justify-center gap-2",
  },
} as const;

// Helper function to get consistent class names
export const getUtilityClass = (
  category: keyof typeof UTILITY_CLASSES,
  variant?: string
): string => {
  const categoryClasses = UTILITY_CLASSES[category];

  if (typeof categoryClasses === "string") {
    return categoryClasses;
  }

  if (
    variant &&
    typeof categoryClasses === "object" &&
    variant in categoryClasses
  ) {
    return categoryClasses[variant as keyof typeof categoryClasses] as string;
  }

  return "";
};

// Color utility functions
export const generateColorVariant = (
  color: string,
  opacity: number = 100
): string => {
  if (opacity === 100) return color;
  return `${color}/${opacity}`;
};

// Common component patterns
export const COMPONENT_PATTERNS = {
  card: "bg-card text-card-foreground rounded-xl border shadow-sm p-6",
  button: {
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 font-poppins",
    sizes: {
      sm: "h-8 rounded-md gap-1.5 px-3",
      default: "h-9 px-4 py-2",
      lg: "h-10 rounded-md px-6",
      icon: "size-9",
    },
  },
  input:
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 font-poppins",
  badge:
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors font-poppins",
} as const;
