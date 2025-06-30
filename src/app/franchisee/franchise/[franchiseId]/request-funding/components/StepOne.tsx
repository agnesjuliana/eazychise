import Image from "next/image";
import React from "react";

export default function StepOne() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-1.png"
        alt="step 1 image"
        width={310}
        height={222}
      />
      <h1 className="mt-12 w-full text-start text-2xl font-medium text-black mb-6">
        Daftarkan diri dan dapatkan modal!
      </h1>
      <div className="w-full space-y-3 mb-8">
        <p className="text-sm text-gray-700">
          1. Baca persyaratan sebelum mengisi formulir.
        </p>
        <p className="text-sm text-gray-700">
          2. Isi formulir dan lengkapi berkas administrasi.
        </p>
        <p className="text-sm text-gray-700">
          3. Jika syarat administrasi lolos, kamu berhak melanjutkan ke sesi
          wawancara.
        </p>
        <p className="text-sm text-gray-700">
          4. Persiapkan diri untuk mengikuti sesi wawancara sesuai jadwal yang
          Fundchise berikan.
        </p>
        <p className="text-sm text-gray-700">
          5. Tunggu hasil wawancara. Jika lolos, selamat kamu berhak mendapatkan
          modal untuk membuka bisnis franchisemu!
        </p>
      </div>
    </>
  );
}
