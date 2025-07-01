import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "primary" | "neutral" | "white";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
} as const;

const variantClasses = {
  primary: "text-primary",
  neutral: "text-muted-foreground",
  white: "text-white",
} as const;

export function LoadingSpinner({
  size = "md",
  className,
  text,
  variant = "primary",
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <span
          className={cn(
            "text-sm font-medium font-poppins",
            variantClasses[variant]
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
}

// Full page loading component
export function PageLoading({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
}

// Inline loading component
export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Button loading component
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-current",
        size === "sm" ? "w-4 h-4" : "w-5 h-5"
      )}
    />
  );
}

// Loading overlay component for modals/dialogs
export function LoadingOverlay({ text = "Memproses..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 shadow-lg">
        <LoadingSpinner size="lg" text={text} variant="primary" />
      </div>
    </div>
  );
}
