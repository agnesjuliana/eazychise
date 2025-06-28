import AppLayout from '@/components/app-layout';
import HeaderPage from "@/components/header";
//import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
//import { Input } from "@/components/ui/input";
//import { Bookmark, Filter, MapPin, Search, Star } from "lucide-react";
//import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const NotificationData = [
  {
      id: 1,
      title: 'Verifikasi Formulir Berhasil',
      description: 'Selamat formulirmu diterima',
      date: '03 Des',
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 hari yang lalu
      isNew: false, // Tidak disorot
      illustration: '/image/notifikasi/team-spirit.png', // Gambar ilustrasi
    },
    {
      id: 2,
      title: 'Jadwal Sesi Wawancara',
      description: 'Jadwal sesi wawancara sudah ditentukan',
      date: '03 Des',
      timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 hari yang lalu
      isNew: false, // Tidak disorot
      illustration: '/image/notifikasi/team-spirit.png', // Gambar ilustrasi
    },
    {
      id: 3,
      title: 'Hasil Akhir Permodalan',
      description: 'Selamat pengajuan modalmu diterima',
      date: '03 Des',
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 hari yang lalu
      isNew: true, // Notifikasi ini disorot di gambar
      illustration: '/image/notifikasi/team-spirit.png', // Gambar ilustrasi
    },
    {
      id: 4,
      title: 'Lengkapi Dokumen MoU',
      description: 'Segera lengkapi dokumen MoU, agar segera diproses',
      date: '03 Des',
      timestamp: Date.now() - (10 * 60 * 1000), // 10 menit yang lalu
      isNew: false, // Tidak disorot
      illustration: '/image/notifikasi/team-spirit.png', // Gambar ilustrasi
    },
];

const getFormattedDate = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

export default function NotificationPage() {
  return (
    <AppLayout>
      {/* HeaderPage akan merender header merah dengan judul "NOTIFICATION" */}
      <HeaderPage title="NOTIFICATION" />
      <div className='p-4 space-y-4 -mt-4'> {/* Menggunakan p-4 untuk padding dan space-y-4 untuk jarak antar kartu */}
        {/* Render setiap notifikasi menggunakan komponen Card */}
        {NotificationData.map((notification) => (
          <Card
            key={notification.id}
            className={`
              ${notification.isNew ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
              flex items-center space-x-4
            `}
          >
            <CardContent className="flex items-center space-x-4 py-0.1 px-4 flex-grow">
              {/* Ilustrasi/ikon notifikasi */}
              <div className='flex-shrink-0'>
                {/* Menggunakan tag <img> standar untuk mengatasi masalah next/image di lingkungan ini */}
                <img
                  src={notification.illustration}
                  alt='Notification Illustration'
                  width={64} // Sesuaikan lebar gambar
                  height={64} // Sesuaikan tinggi gambar
                  className='object-contain rounded-full'
                />
              </div>
              {/* Judul dan deskripsi notifikasi */}
              <div className='flex-grow'>
                <CardTitle className="text-md font-semibold text-gray-800">
                  {notification.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {notification.description}
                </CardDescription>
              </div>
            </CardContent>
            {/* Tanggal notifikasi, di luar CardContent untuk penyelarasan ke kanan */}
            <div className='flex-shrink-0 text-right p-4'>
              <p className='text-sm text-gray-500'>
                {getFormattedDate(notification.timestamp)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
