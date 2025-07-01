import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StepTwoProps {
  onAgreementChange?: (agreed: boolean) => void;
  isAgreed?: boolean;
}

export default function StepTwo({ onAgreementChange, isAgreed }: StepTwoProps) {
  const [agreed, setAgreed] = useState(isAgreed || false);

  const handleAgreementChange = (checked: boolean) => {
    setAgreed(checked);
    onAgreementChange?.(checked);
  };

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

      {/* Agreement Checkbox - Use Case Requirement 3.1 */}
      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
        <Checkbox
          id="agreement"
          checked={agreed}
          onCheckedChange={handleAgreementChange}
          className="mt-0.5"
        />
        <Label
          htmlFor="agreement"
          className="text-sm flex flex-col text-gray-700 leading-relaxed cursor-pointer"
        >
          <span className="font-medium text-gray-900">
            Saya setuju dan memahami
          </span>{" "}
          semua syarat dan ketentuan yang tertera di atas. Saya berkomitmen
          untuk mematuhi seluruh aturan yang berlaku dalam program pendanaan
          ini.
        </Label>
      </div>

      {!agreed && (
        <div className="mt-2 text-center">
          <p className="text-xs text-red-500">
            ⚠️ Anda harus menyetujui syarat dan ketentuan untuk melanjutkan
          </p>
        </div>
      )}
    </>
  );
}
