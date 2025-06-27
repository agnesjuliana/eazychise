"use client";

import { Label } from "@/components/ui/label";
import { CreditCard, FileText, MapPin, Package, Coffee } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

// FranchiseData type definition
export type FranchiseData = {
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
  listing_documents: Array<{
    name: string;
    path: string;
  }>;
  listing_highlights: Array<{
    title: string;
    content: string;
  }>;
  ktp: string;
  foto_diri: string;
};

interface FranchiseDetailProps {
  franchiseData: FranchiseData;
}

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const FranchiseDetail: FC<FranchiseDetailProps> = ({ franchiseData }) => {
  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Detail Franchisor</h2>

      {/* Data Diri Franchisor */}
      <div className="space-y-4">
        <h3 className="font-semibold text-md">Data Diri</h3>

        <div>
          <Label className="text-xs text-gray-500">NIK</Label>
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{franchiseData.ktp}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Foto Diri</Label>
          <div className="mt-2 relative h-48 w-48 border rounded-md overflow-hidden">
            <Image
              src={franchiseData.foto_diri}
              alt="Franchisor Image"
              width={600}
              height={400}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Detail Franchise */}
      <div className="space-y-4 mt-6">
        <h3 className="font-semibold text-md border-b pb-2">
          Detail Franchise
        </h3>

        {/* Franchise Image */}
        <div>
          <Label className="text-xs text-gray-500">Foto Franchise</Label>
          <div className="mt-2 relative h-60 w-full md:w-3/4 border rounded-md overflow-hidden">
            <Image
              src={franchiseData.image}
              alt="Franchise Image"
              width={600}
              height={400}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Nama Franchise</Label>
          <p className="font-medium">{franchiseData.name}</p>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Harga</Label>
          <p className="font-medium">{formatCurrency(franchiseData.price)}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs text-gray-500">Status</Label>
          <span className="px-3 py-2 text-xs rounded-full font-semibold w-fit bg-green-100 text-green-800">
            {franchiseData.status === "active" ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Lokasi</Label>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{franchiseData.location}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Lokasi Penjualan</Label>
          <p className="font-medium">{franchiseData.sales_location}</p>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Peralatan</Label>
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{franchiseData.equipment}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Bahan-bahan</Label>
          <div className="flex items-center">
            <Coffee className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{franchiseData.materials}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 block mb-2">Dokumen</Label>
          <div className="space-y-2">
            <a
              href={franchiseData.ownership_document}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <FileText className="h-4 w-4 mr-1" />
              <span>Sertifikat Kepemilikan</span>
            </a>
            <a
              href={franchiseData.financial_statement}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <FileText className="h-4 w-4 mr-1" />
              <span>Laporan Keuangan</span>
            </a>
            <a
              href={franchiseData.proposal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <FileText className="h-4 w-4 mr-1" />
              <span>Proposal</span>
            </a>
          </div>
        </div>

        {/* Listing Dokumen */}
        <div>
          <Label className="text-xs text-gray-500 block mb-2">
            Dokumen Listing
          </Label>
          <div className="space-y-2">
            {franchiseData.listing_documents.map((doc, index) => (
              <a
                key={index}
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <FileText className="h-4 w-4 mr-1" />
                <span>{doc.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Listing Highlights */}
        <div>
          <Label className="text-xs text-gray-500 block mb-2">Keunggulan</Label>
          <div className="space-y-3">
            {franchiseData.listing_highlights.map((highlight, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-sm">{highlight.title}</h3>
                <p className="text-sm text-gray-600">{highlight.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDetail;
