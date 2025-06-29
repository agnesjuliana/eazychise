"use client";
import axios from "axios";
import { useEffect, useState } from "react";

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

interface ListingDocument {
  id: string;
  type: string;
  name: string;
  path: string;
}

interface ListingHighlight {
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
  franchisor: {
    id: string;
    name: string;
    email: string;
  };
  listing_documents: ListingDocument[];
  listings_highlights: ListingHighlight[];
}

interface User {
  id: string;
  status: string;
  name: string;
  email: string;
  profile_image: string;
  role: string;
}

interface FranchisePurchase {
  id: string;
  user_id: string;
  franchise_id: string;
  funding_request: FundingRequest | null;
  franchise: Franchise;
  user: User;
}

interface FranchiseDetailResponse {
  status: boolean;
  message: string;
  data: FranchisePurchase;
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useGetDetailFranchise = (
  franchiseId: string
): UseQueryResult<Franchise> => {
  const [data, setData] = useState<Franchise | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFranchiseDetail = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const url = `/api/franchises/${franchiseId}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Cache-control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const result = response.data;

      // Based on the debug output, the API returns the franchise data directly
      if (result) {
        setData(result);
      } else {
        throw new Error("Failed to fetch franchise detail");
      }
    } catch (err) {
      setIsError(true);
      if (axios.isAxiosError(err)) {
        setError(
          new Error(
            `Failed to fetch franchise detail: ${
              err.response?.status || err.message
            }`
          )
        );
      } else {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (franchiseId) {
      fetchFranchiseDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseId]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchFranchiseDetail,
  };
};

// Export types for use in components
export type {
  Franchise,
  FranchiseDetailResponse,
  FranchisePurchase,
  FundingRequest,
  ListingDocument,
  ListingHighlight,
  User,
};
