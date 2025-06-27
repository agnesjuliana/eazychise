import Image from "next/image";
import React from "react";

export default function StepFive() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-3.png"
        alt="step 5 image"
        width={326}
        height={224}
      />
      <h1 className="mt-4 w-full text-start text-2xl font-medium text-black mb-6">
        Selamat kamu berhak melanjutkan ke sesi wawancara!
      </h1>
      <p className="text-start w-full text-sm text-gray-700">
        Ikuti sesi wawancara pada undangan yang telah dikirim melalui email!
      </p>
      <p className="mt-6 w-full text-start text-sm text-gray-700">
        Belum menerima email?
      </p>
      <p className="text-start w-full text-sm text-[#FFA952]">
        Kirim ulang undangan
      </p>
    </>
  );
}
