"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Filter, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import withAuth from "@/lib/withAuth";
import {
  useCategories,
  useGetFranchiseByCategoryId,
} from "./_hooks/useGetHome";

const formatRupiah = (price: string | number): string => {
  const numPrice =
    typeof price === "string" ? parseFloat(price.replace(/[^\d]/g, "")) : price;

  // Check if it's a valid number
  if (isNaN(numPrice)) return price.toString();

  // Format with thousand separators
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAllFranchises, setShowAllFranchises] = useState(false);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isErrorCategories,
    error,
  } = useCategories();

  // Set default category to Food category ID when categories are loaded
  useMemo(() => {
    if (categoriesData && categoriesData.length > 0 && !selectedCategoryId) {
      const foodCategory = categoriesData.find(
        (cat) =>
          cat.name.toLowerCase().includes("food") ||
          cat.name.toLowerCase().includes("makanan")
      );
      if (foodCategory) {
        setSelectedCategoryId(foodCategory.id);
      } else {
        // If no Food category found, use the first category
        setSelectedCategoryId(categoriesData[0].id);
      }
    }
  }, [categoriesData, selectedCategoryId]);

  const {
    data: franchiseData,
    isLoading: isFranchisesLoading,
    isError: isErrorFranchises,
    error: franchiseError,
  } = useGetFranchiseByCategoryId(selectedCategoryId, {
    per_page: showAllFranchises ? 30 : 10,
    page: 1,
    filter_value: searchQuery || undefined,
    filter_by: searchQuery ? "name" : undefined,
  });

  const filteredFranchises = useMemo(() => {
    return franchiseData?.data || [];
  }, [franchiseData]);

  return (
    <AppLayout className="overflow-x-hidden">
      {/* Header */}
      <HeaderPage title="Hai, Franchisee!" />

      <div className="p-4 space-y-6">
        {/* Subtitle */}
        <p className="text-white text-sm -mt-20 mb-6 text-center">
          Mulai Bisnismu Tanpa Overthinking!
        </p>
        {/* Search and Filter Bar */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari Franchise"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilter(!showFilter)}
            className="bg-white border-gray-200 relative"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white border-gray-200 relative"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
        {/* Popular Franchises Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Franchise Populer
          </h2>
          <Button
            variant="ghost"
            className="text-orange-500 text-sm p-0 h-auto"
            onClick={() => setShowAllFranchises(!showAllFranchises)}
          >
            {showAllFranchises ? "Lebih Sedikit" : "Lainnya"}
          </Button>
        </div>{" "}
        {/* Franchise Cards Grid */}
        <div
          className={`grid ${
            showAllFranchises ? "grid-cols-2 gap-3" : "grid-cols-2 gap-3"
          }`}
        >
          {isFranchisesLoading ? (
            // Loading skeleton for popular franchises
            Array.from({ length: showAllFranchises ? 12 : 4 }).map(
              (_, index) => (
                <Card
                  key={`loading-${index}`}
                  className="p-0 overflow-hidden border-gray-200 animate-pulse"
                >
                  <div className="h-36 bg-gray-200"></div>
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              )
            )
          ) : isErrorFranchises ? (
            <div className="col-span-2 text-center text-red-500 text-sm py-8">
              Error loading franchises: {franchiseError?.message}
            </div>
          ) : filteredFranchises.length > 0 ? (
            filteredFranchises
              .slice(0, showAllFranchises ? filteredFranchises.length : 4)
              .map((franchise) => (
                <Card
                  key={franchise.id}
                  className="p-0 overflow-hidden border-gray-200 relative group cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  <Link
                    href={`/franchisee/franchise/${franchise.id}`}
                    className="block"
                  >
                    <div className="relative">
                      <div className="bg-gray-200 relative overflow-hidden rounded-t-lg h-36">
                        {/* Changed from template image to API image */}
                        <Image
                          src={
                            franchise.image
                              ? `${franchise.image}`
                              : "/image/home/template-picture-franchise-food.png"
                          }
                          alt={franchise.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>{" "}
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                          {franchise.name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 p-0 hover:bg-gray-100 flex-shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Bookmark className={`w-4 h-4 text-gray-400 `} />
                        </Button>
                      </div>
                      <CardDescription className="text-xs text-gray-500 mb-2">
                        Mulai dari
                      </CardDescription>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatRupiah(franchise.price)}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 text-sm py-8">
              No franchises available
            </div>
          )}
        </div>
        {/* Category Filter Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Kategori Populer
          </h2>
          <Button
            variant="ghost"
            className="text-orange-500 text-sm p-0 h-auto"
          >
            Lainnya
          </Button>
        </div>
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
          {isCategoriesLoading ? (
            <div className="text-sm text-gray-500">Loading categories...</div>
          ) : isErrorCategories ? (
            <div className="text-sm text-red-500">
              Error loading categories: {error?.message}
            </div>
          ) : categoriesData && categoriesData.length > 0 ? (
            categoriesData.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategoryId === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategoryId === category.id
                    ? "bg-[#EF5A5A] hover:bg-[#EF5A5A]/90 text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </Button>
            ))
          ) : (
            <div className="text-sm text-gray-500">No categories available</div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {isFranchisesLoading ? (
            // Loading skeleton for remaining franchises
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`loading-list-${index}`}
                className="p-0 overflow-hidden border-gray-200 animate-pulse"
              >
                <div className="flex">
                  <div className="w-20 h-28 bg-gray-200 flex-shrink-0"></div>
                  <CardContent className="flex-1 p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : isErrorFranchises ? (
            <div className="text-center text-red-500 text-sm py-8">
              Error loading franchises: {franchiseError?.message}
            </div>
          ) : filteredFranchises.length > 4 && !showAllFranchises ? (
            filteredFranchises.slice(4).map((franchise) => (
              <Card
                key={franchise.id}
                className="p-0 overflow-hidden border-gray-200 relative group cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <Link
                  href={`/franchisee/franchise/${franchise.id}`}
                  className="block"
                >
                  <div className="flex">
                    <div className="w-20 h-28 bg-gray-200 relative flex-shrink-0 overflow-hidden rounded-l-lg">
                      {/* Changed from template image to API image */}
                      <Image
                        src={
                          franchise.image
                            ? `${franchise.image}`
                            : "/image/home/template-picture-franchise-food.png"
                        }
                        alt={franchise.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <div className="flex items-start justify-between mb-1">
                            <CardTitle className="text-sm font-semibold text-gray-900 flex-1 pr-2">
                              {franchise.name}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 p-0 hover:bg-gray-100 flex-shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <Bookmark className={`w-4 h-4 text-gray-400 `} />
                            </Button>
                          </div>
                          <CardDescription className="text-xs text-gray-500 mb-1">
                            Mulai dari
                          </CardDescription>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {franchise.location}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatRupiah(franchise.price)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Link>
              </Card>
            ))
          ) : null}
        </div>
        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-center text-gray-500 text-sm">
            Menampilkan {filteredFranchises.length} hasil untuk &ldquo;
            {searchQuery}&rdquo;
          </div>
        )}{" "}
      </div>
    </AppLayout>
  );
}

export default withAuth(HomePage, "FRANCHISEE");
