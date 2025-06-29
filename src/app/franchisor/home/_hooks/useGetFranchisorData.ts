"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface FranchiseDocument {
  id: string;
  type: string;
  name: string;
  path: string;
}

interface FranchiseHighlight {
  id: string;
  title: string;
  content: string;
}

interface Franchise {
  id: string;
  franchisor_id: string;
  name: string;
  price: string;
  image: string;
  status: string;
  location: string;
  ownership_document: string;
  financial_statement: string;
  proposal: string;
  sales_location: string;
  equipment: string;
  materials: string;
  listing_documents: FranchiseDocument[];
  listings_highlights: FranchiseHighlight[];
}

interface Purchase {
  id: string;
  purchase_type: string;
  confirmation_status: string;
  payment_status: string;
  paid_at: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
  };
  funding_request: {
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
  } | null;
}

interface FranchisorResponse {
  status: boolean;
  message: string;
  data: Franchise[];
}

interface PurchasesResponse {
  status: boolean;
  message: string;
  data: Purchase[];
}

interface FranchisorStatsResponse {
  status: boolean;
  message: string;
  data: {
    accepted: number;
    waiting: number;
    rejected: number;
  };
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

// Helper function for retry logic
const retryRequest = async (fn: () => Promise<any>, maxRetries = 3, delay = 1000): Promise<any> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// Hook untuk mengambil data franchise milik franchisor
export const useFranchisorFranchise = (): UseQueryResult<Franchise[]> => {
  const [data, setData] = useState<Franchise[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFranchise = async (isRefetch = false) => {
    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }
      setIsError(false);
      setError(null);

      const response = await retryRequest(
        () => axios.get<FranchisorResponse>("/api/franchisor/franchises", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch franchise data");
      }
    } catch (err) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(new Error(`Failed to fetch franchise: ${errorMessage}`));
      console.error("Error fetching franchisor franchise:", err);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchFranchise();
  }, []);

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch: () => fetchFranchise(true),
  };
};

// Hook untuk mengambil data purchases franchise
export const useFranchisorPurchases = (): UseQueryResult<Purchase[]> => {
  const [data, setData] = useState<Purchase[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPurchases = async (isRefetch = false) => {
    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }
      setIsError(false);
      setError(null);

      const response = await retryRequest(
        () => axios.get<PurchasesResponse>("/api/franchisor/franchises/purchase", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch purchase data");
      }
    } catch (err) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(new Error(`Failed to fetch purchases: ${errorMessage}`));
      console.error("Error fetching franchisor purchases:", err);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch: () => fetchPurchases(true),
  };
};

// Hook untuk mengambil statistik franchisor (accepted, waiting, rejected)
export const useFranchisorStats = (): UseQueryResult<{accepted: number; waiting: number; rejected: number}> => {
  const [data, setData] = useState<{accepted: number; waiting: number; rejected: number} | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async (isRefetch = false) => {
    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }
      setIsError(false);
      setError(null);

      const response = await retryRequest(
        () => axios.get<FranchisorStatsResponse>("/api/franchisor", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch stats data");
      }
    } catch (err) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(new Error(`Failed to fetch stats: ${errorMessage}`));
      console.error("Error fetching franchisor stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch: () => fetchStats(true),
  };
};
