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
import { Bookmark, Filter, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

// Dummy franchise data
const franchiseData = [
  {
    id: 1,
    name: "Pecel Madiun Bu Ati",
    category: "Makanan",
    price: "Rp5.000.000",
    location: "Surabaya",
    rating: 4.5,
    image: "/image/franchise/pecel-madiun.jpg",
    description: "Mulai dari",
    isFavorite: true,
    isNew: false,
    tags: ["Makanan", "Tradisional", "Murah"],
  },
  {
    id: 2,
    name: "Soto Surabaya Pak Slamet",
    category: "Makanan",
    price: "Rp6.000.000",
    location: "Surabaya",
    rating: 4.8,
    image: "/image/franchise/soto-surabaya.jpg",
    description: "Mulai dari",
    isFavorite: false,
    isNew: true,
    tags: ["Makanan", "Soto", "Tradisional"],
  },
  {
    id: 3,
    name: "Bakso Malang Cak Toha",
    category: "Makanan",
    price: "Rp7.000.000",
    location: "Malang",
    rating: 4.7,
    image: "/image/franchise/bakso-malang.jpg",
    description: "Mulai dari",
    isFavorite: true,
    isNew: false,
    tags: ["Makanan", "Bakso", "Malang"],
  },
  {
    id: 4,
    name: "Sego Cawuk Mifta",
    category: "Makanan",
    price: "Rp15.000.000",
    location: "Yogyakarta",
    rating: 4.6,
    image: "/image/franchise/sego-cawuk.jpg",
    description: "Mulai dari",
    isFavorite: false,
    isNew: false,
    tags: ["Makanan", "Gudeg", "Yogyakarta"],
  },
  {
    id: 5,
    name: "Coffee Shop Modern",
    category: "Minuman",
    price: "Rp25.000.000",
    location: "Jakarta",
    rating: 4.9,
    image: "/image/franchise/coffee-shop.jpg",
    description: "Mulai dari",
    isFavorite: false,
    isNew: true,
    tags: ["Minuman", "Coffee", "Modern"],
  },
  {
    id: 6,
    name: "Laundry Express",
    category: "Jasa",
    price: "Rp12.000.000",
    location: "Bandung",
    rating: 4.3,
    image: "/image/franchise/laundry.jpg",
    description: "Mulai dari",
    isFavorite: false,
    isNew: false,
    tags: ["Jasa", "Laundry", "Express"],
  },
];

const categories = ["Semua", "Makanan", "Minuman", "Jasa", "Retail"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showFilter, setShowFilter] = useState(false);

  // Filter and search logic
  const filteredFranchises = useMemo(() => {
    return franchiseData.filter((franchise) => {
      const matchesSearch =
        franchise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        franchise.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        franchise.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "Semua" || franchise.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle favorite for franchise ${id}`);
  };

  return (
    <AppLayout className="overflow-x-hidden">
      {/* Header */}
      <HeaderPage title="Hai John doe!" />

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
          >
            Lainnya
          </Button>
        </div>{" "}
        {/* Franchise Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredFranchises.slice(0, 4).map((franchise) => (
            <Card
              key={franchise.id}
              className="p-0 overflow-hidden border-gray-200 relative group cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <Link href={`/franchise/${franchise.id}`} className="block">
                <div className="relative">
                  <div className="bg-gray-200 relative overflow-hidden rounded-t-lg items-center flex justify-center h-36">
                    {/* Real image or placeholder */}
                    <Image
                      src="/image/home/template-picture-franchise-food.png"
                      alt={franchise.name}
                      width={138}
                      height={138}
                      className="object-cover rounded-2xl item"
                    />
                  </div>
                  {franchise.isNew && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                      Baru
                    </div>
                  )}
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
                        toggleFavorite(franchise.id);
                      }}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          franchise.isFavorite
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>
                  <CardDescription className="text-xs text-gray-500 mb-2">
                    Mulai dari
                  </CardDescription>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {franchise.rating}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {franchise.price}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
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
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-[#EF5A5A] hover:bg-[#EF5A5A]/90"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {filteredFranchises.slice(4).map((franchise) => (
            <Card
              key={franchise.id}
              className="p-0 overflow-hidden border-gray-200 relative group cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <Link href={`/franchise/${franchise.id}`} className="block">
                <div className="flex">
                  <div className="w-20 h-28 bg-gray-200 relative flex-shrink-0 overflow-hidden">
                    <Image
                      src="/image/home/template-picture-franchise-food.png"
                      alt={franchise.name}
                      width={138}
                      height={138}
                      className="object-cover rounded-2xl"
                    />
                    {franchise.isNew && (
                      <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 rounded z-10">
                        Baru
                      </div>
                    )}
                  </div>{" "}
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
                              toggleFavorite(franchise.id);
                            }}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                franchise.isFavorite
                                  ? "fill-orange-500 text-orange-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <CardDescription className="text-xs text-gray-500 mb-1">
                          Mulai dari
                        </CardDescription>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">
                              {franchise.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {franchise.location}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {franchise.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        {/* New Arrivals Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ada yang Baru Nih
          </h2>
          <Card className="p-0 overflow-hidden border-gray-200">
            <div className="h-32 bg-gradient-to-r from-orange-200 to-red-200 flex items-center justify-center">
              <span className="text-orange-600 font-semibold">
                Featured Franchise
              </span>
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-base font-semibold text-gray-900 mb-2">
                Promo Spesial Franchise Baru
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Dapatkan diskon hingga 30% untuk franchise pilihan bulan ini
              </CardDescription>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-center text-gray-500 text-sm">
            Menampilkan {filteredFranchises.length} hasil untuk &ldquo;
            {searchQuery}&rdquo;
          </div>
        )}
      </div>
    </AppLayout>
  );
}
