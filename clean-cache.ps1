# PowerShell script untuk membersihkan Next.js cache
Write-Host "🧹 Membersihkan cache Next.js..." -ForegroundColor Yellow

# Stop semua process Node.js
Write-Host "⏹️  Menghentikan Node.js processes..." -ForegroundColor Blue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Hapus direktori .next
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✓ Folder .next dihapus" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Folder .next tidak ditemukan" -ForegroundColor Gray
}

# Hapus cache node_modules
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force
    Write-Host "✓ Cache node_modules dihapus" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Cache node_modules tidak ditemukan" -ForegroundColor Gray
}

# Check apakah next.config.ts ada dan tidak kosong
if (Test-Path "next.config.ts") {
    $configContent = Get-Content "next.config.ts" -Raw
    if ([string]::IsNullOrWhiteSpace($configContent)) {
        Write-Host "⚠️  WARNING: next.config.ts kosong!" -ForegroundColor Red
        Write-Host "🔧 Mengembalikan konfigurasi dari backup..." -ForegroundColor Yellow
        
        if (Test-Path "next.config.pwa.ts") {
            Copy-Item "next.config.pwa.ts" "next.config.ts"
            Write-Host "✓ Konfigurasi dipulihkan dari next.config.pwa.ts" -ForegroundColor Green
        } else {
            # Buat config minimal
            @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
"@ | Out-File -FilePath "next.config.ts" -Encoding UTF8
            Write-Host "✓ Konfigurasi minimal dibuat" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ next.config.ts terlihat OK" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  WARNING: next.config.ts tidak ditemukan!" -ForegroundColor Red
    Write-Host "🔧 Membuat konfigurasi minimal..." -ForegroundColor Yellow
    
    # Buat config minimal
    @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
"@ | Out-File -FilePath "next.config.ts" -Encoding UTF8
    Write-Host "✓ next.config.ts dibuat" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Cache berhasil dibersihkan!" -ForegroundColor Green
Write-Host "▶️  Sekarang jalankan: npm run dev" -ForegroundColor Cyan
Write-Host ""
