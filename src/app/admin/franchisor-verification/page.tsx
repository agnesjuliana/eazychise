"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, CheckCircle, XCircle, Clock } from "lucide-react";
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

function FranchisorVerificationPage() {
  const [franchises, setFranchises] = useState<FranchiseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "WAITING" | "ACCEPTED" | "REJECTED">("all");

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/franchises", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setFranchises(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFranchiseStatus = async (
    franchiseId: string, 
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchFranchises(); // Refresh data
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WAITING":
        return <Clock className="w-4 h-4" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredFranchises = franchises.filter(franchise => 
    filter === "all" || franchise.confirmation_status === filter
  );

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF5A5A] mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifikasi Franchisor
          </h1>
          <p className="text-gray-600">
            Kelola dan verifikasi pendaftaran franchisor baru
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#EF5A5A] text-white" : ""}
          >
            Semua ({franchises.length})
          </Button>
          <Button
            variant={filter === "WAITING" ? "default" : "outline"}
            onClick={() => setFilter("WAITING")}
            className={filter === "WAITING" ? "bg-[#EF5A5A] text-white" : ""}
          >
            Menunggu ({franchises.filter(f => f.confirmation_status === "WAITING").length})
          </Button>
          <Button
            variant={filter === "ACCEPTED" ? "default" : "outline"}
            onClick={() => setFilter("ACCEPTED")}
            className={filter === "ACCEPTED" ? "bg-[#EF5A5A] text-white" : ""}
          >
            Diterima ({franchises.filter(f => f.confirmation_status === "ACCEPTED").length})
          </Button>
          <Button
            variant={filter === "REJECTED" ? "default" : "outline"}
            onClick={() => setFilter("REJECTED")}
            className={filter === "REJECTED" ? "bg-[#EF5A5A] text-white" : ""}
          >
            Ditolak ({franchises.filter(f => f.confirmation_status === "REJECTED").length})
          </Button>
        </div>

        {/* Franchise Cards */}
        <div className="grid gap-6">
          {filteredFranchises.map((franchise) => (
            <Card key={franchise.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={franchise.image || "/image/dummy/franchise-placeholder.jpg"}
                    alt={franchise.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{franchise.name}</h3>
                    <p className="text-gray-600">{franchise.franchisor.name}</p>
                    <p className="text-sm text-gray-500">{franchise.franchisor.email}</p>
                    <p className="text-lg font-bold text-[#EF5A5A] mt-1">
                      {formatPrice(franchise.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(franchise.confirmation_status)} flex items-center gap-1`}>
                    {getStatusIcon(franchise.confirmation_status)}
                    {franchise.confirmation_status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFranchise(franchise);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Lokasi:</span> {franchise.location}
                </div>
                <div>
                  <span className="font-medium">Status User:</span>{" "}
                  <Badge className={getStatusColor(franchise.franchisor.status)}>
                    {franchise.franchisor.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredFranchises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada data franchisor</p>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedFranchise && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Detail Franchisor - {selectedFranchise.name}
                  </DialogTitle>
                  <DialogDescription>
                    Informasi lengkap tentang pendaftaran franchisor
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
                      <p><span className="font-medium">Nama Franchise:</span> {selectedFranchise.name}</p>
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
      </div>
    </AdminLayout>
  );
}

export default withAuth(FranchisorVerificationPage, "ADMIN");
