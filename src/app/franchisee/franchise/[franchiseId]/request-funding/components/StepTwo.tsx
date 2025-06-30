import Image from "next/image";
import React from "react";

export default function StepTwo() {
  return (
    <>
      <h1 className="mt-4 text-start w-full text-2xl font-medium text-black mb-6">
        Syarat & Ketentuan
      </h1>
      <div className="w-full space-y-3 mb-8">
        <p className="text-sm text-gray-700">
          1. Nominal modal berjumlah sesuai dengan harga franchise yang anda
          pilih.
        </p>
        <p className="text-sm text-gray-700">
          2. Pengembalian modal adalah setelah anda mendapatkan keuntungan
          pertama.
        </p>
        <p className="text-sm text-gray-700">
          3. Jumlah yang dibayarkan setiap bulannya adalah 25% dari keuntungan
          yang anda dapat setiap bulannya.
        </p>
        <p className="text-sm text-gray-700">
          4. Berhenti membayar jika sudah mencapai nominal maksimal.
        </p>
        <p className="text-sm text-gray-700">
          5. Tidak riba karena proses pembayaran dilakukan dengan cicilan tetap,
          tidak ada bunga.
        </p>
        <p className="text-sm text-gray-700">
          6. Apabila Franchisee mengalami kegagalan pada saat menjalankan
          franchise, sehingga belum mendapat keuntungan, maka Franchisee wajib
          mengembalikan peralatan dan ganti rugi bahan yang telah Franchisor
          berikan.
        </p>
        <p className="text-sm text-gray-700">
          7. Siap menerima syarat dan ketentuan berikutnya ketika sudah
          dinyatakan mendapatkan modal.
        </p>
      </div>
    </>
  );
}
