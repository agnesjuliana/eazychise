"use client";

import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/type/user";
import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin-layout";
import withAuth from "@/lib/withAuth";

type FundingWithUser = {
  id: string;
  confirmationStatus: "WAITING" | "ACCEPTED" | "REJECTED";
  address: string;
  phone_number: string;
  npwp: string;
  franchise_address: string;
  ktp: string;
  foto_diri: string;
  foto_lokasi: string;
  mou_franchisor: string;
  mou_modal: string;
    user: {
      id: string;
      name: string;
      email: string;
      status: string;
    };
  };

function AdminApprovePage() {
  const [status, setStatus] = React.useState<string>("all");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [requests, setRequests] = React.useState<FundingWithUser[]>([]);
  const [open, setOpen] = React.useState(false);
  const [actionStatus, setActionStatus] = React.useState<"ACCEPTED" | "REJECTED" | null>(null);

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/funding-request");
        const data = await res.json();
        console.log("Fetched funding request data:", data.data);

        if (data.status) {
          setRequests(data.data as FundingWithUser[]);
        } else {
          console.error("Failed to fetch funding request data:", data);
        }
      } catch (err) {
        console.error("Error fetching funding request:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = React.useMemo(() => {
    return requests.filter(
      (r) => r.user && (r.confirmationStatus === status || status === "all")
    );
  }, [requests, status]);

  const headerHeight = 162 + 20 + 44 + 16;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        <HeaderPage title="Approve Funding Request" />
        <div className="flex w-full items-center px-1 bg-gray-50 justify-between border-t border-gray-200 pt-2">
          {["all", "WAITING", "ACCEPTED", "REJECTED"].map((val) => (
            <Button
              key={val}
              onClick={() => setStatus(val)}
              variant="ghost"
              size="sm"
              disabled={status === val}
              className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
                status === val
                  ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                  : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
              }`}
            >
              {val === "all"
                ? "All"
                : val === "WAITING"
                ? "Pending"
                : val === "ACCEPTED"
                ? "Approved"
                : "Rejected"}
            </Button>
          ))}
        </div>
      </div>

      <div
        style={{ height: `${headerHeight}px` }}
        className="w-full bg-gray-50"
      ></div>

      <div className="flex flex-col gap-4 w-full px-4 pb-10">
        <div className="flex flex-col gap-3 w-full ">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
              <p className="text-gray-500">Mengambil data akun...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{req.user.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        req.confirmationStatus === "WAITING"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.confirmationStatus === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.confirmationStatus === "WAITING"
                        ? "Pending"
                        : req.confirmationStatus === "ACCEPTED"
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{req.user.email}</p>
                </div>
                <Link href={`/admin/fund-req/${req.id}`}>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#EF5A5A] hover:bg-[#c84d4d] active:bg-[#b04545] cursor-pointer text-white"
                  >
                    See Request
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 mb-2">Tidak ada pengajuan</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminApprovePage, "ADMIN");
