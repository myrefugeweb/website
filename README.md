# My Refuge - Non-Profit Landing Page

A modern, professional landing page for My Refuge, a non-profit organization helping at-risk youth in Bartlesville, Oklahoma.

## Features

- 🎨 **Design System**: Reusable components with consistent styling
- 🎭 **Animations**: Smooth, professional animations using Framer Motion
- 📱 **Responsive**: Fully responsive design for all devices
- 🔐 **Admin Dashboard**: Secure admin panel for content management
- 🗓️ **Calendar Events**: Dynamic event management
- 🖼️ **Image Management**: Upload and manage images dynamically

## Tech Stack

- **React** with **TypeScript**
- **Vite** for fast development and building
- **React Router** for navigation
- **Framer Motion** for animations
- **Supabase** for backend (authentication, database, storage)
- **CSS Modules** for component styling

## Project Structure

```
my-refuge/
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── design-system/  # Design tokens and theme
│   ├── lib/            # Utilities and configurations
│   └── styles/         # Global styles
├── backend/            # Backend configuration
│   ├── supabase/       # Supabase CLI configuration and migrations
│   └── sql/            # SQL setup scripts
├── docs/               # Documentation
├── scripts/             # Setup and utility scripts
└── public/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

   **Option 1: Use the setup script (Recommended)**
   ```bash
   # On Windows (PowerShell)
   .\scripts\setup-env.ps1
   
   # On Mac/Linux
   chmod +x scripts/setup-env.sh
   ./scripts/setup-env.sh
   ```

   **Option 2: Manual setup**
   ```bash
   # Copy the example file
   cp env.example .env
   ```
   Then open `.env` and add your Supabase credentials:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase publishable/anon key
   
   See `docs/ENV_SETUP.md` for detailed instructions.

### Development

Run the development server:
```bash
npm run dev
```

### Building for Production

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from **Settings → API** in your Supabase dashboard
3. Set up your `.env` file (see `docs/ENV_SETUP.md` for detailed instructions)
4. Set up the following tables in Supabase (see `docs/SUPABASE_SETUP.md` for full guide):

### Database Schema

**images** table:
- id (uuid, primary key)
- section (text) - e.g., 'hero', 'mission', 'help'
- url (text)
- created_at (timestamp)

**calendar_events** table:
- id (uuid, primary key)
- title (text)
- description (text)
- date (date)
- created_at (timestamp)

**header_content** table:
- id (uuid, primary key)
- title (text)
- description (text)
- updated_at (timestamp)

### Storage Bucket

Create a storage bucket named `images` for image uploads.

## Component Guidelines

- Each component lives in its own directory
- Components are self-contained with their own CSS
- Use the design system tokens for colors, spacing, etc.
- All components are exported through an `index.ts` file

## Admin Access

The admin login is accessible via the "login" link in the footer. After authentication, admins can:
- Upload and manage images for different sections
- Edit header content (hero section)
- Add and manage calendar events

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Push to GitHub**: Follow the instructions in `docs/GITHUB_PAGES_SETUP.md` to authenticate and push your code
2. **Enable GitHub Pages**: Go to repository Settings → Pages → Source: GitHub Actions
3. **Add Secrets**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository secrets
4. **Deploy**: The workflow will automatically build and deploy on every push to `main`

Your site will be available at: `https://myrefugeweb.github.io/website/`

See `docs/GITHUB_PAGES_SETUP.md` for detailed setup instructions.

### Other Platforms

This project can also be deployed to any static hosting service (Netlify, Vercel, etc.). The frontend is static, while the backend functionality is handled by Supabase.

## License

Copyright © 2024 My Refuge 501c3

