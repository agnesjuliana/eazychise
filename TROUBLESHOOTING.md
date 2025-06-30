# Troubleshooting Next.js Development Issues

## Masalah Static Assets 404

Jika Anda mengalami error seperti:
```
GET /_next/static/css/app/layout.css?v=1751232501596 404
GET /_next/static/chunks/main-app.js?v=1751232501596 404
```

### Solusi Cepat:

1. **Bersihkan cache dan restart server:**
   ```bash
   npm run clean:cache
   npm run dev
   ```

2. **Atau gunakan script alternatif:**
   ```bash
   npm run dev:clean
   ```

3. **Manual cleanup (jika script tidak bekerja):**
   ```powershell
   # Stop server (Ctrl+C)
   Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
   npm run dev
   ```

### Penyebab Umum:

1. **Cache yang korup** - File .next yang corrupt
2. **Hot reload issues** - Development server tidak sync
3. **PWA configuration** - Service worker interfering
4. **File permission issues** - Windows file locking

### Pencegahan:

1. **Restart server secara berkala**
2. **Gunakan `npm run dev:clean` saat ada masalah**
3. **Jangan interrupt build process**
4. **Pastikan tidak ada multiple dev server running**

### Script Yang Tersedia:

- `npm run dev` - Normal development
- `npm run dev:clean` - Dev dengan clear cache
- `npm run clean:cache` - Hanya bersihkan cache
- `powershell clean-cache.ps1` - Manual cache cleanup

### Tips Development:

1. **Selalu restart server** setelah mengubah next.config.ts
2. **Clear browser cache** jika masih ada masalah
3. **Check terminal output** untuk error messages
4. **Use incognito mode** untuk testing tanpa cache

## Masalah lain yang umum:

### Port sudah digunakan:
```bash
# Next.js akan otomatis cari port lain
# Atau kill process manual:
Get-Process -Name "node" | Stop-Process -Force
```

### TypeScript errors:
```bash
npm run lint
npx tsc --noEmit
```

### Database connection:
```bash
npm run prisma:studio  # Test DB connection
```
