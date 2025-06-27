"use client";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Franchisor {
  id: string;
  name: string;
  email: string;
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
  franchisor: Franchisor;
}

interface FranchiseResponse {
  status: boolean;
  message: string;
  data: Franchise[];
  meta: {
    per_page: number;
    page: number;
    filter_value: string;
    filter_by: string;
  }[];
}

interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface CategoriesParams {
  per_page?: number;
  page?: number;
  filter_value?: string;
  filter_by?: string;
}

export const useCategories = (
  params?: CategoriesParams
): UseQueryResult<Category[]> => {
  const [apiData, setApiData] = useState<Category[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Manually add "Semua" option to the frontend
  const data = useMemo(() => {
    if (!apiData) return undefined;

    return [
      { id: "all", name: "Semua" }, // Added manually in frontend
      ...apiData.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    ];
  }, [apiData]);

  const queryString = useMemo(() => {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
  }, [params]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const url = `/api/categories${queryString}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Cache-control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const result: CategoriesResponse = response.data;

      if (result.status) {
        // Store only the API data, "Semua" will be added in useMemo above
        setApiData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch categories");
      }
    } catch (err) {
      setIsError(true);
      if (axios.isAxiosError(err)) {
        setError(
          new Error(
            `Failed to fetch categories: ${err.response?.status || err.message}`
          )
        );
      } else {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
      setApiData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchCategories,
  };
};

export const useGetFranchiseByCategoryId = (
  categoryId: string,
  params?: CategoriesParams | undefined
) => {
  const [data, setData] = useState<FranchiseResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const queryString = useMemo(() => {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
  }, [params]);

  const fetchFranchiseByCategory = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const url = `/api/franchises/category/${categoryId}${queryString}`;
      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Cache-control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const result: FranchiseResponse = response.data;

      if (result.status) {
        setData(result);
      } else {
        throw new Error(result.message || "Failed to fetch franchise data");
      }
    } catch (err) {
      setIsError(true);
      if (axios.isAxiosError(err)) {
        setError(
          new Error(
            `Failed to fetch franchises: ${err.response?.status || err.message}`
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
    if (categoryId && categoryId !== "all") {
      fetchFranchiseByCategory();
    } else {
      setData(undefined);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, queryString]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchFranchiseByCategory,
  };
};
