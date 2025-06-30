# Next.js Configuration Guide

## File Konfigurasi

### 1. `next.config.ts` (Utama - DEVELOPMENT)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'], // Optimasi import
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,        // Check for changes every 1s
        aggregateTimeout: 300, // Wait 300ms before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;
```

**Fitur yang diaktifkan:**
- ✅ Image optimization untuk semua HTTPS domain
- ✅ Optimasi import untuk lucide-react
- ✅ Better file watching di Windows
- ✅ Development-friendly (tanpa PWA cache issues)

### 2. `next.config.pwa.ts` (PWA - PRODUCTION)
File terpisah untuk konfigurasi PWA yang bisa digunakan di production.

**Fitur PWA:**
- ✅ Service Worker caching
- ✅ Font caching (Google Fonts)
- ✅ Image caching
- ✅ API caching
- ✅ Offline fallback page

## Pentingnya File next.config.ts

### ⚠️ **SANGAT PENTING!** 

File `next.config.ts` adalah **jantung konfigurasi** aplikasi Next.js Anda:

1. **Image Optimization**: Tanpa konfigurasi images, gambar external tidak akan load
2. **Performance**: Webpack config membantu development experience di Windows
3. **PWA Features**: Untuk production build dengan service worker
4. **Bundle Optimization**: Import optimization mengurangi bundle size

### Dampak Jika Kosong:

❌ **Masalah yang akan terjadi:**
- Images dari URL external tidak akan load
- Performance development buruk
- Bundle size lebih besar
- PWA features tidak berfungsi
- Hot reload mungkin lambat

### Cara Mengembalikan Jika Hilang:

1. **Jika file hilang/kosong:**
   ```bash
   # Copy dari backup
   cp next.config.pwa.ts next.config.ts
   
   # Atau gunakan config minimal
   npm run clean:cache
   ```

2. **Config minimal yang aman:**
   ```typescript
   import type { NextConfig } from "next";
   
   const nextConfig: NextConfig = {
     images: {
       remotePatterns: [{ protocol: 'https', hostname: '**' }],
     },
   };
   
   export default nextConfig;
   ```

## Scripts Yang Tersedia

```bash
npm run dev          # Development normal
npm run dev:clean    # Development + clear cache
npm run clean:cache  # Bersihkan cache saja
```

## Best Practices

1. **Selalu backup** next.config.ts sebelum experimenting
2. **Test di production** sebelum deploy
3. **Monitor bundle size** dengan next bundle analyzer
4. **Use environment variables** untuk different configs

## Troubleshooting

### Config file corrupted:
```bash
npm run clean:cache
# Restore dari next.config.pwa.ts
```

### Images tidak load:
- Check remotePatterns configuration
- Verify image URLs are HTTPS

### PWA issues:
- Disable PWA di development
- Clear browser cache
- Check service worker registration
