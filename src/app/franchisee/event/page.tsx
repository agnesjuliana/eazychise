"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";
import { EventPayload } from "@/type/events";
import { id } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
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
            <div className="bg-white rounded-lg p-4 mb-6 shadow-lg border border-border animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>

          <div className="mx-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow-sm animate-pulse"
              >
                <div className="w-20 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
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
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-border">
            <style
              dangerouslySetInnerHTML={{
                __html: `
              /* Navigation buttons styling */
              .rdp .rdp-nav button,
              .rdp-nav button,
              .rdp-button_previous,
              .rdp-button_next,
              .rdp [class*="nav"] button,
              .rdp [class*="button_previous"],
              .rdp [class*="button_next"] {
                color: hsl(var(--foreground)) !important;
                fill: hsl(var(--foreground)) !important;
              }
              
              .rdp .rdp-nav button:hover,
              .rdp-nav button:hover,
              .rdp-button_previous:hover,
              .rdp-button_next:hover,
              .rdp [class*="nav"] button:hover,
              .rdp [class*="button_previous"]:hover,
              .rdp [class*="button_next"]:hover {
                color: hsl(var(--muted-foreground)) !important;
                fill: hsl(var(--muted-foreground)) !important;
              }
              
              /* SVG inside navigation buttons */
              .rdp .rdp-nav button svg,
              .rdp-nav button svg,
              .rdp-button_previous svg,
              .rdp-button_next svg,
              .rdp [class*="nav"] button svg,
              .rdp [class*="button_previous"] svg,
              .rdp [class*="button_next"] svg {
                color: hsl(var(--foreground)) !important;
                fill: hsl(var(--foreground)) !important;
              }
              
              .rdp .rdp-nav button:hover svg,
              .rdp-nav button:hover svg,
              .rdp-button_previous:hover svg,
              .rdp-button_next:hover svg,
              .rdp [class*="nav"] button:hover svg,
              .rdp [class*="button_previous"]:hover svg,
              .rdp [class*="button_next"]:hover svg {
                color: hsl(var(--muted-foreground)) !important;
                fill: hsl(var(--muted-foreground)) !important;
              }
              
              /* Remove outline from buttons */
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
              
              /* Disable pointer events on date buttons */
              .rdp .rdp-day {
                pointer-events: none !important;
              }
              
              /* Keep pointer events on navigation buttons */
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
                    backgroundColor: "#f87171", // Orange background
                    color: "white",
                    borderRadius: "50%",
                    fontWeight: "600",
                    border: "none",
                  },
                  event: {
                    position: "relative",
                    backgroundColor: "transparent",
                  },
                }}
                modifiersClassNames={{
                  event: "event-dot",
                }}
                components={{
                  Day: ({ day, modifiers, ...props }) => {
                    const hasEvent = modifiers?.event;
                    
                    return (
                      <td 
                        {...props} 
                        className={`relative ${props.className || ''}`}
                        style={{ 
                          ...props.style,
                          position: 'relative',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          height: '40px',
                          width: '40px'
                        }}
                      >
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          {day.date.getDate()}
                          {hasEvent && (
                            <div 
                              className="absolute w-1.5 h-1.5 bg-[#f87171] rounded-full"
                              style={{
                                bottom: '-2px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                              }}
                            />
                          )}
                        </div>
                      </td>
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Events List - Simple card layout like admin */}
        <div className="mx-4 space-y-3">
          {loading ? (
            <div className="flex justify-center p-4">
              <LoadingSpinner size="lg" text="Memuat event..." />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
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
                    <div className="w-20 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
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
                      {/* Fallback gradient - initially hidden, shown via JS when image fails */}
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-lg">
                            {event.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-primary font-medium">
                          {formatDate(event.datetime)}
                        </span>
                        <span>•</span>
                        <span>{formatTime(event.datetime)} WIB</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm leading-tight break-words mb-1">
                        {event.name}
                      </h3>
                      <span className="text-primary font-medium text-xs">
                        {formatPrice(event.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground mb-2">
                Tidak ada event di bulan ini
              </p>
              <p className="text-sm text-muted-foreground">
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
