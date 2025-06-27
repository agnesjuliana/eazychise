import Image from "next/image";
import React from "react";

export default function StepEight() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-2.png"
        alt="step 8 image"
        width={346}
        height={240}
      />
      <h1 className="mt-4 w-full text-center text-2xl font-medium text-black mb-6">
        Dokumen sedang diverifikasi!
      </h1>
    </>
  );
}
