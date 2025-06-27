"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  steps?: number;
  currentStep?: number;
  variant?: "default" | "steps";
}

function Progress({
  className,
  value,
  steps = 5,
  currentStep = 1,
  variant = "default",
  ...props
}: ProgressProps) {
  if (variant === "steps") {
    return (
      <div
        className={cn("flex items-center justify-between w-full", className)}
      >
        {Array.from({ length: steps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isNotLast = index < steps - 1;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex items-center my-6">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full text-white font-medium text-sm transition-colors",
                    isActive ? "bg-[#EF5A5A]" : "bg-gray-300"
                  )}
                >
                  {stepNumber}
                </div>
              </div>
              {isNotLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5  mx-2",
                    isActive ? "bg-[#EF5A5A]" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
