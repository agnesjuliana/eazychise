"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { BackButton } from "@/components/ui/back-button";
import withAuth from "@/lib/withAuth";

function PrivacyPolicyPage() {
  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="KEBIJAKAN PRIVASI" />
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton fallbackUrl="/franchisor/profile" />
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
                      <li>Dokumen identitas (KTP, foto diri)</li>
                      <li>Informasi profil bisnis dan franchise</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      Data Penggunaan:
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Aktivitas dalam platform</li>
                      <li>Riwayat transaksi dan komunikasi</li>
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
                  <li>Menyediakan dan memelihara layanan platform</li>
                  <li>Memverifikasi identitas dan keamanan akun</li>
                  <li>
                    Memfasilitasi komunikasi antara franchisor dan franchisee
                  </li>
                  <li>Meningkatkan pengalaman pengguna dan fitur platform</li>
                  <li>Mengirim notifikasi penting terkait layanan</li>
                  <li>Mematuhi persyaratan hukum dan regulasi</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Keamanan Data
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi
                  yang sesuai untuk melindungi data pribadi Anda dari akses yang
                  tidak sah, kehilangan, atau penyalahgunaan:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Enkripsi data saat transit dan penyimpanan</li>
                  <li>Kontrol akses berbasis peran</li>
                  <li>Pemantauan keamanan berkelanjutan</li>
                  <li>Backup data secara teratur</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Berbagi Data
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Kami tidak menjual, menyewakan, atau membagikan data pribadi
                  Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali dalam
                  situasi berikut:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Ketika diperlukan untuk menyediakan layanan yang Anda minta
                  </li>
                  <li>Untuk mematuhi kewajiban hukum</li>
                  <li>
                    Dengan penyedia layanan terpercaya yang membantu operasi
                    platform
                  </li>
                  <li>
                    Dalam keadaan darurat untuk melindungi keselamatan pengguna
                  </li>
                </ul>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Hak Anda
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Mengakses dan memperbarui data pribadi Anda</li>
                  <li>
                    Meminta penghapusan data pribadi (dengan batasan tertentu)
                  </li>
                  <li>Menarik persetujuan penggunaan data</li>
                  <li>Meminta portabilitas data</li>
                  <li>Mengajukan keluhan terkait pemrosesan data</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Cookies dan Teknologi Pelacakan
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Kami menggunakan cookies dan teknologi serupa untuk
                  meningkatkan pengalaman Anda, menganalisis penggunaan
                  platform, dan menyediakan fitur yang dipersonalisasi. Anda
                  dapat mengatur preferensi cookies melalui pengaturan browser
                  Anda.
                </p>
              </div>

              {/* Policy Updates */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Perubahan Kebijakan
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke
                  waktu. Perubahan material akan diberitahukan melalui platform
                  atau email. Penggunaan berkelanjutan layanan kami setelah
                  perubahan menunjukkan persetujuan Anda terhadap kebijakan yang
                  telah diperbarui.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Hubungi Kami
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini
                  atau ingin menggunakan hak Anda terkait data pribadi, silakan
                  hubungi kami:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> privacy@eazychise.com
                    <br />
                    <strong>Telepon:</strong> +62 21 1234 5678
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
    </FranchisorLayout>
  );
}

export default withAuth(PrivacyPolicyPage, "FRANCHISOR");
