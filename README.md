# DeadStar Frontend - Medusa.JS Storefront

A mobile-first Next.js frontend for Medusa.JS built with a 2-column product grid layout inspired by modern e-commerce design.

## Features

- 📱 Mobile-first responsive design
- 🎯 Hero splash section
- 🛍️ Featured items showcase
- 📂 Collections section
- 🏪 2-column product grid (Picture, Name, Price)
- 🧭 Navbar and Footer

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
# or
npm install
```

### Development

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProductGrid.tsx
│   ├── FeaturedItems.tsx
│   ├── Collections.tsx
│   └── Footer.tsx
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Notes

- Backend coordination functions are not included and should be implemented as needed
- All components are mock-data friendly and ready for Medusa integration
- Mobile-first breakpoints are built into all components
