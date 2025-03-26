# Tasman Capital Website Editing System Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Database Structure](#database-structure)
3. [Content Management](#content-management)
4. [Theme and Styling](#theme-and-styling)
5. [Page Templates](#page-templates)
6. [Headers and Footers](#headers-and-footers)
7. [Navigation Menus](#navigation-menus)
8. [User Workflows](#user-workflows)
9. [Technical Reference](#technical-reference)
10. [Troubleshooting](#troubleshooting)

## Introduction

The Tasman Capital website is built on a flexible, database-driven content management system that allows for complete customization of content, styling, and structure through a visual editor interface. This documentation provides a comprehensive guide to understanding and using the website editing system.

### Key Features

- **Dynamic Content Management**: Create, edit, and organize all website content
- **Visual Styling System**: Customize appearance using CSS variables and theme settings
- **Page Templates**: Pre-configured page layouts for different content types
- **Header and Footer Customization**: Multiple styles with full customization options
- **Navigation Management**: Hierarchical menu system with responsive behavior
- **Multi-tenant Architecture**: Support for multiple websites with isolated content
- **Role-Based Access Control**: Granular permissions for different user types

### Technology Stack

- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Frontend**: React with TypeScript
- **Styling**: CSS variables with light/dark mode support
- **Authentication**: Supabase Auth with Row Level Security (RLS)

## Database Structure

The website content and configuration are stored in a structured PostgreSQL database in Supabase. Below is an overview of the key tables and their relationships:

### Core Tables

#### `users` and `profiles`
- Store user information and authentication data
- Include role-based permissions (admin, editor, viewer)
- Managed through Supabase Auth with Row Level Security

#### `pages`
- Stores all website pages
- Contains metadata, SEO information, and publishing status
- Links to templates, headers, footers, and content

#### `components`
- Stores reusable UI components
- Contains component type, properties, and styling
- Used to build page sections

#### `media`
- Stores images, videos, and documents
- Includes metadata, alt text, and file information
- Organized with tags and categories

### Configuration Tables

#### `themes`
- Stores theme configurations
- Contains CSS variables for colors, typography, and spacing
- Supports light and dark mode variants

#### `page_templates`
- Defines page structure templates
- Contains section configurations and default content
- Used when creating new pages

#### `headers` and `footers`
- Stores header and footer configurations
- Contains structure, styling, and behavior settings
- Links to navigation menus

#### `navigation_menus` and `menu_items`
- Stores navigation structure
- Supports hierarchical menus with parent-child relationships
- Includes responsive behavior configuration

### Entity Relationship Diagram

```
users 1──* profiles
     └──* pages
          │
          ├── template_id ─────> page_templates
          ├── header_id ──────> headers
          └── footer_id ──────> footers
                               /      \
                              /        \
         navigation_menus <──┘          └──> navigation_menus
                │
                └──* menu_items
                     │
                     └──* menu_items (parent-child)

pages ──* components
      └──* media
```

## Content Management

### Pages

Pages are the primary content containers in the website. Each page has:

- **Basic Information**: Title, slug, description, and status
- **SEO Data**: Meta title, description, keywords, and OG image
- **Structure**: Template, header, and footer configurations
- **Content**: Collection of components organized in sections

#### Page Operations

| Operation | Description | Access Level |
|-----------|-------------|--------------|
| Create | Add a new page based on a template | Admin, Editor |
| Read | View page content and structure | All |
| Update | Modify page content, structure, or settings | Admin, Editor |
| Delete | Remove a page from the website | Admin |
| Publish | Make a page visible to the public | Admin, Editor |
| Unpublish | Hide a page from the public | Admin, Editor |
| Duplicate | Create a copy of an existing page | Admin, Editor |

### Components

Components are the building blocks of page content. Each component has:

- **Type**: Defines the component's functionality and appearance
- **Properties**: Configurable options specific to the component type
- **Content**: Text, images, links, or other media
- **Styling**: Visual appearance settings

#### Component Types

| Type | Description | Properties |
|------|-------------|------------|
| Hero | Large banner section with heading and background | Heading, subheading, background image/video, CTA buttons |
| Content | Text-based content section | Heading, rich text content, columns, alignment |
| Features | Grid of feature items with icons | Heading, features list, columns, icon style |
| Team | Team member profiles | Heading, team members, layout style |
| Testimonials | Client or customer testimonials | Heading, testimonials list, display style |
| CTA | Call-to-action section | Heading, description, button text/link |
| Gallery | Image or video gallery | Images, captions, layout style |
| Contact | Contact information and form | Contact details, form fields, map |
| Investments | Investment portfolio items | Heading, investments list, filter options |

#### Component Operations

| Operation | Description | Access Level |
|-----------|-------------|--------------|
| Add | Add a component to a page section | Admin, Editor |
| Configure | Modify component properties | Admin, Editor |
| Reorder | Change component position | Admin, Editor |
| Remove | Delete a component from a page | Admin, Editor |
| Duplicate | Create a copy of a component | Admin, Editor |

### Media Management

The media library allows for organizing and reusing images, videos, and documents:

- **Upload**: Add new media files to the library
- **Organize**: Tag and categorize media for easy retrieval
- **Select**: Choose media for use in components
- **Optimize**: Automatically resize and compress images

## Theme and Styling

The styling system uses CSS variables to ensure consistent design across the website.

### CSS Variables

#### Core Theme Variables

| Variable | Purpose | Light Mode | Dark Mode |
|----------|---------|------------|-----------|
| `--background` | Background colors | 255 255 255 | 2 6 23 |
| `--foreground` | Text colors | 20 20 20 | 255 255 255 |
| `--primary` | Main brand color | 234 88 12 | 234 88 12 |
| `--primary-foreground` | Text on primary color elements | 255 255 255 | 2 6 23 |
| `--secondary` | Secondary color | 245 245 245 | 15 15 30 |
| `--secondary-foreground` | Text on secondary elements | 20 20 20 | 255 255 255 |
| `--muted` | For muted elements | 235 235 235 | 25 25 40 |
| `--muted-foreground` | Text on muted elements | 100 100 100 | 200 200 200 |
| `--accent` | Accent color | 234 88 12 | 234 88 12 |
| `--accent-foreground` | Text on accent elements | 255 255 255 | 2 6 23 |
| `--border` | Border color | 225 225 225 | 20 20 35 |
| `--ring` | Focus ring color | 215 215 215 | 30 30 45 |

#### Status Colors

| Variable | Purpose | Value |
|----------|---------|-------|
| `--destructive` | Error/delete actions | 239 68 68 |
| `--destructive-foreground` | Text on destructive elements | 255 255 255 |
| `--success` | Success indicators | 34 197 94 |
| `--success-foreground` | Text on success elements | 255 255 255 |
| `--warning` | Warning indicators | 234 179 8 |
| `--warning-foreground` | Text on warning elements | 255 255 255 |

### Typography

#### Font Families

| Variable | Purpose | Value |
|----------|---------|-------|
| `--font-sans` | Primary font | 'Inter', system-ui, sans-serif |
| `--font-serif` | Secondary font | 'Georgia', serif |
| `--font-mono` | Monospace font | 'Menlo', monospace |

#### Font Sizes

| Variable | Size | Value |
|----------|------|-------|
| `--font-size-xs` | Extra small | 0.75rem |
| `--font-size-sm` | Small | 0.875rem |
| `--font-size-base` | Base | 1rem |
| `--font-size-lg` | Large | 1.125rem |
| `--font-size-xl` | Extra large | 1.25rem |
| `--font-size-2xl` | 2XL | 1.5rem |
| `--font-size-3xl` | 3XL | 1.875rem |
| `--font-size-4xl` | 4XL | 2.25rem |
| `--font-size-5xl` | 5XL | 3rem |
| `--font-size-6xl` | 6XL | 3.75rem |
| `--font-size-7xl` | 7XL | 4.5rem |
| `--font-size-8xl` | 8XL | 6rem |
| `--font-size-9xl` | 9XL | 8rem |

#### Font Weights

| Variable | Weight | Value |
|----------|--------|-------|
| `--font-weight-thin` | Thin | 100 |
| `--font-weight-extralight` | Extra Light | 200 |
| `--font-weight-light` | Light | 300 |
| `--font-weight-normal` | Normal | 400 |
| `--font-weight-medium` | Medium | 500 |
| `--font-weight-semibold` | Semi Bold | 600 |
| `--font-weight-bold` | Bold | 700 |
| `--font-weight-extrabold` | Extra Bold | 800 |
| `--font-weight-black` | Black | 900 |

### Component-Specific Styling

Each component type has specific style variables that can be customized:

- **Buttons**: Background, text color, padding, border radius
- **Cards**: Background, border, shadow, padding
- **Forms**: Input styles, label styles, validation styles
- **Navigation**: Link colors, active states, dropdown styles
- **Hero**: Background overlay, text alignment, spacing

## Page Templates

Page templates provide pre-configured layouts for different types of content. Each template defines:

- **Layout**: Overall page structure
- **Header Type**: Default header style
- **Sections**: Available content sections with default content
- **Footer Type**: Default footer style

### Available Templates

#### Standard Page

A versatile page template with standard header, content sections, and footer.

**Structure:**
- Header: Standard
- Sections:
  - Hero (required, limit 1)
  - Content (optional, unlimited)
  - Features (optional, unlimited)
  - CTA (optional, limit 1)
- Footer: Standard

#### Landing Page

Focused on conversion with minimal navigation and strong call-to-action.

**Structure:**
- Header: Minimal
- Sections:
  - Hero (required, limit 1)
  - Features (optional, limit 1)
  - Testimonials (optional, limit 1)
  - CTA (required, limit 1)
- Footer: Minimal

#### Content Page

Designed for detailed content presentation with sidebar navigation.

**Structure:**
- Header: Standard
- Sections:
  - PageHeader (required, limit 1)
  - ContentWithSidebar (required, limit 1)
  - RelatedContent (optional, limit 1)
- Footer: Standard

#### Team Page

Showcases team members with profiles and details.

**Structure:**
- Header: Standard
- Sections:
  - TeamOverview (required, limit 1)
  - TeamMembers (required, limit 1)
  - Careers (optional, limit 1)
- Footer: Standard

#### Investment Page

Presents investment portfolio and approach.

**Structure:**
- Header: Standard
- Sections:
  - InvestmentApproach (required, limit 1)
  - CurrentInvestments (optional, limit 1)
  - RealizedInvestments (optional, limit 1)
  - CaseStudies (optional, limit 1)
- Footer: Standard

#### Contact Page

Provides contact information, form, and office locations.

**Structure:**
- Header: Standard
- Sections:
  - ContactInformation (required, limit 1)
  - OfficeLocations (optional, limit 1)
  - ContactForm (required, limit 1)
- Footer: Standard

#### Legal Page

Formatted for legal content such as privacy policy or terms of service.

**Structure:**
- Header: Standard
- Sections:
  - LegalContent (required, limit 1)
- Footer: Standard

## Headers and Footers

Headers and footers can be customized independently of page templates.

### Header Styles

#### Standard Header

Default header with logo and navigation.

**Features:**
- Logo with dark mode variant
- Horizontal navigation menu
- Theme toggle
- Sticky behavior with scroll effects
- Mobile menu drawer

**Styling:**
- Background: `rgb(var(--background) / 0.8)` with blur effect
- Height: 80px
- Border bottom: 1px solid `rgb(var(--border))`
- Box shadow on scroll

#### Transparent Header

For use with hero sections, becomes solid on scroll.

**Features:**
- White logo (for dark backgrounds)
- Horizontal navigation menu
- Theme toggle
- Transparent background that becomes solid on scroll
- Mobile menu drawer

**Styling:**
- Initial background: transparent
- Scrolled background: `rgb(var(--background) / 0.8)` with blur effect
- Initial links: white
- Scrolled links: `rgb(var(--foreground))`

#### Minimal Header

Simplified header with reduced height.

**Features:**
- Logo with dark mode variant
- Horizontal navigation menu
- No theme toggle
- Sticky behavior
- Mobile menu drawer

**Styling:**
- Background: `rgb(var(--background))`
- Height: 60px
- Border bottom: 1px solid `rgb(var(--border))`
- Reduced padding and font size

### Footer Styles

#### Standard Footer

Multi-column footer with navigation and contact info.

**Features:**
- Logo with dark mode variant
- Multiple content columns
- Social media links
- Copyright information
- Back to top button

**Styling:**
- Background: `rgb(var(--secondary))`
- Padding: 4rem 1.5rem 2rem
- Border top for bottom section
- Column grid layout

#### Minimal Footer

Simplified single-row footer.

**Features:**
- Logo with dark mode variant
- Horizontal link list
- Social media links
- Copyright information
- No back to top button

**Styling:**
- Background: `rgb(var(--background))`
- Padding: 2rem 1.5rem
- Centered content
- Reduced spacing

#### Expanded Footer

Comprehensive footer with newsletter signup.

**Features:**
- Logo with dark mode variant
- Multiple content columns
- Newsletter signup form
- Social media links
- Copyright information
- Back to top button

**Styling:**
- Background: `rgb(var(--secondary))`
- Padding: 5rem 1.5rem 2rem
- Column grid layout
- Newsletter form styling
- Border top for bottom section

## Navigation Menus

The navigation system allows for creating and managing menus for different parts of the website.

### Menu Types

#### Main Navigation

Primary navigation for the header.

**Features:**
- Horizontal layout
- Dropdown support
- Current page highlighting
- Mobile-friendly

#### Footer Navigation

Primary navigation for the footer.

**Features:**
- Multiple columns possible
- Simple links (no dropdowns)
- Grouped by category

#### Mobile Navigation

Specialized navigation for mobile devices.

**Features:**
- Optimized for touch
- Expandable sections
- Larger tap targets
- Full-screen overlay or drawer

#### Legal Navigation

Secondary navigation for legal/utility links.

**Features:**
- Minimal styling
- Usually placed in footer
- Small text size

### Menu Structure

Menus are hierarchical with parent-child relationships:

- **Top-level items**: Main navigation categories
- **Second-level items**: Dropdown menu options
- **Third-level items**: Sub-dropdown options (if needed)

### Menu Item Properties

Each menu item can have the following properties:

- **Label**: Display text
- **URL**: Link destination (internal or external)
- **Page Reference**: Link to a specific page (auto-updates if page slug changes)
- **Icon**: Optional icon to display
- **Target**: Open in same window or new tab
- **CSS Classes**: Custom styling
- **Attributes**: Additional HTML attributes
- **Responsive Behavior**: Display rules for different screen sizes

### Responsive Configuration

Menu items can be configured differently for each device size:

- **Desktop**: Standard navigation
- **Tablet**: Adapted for medium screens
- **Mobile**: Optimized for small screens

Properties that can vary by device:
- Visibility (show/hide)
- CSS classes
- Label text (can be shortened)
- Icon display

## User Workflows

### Creating a New Page

1. **Access the Admin Dashboard**
   - Navigate to `https://tasmancapital.com.au/login`
   - Enter your email and password
   - Click "Sign In"
2. **Select a Template**
   - Choose from available page templates
   - Preview template structure

3. **Configure Page Settings**
   - Enter page title
   - Set page slug (URL path)
   - Add meta description and keywords
   - Select OG image for social sharing

4. **Choose Header and Footer**
   - Select header style from dropdown
   - Select footer style from dropdown
   - Configure header/footer options if needed

5. **Edit Page Content**
   - Add/edit content for each section
   - Configure component properties
   - Upload or select media
   - Arrange components as needed

6. **Preview and Publish**
   - Preview page in desktop, tablet, and mobile views
   - Save as draft or publish immediately
   - Set publishing schedule if needed

### Editing Theme Settings

1. **Access Theme Settings**
   - Navigate to "Appearance" > "Theme Settings"
   - Select theme to edit (or create new)

2. **Edit Color Variables**
   - Modify primary, secondary, and accent colors
   - Adjust background and text colors
   - Configure status colors

3. **Edit Typography**
   - Select font families
   - Adjust font sizes and weights
   - Modify heading styles

4. **Preview Changes**
   - See real-time preview of changes
   - Check both light and dark modes
   - Test on different device sizes

5. **Save and Apply**
   - Save theme settings
   - Apply theme to website

### Managing Navigation

1. **Access Navigation Settings**
   - Navigate to "Appearance" > "Navigation"
   - Select menu to edit

2. **Edit Menu Structure**
   - Add new menu items
   - Create dropdown menus by adding child items
   - Reorder items by drag and drop
   - Delete unwanted items

3. **Configure Menu Items**
   - Set link destination (page, URL, or anchor)
   - Add icons if needed
   - Configure responsive behavior
   - Set custom CSS classes

4. **Preview Navigation**
   - See how navigation appears in context
   - Test dropdown behavior
   - Check responsive adjustments

5. **Save Changes**
   - Apply navigation changes to website

## Technical Reference

### Database Schema

Detailed table definitions and relationships:

```sql
-- Users and authentication
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

-- Pages
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

-- Components
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

-- Media
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

-- Themes
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

-- Page Templates
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

-- Headers
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

-- Footers
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

-- Navigation Menus
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

-- Menu Items
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

### API Endpoints

The website uses Supabase's RESTful API for data access. Key endpoints include:

#### Pages

- `GET /rest/v1/pages`: List all pages
- `GET /rest/v1/pages?slug=eq.{slug}`: Get page by slug
- `POST /rest/v1/pages`: Create a new page
- `PATCH /rest/v1/pages?id=eq.{id}`: Update a page
- `DELETE /rest/v1/pages?id=eq.{id}`: Delete a page

#### Components

- `GET /rest/v1/components?page_id=eq.{page_id}`: Get components for a page
- `POST /rest/v1/components`: Create a new component
- `PATCH /rest/v1/components?id=eq.{id}`: Update a component
- `DELETE /rest/v1/components?id=eq.{id}`: Delete a component

#### Navigation

- `GET /rest/v1/navigation_menus`: List all navigation menus
- `GET /rest/v1/menu_items?menu_id=eq.{menu_id}`: Get items for a menu
- `POST /rest/v1/menu_items`: Create a new menu item
- `PATCH /rest/v1/menu_items?id=eq.{id}`: Update a menu item
- `DELETE /rest/v1/menu_items?id=eq.{id}`: Delete a menu item

### Helper Functions

PostgreSQL functions that assist with common operations:

#### `get_menu_items(p_menu_id UUID)`

Retrieves menu items hierarchically with parent-child relationships.

#### `is_admin(user_id UUID)`

Checks if a user has admin privileges.

#### `get_page_with_components(p_slug TEXT)`

Retrieves a page with all its components in the correct order.

## Troubleshooting

### Common Issues

#### Page Not Saving

**Possible causes:**
- Missing required fields
- Duplicate slug
- Insufficient permissions

**Solutions:**
- Check for error messages in the form
- Ensure all required fields are filled
- Try a different slug
- Verify your user permissions

#### Components Not Displaying

**Possible causes:**
- Component type not recognized
- Missing required properties
- Section limit reached

**Solutions:**
- Check component configuration
- Ensure all required properties are set
- Remove other components if section has a limit

#### Styling Not Applying

**Possible causes:**
- CSS variable not defined
- Incorrect variable reference
- Caching issues

**Solutions:**
- Verify CSS variables in theme settings
- Check syntax of variable references
- Clear browser cache
- Try in incognito/private browsing mode

#### Navigation Not Working

**Possible causes:**
- Menu not assigned to header/footer
- Incorrect page references
- Responsive configuration issues

**Solutions:**
- Check menu assignments in header/footer settings
- Verify page references and URLs
- Test on different device sizes
- Check responsive behavior settings

### Support Resources

- **Documentation**: This comprehensive guide
- **Admin Guide**: Step-by-step instructions for common tasks
- **Developer Reference**: Technical details for customization
- **Support Contact**: support@tasmancapital.com.au
