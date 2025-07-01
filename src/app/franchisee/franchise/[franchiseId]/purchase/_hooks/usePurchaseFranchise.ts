import { useState } from "react";
import { toast } from "sonner";

interface PurchasePayload {
  purchase_type: "FUNDED" | "PURCHASED";
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
  payment_status: "PAID" | "PROCESSED";
  paid_at: string;
}

export const usePurchaseFranchise = () => {
  const [isLoading, setIsLoading] = useState(false);

  const purchaseFranchise = async (
    franchiseId: string,
    payload: PurchasePayload
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/franchises/${franchiseId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Purchase failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Pembayaran gagal";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseFranchise,
    isLoading,
  };
};
