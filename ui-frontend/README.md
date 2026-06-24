# Travel Booking Web App

Modern Next.js App Router frontend for a travel booking platform.

## Stack

- Next.js App Router
- React
- JavaScript ES6+
- CSS variables for theme system
- Jest
- React Testing Library

## Highlights

- Distinct, portfolio-ready visual design with gradient surfaces and glassmorphism-inspired cards
- Global light and dark mode applied across the entire app
- JWT-aware mock auth flow with role-based UI
- Protected dashboard and admin surfaces
- Dynamic tour detail route at `/tours/[id]`
- Accessibility-aware form controls and validation messages

## Run Locally

```powershell
cd "C:\Users\Aseem\Desktop\GIT\Travel Agency Application\ui-frontend"
npm install
npm run dev
```

## Test

```powershell
npm test
```

## Resume-Ready Feature List

- Implemented a Next.js App Router frontend with reusable components and page-level route structure
- Built theme-aware UI with a global light/dark mode toggle and CSS variable design tokens
- Added protected route behavior and role-based navigation for CUSTOMER, ADMIN, and TRAVEL_AGENT
- Created reusable mock API utilities for tours, bookings, and feedback workflows
- Added Jest and React Testing Library coverage for core user flows

## Interview Talking Points

- Explain why the theme lives in a top-level provider and how CSS variables keep the entire app consistent
- Describe the tradeoff of starting with mock API integration before wiring the real backend
- Discuss how protected route logic and role-based UI are separated from page content
- Mention accessibility decisions such as semantic landmarks, labels, and validation messages
- Highlight the App Router structure and route-level composition for performance and maintainability
