"use client";

import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Phone, Mail, MessageCircle, HelpCircle } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useState } from "react";
import withAuth from "@/lib/withAuth";

function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Bagaimana cara mengelola verifikasi franchisor?",
      answer:
        "Anda dapat mengelola verifikasi franchisor melalui halaman 'Verifikasi Franchisor' di panel admin. Review dokumen dan berikan persetujuan atau penolakan sesuai dengan kriteria yang ditetapkan.",
    },
    {
      question: "Bagaimana cara mengatur event dan pengumuman?",
      answer:
        "Gunakan halaman 'Event Management' untuk membuat, mengedit, dan menghapus event atau pengumuman. Pastikan informasi yang disampaikan akurat dan relevan untuk pengguna platform.",
    },
    {
      question: "Bagaimana cara mengelola kategori franchise?",
      answer:
        "Anda dapat menambah, mengedit, atau menghapus kategori franchise melalui panel admin. Pastikan kategori yang dibuat relevan dan mudah dipahami oleh pengguna.",
    },
    {
      question: "Bagaimana cara monitoring aktivitas platform?",
      answer:
        "Panel admin menyediakan dashboard untuk memonitor aktivitas pengguna, transaksi, dan performa platform secara real-time. Gunakan data ini untuk mengoptimalkan layanan.",
    },
    {
      question: "Bagaimana cara menangani laporan atau komplain?",
      answer:
        "Semua laporan dan komplain dapat dilihat melalui sistem ticketing di panel admin. Berikan respon yang cepat dan solusi yang tepat untuk menjaga kepuasan pengguna.",
    },
    {
      question: "Bagaimana cara backup data platform?",
      answer:
        "Sistem backup otomatis sudah tersedia, namun Anda juga dapat melakukan backup manual melalui panel admin. Pastikan data penting selalu ter-backup secara berkala.",
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
      description: "admin@eazychise.com",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat dengan tim support",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <AdminLayout className="overflow-x-hidden">
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="BANTUAN" />
      </div>

      <div className="bg-gray-50">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton fallbackUrl="/admin/profile" />
        </div>

        {/* Help Content */}
        <div className="px-4 pt-4 space-y-6 pb-6">
          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-5 h-5 text-[#EF5A5A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {item.question}
                      </h4>
                      <div
                        className={`transform transition-transform ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Guidelines */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Panduan Admin
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Kelola Verifikasi dengan Teliti
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pastikan semua dokumen dan informasi franchisor telah
                    diverifikasi dengan seksama sebelum memberikan persetujuan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Monitor Aktivitas Platform
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pantau aktivitas pengguna secara berkala untuk memastikan
                    platform berjalan dengan baik dan aman
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Respon Cepat terhadap Masalah
                  </h3>
                  <p className="text-sm text-gray-600">
                    Berikan respon yang cepat dan solusi yang tepat untuk setiap
                    laporan atau komplain yang masuk
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#EF5A5A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Jaga Keamanan Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pastikan keamanan data pengguna dan platform selalu terjaga
                    dengan melakukan backup secara berkala
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hubungi Tim Support
            </h3>

            <div className="space-y-3">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${option.color} mr-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Kontak Darurat
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Untuk masalah kritis yang memerlukan penanganan segera, hubungi:
            </p>
            <button
              onClick={() => window.open("tel:+6281234567890")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              +62 812 3456 7890
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(HelpPage, "ADMIN");
