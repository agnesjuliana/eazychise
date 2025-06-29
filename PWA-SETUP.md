# PWA Setup Documentation

## Overview

EazyChise is configured as a Progressive Web App (PWA) with full offline capabilities and native app-like experience.

## Features Implemented

### ✅ Core PWA Features

- **Service Worker**: Automatic caching and offline support
- **Web App Manifest**: Complete app metadata and icon configuration
- **Install Prompt**: Smart install prompts for both Android and iOS
- **Offline Support**: Custom offline page with user-friendly messaging
- **Responsive Design**: Mobile-first design that works across all devices

### ✅ Advanced Features

- **Runtime Caching**: Optimized caching strategies for different resource types
- **Push Notifications**: Ready for implementation (requires backend setup)
- **App Shortcuts**: Quick access to Home, Profile, and Franchise pages
- **Standalone Mode**: Full-screen app experience when installed
- **Auto-updates**: Automatic service worker updates without user intervention

## Configuration Files

### 1. `next.config.ts`

- Configures next-pwa plugin
- Sets up runtime caching strategies
- Defines offline fallback page
- Disables PWA in development for better debugging

### 2. `public/manifest.json`

- Complete app metadata
- Icon definitions for all screen sizes
- App shortcuts configuration
- Theme colors and display preferences

### 3. `src/app/layout.tsx`

- PWA meta tags
- Apple Web App configurations
- Manifest linking
- Install prompt integration

## Components

### PWAInstallPrompt

- Smart detection of install capability
- Separate UI for iOS (manual instructions) and Android (native prompt)
- Dismissal logic with cooldown period
- User-friendly messaging in Indonesian

### PWAStatus (Development Only)

- Real-time PWA status monitoring
- Service worker status tracking
- Online/offline detection
- Installation status monitoring

### Offline Page

- Custom offline experience
- Connection status display
- Available offline features list
- Retry functionality

## Caching Strategy

### Images & Static Assets

- **Strategy**: CacheFirst
- **Duration**: 30 days
- **Max Entries**: 60 items

### Google Fonts

- **Strategy**: CacheFirst
- **Duration**: 365 days
- **Max Entries**: 10 items

### API Calls

- **Strategy**: NetworkFirst
- **Duration**: 5 minutes
- **Max Entries**: 100 items

### General Pages

- **Strategy**: NetworkFirst
- **Duration**: 24 hours
- **Max Entries**: 200 items

## Testing PWA

### Development

```bash
# Build and test
npm run build
npm run start

# Access via HTTPS (required for PWA)
# Use ngrok or similar for HTTPS in development
```

### Production

1. Deploy to HTTPS domain
2. Open in mobile browser
3. Look for "Add to Home Screen" prompt
4. Test offline functionality
5. Verify service worker registration in DevTools

### Testing Checklist

- [ ] App installs correctly on mobile devices
- [ ] Offline page loads when disconnected
- [ ] Service worker updates automatically
- [ ] Caching works for images and pages
- [ ] App shortcuts work after installation
- [ ] Standalone mode launches correctly
- [ ] iOS Safari shows install instructions
- [ ] Android Chrome shows install prompt

## Browser Support

### Fully Supported

- Chrome 67+
- Firefox 67+
- Safari 11.1+
- Edge 79+

### Partially Supported

- iOS Safari (manual installation)
- Samsung Internet
- UC Browser

## Lighthouse PWA Score

Target scores:

- **PWA**: 100/100
- **Performance**: 90+/100
- **Accessibility**: 95+/100
- **Best Practices**: 95+/100
- **SEO**: 100/100

## Troubleshooting

### Service Worker Not Registering

1. Check HTTPS requirement
2. Verify `next-pwa` configuration
3. Check browser console for errors
4. Clear browser cache and try again

### Install Prompt Not Showing

1. Ensure HTTPS is enabled
2. Check manifest.json is valid
3. Verify all required manifest fields
4. Test engagement heuristics (user interaction required)

### Offline Page Not Loading

1. Check service worker is active
2. Verify offline fallback in next.config.ts
3. Test network disconnection
4. Check cache storage in DevTools

## Future Enhancements

- [ ] Push notification implementation
- [ ] Background sync for forms
- [ ] Share API integration
- [ ] File system access for document uploads
- [ ] Biometric authentication
- [ ] Geolocation services for franchise search

## PWA Icons Setup ✅

### Using Favicon.svg as PWA Icons

The PWA has been configured to use the existing `favicon.svg` directly for all icon sizes instead of generating separate PNG files. This approach:

- **Simplifies maintenance**: Only one icon file to manage
- **Reduces file size**: SVG is vector-based and scales perfectly
- **Better quality**: No pixelation at any size
- **Modern approach**: SVG icons are supported by all modern browsers

### Icon Configuration

All PWA icons now reference `/favicon.svg`:

- **Manifest icons**: All sizes (72x72 to 512x512) use the same SVG
- **Apple touch icons**: iPhone/iPad icons use the SVG
- **Social media**: Twitter and OpenGraph images use the SVG
- **App shortcuts**: All shortcuts use the SVG icon

### Files Updated

- `public/manifest.json` - Updated all icon references to `/favicon.svg`
- `src/app/layout.tsx` - Updated meta tags and links to use favicon.svg
- `public/favicon.svg` - Copied from src/app/favicon.svg for PWA use

### Browser Support for SVG Icons

- ✅ **Chrome 88+**: Full support for SVG PWA icons
- ✅ **Firefox 89+**: Full support for SVG PWA icons
- ✅ **Safari 14+**: Full support for SVG PWA icons
- ✅ **Edge 88+**: Full support for SVG PWA icons
- ⚠️ **Older browsers**: May fallback to default icon

### Benefits of SVG Icons

1. **Perfect scaling**: Looks crisp at any size
2. **Small file size**: Vector graphics are efficient
3. **Easy updates**: Change one file updates all icons
4. **Accessibility**: Can include alt text and descriptions
5. **Modern standard**: Recommended by PWA best practices

## Scripts Available

### Icon Management Scripts

- `scripts/generate-icons.js` - Generates placeholder SVG icons (legacy)
- `scripts/generate-png-icons.js` - Generates PNG icons from favicon (not needed anymore)
- `scripts/cleanup-old-icons.js` - Removes old PNG icon files

### Current Setup

The project now uses `favicon.svg` directly for all PWA icons, eliminating the need for icon generation scripts. The favicon automatically scales for all required sizes.
