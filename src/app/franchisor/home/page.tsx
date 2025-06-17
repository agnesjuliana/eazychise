"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
//import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
//import { Input } from "@/components/ui/input";
//import { Bookmark, Filter, MapPin, Search, Star } from "lucide-react";
//import Link from "next/link";
import Image from "next/image";

// Dummy franchise data (misal butuh)
const franchiseData = [
  {
    id: 1,
    name: "Pecel Madiun Bu Ati",
    category: "Makanan",
    price: "Rp5.000.000",
    location: "Jl. Keputih, Surabaya",
    rating: 4.5,
    image: "/image/franchise/pecel-madiun.jpg",
    description: "Nasi pecel lengkap legenda surabaya",
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
    description: "Soto enak punya pak slamet nih",
    isFavorite: false,
    isNew: true,
    tags: ["Makanan", "Soto", "Tradisional"],
  },
];

const registeredFranchise = franchiseData[0];

//const categories = ["Semua", "Makanan", "Minuman", "Jasa", "Retail"];

export default function HomeFranchisorPage() {
  //const [searchQuery, setSearchQuery] = useState("");
  //const [selectedCategory, setSelectedCategory] = useState("Semua");
  //const [showFilter, setShowFilter] = useState(false);

  // Filter and search logic
  /*const filteredFranchises = useMemo(() => {
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
  };*/

  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header */}
      <HeaderPage title="Dashboard Franchisor" />

      <div className="p-4 space-y-6">
        {/* Subtitle */}
        <p className="text-white text-sm -mt-20 mb-6 text-center">
          Mulai Bisnismu Tanpa Overthinking!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-18">
            {/* Card Franchise Terjual */}
            <Card className="bg-[#EF5A5A] text-white p-4 overflow-hidden">
                <CardContent className="relative p-0 h-full">
                <p className="text-xs font-light">Franchise Terjual</p>
                <p className="text-3xl font-bold mt-1">50</p>
                
                <Image
                    src="/image/cloudWhite.png"
                    alt="Cloud Element"
                    width={28.95}  // Ukuran disesuaikan agar tidak terlalu besar
                    height={19.11}
                    className="absolute -bottom-1 -right-1" // Posisi di pojok kanan bawah
                />
                </CardContent>
            </Card>
            {/* Card Total Aset */}
            <Card className="bg-[#FFA952] text-black p-4 overflow-hidden">
                <CardContent className="relative p-0 h-full">
                <p className="text-xs font-light">Total Aset</p>
                <p className="text-l font-bold mt-1">Rp500.000.000</p>
                <Image
                    src="/image/cloudOrange.png"
                    alt="Cloud Element"
                    width={28.95}
                    height={19.11}
                    className="absolute -bottom-1 -right-1"
                />
                </CardContent>
            </Card>
        </div>
        {/* Registered Franchise */}
        {registeredFranchise && (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Registered Franchise
            </h2>
            <Card className="p-0 overflow-hidden border-gray-200">
            <div className="relative h-40 w-full">
                <Image
                src={registeredFranchise.image}
                alt={`Image of ${registeredFranchise.name}`}
                layout="fill"
                objectFit="cover"
                className="bg-gray-200"
                />
            </div>
            <CardContent className="px-4 pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                {registeredFranchise.name}
                </CardTitle>
                <CardDescription className="text-xs text-gray-600 mb-2">
                {registeredFranchise.location}
                </CardDescription>
                <CardDescription className="text-sm text-gray-600">
                {registeredFranchise.description}
                </CardDescription>
            </CardContent>
            </Card>
        </div>
        )}
      </div>
    </FranchisorLayout>
  );
}