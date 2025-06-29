"use client";

import { useParams } from "next/navigation";
import FranchiseeForm from "./components/FranchiseeForm";
import FranchisorForm from "./components/FranchisorForm";
import withAuth from "@/lib/withAuth";

function RegisterPage() {
  const { role } = useParams() as { role: string };

  // Render appropriate form based on role
  return role === "franchisor" ? <FranchisorForm /> : <FranchiseeForm />;
}

export default withAuth(RegisterPage, "GUEST");
