"use client";

import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import withAuth from "@/lib/withAuth";

function PrivacyPolicyPage() {
  return (
    <AdminLayout className="overflow-x-hidden">
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="KEBIJAKAN PRIVASI" />
      </div>

      <div className="bg-gray-50">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton fallbackUrl="/admin/profile" />
        </div>

        {/* Privacy Policy Content */}
        <div className="px-4 pt-4 space-y-6 pb-6">
          {/* Introduction */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-[#EF5A5A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Kebijakan Privasi Admin
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Sebagai administrator platform EazyChise, Anda memiliki akses ke
              data sensitif pengguna dan bertanggung jawab untuk melindungi
              privasi mereka. Kebijakan ini mengatur bagaimana data harus
              ditangani dan dilindungi.
            </p>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: Desember 2024
            </p>
          </div>

          {/* Data Access & Responsibilities */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Database className="w-5 h-5 text-[#EF5A5A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Akses Data & Tanggung Jawab
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Data yang Dapat Diakses:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Informasi profil pengguna (franchisor dan franchisee)</li>
                  <li>Dokumen verifikasi dan validasi</li>
                  <li>Data transaksi dan aktivitas platform</li>
                  <li>Log sistem dan keamanan</li>
                  <li>Laporan dan analitik platform</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Tanggung Jawab Admin:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Menjaga kerahasiaan semua data pengguna</li>
                  <li>Hanya mengakses data yang diperlukan untuk tugas</li>
                  <li>Tidak membagikan informasi ke pihak ketiga</li>
                  <li>Melaporkan setiap insiden keamanan data</li>
                  <li>Menggunakan akses admin secara etis dan professional</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 text-[#EF5A5A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Keamanan Data
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Protokol Keamanan:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Gunakan password yang kuat dan unik untuk akun admin</li>
                  <li>Aktifkan two-factor authentication (2FA)</li>
                  <li>Logout dari sistem setelah selesai bekerja</li>
                  <li>Jangan mengakses panel admin dari perangkat publik</li>
                  <li>Laporkan aktivitas mencurigakan segera</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Backup dan Recovery:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Data di-backup secara otomatis setiap hari</li>
                  <li>Backup disimpan dengan enkripsi tingkat tinggi</li>
                  <li>Proses recovery data tersedia untuk emergency</li>
                  <li>Log backup dapat dimonitor melalui panel admin</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Monitoring */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 text-[#EF5A5A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Monitoring & Audit
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Aktivitas yang Dimonitor:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Semua akses data pengguna tercatat dalam log</li>
                  <li>Waktu login dan logout admin dilacak</li>
                  <li>Perubahan data penting memerlukan approval</li>
                  <li>Audit rutin dilakukan untuk memastikan compliance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Pelaporan Insiden:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Laporkan segera jika akun admin dikompromikan</li>
                  <li>Dokumentasikan setiap pelanggaran data yang ditemukan</li>
                  <li>Eskalasi masalah keamanan ke tim IT security</li>
                  <li>Koordinasi dengan tim legal jika diperlukan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Rights & Compliance */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hak Pengguna & Compliance
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Hak Privasi Pengguna:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Hak untuk mengakses data pribadi mereka</li>
                  <li>Hak untuk mengoreksi informasi yang tidak akurat</li>
                  <li>Hak untuk menghapus data (sesuai ketentuan)</li>
                  <li>Hak untuk membatasi pemrosesan data</li>
                  <li>Hak untuk mendapat penjelasan penggunaan data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Compliance Requirements:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Patuhi regulasi perlindungan data personal Indonesia</li>
                  <li>Implementasikan prinsip data minimization</li>
                  <li>Pastikan consent pengguna untuk pemrosesan data</li>
                  <li>Maintain audit trail untuk semua aktivitas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Kontak Privacy Officer
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Untuk pertanyaan terkait kebijakan privasi atau melaporkan insiden
              keamanan data:
            </p>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-blue-900">Email:</span>
                <span className="text-blue-700 ml-2">
                  privacy@eazychise.com
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-blue-900">Telepon:</span>
                <span className="text-blue-700 ml-2">
                  +62 21 1234 5678 ext. 101
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⚠️ Peringatan Penting
            </h3>
            <p className="text-sm text-red-700">
              Pelanggaran terhadap kebijakan privasi ini dapat mengakibatkan
              tindakan disipliner, termasuk pencabutan akses admin dan tindakan
              hukum sesuai peraturan yang berlaku. Pastikan Anda memahami dan
              mematuhi semua ketentuan di atas.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(PrivacyPolicyPage, "ADMIN");
