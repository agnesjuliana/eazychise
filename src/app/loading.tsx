import { LoadingSpinner } from "@/components/ui/loading";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingSpinner size="lg" text="Mengambil data akun..." />
    </div>
  );
}
