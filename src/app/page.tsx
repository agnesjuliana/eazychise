// src/app/page.tsx
"use client";

import withAuth from "@/lib/withAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/start");
  }, [router]);

  return null;
}

export default withAuth(HomeRedirect, "OPTIONAL");
