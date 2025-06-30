"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";
import { EventPayload } from "@/type/events";
import { id } from "date-fns/locale";
import { Calendar, Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function EventPage() {
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState<Date | null>(null);
  const [events, setEvents] = React.useState<EventPayload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [eventDates, setEventDates] = React.useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  React.useEffect(() => {
    // Set today date and fetch events on client side
    const now = new Date();
    setToday(now);
    setMounted(true);
    setCurrentMonth(now);
    fetchEvents();
  }, []);

  // Fetch events from database
  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await fetch("/api/events", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      // API returns status or success flag
      if (res.ok && (data.success || data.status)) {
        setEvents(data.data || []);
        setEventDates(
          (data.data || []).map((e: EventPayload) => new Date(e.datetime))
        );
      } else {
        console.error("Failed to fetch events:", data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  // Utility formatters
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
    return priceNumber === 0
      ? "Gratis"
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(priceNumber);
  };

  const getImageSrc = (imagePath: string) => {
    if (!imagePath) return "/images/placeholder.png";
    if (
      imagePath.startsWith("http") ||
      imagePath.startsWith("/images/") ||
      imagePath.startsWith("/storage/")
    ) {
      return imagePath;
    }
    return `/storage/image/${imagePath}`;
  };

  // update currentMonth when calendar month changes
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Filter events by current calendar month
  const filteredEvents = React.useMemo(() => {
    return events.filter((e) => {
      const d = new Date(e.datetime);
      return (
        d.getFullYear() === currentMonth.getFullYear() &&
        d.getMonth() === currentMonth.getMonth()
      );
    });
  }, [events, currentMonth]);

  // Prevent hydration mismatch by not rendering until mounted and today is set
  if (!mounted || !today) {
    return (
      <AppLayout className="overflow-x-hidden">
        <div className="relative">
          <HeaderPage title="EVENT" />

          {/* Skeleton/Loading state */}
          <div className="mx-4 -mt-8 relative z-10">
            <div className="bg-white rounded-lg p-4 mb-6 shadow-lg border border-gray-100 animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="mx-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow-sm animate-pulse"
              >
                <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout className="overflow-x-hidden">
      <div className="relative">
        <HeaderPage title="EVENT" />

        {/* Calendar Section - Overlapping with header */}
        <div className="mx-6 -mt-8 relative z-10">
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-gray-100">
            <style
              dangerouslySetInnerHTML={{
                __html: `
              /* Event dot styling */
              .event-dot::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 10px;
                background-color: #EF5A5A;
                border-radius: 50%;
              }
              
              /* Navigation buttons - comprehensive selectors */
              .rdp .rdp-nav button,
              .rdp-nav button,
              .rdp-button_previous,
              .rdp-button_next,
              .rdp [class*="nav"] button,
              .rdp [class*="button_previous"],
              .rdp [class*="button_next"] {
                color: #000000 !important;
                fill: #000000 !important;
              }
              
              .rdp .rdp-nav button:hover,
              .rdp-nav button:hover,
              .rdp-button_previous:hover,
              .rdp-button_next:hover,
              .rdp [class*="nav"] button:hover,
              .rdp [class*="button_previous"]:hover,
              .rdp [class*="button_next"]:hover {
                color: #333333 !important;
                fill: #333333 !important;
              }
              
              /* SVG inside navigation buttons */
              .rdp .rdp-nav button svg,
              .rdp-nav button svg,
              .rdp-button_previous svg,
              .rdp-button_next svg,
              .rdp [class*="nav"] button svg,
              .rdp [class*="button_previous"] svg,
              .rdp [class*="button_next"] svg {
                color: #000000 !important;
                fill: #000000 !important;
              }
              
              .rdp .rdp-nav button:hover svg,
              .rdp-nav button:hover svg,
              .rdp-button_previous:hover svg,
              .rdp-button_next:hover svg,
              .rdp [class*="nav"] button:hover svg,
              .rdp [class*="button_previous"]:hover svg,
              .rdp [class*="button_next"]:hover svg {
                color: #333333 !important;
                fill: #333333 !important;
              }
              
              /* Force any navigation related elements to be black */
              .rdp-nav *,
              .rdp [class*="nav"] *,
              .rdp [class*="button_previous"] *,
              .rdp [class*="button_next"] * {
                color: #000000 !important;
                fill: #000000 !important;
              }
              
              /* Remove any blue color overrides */
              .rdp button[class*="nav"],
              .rdp button[class*="button_previous"],
              .rdp button[class*="button_next"] {
                color: #000000 !important;
                background-color: transparent !important;
                border: none !important;
              }
              
              /* Remove outline from today and any selected dates */
              .rdp button:focus,
              .rdp button:focus-visible,
              .rdp .rdp-day_selected,
              .rdp .rdp-day_today,
              .rdp .rdp-day_selected:focus,
              .rdp .rdp-day_today:focus {
                outline: none !important;
                box-shadow: none !important;
                border: none !important;
              }
              
              /* Remove outline on today/selected date - more aggressive */
              .rdp .rdp-day_selected,
              .rdp .rdp-day_today,
              .rdp button[aria-selected="true"],
              .rdp button[data-selected="true"],
              .rdp button:focus,
              .rdp button:focus-visible,
              .rdp [aria-selected="true"],
              .rdp [data-selected="true"] {
                outline: none !important;
                box-shadow: none !important;
                border: 2px solid transparent !important;
                ring: none !important;
              }
              
              /* Force remove any focus states and blue outlines */
              .rdp *:focus,
              .rdp *:focus-visible,
              .rdp button,
              .rdp [role="gridcell"] button,
              .rdp [role="gridcell"] button:focus,
              .rdp [role="gridcell"] button:focus-visible,
              .rdp [data-selected],
              .rdp [aria-selected],
              .rdp .rdp-day,
              .rdp .rdp-day:focus,
              .rdp .rdp-day:focus-visible {
                outline: none !important;
                box-shadow: none !important;
                border-color: transparent !important;
                ring: 0 !important;
                --tw-ring-shadow: none !important;
                --tw-ring-offset-shadow: none !important;
              }
              
              /* Remove any blue color on buttons */
              .rdp button[role="gridcell"],
              .rdp [role="gridcell"] button {
                outline: none !important;
                box-shadow: none !important;
                border: none !important;
              }
              
              /* Disable pointer events on all date buttons to make truly unclickable */
              .rdp .rdp-day {
                pointer-events: none !important;
              }
              
              /* But keep pointer events on navigation buttons */
              .rdp .rdp-nav button,
              .rdp-nav button,
              .rdp-button_previous,
              .rdp-button_next {
                pointer-events: auto !important;
              }
            `,
              }}
            />
            <div className="flex justify-center items-center">
              <DayPicker
                month={currentMonth}
                onMonthChange={handleMonthChange}
                showOutsideDays
                locale={id}
                navLayout="after"
                mode="single"
                onSelect={() => {}} // Unclickable - tidak ada aksi untuk tanggal
                className="mx-auto"
                modifiers={{
                  event: eventDates,
                  ...(today && { today: [today] }),
                }}
                modifiersStyles={{
                  today: {
                    backgroundColor: "#EF5A5A",
                    color: "white",
                    borderRadius: "50%",
                    fontWeight: "600",
                    border: "none",
                  },
                  event: {
                    position: "relative",
                  },
                }}
                modifiersClassNames={{
                  event: "event-dot",
                }}
              />
            </div>
          </div>
        </div>

        {/* Events List - Simple card layout like admin */}
        <div className="mx-4 space-y-3">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A]" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Event Bulan Ini ({filteredEvents.length})
              </h3>
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id ?? index}
                  className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    // Open event image or details
                    if (event.image) {
                      window.open(getImageSrc(event.image), "_blank");
                    }
                  }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Event Image */}
                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={getImageSrc(event.image)}
                        alt={event.name}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
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
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
              <p className="text-gray-500 mb-2">Tidak ada event di bulan ini</p>
              <p className="text-sm text-gray-400">
                Navigasi ke bulan lain untuk melihat event lainnya
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(EventPage, "FRANCHISEE");
