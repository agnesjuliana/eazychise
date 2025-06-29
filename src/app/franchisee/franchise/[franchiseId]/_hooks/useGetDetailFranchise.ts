"use client";
import axios from "axios";
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
  data: Franchise; // Changed to Franchise since API returns franchise directly
}

// Custom hook that mimics useQuery behavior
export const useGetDetailFranchise = (franchiseId: string) => {
  const [data, setData] = useState<Franchise | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFranchiseDetail = useCallback(async () => {
    if (!franchiseId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const response = await axios.get<FranchiseDetailResponse>(
        `/api/franchises/${franchiseId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // The API returns { status, message, data } where data contains the franchise
      if (response.data.status && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch franchise details"
        );
      }
    } catch (err) {
      console.error("Error fetching franchise detail:", err);
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [franchiseId]);

  // Fetch data when component mounts or franchiseId changes
  useEffect(() => {
    fetchFranchiseDetail();
  }, [fetchFranchiseDetail]);

  // Return object similar to useQuery
  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchFranchiseDetail, // Allows manual refetch
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
