"use client";

import { useCallback, useEffect, useState } from "react";

// Types based on the API route structure
interface FundingRequest {
  id: string;
  confirmation_status: string;
  address: string;
  phone_number: string;
  npwp: string;
  franchise_address: string;
  ktp: string;
  foto_diri: string;
  foto_lokasi: string;
  mou_franchisor: string;
  mou_modal: string;
}

interface Franchise {
  id: string;
  name: string;
  price: string;
  image: string;
  status: string;
  location: string;
  franchisor: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  status: string;
  name: string;
  email: string;
  profile_image: string;
  role: string;
}

interface OwnedFranchiseDetail {
  id: string;
  user_id: string;
  franchise_id: string;
  purchase_type: "FUNDED" | "PURCHASED";
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
  payment_status: "PAID" | "PROCESSED";
  paid_at: string | null;
  franchise: Franchise;
  funding_request: FundingRequest | null;
  user: User;
}

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom hook that mimics useQuery behavior for owned franchise detail
export const useGetOwnedFranchiseDetail = (
  franchiseId: string
): UseQueryResult<OwnedFranchiseDetail> => {
  const [data, setData] = useState<OwnedFranchiseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!franchiseId) {
      setIsError(true);
      setError("Franchise ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const response = await fetch(
        `/api/franchisee/franchises/${franchiseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching owned franchise detail:", error);
      setIsError(true);
      setError(error instanceof Error ? error.message : "Unknown error");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [franchiseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, isError, error, refetch };
};

// Export types for use in components
export type { Franchise, FundingRequest, OwnedFranchiseDetail, User };
