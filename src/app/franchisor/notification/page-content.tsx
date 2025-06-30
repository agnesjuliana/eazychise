"use client";

import React, { useEffect, useState } from "react";
import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  sent_at: string;
}

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        const sorted = data.data.sort(
        (a: Notification, b: Notification) =>
            new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
        );
        setNotifications(sorted);


        if (res.ok && data.status) {
          setNotifications(data.data);
        } else {
          console.error("Gagal mengambil notifikasi");
        }

        // Tandai sebagai sudah dibaca
        await fetch("/api/notifications", { method: "PATCH" });
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);

    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) return "Today";
    if (diffHours < 48) return "Yesterday";

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  
  return (
    <FranchisorLayout>
      <HeaderPage title="Notifikasi" />
      <div className="px-4 py-6 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada notifikasi</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-xl flex items-start gap-4 p-4 justify-between ${
                notif.is_read ? "bg-gray-100" : "bg-yellow-50"
              }`}
            >
              <div className="flex-shrink-0">
                <Image
                  src="/image/franchisee/request-funding/request-funding-4.png"
                  alt="notification icon"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-base text-gray-900">
                  {notif.title}
                </h2>
                <p className="text-sm text-gray-700">{notif.message}</p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {formatDate(notif.sent_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </FranchisorLayout>
  );
}

export default NotificationPage;
