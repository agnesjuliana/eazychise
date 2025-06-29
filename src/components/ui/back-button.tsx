"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fallbackUrl?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  text?: string;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ 
    className, 
    variant = "ghost", 
    size = "sm", 
    fallbackUrl = "/", 
    showText = true,
    text = "Kembali",
    onClick,
    ...props 
  }, ref) => {
    const router = useRouter();

    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      
      if (onClick) {
        onClick(e);
        return;
      }

      // Check if there's history to go back to
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleBack}
        className={cn(
          "flex items-center gap-2 text-gray-600 hover:text-gray-900",
          !showText && "p-2",
          className
        )}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        {showText && <span>{text}</span>}
      </Button>
    );
  }
);

BackButton.displayName = "BackButton";

export { BackButton };
