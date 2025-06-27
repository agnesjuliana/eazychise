import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
      <p className="text-gray-500">Mengambil data akun...</p>
    </div>
  );
}
