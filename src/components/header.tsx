import Image from "next/image";
import React from "react";

export default function HeaderPage({ title }: { title: string }) {
  return (
    <div className="bg-primary h-[162px] w-full relative rounded-b-[10px] flex items-center justify-center">
      <Image
        src="/image/cloud.png"
        alt="Cloud Element"
        width={62}
        height={41}
        className="absolute -top-[20px] left-[80px]"
      />
      <Image
        src="/image/cloud.png"
        alt="Cloud Element"
        width={62}
        height={41}
        className="absolute bottom-[45px] left-[0px]"
      />
      <Image
        src="/image/cloud.png"
        alt="Cloud Element"
        width={62}
        height={41}
        className="absolute top-[20px] -right-[40px]"
      />
      <Image
        src="/image/cloud.png"
        alt="Cloud Element"
        width={62}
        height={41}
        className="absolute bottom-[10px] right-[40px]"
      />
      <h2 className="text-center text-primary-foreground text-2xl font-semibold font-poppins mt-4">
        {title}
      </h2>
    </div>
  );
}
