import React from "react";
import { Toast } from "./toast";

type ToastState = {
  message: string;
  variant?: "default" | "success" | "destructive" | "warning";
};

export const useToast = () => {
  const [toastState, setToastState] = React.useState<ToastState | null>(null);

  const showToast = (
    message: string,
    variant: ToastState["variant"] = "default"
  ) => {
    setToastState({ message, variant });
    setTimeout(() => setToastState(null), 3000); // Auto-dismiss after 3s
  };

  const ToastRenderer = () =>
    toastState ? (
      <div className="fixed top-4 right-4 z-50 w-[320px]">
        <Toast variant={toastState.variant}>{toastState.message}</Toast>
      </div>
    ) : null;

  return { showToast, ToastRenderer };
};
