"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HelpPage() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "Bagaimana cara mendaftar sebagai franchisee?",
      answer:
        "Untuk mendaftar sebagai franchisee, Anda perlu mengisi form registrasi, melengkapi dokumen yang diperlukan, dan menunggu proses verifikasi dari admin.",
    },
    {
      id: 2,
      question: "Berapa lama proses verifikasi akun?",
      answer:
        "Proses verifikasi akun biasanya memakan waktu 1-3 hari kerja setelah semua dokumen lengkap disubmit.",
    },
    {
      id: 3,
      question: "Dokumen apa saja yang diperlukan?",
      answer:
        "Dokumen yang diperlukan meliputi KTP, NPWP, SIUP, dan Surat Keterangan Domisili Usaha.",
    },
    {
      id: 4,
      question: "Bagaimana cara mengubah data profil?",
      answer:
        "Anda dapat mengubah data profil melalui menu Akun di halaman Profile, kemudian klik tombol Edit.",
    },
    {
      id: 5,
      question: "Apa yang harus dilakukan jika dokumen ditolak?",
      answer:
        "Jika dokumen ditolak, silakan cek alasan penolakan dan upload ulang dokumen yang sudah diperbaiki sesuai keterangan.",
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat langsung dengan customer service",
      icon: MessageCircle,
      action: "Mulai Chat",
      available: true,
    },
    {
      title: "Telepon",
      description: "Hubungi kami di (021) 1234-5678",
      icon: Phone,
      action: "Panggil Sekarang",
      available: true,
    },
    {
      title: "Email",
      description: "Kirim email ke support@eazychise.com",
      icon: Mail,
      action: "Kirim Email",
      available: true,
    },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <HeaderPage title="BANTUAN" />

        {/* Back Button */}
        <div className="px-4 -mt-6 relative z-10 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>
        </div>

        {/* Help Content */}
        <div className="px-4">
          {/* Contact Support */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hubungi Support
            </h3>
            <div className="space-y-3">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#EF5A5A] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#EF5A5A]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {option.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
                      disabled={!option.available}
                    >
                      {option.action}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-[#EF5A5A]" />
              <h3 className="text-lg font-semibold text-gray-900">
                Jam Operasional
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Senin - Jumat</span>
                <span className="font-medium text-gray-900">
                  08:00 - 17:00 WIB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sabtu</span>
                <span className="font-medium text-gray-900">
                  08:00 - 12:00 WIB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minggu</span>
                <span className="font-medium text-gray-900">Tutup</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#EF5A5A]" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pertanyaan Umum (FAQ)
              </h3>
            </div>
            <div className="space-y-3">
              {faqData.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    className="w-full p-4 justify-between text-left hover:bg-gray-50"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedFaq === faq.id ? "transform rotate-90" : ""
                      }`}
                    />
                  </Button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* App Version */}
          <div className="text-center mt-6 mb-4">
            <p className="text-xs text-gray-400">EazyChise App v1.0.0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

