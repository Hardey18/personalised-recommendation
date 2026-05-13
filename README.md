# KoreRec — Frontend

Personalised AI recommendation engine frontend built for the hackathon.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, server components, fast |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| State (server) | TanStack React Query v5 | Cache, loading/error states, devtools |
| State (client) | Zustand + persist | Lightweight auth store with localStorage sync |
| HTTP | Axios | Interceptors for auth token injection + 401 handling |
| Forms | React Hook Form + Zod | Performant validation, type-safe schemas |
| Animations | Framer Motion | Smooth page transitions and micro-interactions |
| Toasts | Sonner | Beautiful, accessible notifications |
| Fonts | Syne (display) + DM Sans (body) | Distinctive, professional pairing |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Login with split layout
│   └── (app)/                    # Authenticated route group
│       ├── layout.tsx            # App shell (sidebar + header)
│       ├── dashboard/page.tsx    # Search + recommendations
│       ├── history/
│       │   ├── page.tsx          # History list
│       │   └── [id]/page.tsx     # History detail
│       └── profile/page.tsx      # User profile
├── components/
│   ├── features/
│   │   ├── SearchBar.tsx         # Main search with context field
│   │   └── RecommendationCard.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible desktop nav
│   │   ├── Header.tsx            # Top bar
│   │   └── MobileNav.tsx         # Bottom nav on mobile
│   ├── providers/
│   │   ├── QueryProvider.tsx     # React Query setup
│   │   └── AuthGuard.tsx         # Route protection
│   └── ui/
│       ├── Skeleton.tsx          # Loading skeletons
│       └── StatCard.tsx
├── hooks/
│   └── useAuth.ts                # Login / logout mutations
├── lib/
│   ├── axios.ts                  # API client with interceptors
│   ├── utils.ts                  # cn(), formatters
│   ├── mockData.ts               # Placeholder data until APIs ready
│   └── api/
│       └── auth.ts               # Auth service
├── store/
│   └── authStore.ts              # Zustand auth store
└── types/
    └── index.ts                  # Shared TypeScript types
```

## Getting Started

### 1. Install dependencies
```bash
yarn
```

### 2. Start dev server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)
