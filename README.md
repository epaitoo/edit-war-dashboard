# Wikipedia Edit War Detector - Dashboard

Real-time React dashboard for monitoring and analyzing Wikipedia edit wars. Built with modern web technologies including React 18, TypeScript, TanStack Query, and Server-Sent Events for live updates.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

[Live Demo](#) • [Backend Repo](https://github.com/epaitoo/wikipedia-edit-war-detector) 



## Features

### Real-Time Updates
- **Server-Sent Events (SSE)** - Live streaming from backend
- **Auto-reconnect** - Handles connection drops gracefully
- **Twitter-style notifications** - Non-intrusive alerts for new edit wars
- **Optimistic UI updates** - Instant feedback without page refresh

### Data Management
- **TanStack Query (React Query)** - Intelligent caching and synchronization
- **Automatic refetching** - Keeps data fresh on window focus
- **Pagination** - Efficient browsing of large datasets
- **Search & filtering** - By status, severity, and keywords

### Modern UI/UX
- **Tailwind CSS v4** - Utility-first styling with latest features
- **Responsive design** - Works on desktop, tablet, and mobile
- **Color-coded severity** - Visual hierarchy (CRITICAL → LOW)
- **Loading skeletons** - Professional loading states
- **Smooth transitions** - React Router page animations

### Type Safety
- **Full TypeScript coverage** - Compile-time error catching
- **API type definitions** - Match backend DTOs exactly
- **Strict mode enabled** - Maximum type safety

---

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Dashboard.tsx           # Main dashboard with SSE integration
│   ├── AlertDetailPage.tsx     # Detailed edit war analysis
│   ├── AlertsListPage.tsx      # Browse/filter all alerts
│   ├── NotificationBanner.tsx  # Twitter-style notification
│   ├── StatCard.tsx            # Reusable metric card
│   └── LoadingSkeleton.tsx     # Loading state component
├── hooks/
│   ├── useSSE.ts              # Server-Sent Events hook
│   ├── useAlerts.ts           # React Query hooks for alerts
│   └── useStats.ts            # React Query hook for stats
├── api/
│   └── client.ts              # API client & type definitions
├── providers/
│   └── QueryProvider.tsx      # TanStack Query configuration
└── App.tsx                     # Router configuration
```

### Data Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND DATA FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Backend API (REST)
       │
       ├──► TanStack Query ──► React Components
       │         │
       │         └──► Automatic Caching & Refetching
       │
Backend SSE Stream
       │
       └──► useSSE Hook ──► Event Processing ──► State Update
                                    │
                                    └──► Notification Banner
                                    └──► Dashboard Refresh
```

### State Management Strategy

**Server State** (Backend data)
- Managed by **TanStack Query**
- Automatic caching, refetching, pagination
- Examples: alerts list, statistics, individual alert details

**UI State** (Frontend-only)
- Managed by **React hooks** (useState, useReducer)
- Examples: notification visibility, filters, page navigation

**Real-Time State** (Live updates)
- Managed by **SSE + React state**
- Queued updates shown in notification banner
- User controls when to view new data (non-intrusive)

---

## Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Backend API** running at `http://localhost:8081`
  - See [backend setup instructions](https://github.com/epaitoo/wikipedia-edit-war-detector)

### Installation
```bash
# Clone the repository
git clone 
cd wikipedia-edit-war-detector

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Configuration

Update API base URL if your backend runs on a different port:

**`src/api/client.ts`**
```typescript
const API_BASE_URL = 'http://localhost:8081/api';
```

---

## 🛠️ Development

### Available Scripts
```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

### Project Structure
```
wikipedia-editwar-frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── api/                 # API client & types
│   ├── providers/           # Context providers
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles (Tailwind)
├── docs/
│   └── screenshots/         # README images
├── package.json
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind config
├── vite.config.ts           # Vite config
└── README.md
```

---

## Key Dependencies

### Core Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `typescript` | ^5.6.2 | Type safety |
| `vite` | ^5.4.10 | Build tool & dev server |

### State Management & Data Fetching

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.62.7 | Server state management |
| `@tanstack/react-query-devtools` | ^5.62.7 | Dev tools for React Query |

### Routing

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | ^7.1.1 | Client-side routing |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.0.0 | Utility-first CSS |
| `autoprefixer` | ^10.4.20 | CSS vendor prefixes |
| `postcss` | ^8.4.49 | CSS processing |

---

## Styling Guide

### Tailwind CSS v4

This project uses the latest Tailwind CSS v4 with the new `@import` syntax:

**`src/index.css`**
```css
@import "tailwindcss";

/* Custom animations */
@keyframes slide-down {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
```

### Color Scheme

**Severity Levels:**
- 🔴 **CRITICAL** - `border-red-500 bg-red-50 text-red-900`
- 🟠 **HIGH** - `border-orange-500 bg-orange-50 text-orange-900`
- 🟡 **MEDIUM** - `border-yellow-500 bg-yellow-50 text-yellow-900`
- 🔵 **LOW** - `border-blue-500 bg-blue-50 text-blue-900`

**Status Indicators:**
- 🟢 **Connected** - `bg-green-500 animate-pulse`
- 🔴 **Disconnected** - `bg-red-500`

---

## API Integration

### REST API (via TanStack Query)
```typescript
// Example: Fetching alerts with pagination
const { data, isLoading, error } = useAlerts({ 
  page: 0, 
  size: 20,
  status: 'ACTIVE',
  severity: 'HIGH'
});
```

**Features:**
- Automatic caching (5 min stale time)
- Background refetching on window focus
- Retry on failure (1 retry)
- Optimistic updates

### Server-Sent Events (SSE)
```typescript
// Example: Connecting to SSE stream
const { events, isConnected, error } = useSSE('http://localhost:8081/stream');

useEffect(() => {
  if (events.length > 0) {
    const latestEvent = events[events.length - 1];
    if (latestEvent.type === 'EDIT_WAR') {
      // Handle new edit war
      setNewAlerts(prev => [...prev, latestEvent.data]);
    }
  }
}, [events]);
```

**Features:**
- Auto-reconnect on connection loss (5s interval)
- Event type detection (EDIT vs EDIT_WAR)
- JSON parsing with error handling
- Connection state tracking

---

## 🧪 Testing
```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Recommended Testing Stack:**
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking

---

## Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build
npm run build

# Drag & drop the 'dist' folder to Netlify
# Or use Netlify CLI:
netlify deploy --prod --dir=dist
```

### Environment Variables

Create `.env.production`:
```bash
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_SSE_URL=https://your-backend-api.com/stream
```

Update `src/api/client.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
```

---

## Troubleshooting

### SSE Connection Issues

**Problem:** "Disconnected" status shown

**Solutions:**
1. Ensure backend is running at `http://localhost:8081`
2. Check browser console for CORS errors
3. Verify backend SSE endpoint: `curl http://localhost:8081/stream`
4. Check browser DevTools → Network → stream (should show status 200)

### React Query Not Fetching

**Problem:** Data not loading

**Solutions:**
1. Check Network tab - are API calls being made?
2. Check `queryKey` matches between components
3. Enable React Query DevTools: Look for cache status
4. Check if backend API is returning expected JSON

### TypeScript Errors

**Problem:** Type mismatches

**Solutions:**
1. Ensure types in `src/api/client.ts` match backend DTOs
2. Run `npm run type-check` to see all errors
3. Check for `any` types - should be avoided

---




