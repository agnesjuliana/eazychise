"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState, useCallback } from "react";

export default function StepThree() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    alamatTempat: "",
    noTelepon: "",
    npwp: "",
    alamatFranchise: "",
  });

  const [files, setFiles] = useState({
    scanKTP: null as File | null,
    fotoDiri: null as File | null,
    fotoFranchise: null as File | null,
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileUpload = useCallback((field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  }, []);

  return (
    <div className="mt-4 w-full space-y-6">
      <h1 className="text-xl font-semibold text-black mb-6">
        Formulir Pendaftaran
      </h1>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label
            htmlFor="namaLengkap"
            className="text-sm font-medium text-black"
          >
            Nama Lengkap
          </Label>
          <Input
            id="namaLengkap"
            placeholder="Dwiyanto Putra"
            value={formData.namaLengkap}
            onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-black">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Dwiyanto28@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Alamat Tempat Tinggal */}
        <div className="space-y-2">
          <Label
            htmlFor="alamatTempat"
            className="text-sm font-medium text-black"
          >
            Alamat Tempat Tinggal
          </Label>
          <Input
            id="alamatTempat"
            placeholder="Jalan Aja Dulu"
            value={formData.alamatTempat}
            onChange={(e) => handleInputChange("alamatTempat", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* No Telepon */}
        <div className="space-y-2">
          <Label htmlFor="noTelepon" className="text-sm font-medium text-black">
            No Telepon
          </Label>
          <Input
            id="noTelepon"
            placeholder="082327184928"
            value={formData.noTelepon}
            onChange={(e) => handleInputChange("noTelepon", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* NPWP */}
        <div className="space-y-2">
          <Label htmlFor="npwp" className="text-sm font-medium text-black">
            NPWP
          </Label>
          <Input
            id="npwp"
            placeholder="XXXXXXXXXX"
            value={formData.npwp}
            onChange={(e) => handleInputChange("npwp", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Alamat Lokasi Franchise */}
        <div className="space-y-2">
          <Label
            htmlFor="alamatFranchise"
            className="text-sm font-medium text-black"
          >
            Alamat Lokasi Franchise
          </Label>
          <Input
            id="alamatFranchise"
            placeholder="Jalan Aja Dulu"
            value={formData.alamatFranchise}
            onChange={(e) =>
              handleInputChange("alamatFranchise", e.target.value)
            }
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Scan KTP */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Scan KTP</Label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("scanKTP", e.target.files?.[0] || null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              {files.scanKTP ? (
                <span className="text-sm text-gray-600">
                  {files.scanKTP.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Upload file</span>
              )}
            </div>
          </div>
        </div>

        {/* Upload Foto Diri */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Foto Diri
          </Label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("fotoDiri", e.target.files?.[0] || null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              {files.fotoDiri ? (
                <span className="text-sm text-gray-600">
                  {files.fotoDiri.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Upload file</span>
              )}
            </div>
          </div>
        </div>

        {/* Upload Foto Lokasi Franchise */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Foto Lokasi Franchise
          </Label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("fotoFranchise", e.target.files?.[0] || null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              {files.fotoFranchise ? (
                <span className="text-sm text-gray-600">
                  {files.fotoFranchise.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Upload file</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
