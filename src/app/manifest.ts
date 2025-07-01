import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EazyChise - Franchisee/Franchisor Platform",
    short_name: "EazyChise",
    description:
      "Platform terbaik untuk franchisee dan franchisor di Indonesia",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    categories: ["business", "finance", "productivity"],
    lang: "id",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Home",
        short_name: "Home",
        description: "Go to home page",
        url: "/",
        icons: [
          {
            src: "/favicon/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Franchise",
        short_name: "Franchise",
        description: "Browse franchises",
        url: "/franchisee",
        icons: [
          {
            src: "/favicon/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Franchisor",
        short_name: "Franchisor",
        description: "Franchisor dashboard",
        url: "/franchisor",
        icons: [
          {
            src: "/favicon/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
