import Image from "next/image";
import React from "react";

export default function StepSix() {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-4.png"
        alt="step 6 image"
        width={346}
        height={240}
      />
      <h1 className="mt-4 w-full text-start text-2xl font-medium text-black mb-6">
        Selamat kamu berhasil mendapatkan modal untuk memulai bisnis
        franchisemu!
      </h1>
    </>
  );
}
