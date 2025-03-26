# Tasman Capital Website Database Schema

This document provides a detailed reference of the database schema used in the Tasman Capital website. The database is hosted on Supabase and uses PostgreSQL with Row Level Security (RLS) policies.

## Table of Contents

1. [User Authentication](#user-authentication)
2. [Website Content](#website-content)
3. [Theme and Styling](#theme-and-styling)
4. [Page Templates](#page-templates)
5. [Headers and Footers](#headers-and-footers)
6. [Navigation Menus](#navigation-menus)
7. [Row Level Security](#row-level-security)
8. [Helper Functions](#helper-functions)

## User Authentication

### `profiles` Table

Stores user profile information linked to Supabase Auth.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Roles:**
- `admin`: Full access to all features
- `editor`: Can create and edit content but not manage users
- `viewer`: Read-only access to content

## Website Content

### `pages` Table

Stores all website pages.

```sql
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  template_id UUID REFERENCES public.page_templates(id),
  header_id UUID REFERENCES public.headers(id),
  footer_id UUID REFERENCES public.footers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

**Status Values:**
- `draft`: Not visible to the public
- `published`: Visible to the public
- `archived`: No longer visible but preserved

### `components` Table

Stores page components and their properties.

```sql
CREATE TABLE public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  properties JSONB NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Component Types:**
- `hero`: Hero section with heading and background
- `content`: Text-based content section
- `features`: Grid of feature items with icons
- `team`: Team member profiles
- `testimonials`: Client or customer testimonials
- `cta`: Call-to-action section
- `gallery`: Image or video gallery
- `contact`: Contact information and form
- `investments`: Investment portfolio items

### `media` Table

Stores uploaded media files.

```sql
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Theme and Styling

### `themes` Table

Stores theme configurations with CSS variables.

```sql
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  light_mode JSONB NOT NULL,
  dark_mode JSONB NOT NULL,
  typography JSONB NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**JSONB Structure Example:**

```json
{
  "light_mode": {
    "--background": "255 255 255",
    "--foreground": "20 20 20",
    "--primary": "234 88 12",
    "--primary-foreground": "255 255 255",
    "--secondary": "245 245 245",
    "--secondary-foreground": "20 20 20",
    "--muted": "235 235 235",
    "--muted-foreground": "100 100 100",
    "--accent": "234 88 12",
    "--accent-foreground": "255 255 255",
    "--border": "225 225 225",
    "--ring": "215 215 215",
    "--destructive": "239 68 68",
    "--destructive-foreground": "255 255 255",
    "--success": "34 197 94",
    "--success-foreground": "255 255 255",
    "--warning": "234 179 8",
    "--warning-foreground": "255 255 255"
  },
  "dark_mode": {
    "--background": "2 6 23",
    "--foreground": "255 255 255",
    "--primary": "234 88 12",
    "--primary-foreground": "2 6 23",
    "--secondary": "15 15 30",
    "--secondary-foreground": "255 255 255",
    "--muted": "25 25 40",
    "--muted-foreground": "200 200 200",
    "--accent": "234 88 12",
    "--accent-foreground": "2 6 23",
    "--border": "20 20 35",
    "--ring": "30 30 45",
    "--destructive": "239 68 68",
    "--destructive-foreground": "255 255 255",
    "--success": "34 197 94",
    "--success-foreground": "255 255 255",
    "--warning": "234 179 8",
    "--warning-foreground": "255 255 255"
  },
  "typography": {
    "--font-sans": "'Inter', system-ui, sans-serif",
    "--font-serif": "'Georgia', serif",
    "--font-mono": "'Menlo', monospace",
    "--font-size-xs": "0.75rem",
    "--font-size-sm": "0.875rem",
    "--font-size-base": "1rem",
    "--font-size-lg": "1.125rem",
    "--font-size-xl": "1.25rem",
    "--font-size-2xl": "1.5rem",
    "--font-size-3xl": "1.875rem",
    "--font-size-4xl": "2.25rem",
    "--font-size-5xl": "3rem",
    "--font-size-6xl": "3.75rem",
    "--font-size-7xl": "4.5rem",
    "--font-size-8xl": "6rem",
    "--font-size-9xl": "8rem",
    "--font-weight-thin": "100",
    "--font-weight-extralight": "200",
    "--font-weight-light": "300",
    "--font-weight-normal": "400",
    "--font-weight-medium": "500",
    "--font-weight-semibold": "600",
    "--font-weight-bold": "700",
    "--font-weight-extrabold": "800",
    "--font-weight-black": "900"
  },
  "components": {
    "button": {
      "primary": {
        "background": "rgb(var(--primary))",
        "color": "rgb(var(--primary-foreground))",
        "hover": "rgb(var(--primary) / 0.9)",
        "active": "rgb(var(--primary) / 0.8)"
      },
      "secondary": {
        "background": "rgb(var(--secondary))",
        "color": "rgb(var(--secondary-foreground))",
        "hover": "rgb(var(--secondary) / 0.9)",
        "active": "rgb(var(--secondary) / 0.8)"
      }
    },
    "card": {
      "background": "rgb(var(--background))",
      "border": "1px solid rgb(var(--border))",
      "shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1)"
    }
  }
}
```

## Page Templates

### `page_templates` Table

Defines page structure templates.

```sql
CREATE TABLE public.page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**JSONB Structure Example:**

```json
{
  "sections": [
    {
      "name": "hero",
      "label": "Hero Section",
      "required": true,
      "limit": 1,
      "default_content": {
        "type": "hero",
        "properties": {
          "heading": "Welcome to Tasman Capital",
          "subheading": "Strategic investment partners",
          "background_type": "video",
          "background_video": "/videos/hero-background.mp4",
          "background_image": "/images/hero-background.jpg",
          "cta_buttons": [
            {
              "text": "Learn More",
              "url": "/about",
              "style": "primary"
            },
            {
              "text": "Contact Us",
              "url": "/contact",
              "style": "secondary"
            }
          ]
        }
      }
    },
    {
      "name": "content",
      "label": "Content Section",
      "required": false,
      "limit": null,
      "default_content": {
        "type": "content",
        "properties": {
          "heading": "About Us",
          "content": "<p>Tasman Capital is a private investment firm...</p>",
          "columns": 1,
          "alignment": "left"
        }
      }
    }
  ],
  "default_header": "standard",
  "default_footer": "standard"
}
```

## Headers and Footers

### `headers` Table

Stores header configurations.

```sql
CREATE TABLE public.headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  styles JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  primary_menu_id UUID REFERENCES public.navigation_menus(id),
  secondary_menu_id UUID REFERENCES public.navigation_menus(id),
  mobile_menu_id UUID REFERENCES public.navigation_menus(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**JSONB Structure Example:**

```json
{
  "structure": {
    "logo": {
      "light": "/images/logo-light.svg",
      "dark": "/images/logo-dark.svg",
      "alt": "Tasman Capital Logo",
      "width": 180,
      "height": 40
    },
    "show_theme_toggle": true,
    "sticky": true,
    "transparent": false,
    "actions": [
      {
        "text": "Contact",
        "url": "/contact",
        "style": "primary"
      }
    ]
  },
  "styles": {
    "height": "80px",
    "background": "rgb(var(--background) / 0.8)",
    "backdrop_filter": "blur(10px)",
    "border_bottom": "1px solid rgb(var(--border))",
    "padding": "0 1.5rem",
    "mobile_breakpoint": "768px"
  }
}
```

### `footers` Table

Stores footer configurations.

```sql
CREATE TABLE public.footers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  styles JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  primary_menu_id UUID REFERENCES public.navigation_menus(id),
  secondary_menu_id UUID REFERENCES public.navigation_menus(id),
  mobile_menu_id UUID REFERENCES public.navigation_menus(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**JSONB Structure Example:**

```json
{
  "structure": {
    "logo": {
      "light": "/images/logo-light.svg",
      "dark": "/images/logo-dark.svg",
      "alt": "Tasman Capital Logo",
      "width": 180,
      "height": 40
    },
    "columns": [
      {
        "title": "About",
        "menu_id": "footer_about"
      },
      {
        "title": "Investments",
        "menu_id": "footer_investments"
      },
      {
        "title": "Contact",
        "content": "<p>123 Business St<br>Sydney, NSW 2000<br>info@tasmancapital.com.au</p>"
      }
    ],
    "social_links": [
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/company/tasman-capital",
        "icon": "linkedin"
      },
      {
        "platform": "twitter",
        "url": "https://twitter.com/tasmancapital",
        "icon": "twitter"
      }
    ],
    "copyright": "© {year} Tasman Capital. All rights reserved.",
    "show_back_to_top": true
  },
  "styles": {
    "background": "rgb(var(--secondary))",
    "text_color": "rgb(var(--secondary-foreground))",
    "padding": "4rem 1.5rem 2rem",
    "border_top": "none"
  }
}
```

## Navigation Menus

### `navigation_menus` Table

Stores navigation menu configurations.

```sql
CREATE TABLE public.navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Location Values:**
- `header_primary`: Main header navigation
- `header_secondary`: Secondary header navigation
- `footer_primary`: Main footer navigation
- `footer_secondary`: Secondary footer navigation
- `mobile`: Mobile-specific navigation

### `menu_items` Table

Stores individual menu items.

```sql
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT,
  page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  icon TEXT,
  target TEXT,
  is_external BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  classes TEXT,
  attributes JSONB,
  responsive_behavior JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**JSONB Structure Example:**

```json
{
  "attributes": {
    "data-tracking": "main-nav-about",
    "aria-label": "About Us Section"
  },
  "responsive_behavior": {
    "desktop": {
      "visible": true,
      "classes": "desktop-menu-item"
    },
    "tablet": {
      "visible": true,
      "classes": "tablet-menu-item"
    },
    "mobile": {
      "visible": true,
      "classes": "mobile-menu-item",
      "label": "About"
    }
  }
}
```

## Row Level Security

The database uses Row Level Security (RLS) policies to control access to data:

### Pages RLS

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

### Components RLS

```sql
-- Enable RLS
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY admin_all_components ON public.components
  USING (auth.jwt() ->> 'role' = 'admin');

-- Editors can read all components and modify them
CREATE POLICY editor_read_components ON public.components
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer'));

CREATE POLICY editor_modify_components ON public.components
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY editor_update_components ON public.components
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- Viewers can only read components of published pages
CREATE POLICY viewer_read_published_components ON public.components
  FOR SELECT USING (
    (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer')) OR
    EXISTS (
      SELECT 1 FROM public.pages
      WHERE pages.id = components.page_id
      AND pages.status = 'published'
      AND pages.published_at <= now()
    )
  );
```

### Navigation Menus RLS

```sql
-- Enable RLS
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY admin_all_navigation ON public.navigation_menus
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_menu_items ON public.menu_items
  USING (auth.jwt() ->> 'role' = 'admin');

-- Editors can read all navigation and modify it
CREATE POLICY editor_read_navigation ON public.navigation_menus
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer'));

CREATE POLICY editor_modify_navigation ON public.navigation_menus
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY editor_update_navigation ON public.navigation_menus
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- Same for menu items
CREATE POLICY editor_read_menu_items ON public.menu_items
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'editor', 'viewer'));

CREATE POLICY editor_modify_menu_items ON public.menu_items
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY editor_update_menu_items ON public.menu_items
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- Viewers can only read
CREATE POLICY viewer_read_navigation ON public.navigation_menus
  FOR SELECT USING (true);

CREATE POLICY viewer_read_menu_items ON public.menu_items
  FOR SELECT USING (true);
```

## Helper Functions

### `get_menu_items(p_menu_id UUID)`

Retrieves menu items hierarchically with parent-child relationships.

```sql
CREATE OR REPLACE FUNCTION public.get_menu_items(p_menu_id UUID)
RETURNS TABLE (
  id UUID,
  label TEXT,
  url TEXT,
  page_id UUID,
  icon TEXT,
  target TEXT,
  is_external BOOLEAN,
  order_index INTEGER,
  classes TEXT,
  attributes JSONB,
  responsive_behavior JSONB,
  level INTEGER,
  children JSONB
) AS $$
WITH RECURSIVE menu_tree AS (
  -- Base case: top-level items
  SELECT
    mi.id,
    mi.label,
    mi.url,
    mi.page_id,
    mi.icon,
    mi.target,
    mi.is_external,
    mi.order_index,
    mi.classes,
    mi.attributes,
    mi.responsive_behavior,
    1 AS level,
    mi.parent_id
  FROM public.menu_items mi
  WHERE mi.menu_id = p_menu_id AND mi.parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: child items
  SELECT
    c.id,
    c.label,
    c.url,
    c.page_id,
    c.icon,
    c.target,
    c.is_external,
    c.order_index,
    c.classes,
    c.attributes,
    c.responsive_behavior,
    p.level + 1,
    c.parent_id
  FROM public.menu_items c
  JOIN menu_tree p ON c.parent_id = p.id
  WHERE c.menu_id = p_menu_id
)
SELECT
  mt.id,
  mt.label,
  mt.url,
  mt.page_id,
  mt.icon,
  mt.target,
  mt.is_external,
  mt.order_index,
  mt.classes,
  mt.attributes,
  mt.responsive_behavior,
  mt.level,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'label', c.label,
          'url', c.url,
          'page_id', c.page_id,
          'icon', c.icon,
          'target', c.target,
          'is_external', c.is_external,
          'order_index', c.order_index,
          'classes', c.classes,
          'attributes', c.attributes,
          'responsive_behavior', c.responsive_behavior,
          'children', c.children
        ) ORDER BY c.order_index
      )
      FROM get_menu_items(p_menu_id) c
      WHERE c.parent_id = mt.id
    ),
    '[]'::jsonb
  ) AS children
FROM menu_tree mt
WHERE mt.parent_id IS NULL
ORDER BY mt.order_index;
$$ LANGUAGE SQL STABLE;
```

### `get_page_with_components(p_slug TEXT)`

Retrieves a page with all its components in the correct order.

```sql
CREATE OR REPLACE FUNCTION public.get_page_with_components(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  status TEXT,
  template_id UUID,
  header_id UUID,
  footer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  components JSONB
) AS $$
SELECT
  p.id,
  p.title,
  p.slug,
  p.description,
  p.meta_title,
  p.meta_description,
  p.meta_keywords,
  p.og_image,
  p.status,
  p.template_id,
  p.header_id,
  p.footer_id,
  p.created_at,
  p.updated_at,
  p.published_at,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'type', c.type,
          'properties', c.properties,
          'section', c.section,
          'order_index', c.order_index
        ) ORDER BY c.section, c.order_index
      )
      FROM public.components c
      WHERE c.page_id = p.id
    ),
    '[]'::jsonb
  ) AS components
FROM public.pages p
WHERE p.slug = p_slug;
$$ LANGUAGE SQL STABLE;
```
