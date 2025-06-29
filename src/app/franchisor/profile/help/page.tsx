"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { ArrowLeft, Phone, Mail, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

function HelpPage() {
  const router = useRouter();

  const faqItems = [
    {
      question: "Bagaimana cara menambahkan listing franchise baru?",
      answer:
        "Anda dapat menambahkan listing franchise melalui halaman 'Tambah Franchise' di dashboard. Pastikan melengkapi semua informasi yang diperlukan termasuk deskripsi, foto, dan dokumen pendukung.",
    },
    {
      question: "Bagaimana cara mengelola aplikasi dari franchisee?",
      answer:
        "Semua aplikasi dari calon franchisee dapat dilihat dan dikelola melalui halaman 'Manajemen Aplikasi'. Anda dapat mereview, menerima, atau menolak aplikasi yang masuk.",
    },
    {
      question: "Apa yang harus dilakukan jika ada masalah dengan pembayaran?",
      answer:
        "Jika ada masalah pembayaran, silakan hubungi tim customer service kami melalui email atau telepon. Sertakan detail transaksi untuk penanganan yang lebih cepat.",
    },
    {
      question: "Bagaimana cara memperbarui informasi franchise?",
      answer:
        "Anda dapat memperbarui informasi franchise melalui halaman 'Edit Franchise' di dashboard. Perubahan akan direview oleh tim kami sebelum dipublikasikan.",
    },
    {
      question: "Apakah ada biaya untuk menggunakan platform EazyChise?",
      answer:
        "Platform EazyChise menggunakan model commission-based. Biaya hanya dikenakan ketika ada transaksi yang berhasil. Detail lengkap dapat dilihat di halaman 'Biaya & Tarif'.",
    },
    {
      question: "Bagaimana cara berkomunikasi dengan calon franchisee?",
      answer:
        "Anda dapat berkomunikasi dengan calon franchisee melalui sistem pesan dalam platform, atau melalui kontak yang telah disediakan dalam aplikasi mereka.",
    },
    {
      question:
        "Bagaimana cara meningkatkan visibilitas listing franchise saya?",
      answer:
        "Pastikan listing Anda dilengkapi dengan foto berkualitas, deskripsi yang menarik, dan informasi yang akurat. Anda juga dapat menggunakan fitur promosi untuk meningkatkan visibilitas.",
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
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-gray-50 w-full">
        <HeaderPage title="BANTUAN" />
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div style={{ height: "180px" }} className="w-full bg-gray-50"></div>
      <div className="min-h-screen bg-gray-50">
        {/* Content */}
        <div className="px-4 mt-3 relative z-10 pb-8 space-y-4">
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
              Panduan Memulai sebagai Franchisor
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Lengkapi Profil dan Dokumen
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pastikan profil franchisor dan dokumen pendukung sudah
                    lengkap dan terverifikasi untuk membangun kepercayaan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Buat Listing Franchise yang Menarik
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tambahkan detail franchise dengan foto berkualitas,
                    deskripsi yang jelas, dan informasi investasi yang
                    transparan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Kelola Aplikasi Masuk
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor dan responsi aplikasi dari calon franchisee dengan
                    cepat dan profesional
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Seleksi dan Evaluasi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lakukan seleksi menyeluruh untuk memastikan calon franchisee
                    sesuai dengan kriteria bisnis Anda
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Bangun Kemitraan Sukses
                  </h3>
                  <p className="text-sm text-gray-600">
                    Berikan training dan support yang berkualitas untuk
                    memastikan kesuksesan mitra franchisee
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Success */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tips Sukses Menjadi Franchisor
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-1">
                  💡 Buat Deskripsi yang Menarik
                </h3>
                <p className="text-sm text-blue-700">
                  Gunakan deskripsi yang jelas dan menarik untuk listing
                  franchise Anda. Sertakan keunggulan, support yang diberikan,
                  dan proyeksi bisnis.
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-1">
                  � Transparansi Investasi
                </h3>
                <p className="text-sm text-green-700">
                  Berikan informasi investasi yang jelas dan transparan.
                  Jelaskan dengan detail biaya franchise fee, modal operasional,
                  dan ROI yang realistis.
                </p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-1">
                  🤝 Responsif dalam Komunikasi
                </h3>
                <p className="text-sm text-orange-700">
                  Berikan respon yang cepat dan informatif kepada calon
                  franchisee. Komunikasi yang baik meningkatkan tingkat
                  konversi.
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-1">
                  🎯 Seleksi yang Tepat
                </h3>
                <p className="text-sm text-purple-700">
                  Lakukan seleksi calon franchisee dengan cermat. Pilih mitra
                  yang memiliki komitmen, kemampuan finansial, dan visi yang
                  sejalan dengan brand Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="bg-gradient-to-r from-[#EF5A5A] to-[#FF7B7B] rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Masih Butuh Bantuan?</h2>
            <p className="text-white/90 mb-4">
              Tim customer service kami siap membantu Anda mengoptimalkan
              listing franchise dan mengelola aplikasi dari calon franchisee
              dengan efektif.
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
    </FranchisorLayout>
  );
}

export default withAuth(HelpPage, "FRANCHISOR");
