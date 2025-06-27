import Image from "next/image";
import React from "react";

export default function StepFour() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-2.png"
        alt="step 4 image"
        width={346}
        height={240}
      />
      <h1 className="mt-4 w-full text-start text-2xl font-medium text-black mb-6">
        Formulir kamu sedang diproses. Tunggu notifikasi hasilnya ya!
      </h1>
    </>
  );
}
