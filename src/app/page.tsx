// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/start");
  }, [router]);

  return null;
}

export default withAuth(HomeRedirect, "OPTIONAL");
