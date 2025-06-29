"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin-layout';
import HeaderPage from '@/components/header';
import withAuth from '@/lib/withAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Loader2, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { EventPayload } from '@/type/events';

function EventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setEvents(data.data || []);
      } else {
        console.error('Failed to fetch events:', data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string | number) => {
    const priceNumber = typeof price === 'string' ? Number(price) : price;
    if (priceNumber === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(priceNumber);
  };

  return (
    <AdminLayout>
      {/* Fixed Header */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        <HeaderPage title="Kelola Event" />
      </div>
      
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div
        style={{ height: '140px' }}
        className="w-full bg-gray-50"
      ></div>

      {/* Konten Utama */}
      <div className="flex flex-col gap-4 w-full px-4 pb-10">
        {/* Add Event Button - Dipindahkan ke dalam konten utama */}
        <div className="w-full">
          <Button
            onClick={() => router.push('/admin/event/add')}
            className="w-full bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Event Baru
          </Button>
        </div>

        {/* Events List */}
        <div className="flex flex-col gap-3 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
            <p className="text-gray-500">Memuat data event...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={event.id ?? index} className="p-4 shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* Event Image */}
                  <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={event.image || '/images/default-event.png'} // Fallback image
                      alt={event.name}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback gradient */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hidden">
                      <span className="text-white font-bold text-lg">
                        {event.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
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
                    </div>
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
              onClick={() => router.push('/admin/event/add')}
              className="bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Event
            </Button>
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(EventListPage, 'ADMIN');
