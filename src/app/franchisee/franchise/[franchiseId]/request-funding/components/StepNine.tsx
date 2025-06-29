import Image from "next/image";
import React from "react";

export default function StepNine() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-5.png"
        alt="step 9 image"
        width={346}
        height={240}
      />
      <h1 className="mt-4 w-full text-center text-2xl font-medium text-black mb-6">
        Dokumen berhasil diverifikasi!
      </h1>
    </>
  );
}
