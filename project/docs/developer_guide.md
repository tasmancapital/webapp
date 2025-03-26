# Tasman Capital Website Developer Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Development Environment](#development-environment)
4. [Database Structure](#database-structure)
5. [API Reference](#api-reference)
6. [Frontend Components](#frontend-components)
7. [CSS Variables System](#css-variables-system)
8. [Authentication and Authorization](#authentication-and-authorization)
9. [Extending the System](#extending-the-system)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Performance Optimization](#performance-optimization)

## Introduction

This developer guide provides technical documentation for developers working on the Tasman Capital website. It covers the architecture, database structure, API endpoints, and customization options.

### Technology Stack

- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Frontend**: React with TypeScript
- **Styling**: CSS variables with light/dark mode support
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Hosting**: Vercel

## Architecture Overview

The Tasman Capital website is built on a flexible, database-driven architecture that separates content from presentation. The system consists of:

### Backend Components

- **Supabase Database**: PostgreSQL database with tables for content, users, and configuration
- **Supabase Auth**: Authentication and user management
- **Supabase Storage**: Media file storage
- **Supabase Functions**: Serverless functions for complex operations

### Frontend Components

- **React Application**: Client-side rendering for fast user experience
- **Admin Dashboard**: Content management interface (accessible at `/login` path)
- **Public Website**: Visitor-facing website

### Data Flow

1. User requests a page
2. Frontend fetches data from Supabase API
3. Data is processed and rendered using React components
4. CSS variables apply styling based on theme settings
5. User interactions trigger API calls to update data

## Development Environment

### Prerequisites

- Node.js 16+
- npm or yarn
- Git
- Supabase CLI

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tasman-capital/website.git
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref your_project_ref
   ```

3. Apply migrations:
   ```bash
   supabase db push
   ```

## Database Structure

The database is structured around several key tables:

### Core Tables

- `profiles`: User profiles linked to Supabase Auth
- `pages`: Website pages with metadata and content
- `components`: Page components with properties and content
- `media`: Uploaded media files with metadata

### Configuration Tables

- `themes`: Theme configurations with CSS variables
- `page_templates`: Page structure templates
- `headers` and `footers`: Header and footer configurations
- `navigation_menus` and `menu_items`: Navigation structure

For detailed schema information, see [database_schema.md](./database_schema.md).

## API Reference

The website uses Supabase's RESTful API for data access. Here are the key endpoints:

### Authentication

- `POST /auth/v1/signup`: Create a new user
- `POST /auth/v1/token?grant_type=password`: Sign in with email/password
- `POST /auth/v1/token?grant_type=refresh_token`: Refresh access token
- `POST /auth/v1/logout`: Sign out

### Pages

- `GET /rest/v1/pages`: List all pages
- `GET /rest/v1/pages?slug=eq.{slug}`: Get page by slug
- `POST /rest/v1/pages`: Create a new page
- `PATCH /rest/v1/pages?id=eq.{id}`: Update a page
- `DELETE /rest/v1/pages?id=eq.{id}`: Delete a page

### Components

- `GET /rest/v1/components?page_id=eq.{page_id}`: Get components for a page
- `POST /rest/v1/components`: Create a new component
- `PATCH /rest/v1/components?id=eq.{id}`: Update a component
- `DELETE /rest/v1/components?id=eq.{id}`: Delete a component

### Navigation

- `GET /rest/v1/navigation_menus`: List all navigation menus
- `GET /rest/v1/menu_items?menu_id=eq.{menu_id}`: Get items for a menu
- `POST /rest/v1/menu_items`: Create a new menu item
- `PATCH /rest/v1/menu_items?id=eq.{id}`: Update a menu item
- `DELETE /rest/v1/menu_items?id=eq.{id}`: Delete a menu item

### Helper Functions

- `GET /rest/v1/rpc/get_menu_items?p_menu_id={menu_id}`: Get hierarchical menu items
- `GET /rest/v1/rpc/get_page_with_components?p_slug={slug}`: Get page with components

## Frontend Components

The frontend is built with React and organized into reusable components:

### Core Components

- `<Page>`: Renders a page with its components
- `<Header>`: Renders the header based on configuration
- `<Footer>`: Renders the footer based on configuration
- `<Navigation>`: Renders navigation menus

### Content Components

- `<Hero>`: Hero section with heading and background
- `<Content>`: Text-based content section
- `<Features>`: Grid of feature items with icons
- `<Team>`: Team member profiles
- `<Testimonials>`: Client or customer testimonials
- `<CTA>`: Call-to-action section
- `<Gallery>`: Image or video gallery
- `<Contact>`: Contact information and form
- `<Investments>`: Investment portfolio items

### Admin Components

- `<PageEditor>`: Interface for editing pages
- `<ComponentEditor>`: Interface for editing components
- `<MediaLibrary>`: Interface for managing media
- `<ThemeEditor>`: Interface for customizing themes
- `<NavigationEditor>`: Interface for managing navigation

### Example Component Structure

```tsx
// Hero.tsx
import React from 'react';
import { HeroProps } from '../types';

export const Hero: React.FC<HeroProps> = ({
  heading,
  subheading,
  backgroundType,
  backgroundVideo,
  backgroundImage,
  ctaButtons,
}) => {
  return (
    <section className="hero">
      {backgroundType === 'video' && backgroundVideo ? (
        <video
          className="hero-background"
          autoPlay
          muted
          loop
          playsInline
          src={backgroundVideo}
        />
      ) : (
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="hero-content">
        <h1>{heading}</h1>
        {subheading && <p>{subheading}</p>}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="hero-buttons">
            {ctaButtons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                className={`button button-${button.style}`}
              >
                {button.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
```

## CSS Variables System

The website uses CSS variables for consistent styling and theming:

### Implementation

CSS variables are defined in the `:root` element and updated based on theme settings:

```css
:root {
  /* Light mode (default) */
  --background: 255 255 255;
  --foreground: 20 20 20;
  --primary: 234 88 12;
  --primary-foreground: 255 255 255;
  --secondary: 245 245 245;
  --secondary-foreground: 20 20 20;
  --muted: 235 235 235;
  --muted-foreground: 100 100 100;
  --accent: 234 88 12;
  --accent-foreground: 255 255 255;
  --border: 225 225 225;
  --ring: 215 215 215;
}

.dark {
  /* Dark mode */
  --background: 2 6 23;
  --foreground: 255 255 255;
  --primary: 234 88 12;
  --primary-foreground: 2 6 23;
  --secondary: 15 15 30;
  --secondary-foreground: 255 255 255;
  --muted: 25 25 40;
  --muted-foreground: 200 200 200;
  --accent: 234 88 12;
  --accent-foreground: 2 6 23;
  --border: 20 20 35;
  --ring: 30 30 45;
}
```

### Usage in Components

CSS variables are used in component styles:

```css
.button-primary {
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
}

.button-secondary {
  background-color: rgb(var(--secondary));
  color: rgb(var(--secondary-foreground));
}
```

### Dynamic Theme Application

Themes are applied dynamically using JavaScript:

```tsx
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Apply light mode variables
  Object.entries(theme.light_mode).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Apply dark mode variables when dark class is present
  document.addEventListener('theme-change', (e) => {
    if (e.detail.theme === 'dark') {
      Object.entries(theme.dark_mode).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      Object.entries(theme.light_mode).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  });
};
```

## Authentication and Authorization

### Authentication Flow

1. User signs in with email/password
2. Supabase Auth returns access token and refresh token
3. Access token is stored in memory
4. Refresh token is stored in a secure HTTP-only cookie
5. Access token is included in API requests as a Bearer token

### Row Level Security

Access control is implemented using PostgreSQL's Row Level Security (RLS) policies:

```sql
-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY admin_all_pages ON public.pages
  USING (auth.jwt() ->> 'role' = 'admin');

-- Editors can read all pages and modify non-published pages
CREATE POLICY editor_read_pages ON public.pages
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer'));

CREATE POLICY editor_modify_pages ON public.pages
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY editor_update_pages ON public.pages
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- Viewers can only read published pages
CREATE POLICY viewer_read_published_pages ON public.pages
  FOR SELECT USING (
    (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer')) OR
    (status = 'published' AND published_at <= now())
  );
```

### Role-Based Access Control

The system uses three roles:

- **Admin**: Full access to all features
- **Editor**: Can create and edit content but not manage users
- **Viewer**: Read-only access to content

Role checks are implemented in the frontend:

```tsx
const RequireRole = ({ children, requiredRole }) => {
  const { user, userRole } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <AccessDenied />;
  }
  
  if (requiredRole === 'editor' && !['admin', 'editor'].includes(userRole)) {
    return <AccessDenied />;
  }
  
  return children;
};
```

## Extending the System

### Adding a New Component Type

1. Create a new React component:
   ```tsx
   // src/components/NewComponent.tsx
   import React from 'react';
   
   interface NewComponentProps {
     heading: string;
     content: string;
     // Add other properties
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({
     heading,
     content,
   }) => {
     return (
       <section className="new-component">
         <h2>{heading}</h2>
         <div dangerouslySetInnerHTML={{ __html: content }} />
       </section>
     );
   };
   ```

2. Register the component in the component registry:
   ```tsx
   // src/components/registry.ts
   import { Hero } from './Hero';
   import { Content } from './Content';
   import { NewComponent } from './NewComponent';
   
   export const componentRegistry = {
     hero: Hero,
     content: Content,
     new_component: NewComponent,
   };
   ```

3. Add the component to the admin interface:
   ```tsx
   // src/admin/components/ComponentSelector.tsx
   const componentTypes = [
     { value: 'hero', label: 'Hero' },
     { value: 'content', label: 'Content' },
     { value: 'new_component', label: 'New Component' },
   ];
   ```

4. Create an editor for the component:
   ```tsx
   // src/admin/components/NewComponentEditor.tsx
   import React from 'react';
   import { Form, Input, TextArea } from '../ui';
   
   export const NewComponentEditor = ({ properties, onChange }) => {
     return (
       <Form>
         <Input
           label="Heading"
           value={properties.heading || ''}
           onChange={(e) => onChange({ ...properties, heading: e.target.value })}
         />
         <TextArea
           label="Content"
           value={properties.content || ''}
           onChange={(e) => onChange({ ...properties, content: e.target.value })}
         />
       </Form>
     );
   };
   ```

### Adding a New API Endpoint

To add a custom API endpoint using Supabase Functions:

1. Create a new function:
   ```js
   // supabase/functions/custom-endpoint/index.ts
   import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
   
   serve(async (req) => {
     const supabaseClient = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       Deno.env.get('SUPABASE_ANON_KEY') ?? '',
       {
         global: {
           headers: { Authorization: req.headers.get('Authorization')! },
         },
       }
     );
     
     // Your custom logic here
     const { data, error } = await supabaseClient
       .from('your_table')
       .select('*');
     
     return new Response(
       JSON.stringify({ data, error }),
       { headers: { 'Content-Type': 'application/json' } }
     );
   });
   ```

2. Deploy the function:
   ```bash
   supabase functions deploy custom-endpoint
   ```

3. Call the function from the frontend:
   ```tsx
   const { data, error } = await supabase.functions.invoke('custom-endpoint');
   ```

## Testing

### Unit Testing

Unit tests are written using Jest and React Testing Library:

```tsx
// src/components/__tests__/Hero.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero component', () => {
  it('renders heading correctly', () => {
    render(
      <Hero
        heading="Test Heading"
        subheading="Test Subheading"
        backgroundType="image"
        backgroundImage="/test.jpg"
        ctaButtons={[]}
      />
    );
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });
  
  it('renders video background when specified', () => {
    render(
      <Hero
        heading="Test Heading"
        backgroundType="video"
        backgroundVideo="/test.mp4"
        ctaButtons={[]}
      />
    );
    
    const video = screen.getByRole('video');
    expect(video).toHaveAttribute('src', '/test.mp4');
  });
});
```

### Integration Testing

Integration tests use Cypress:

```js
// cypress/integration/page.spec.js
describe('Page rendering', () => {
  beforeEach(() => {
    cy.intercept('GET', '/rest/v1/pages*', { fixture: 'page.json' });
    cy.intercept('GET', '/rest/v1/components*', { fixture: 'components.json' });
  });
  
  it('loads and displays a page correctly', () => {
    cy.visit('/about');
    cy.get('h1').should('contain', 'About Us');
    cy.get('.hero').should('exist');
    cy.get('.content').should('exist');
  });
});
```

### API Testing

API tests use Supertest:

```js
// tests/api/pages.test.js
const request = require('supertest');
const baseUrl = process.env.SUPABASE_URL;

describe('Pages API', () => {
  let token;
  
  beforeAll(async () => {
    // Get auth token
    const response = await request(baseUrl)
      .post('/auth/v1/token?grant_type=password')
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });
    
    token = response.body.access_token;
  });
  
  it('returns a list of pages', async () => {
    const response = await request(baseUrl)
      .get('/rest/v1/pages')
      .set('Authorization', `Bearer ${token}`)
      .set('apikey', process.env.SUPABASE_ANON_KEY);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Deployment

### Deployment Process

The website is deployed using a CI/CD pipeline:

1. Code is pushed to the main branch
2. GitHub Actions runs tests
3. If tests pass, the frontend is built and deployed to Vercel
4. Database migrations are applied to Supabase

### Environment Variables

The following environment variables are required:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=your_site_url
```

### Database Migrations

Database migrations are managed using the Supabase CLI:

```bash
# Apply migrations
supabase db push

# Generate a new migration
supabase migration new your_migration_name
```

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Components are loaded dynamically using React.lazy
- **Image Optimization**: Images are served in WebP format with appropriate sizes
- **CSS Optimization**: CSS is minified and unused styles are removed
- **Caching**: API responses are cached using React Query

### Backend Optimization

- **Database Indexes**: Indexes are created for frequently queried columns
- **Query Optimization**: Complex queries use PostgreSQL functions
- **Connection Pooling**: Supabase handles connection pooling automatically
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse

### Example Performance Improvements

```tsx
// Dynamic import for code splitting
const DynamicComponent = React.lazy(() => import('./HeavyComponent'));

// Optimized image component
const OptimizedImage = ({ src, alt, width, height }) => {
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  );
};

// Optimized API fetching with React Query
const usePageData = (slug) => {
  return useQuery(
    ['page', slug],
    async () => {
      const { data, error } = await supabase
        .rpc('get_page_with_components', { p_slug: slug });
      
      if (error) throw error;
      return data;
    },
    {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
```
