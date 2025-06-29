"use client";

import { useCallback, useEffect, useState } from "react";

// Types based on the API route structure
interface Franchisor {
  id: string;
  name: string;
  email: string;
}

interface Franchise {
  id: string;
  name: string;
  price: string;
  image: string;
  status: string;
  location: string;
  franchisor: Franchisor;
}

interface FundingRequest {
  id: string;
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
}

interface FranchisePurchase {
  id: string;
  user_id: string;
  franchise_id: string;
  purchase_type: "FUNDED" | "PURCHASED";
  confirmation_status: "WAITING" | "REJECTED" | "ACCEPTED";
  payment_status: "PAID" | "PROCESSED";
  paid_at: string | null;
  franchise: Franchise;
  funding_request: FundingRequest | null;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: FranchisePurchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

interface QueryParams {
  page?: number;
  limit?: number;
}

// Custom hook that mimics useQuery behavior
export const useGetOwnedFranchises = (
  params?: QueryParams
): UseQueryResult<FranchisePurchase[]> => {
  const [data, setData] = useState<FranchisePurchase[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());

      const response = await fetch(
        `/api/franchisee/franchises?${searchParams.toString()}`,
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

      const result: ApiResponse = await response.json();

      if (result.status) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching owned franchises:", error);
      setIsError(true);
      setError(error instanceof Error ? error.message : "Unknown error");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, isError, error, refetch };
};

// Export types for use in components
export type {
  ApiResponse,
  Franchise,
  FranchisePurchase,
  Franchisor,
  FundingRequest,
};
