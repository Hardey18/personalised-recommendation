# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- Install dependencies: `yarn`
- Start development server: `yarn dev`
- Build for production: `yarn build`
- Start production server: `yarn start`
- Lint code: `yarn lint`

## Architecture and Structure

### Overview
KoreRec is a personalised AI recommendation engine frontend built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

### Project Structure
- `src/app/`: App Router pages and layouts.
    - `(app)/`: Route group for authenticated pages (Dashboard, History, Profile).
    - `login/`: Login page.
- `src/components/`: Component library.
    - `ui/`: Base UI components.
    - `layout/`: App shell components (Sidebar, Header, MobileNav).
    - `features/`: Domain-specific feature components.
    - `providers/`: Context and guard providers (QueryProvider, AuthGuard).
- `src/hooks/`: Custom React hooks (e.g., `useAuth.ts`).
- `src/lib/`: Shared utilities and API clients.
    - `axios.ts`: Configured Axios client with auth interceptors.
    - `api/`: Service layer for external API calls.
- `src/store/`: Client-side state management using Zustand (e.g., `authStore.ts`).
- `src/types/`: Global TypeScript type definitions.

### Key Technical Decisions
- **Server State**: TanStack React Query v5 for caching and server synchronization.
- **Client State**: Zustand with persistence for authentication.
- **HTTP Client**: Axios with interceptors for automatic token injection and 401 handling.
- **Form Validation**: React Hook Form integrated with Zod for type-safe schema validation.
- **Styling**: Tailwind CSS for utility-first styling.
- **Animations**: Framer Motion for page transitions and interactions.
