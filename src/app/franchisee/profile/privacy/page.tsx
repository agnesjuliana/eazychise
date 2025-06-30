"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import { BackButton } from "@/components/ui/back-button";
import withAuth from "@/lib/withAuth";

function PrivacyPolicyPage() {
  return (
    <AppLayout className="overflow-x-hidden">
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="KEBIJAKAN PRIVASI" />
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton fallbackUrl="/franchisee/profile" />
        </div>

        {/* Content */}
        <div className="px-4 mt-3 relative z-10 pb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-6">
              {/* Introduction */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Pengantar
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  EazyChise berkomitmen untuk melindungi privasi dan keamanan
                  data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana
                  kami mengumpulkan, menggunakan, dan melindungi informasi Anda
                  saat menggunakan platform kami.
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Informasi yang Kami Kumpulkan
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Data Pribadi:
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Nama lengkap dan informasi kontak</li>
                      <li>Alamat email dan nomor telepon</li>
                      <li>Dokumen identitas dan kelengkapan usaha</li>
                      <li>Informasi keuangan dan riwayat transaksi</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Data Penggunaan:
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Aktivitas pencarian dan aplikasi franchise</li>
                      <li>Riwayat komunikasi dengan franchisor</li>
                      <li>Preferensi dan pengaturan akun</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Bagaimana Kami Menggunakan Data Anda
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Memfasilitasi pencarian dan aplikasi franchise</li>
                  <li>
                    Memverifikasi identitas dan kelayakan sebagai franchisee
                  </li>
                  <li>Menghubungkan Anda dengan franchisor yang sesuai</li>
                  <li>Meningkatkan pengalaman pengguna platform</li>
                  <li>Mengirim rekomendasi franchise yang relevan</li>
                  <li>Mematuhi persyaratan hukum dan regulasi</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Keamanan Data
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Kami menerapkan langkah-langkah keamanan terdepan untuk
                  melindungi data pribadi Anda dari akses yang tidak sah,
                  kehilangan, atau penyalahgunaan:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Enkripsi end-to-end untuk semua data sensitif</li>
                  <li>Autentikasi multi-faktor untuk akses akun</li>
                  <li>Monitoring keamanan real-time</li>
                  <li>Backup data otomatis dan terenkripsi</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Berbagi Data
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Kami hanya membagikan data Anda dalam situasi berikut:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Dengan franchisor yang Anda aplikasikan (setelah
                    persetujuan)
                  </li>
                  <li>Untuk verifikasi kelayakan dan background check</li>
                  <li>
                    Dengan penyedia layanan terpercaya untuk operasi platform
                  </li>
                  <li>Ketika diwajibkan oleh hukum atau otoritas</li>
                </ul>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Hak Anda sebagai Franchisee
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Sebagai pengguna platform, Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Mengakses dan memperbarui profil dan dokumen Anda</li>
                  <li>Mengontrol data yang dibagikan dengan franchisor</li>
                  <li>Meminta penghapusan akun dan data pribadi</li>
                  <li>Mendapatkan salinan data pribadi yang tersimpan</li>
                  <li>Mengajukan keluhan terkait penggunaan data</li>
                </ul>
              </div>

              {/* Franchisee Rights */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Perlindungan Khusus Franchisee
                </h2>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      🔒 Kontrol Aplikasi
                    </h3>
                    <p className="text-sm text-blue-700">
                      Data Anda hanya akan dibagikan kepada franchisor setelah
                      Anda secara eksplisit mengajukan aplikasi dan memberikan
                      persetujuan.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">
                      📋 Transparansi Proses
                    </h3>
                    <p className="text-sm text-green-700">
                      Anda akan selalu mendapat notifikasi tentang status
                      aplikasi dan penggunaan data Anda dalam proses seleksi
                      franchise.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">
                      🛡️ Perlindungan Identitas
                    </h3>
                    <p className="text-sm text-orange-700">
                      Informasi sensitif seperti data keuangan akan di-anonymize
                      dalam tahap awal seleksi untuk melindungi privasi Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Cookies dan Personalisasi
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Kami menggunakan cookies untuk memberikan rekomendasi
                  franchise yang personal berdasarkan preferensi dan aktivitas
                  Anda. Anda dapat mengatur preferensi cookies melalui
                  pengaturan browser atau akun Anda.
                </p>
              </div>

              {/* Policy Updates */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Perubahan Kebijakan
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Setiap perubahan material pada kebijakan privasi akan
                  diberitahukan minimal 30 hari sebelum berlaku efektif melalui
                  email dan notifikasi dalam aplikasi.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Hubungi Kami
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Untuk pertanyaan tentang kebijakan privasi atau penggunaan hak
                  Anda:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Tim Privacy:</strong> privacy@eazychise.com
                    <br />
                    <strong>Customer Service:</strong> +62 21 1234 5678
                    <br />
                    <strong>Alamat:</strong> Jakarta, Indonesia
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Kebijakan privasi ini terakhir diperbarui pada:{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(PrivacyPolicyPage, "FRANCHISEE");
