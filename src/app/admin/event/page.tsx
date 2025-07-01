"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { EventPayload } from "@/type/events";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function EventManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    eventId: string | null;
    eventName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    eventId: null,
    eventName: "",
    isDeleting: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setEvents(data.data || []);
      } else {
        console.error("Failed to fetch events:", data);
        toast.error("Gagal memuat data event");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Gagal memuat data event");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string | number) => {
    const priceNumber = typeof price === "string" ? Number(price) : price;
    if (priceNumber === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(priceNumber);
  };

  const handleDeleteClick = (event: EventPayload) => {
    const eventId =
      (event as EventPayload).id ??
      (event as EventPayload & { _id?: string })._id;
    setDeletePopup({
      isOpen: true,
      eventId: eventId || null,
      eventName: event.name,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletePopup.eventId) return;

    setDeletePopup((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(`/api/events/${deletePopup.eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && data.status) {
        toast.success("Event berhasil dihapus!");
        fetchEvents(); // Refresh list
        setDeletePopup({
          isOpen: false,
          eventId: null,
          eventName: "",
          isDeleting: false,
        });
      } else {
        toast.error(data.message || "Gagal menghapus event");
        setDeletePopup((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Gagal menghapus event");
      setDeletePopup((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopup({
      isOpen: false,
      eventId: null,
      eventName: "",
      isDeleting: false,
    });
  };

  return (
    <AdminLayout>
      {/* Fixed Header */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        <HeaderPage title="Kelola Event" />
      </div>

      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div style={{ height: "180px" }} className="w-full bg-gray-50"></div>

      {/* Konten Utama */}
      <div className="flex flex-col gap-4 w-full px-4 pb-10">
        {/* Add Event Button - Dipindahkan ke dalam konten utama */}
        <div className="w-full">
          <Button
            onClick={() => router.push("/admin/event/add")}
            className="w-full bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Event Baru
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Daftar Event ({events.length})
              </h3>
              {events.map((event, index) => (
                <Card key={event.id ?? index} className="p-4 shadow-sm">
                  <div className="flex items-start space-x-4">
                    {/* Event Image */}
                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.name}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                      {/* Fallback gradient */}
                      <div
                        className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <span className="text-white font-bold text-lg">
                          {event.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[#EF5A5A] font-medium">
                          {formatDate(event.datetime)}
                        </span>
                        <span>•</span>
                        <span>{formatTime(event.datetime)} WIB</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight break-words mb-1">
                        {event.name}
                      </h3>
                      <span className="text-[#EF5A5A] font-medium text-xs">
                        {formatPrice(event.price)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-8 w-8"
                        onClick={() => {
                          router.push(
                            `/admin/event/${
                              (event as EventPayload).id ??
                              (event as EventPayload & { _id?: string })._id
                            }`
                          );
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-8 w-8 text-red-500 hover:text-red-700 hover:border-red-500"
                        onClick={() => handleDeleteClick(event)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Belum ada event yang dibuat</p>
              <p className="text-sm text-gray-400 mb-4">
                Mulai dengan menambahkan event pertama Anda
              </p>
              <Button
                onClick={() => router.push("/admin/event/add")}
                className="bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Event
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deletePopup.isOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Event</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus event &quot;
              {deletePopup.eventName}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePopup.isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePopup.isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletePopup.isDeleting ? "Menghapus..." : "Hapus Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default withAuth(EventManagementPage, "ADMIN");
