"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import {
  ArrowLeft,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

function HelpPage() {
  const router = useRouter();

  const faqItems = [
    {
      question: "Bagaimana cara mencari franchise yang sesuai?",
      answer:
        "Gunakan fitur filter berdasarkan kategori, lokasi, dan budget investasi. Anda juga dapat menggunakan fitur pencarian untuk menemukan franchise spesifik yang diminati.",
    },
    {
      question: "Apa saja dokumen yang diperlukan untuk aplikasi franchise?",
      answer:
        "Dokumen yang biasanya diperlukan meliputi KTP, NPWP, SIUP, Surat Keterangan Domisili Usaha, dan dokumen finansial seperti rekening koran atau laporan keuangan.",
    },
    {
      question: "Berapa lama proses aplikasi franchise?",
      answer:
        "Proses aplikasi umumnya memakan waktu 1-4 minggu, tergantung pada franchisor dan kelengkapan dokumen yang Anda berikan. Beberapa franchisor mungkin memiliki proses yang lebih cepat.",
    },
    {
      question: "Bagaimana cara berkomunikasi dengan franchisor?",
      answer:
        "Setelah mengajukan aplikasi, Anda dapat berkomunikasi langsung dengan franchisor melalui sistem chat dalam platform atau kontak yang disediakan dalam listing franchise.",
    },
    {
      question: "Apa yang harus dilakukan jika aplikasi ditolak?",
      answer:
        "Jika aplikasi ditolak, Anda akan menerima feedback dari franchisor. Anda dapat memperbaiki aspek yang kurang dan mengajukan aplikasi ke franchise lain yang lebih sesuai dengan profil Anda.",
    },
    {
      question:
        "Bisakah saya mengajukan aplikasi ke beberapa franchise sekaligus?",
      answer:
        "Ya, Anda dapat mengajukan aplikasi ke beberapa franchise sekaligus. Namun pastikan Anda dapat mengelola semua komunikasi dan proses seleksi dengan baik.",
    },
    {
      question: "Bagaimana cara memperbarui profil dan dokumen saya?",
      answer:
        "Anda dapat memperbarui profil melalui halaman 'Akun' di menu Profile. Untuk dokumen, gunakan halaman 'Kelengkapan Dokumen' untuk upload atau update dokumen terbaru.",
    },
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Telepon",
      description: "+62 21 1234 5678",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@eazychise.com",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <AppLayout className="overflow-x-hidden">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="relative">
          <HeaderPage title="BANTUAN" />
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 -mt-6 relative z-10 pb-8 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Butuh Bantuan Cepat?
            </h2>
            <div className="space-y-3">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (option.title === "Telepon") {
                      window.open("tel:+6221123456578");
                    } else if (option.title === "Email") {
                      window.open("mailto:support@eazychise.com");
                    } else {
                      alert("Fitur live chat akan segera tersedia");
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${option.color}`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900 text-left">
                      {item.question}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Panduan Memulai sebagai Franchisee
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Lengkapi Profil Anda
                  </h3>
                  <p className="text-sm text-gray-600">
                    Isi profil dengan lengkap dan upload dokumen yang diperlukan
                    untuk meningkatkan kredibilitas Anda
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Cari Franchise yang Sesuai
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gunakan filter untuk menemukan franchise yang sesuai dengan
                    budget, lokasi, dan minat Anda
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Ajukan Aplikasi</h3>
                  <p className="text-sm text-gray-600">
                    Kirim aplikasi ke franchise yang diminati dengan melengkapi
                    form dan dokumen yang diperlukan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Proses Seleksi</h3>
                  <p className="text-sm text-gray-600">
                    Ikuti proses seleksi dari franchisor dan jaga komunikasi
                    yang baik selama proses berlangsung
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Mulai Kemitraan</h3>
                  <p className="text-sm text-gray-600">
                    Setelah diterima, ikuti onboarding dan training dari
                    franchisor untuk memulai bisnis Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Success */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tips Sukses Menjadi Franchisee
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-1">
                  🎯 Riset yang Mendalam
                </h3>
                <p className="text-sm text-blue-700">
                  Lakukan riset menyeluruh tentang brand, pasar target, dan
                  kompetitor sebelum mengajukan aplikasi franchise.
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-1">
                  💰 Persiapan Finansial
                </h3>
                <p className="text-sm text-green-700">
                  Pastikan Anda memiliki modal yang cukup tidak hanya untuk
                  franchise fee, tapi juga untuk operasional awal dan biaya tak
                  terduga.
                </p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-1">
                  📍 Lokasi Strategis
                </h3>
                <p className="text-sm text-orange-700">
                  Pilih lokasi yang strategis sesuai dengan target market dari
                  franchise yang Anda pilih. Lokasi adalah kunci sukses bisnis
                  retail.
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-1">
                  🤝 Komitmen Jangka Panjang
                </h3>
                <p className="text-sm text-purple-700">
                  Franchise adalah komitmen jangka panjang. Pastikan Anda siap
                  mengikuti sistem dan standar dari franchisor dengan konsisten.
                </p>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="bg-gradient-to-r from-[#EF5A5A] to-[#FF7B7B] rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Masih Butuh Bantuan?</h2>
            <p className="text-white/90 mb-4">
              Tim customer service kami siap membantu Anda menemukan franchise
              yang tepat dan menjalani proses aplikasi dengan sukses.
            </p>
            <button
              onClick={() => window.open("mailto:support@eazychise.com")}
              className="bg-white text-[#EF5A5A] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Hubungi Support
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(HelpPage, "FRANCHISEE");
