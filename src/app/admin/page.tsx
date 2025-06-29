"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { User as UserType } from "@/type/user";
import React from "react";
import { Loader2, Eye, Download, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin-layout";
import withAuth from "@/lib/withAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FranchiseData {
  id: string;
  name: string;
  price: number;
  image: string;
  status: string;
  location: string;
  ownership_document: string;
  financial_statement: string;
  proposal: string;
  sales_location: string;
  equipment: string;
  materials: string;
  confirmation_status: "WAITING" | "ACCEPTED" | "REJECTED";
  franchisor: {
    id: string;
    name: string;
    email: string;
    status: "WAITING" | "ACCEPTED" | "REJECTED";
    franchisor_profiles: {
      ktp: string;
      foto_diri: string;
    };
  };
  listings_highlights: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  listing_documents: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
}

function AdminVerifyPage() {
  const [activeTab, setActiveTab] = React.useState<"users" | "franchises">("users");
  const [role, setRole] = React.useState<string>("FRANCHISEE");
  const [status, setStatus] = React.useState<string>("all");
  const [user, setUser] = React.useState<UserType[]>([]);
  const [franchises, setFranchises] = React.useState<FranchiseData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedFranchise, setSelectedFranchise] = React.useState<FranchiseData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const userResponse = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.status) {
            setUser(userData.data as UserType[]);
          }
        }

        // Fetch franchises
        const franchiseResponse = await fetch("/api/admin/franchises", {
          credentials: "include",
        });
        if (franchiseResponse.ok) {
          const franchiseData = await franchiseResponse.json();
          setFranchises(franchiseData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateFranchiseStatus = async (
    franchiseId: string, 
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh franchise data
        const franchiseResponse = await fetch("/api/admin/franchises", {
          credentials: "include",
        });
        if (franchiseResponse.ok) {
          const franchiseData = await franchiseResponse.json();
          setFranchises(franchiseData.data || []);
        }
        setIsDialogOpen(false);
        setSelectedFranchise(null);
      }
    } catch (error) {
      console.error("Error updating franchise status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const userRender = React.useMemo(() => {
    console.log("user", user);
    return user
      .filter((u) => u.role === role)
      .filter((u) => u.status === status || status === "all");
  }, [user, role, status]);

  const franchiseRender = React.useMemo(() => {
    return franchises.filter((f) => f.confirmation_status === status || status === "all");
  }, [franchises, status]); // Menghitung tinggi header dan switch (162px header + padding bottom/top + tinggi tombol + gap + tinggi status filter)
  console.log("userRender", userRender);
  const headerHeight = 162 + 20 + 44 + 16 + 44 + 16; // Perkiraan tinggi total elemen fixed

  return (
    <AdminLayout>
      {/* Fixed Header dan Button */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        {/* Custom Header dengan Back Button Integrated */}
        <div className="bg-[#EF5A5A] h-[162px] w-full relative rounded-b-[10px] flex items-center justify-center">
          {/* Back Button di dalam header */}
          <div className="absolute left-4 top-4">
            <BackButton fallbackUrl="/" variant="ghost" size="sm" className="text-white hover:bg-white/20 border-white/30" />
          </div>
          
          {/* Cloud decorations - existing */}
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute -top-[20px] left-[80px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[45px] left-[0px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute top-[20px] -right-[40px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[10px] right-[40px]"
          />
          
          {/* Title */}
          <h2 className="text-center text-white text-[24px] font-semibold font-poppins mt-4">
            Admin Panel
          </h2>
        </div>
        
        {/* Main Tab Filter */}
        <div className="flex w-full items-center px-2 bg-gray-50 justify-around border-b border-gray-200">
          <Button
            onClick={() => setActiveTab("users")}
            variant="ghost"
            size="lg"
            disabled={activeTab === "users"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              activeTab === "users"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveTab("franchises")}
            variant="ghost"
            size="lg"
            disabled={activeTab === "franchises"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              activeTab === "franchises"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Franchises
          </Button>
        </div>

        {/* Role Filter - Only show for Users tab */}
        {activeTab === "users" && (
          <div className="flex w-full items-center px-2 bg-gray-50 justify-around">
            <Button
              onClick={() => setRole("FRANCHISEE")}
              variant="ghost"
              size="lg"
              disabled={role === "FRANCHISEE"}
              className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
                role === "FRANCHISEE"
                  ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                  : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
              }`}
            >
              Franchisee
            </Button>
            <Button
              onClick={() => setRole("FRANCHISOR")}
              variant="ghost"
              size="lg"
              disabled={role === "FRANCHISOR"}
              className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
                role === "FRANCHISOR"
                  ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                  : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
              }`}
            >
              Franchisor
            </Button>
          </div>
        )}{" "}
        {/* Status Filter */}
        <div className="flex w-full items-center px-1 bg-gray-50 justify-between border-t border-gray-200 pt-2">
          <Button
            onClick={() => setStatus("all")}
            variant="ghost"
            size="sm"
            disabled={status === "all"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "all"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Semua
          </Button>
          <Button
            onClick={() => setStatus("WAITING")}
            variant="ghost"
            size="sm"
            disabled={status === "WAITING"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "WAITING"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Pending
          </Button>
          <Button
            onClick={() => setStatus("ACCEPTED")}
            variant="ghost"
            size="sm"
            disabled={status === "ACCEPTED"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "ACCEPTED"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Aktif
          </Button>
          <Button
            onClick={() => setStatus("REJECTED")}
            variant="ghost"
            size="sm"
            disabled={status === "REJECTED"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "REJECTED"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Ditolak
          </Button>
        </div>
      </div>
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div
        style={{ height: `${headerHeight}px` }}
        className="w-full bg-gray-50"
      ></div>
      {/* Konten Utama */}
      <div className="flex flex-col gap-4 w-full px-4 pb-10">
        <div className="flex flex-col gap-3 w-full ">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
              <p className="text-gray-500">Mengambil data...</p>
            </div>
          ) : activeTab === "users" ? (
            // Users Content
            userRender.length > 0 ? (
              userRender.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{u.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          u.status === "WAITING"
                            ? "bg-yellow-100 text-yellow-800"
                            : u.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.status === "WAITING"
                          ? "Pending"
                          : u.status === "ACCEPTED"
                          ? "Aktif"
                          : "Ditolak"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                  <Link href={`/admin/${u.id}`}>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#EF5A5A] hover:bg-[#c84d4d] active:bg-[#b04545] cursor-pointer text-white"
                    >
                      Details
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-500 mb-2">
                  Tidak ada akun{" "}
                  {role === "FRANCHISOR" ? "Franchisor" : "Franchisee"}
                </p>
              </div>
            )
          ) : (
            // Franchises Content
            franchiseRender.length > 0 ? (
              franchiseRender.map((franchise) => (
                <div key={franchise.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={franchise.image || "/image/dummy/franchise-placeholder.jpg"}
                        alt={franchise.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{franchise.name}</h3>
                        <p className="text-sm text-gray-600">{franchise.franchisor.name}</p>
                        <p className="text-sm font-bold text-[#EF5A5A] mt-1">
                          {formatPrice(franchise.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(franchise.confirmation_status)} text-xs`}>
                        {franchise.confirmation_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Lokasi:</span> {franchise.location}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFranchise(franchise);
                        setIsDialogOpen(true);
                      }}
                      className="text-[#EF5A5A] border-[#EF5A5A] hover:bg-[#EF5A5A] hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-500 mb-2">Tidak ada data franchise</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Detail Dialog untuk Franchise */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedFranchise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Detail Franchise - {selectedFranchise.name}
                </DialogTitle>
                <DialogDescription>
                  Informasi lengkap tentang pendaftaran franchise
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Informasi Franchisor</h4>
                    <p><span className="font-medium">Nama:</span> {selectedFranchise.franchisor.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedFranchise.franchisor.email}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedFranchise.franchisor.status)}`}>
                        {selectedFranchise.franchisor.status}
                      </Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Informasi Franchise</h4>
                    <p><span className="font-medium">Nama:</span> {selectedFranchise.name}</p>
                    <p><span className="font-medium">Harga:</span> {formatPrice(selectedFranchise.price)}</p>
                    <p><span className="font-medium">Lokasi:</span> {selectedFranchise.location}</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold mb-3">Dokumen Identitas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">KTP</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(selectedFranchise.franchisor.franchisor_profiles.ktp, "KTP.jpg")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download KTP
                      </Button>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">Foto Diri</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(selectedFranchise.franchisor.franchisor_profiles.foto_diri, "Foto-Diri.jpg")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download Foto
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Business Documents */}
                <div>
                  <h4 className="font-semibold mb-3">Dokumen Bisnis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">Dokumen Kepemilikan</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(selectedFranchise.ownership_document, "Dokumen-Kepemilikan.pdf")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">Laporan Keuangan</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(selectedFranchise.financial_statement, "Laporan-Keuangan.pdf")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">Proposal Bisnis</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(selectedFranchise.proposal, "Proposal-Bisnis.pdf")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Detail Bisnis</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Lokasi Penjualan:</h5>
                      <p className="text-sm text-gray-600">{selectedFranchise.sales_location}</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Peralatan:</h5>
                      <p className="text-sm text-gray-600">{selectedFranchise.equipment}</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Bahan Baku:</h5>
                      <p className="text-sm text-gray-600">{selectedFranchise.materials}</p>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-semibold mb-3">Keunggulan Franchise</h4>
                  <div className="space-y-3">
                    {selectedFranchise.listings_highlights.map((highlight) => (
                      <div key={highlight.id} className="border rounded-lg p-3">
                        <h5 className="font-medium">{highlight.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{highlight.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Documents */}
                {selectedFranchise.listing_documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Dokumen Pendukung</h4>
                    <div className="space-y-2">
                      {selectedFranchise.listing_documents.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center border rounded-lg p-3">
                          <span className="font-medium">{doc.name}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(doc.path, doc.name)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedFranchise.confirmation_status === "WAITING" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => updateFranchiseStatus(selectedFranchise.id, "ACCEPTED")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Terima
                    </Button>
                    <Button
                      onClick={() => updateFranchiseStatus(selectedFranchise.id, "REJECTED")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Tolak
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default withAuth(AdminVerifyPage, "ADMIN");
