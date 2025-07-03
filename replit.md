# WeisCandle Workshop Aromaterapi - Replit.md

## Overview

WeisCandle is a modern web application for an aromatherapy candle making workshop business. The application serves as both a marketing website and workshop management platform, featuring a sales-focused homepage, detailed workshop information, blog content, and contact forms. Built with a modern full-stack architecture using React and Node.js.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with Shadcn/UI component library
- **Forms**: React Hook Form with Zod validation for robust form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful APIs with JSON responses
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for API request/response validation
- **Development**: Hot reloading with Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with TypeScript integration
- **Migrations**: Drizzle Kit for database schema management
- **Development Fallback**: In-memory storage for development/testing

## Key Components

### Pages & Routes
- **Home (/)**: Sales-focused landing page with hero section, benefits, pricing, and testimonials
- **Workshop (/workshop)**: Detailed curriculum, instructor information, and facilities
- **About (/about)**: Brand story, vision, mission, and team information
- **Blog (/blog)**: Article listing with pagination and search
- **Blog Post (/blog/:slug)**: Individual article pages with rich content
- **Contact (/contact)**: Contact form with validation and location information
- **Export (/export)**: B2B wholesale and partnership information
- **404**: Custom not found page with navigation options

### UI Components
- **Navigation**: Responsive navigation with mobile menu
- **Hero Section**: Call-to-action focused landing section
- **Workshop Benefits**: Feature highlights with icons and descriptions
- **Schedule & Pricing**: Package comparison cards
- **Testimonial Carousel**: Auto-rotating customer testimonials
- **Footer**: Site-wide navigation and contact information

### Database Schema
- **Users**: Basic user management (future authentication)
- **Blog Posts**: Article content with slug-based routing
- **Contacts**: Form submissions with validation

## Data Flow

### Client-Side Flow
1. React components render with initial state
2. TanStack Query manages API calls and caching
3. Forms use React Hook Form with Zod validation
4. Wouter handles client-side navigation
5. Tailwind/Shadcn provides consistent styling

### Server-Side Flow
1. Express routes handle API requests
2. Zod validates incoming request data
3. Drizzle ORM interacts with PostgreSQL
4. JSON responses sent back to client
5. Error handling with appropriate HTTP status codes

### API Endpoints
- `GET /api/blog` - Retrieve all blog posts
- `GET /api/blog/:slug` - Retrieve specific blog post
- `POST /api/contact` - Submit contact form

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **@hookform/resolvers**: Form validation integration
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: TypeScript ORM
- **@neondatabase/serverless**: PostgreSQL driver
- **cors**: Cross-origin resource sharing
- **tsx**: TypeScript execution

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development Setup
- `npm run dev`: Starts both frontend (Vite) and backend (Express) concurrently
- Hot reloading enabled for both client and server code
- In-memory storage fallback for rapid development

### Production Build
- `npm run build`: 
  - Builds frontend with Vite (optimized for production)
  - Bundles backend with esbuild (Node.js compatible)
- `npm start`: Runs production server
- Static assets served from Express

### Database Setup
- `npm run db:push`: Syncs Drizzle schema with PostgreSQL
- Environment variables required: `DATABASE_URL`
- Migrations stored in `/migrations` directory

### Environment Configuration
- `NODE_ENV`: Development/production mode
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (defaults to 3000)

## Changelog

Changelog:
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.