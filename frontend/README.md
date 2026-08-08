# Asha Boutique Store

A modern, elegant boutique e-commerce website featuring smooth scroll animations, product catalog, appointment booking, and shopping cart functionality.

## Project Overview

Asha Boutique Store is a React-based single-page application built with Vite. It showcases a boutique fashion store with:
- Smooth scroll-triggered animations using GSAP
- Product catalog with filtering by category
- Shopping cart with add/remove functionality
- Appointment booking system
- Responsive design for mobile and desktop
- Beautiful UI components from shadcn/ui

## Project Structure

```
app/
├── public/                 # Static assets (images, etc.)
├── src/
│   ├── components/
│   │   └── ui/            # shadcn/ui components (53 components)
│   ├── hooks/
│   │   └── use-mobile.ts  # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts       # Utility functions (cn for class merging)
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main application component
│   ├── index.css          # Base styles
│   └── main.jsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
└── components.json        # shadcn/ui configuration
```

## UI Components Used

The project uses 53 shadcn/ui components (all converted from TypeScript to JavaScript):

### Layout & Navigation
- **Sheet** - Mobile drawer/sheet component
- **Sidebar** - Collapsible sidebar with keyboard shortcuts
- **Separator** - Visual separator/divider
- **Scroll Area** - Custom scrollable areas

### Form & Input
- **Button** - Primary and secondary buttons
- **Input** - Text input fields
- **Textarea** - Multi-line text input
- **Label** - Form labels
- **Select** - Dropdown select
- **Checkbox** - Checkbox inputs
- **Radio Group** - Radio button groups
- **Switch** - Toggle switches
- **Slider** - Range slider
- **Input OTP** - One-time password input
- **Input Group** - Grouped input fields
- **Field** - Form field wrapper
- **Form** - Form components with react-hook-form

### Data Display
- **Card** - Card containers
- **Badge** - Status badges
- **Avatar** - User avatars
- **Table** - Data tables
- **Skeleton** - Loading skeletons
- **Progress** - Progress bars
- **Pagination** - Pagination controls
- **Empty** - Empty state component
- **Item** - List items
- **Kbd** - Keyboard key display

### Feedback & Overlays
- **Dialog** - Modal dialogs
- **Alert** - Alert messages
- **Alert Dialog** - Confirmation dialogs
- **Toast (Sonner)** - Toast notifications
- **Tooltip** - Hover tooltips
- **Popover** - Popover content
- **Hover Card** - Hover-triggered cards

### Navigation Menus
- **Dropdown Menu** - Dropdown menus
- **Context Menu** - Right-click context menus
- **Menubar** - Top menu bar
- **Navigation Menu** - Navigation menus
- **Command** - Command palette (cmdk)
- **Drawer** - Bottom drawer (vaul)
- **Breadcrumb** - Breadcrumb navigation

### Interactive Components
- **Accordion** - Collapsible accordion
- **Collapsible** - Collapsible content
- **Tabs** - Tab navigation
- **Toggle** - Toggle buttons
- **Toggle Group** - Toggle button groups
- **Resizable** - Resizable panels
- **Carousel** - Image carousel (embla-carousel-react)
- **Chart** - Data charts (recharts)

### Advanced Components
- **Calendar** - Date picker calendar
- **Aspect Ratio** - Aspect ratio container
- **Spinner** - Loading spinner

## Key Dependencies

### Core Framework
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React DOM 19.2.0** - React DOM renderer

### UI Libraries
- **Radix UI** - Headless UI primitives (20+ packages)
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Class name utilities

### Animation
- **GSAP 3.14.2** - Professional animation library
- **ScrollTrigger** - Scroll-based animations (GSAP plugin)

### Form Handling
- **react-hook-form 7.70.0** - Form state management
- **@hookform/resolvers** - Form validation resolvers
- **zod 4.3.5** - Schema validation

### Data Visualization
- **recharts 2.15.4** - Chart library
- **embla-carousel-react 8.6.0** - Carousel component

### Other Utilities
- **sonner 2.0.7** - Toast notifications
- **date-fns 4.1.0** - Date utilities
- **react-day-picker 9.13.0** - Date picker
- **cmdk 1.1.1** - Command palette
- **vaul 1.1.2** - Drawer component
- **next-themes 0.4.6** - Theme management
- **react-resizable-panels 4.2.2** - Resizable panels

## Features

### 1. Scroll Animations (GSAP)
- **Hero Section**: Fade-in and scale animations on load
- **New Arrivals**: Images slide in from left/right as you scroll
- **Curated Collection**: Text and image slide from opposite directions
- **Atelier**: Image and text slide with scroll scrubbing
- **Trending Now**: Staggered card animations
- **Style Edit**: Text and image slide animations

**How it works:**
```javascript
gsap.fromTo('.element',
  { x: '-60vw' },  // Start: 60 viewport widths off-screen
  {
    x: 0,          // End: On-screen
    scrollTrigger: {
      trigger: elementRef.current,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1     // Smooth scroll-linked animation
    }
  }
)
```

### 2. Product Catalog
- 8 sample products with categories (Tops, Dresses, Tailoring, Accessories)
- Category filtering (All, Tops, Dresses, Tailoring, Accessories)
- Hover effects on product cards
- Add to cart functionality with visual feedback

### 3. Shopping Cart
- Cart icon with item count badge in navigation
- Add to cart with toast notifications
- Cart dialog showing:
  - Product images, names, prices
  - Quantity controls (+/-)
  - Remove items
  - Total price calculation
  - Checkout button (placeholder)

### 4. Appointment Booking
- Booking dialog with form fields:
  - Name, Phone, Email
  - Service type selection
  - Preferred date and time
  - Additional notes
- Form validation
- Success toast notification

### 5. Responsive Design
- Mobile-first approach
- Mobile menu with hamburger toggle
- Responsive grid layouts
- Touch-friendly interactions

## Color Scheme

- **Primary Accent**: `#E46A53` (Terracotta/Red)
- **Primary Text**: `#2B1E1A` (Dark Brown)
- **Secondary Text**: `#7A655D` (Medium Brown)
- **Background**: `#F6F2EE` (Cream/Beige)
- **Secondary Background**: `#E9E3DD` (Light Beige)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server runs on `http://localhost:5173` by default.

## Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## File Organization Notes

### Main Application Logic
- **App.jsx** - Contains all page sections, state management, and business logic
- **main.jsx** - Entry point that mounts React to DOM

### UI Components
- All UI components are in `src/components/ui/`
- Each component is a standalone file
- Components use Radix UI primitives with Tailwind styling
- All components have been converted from TypeScript (.tsx) to JavaScript (.jsx)

### Utilities
- **lib/utils.ts** - Contains `cn()` function for merging Tailwind classes
- **hooks/use-mobile.ts** - Custom hook for detecting mobile screen size

## Custom Hooks

### use-mobile
Detects if the current viewport is mobile-sized (768px breakpoint).

```javascript
const isMobile = useIsMobile()
```

## Styling

The project uses Tailwind CSS with custom configuration in `tailwind.config.js`. Custom colors and animations are defined there.

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support.

## License

Private project for Asha Boutique Store.

## Notes

- Project has been fully converted from TypeScript to JavaScript
- All .tsx files have been converted to .jsx
- TypeScript configuration files have been removed
- Project uses React 19 with Vite 7
