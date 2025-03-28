
-- ========== START OF 20250325000001_admin_authentication.sql ==========

/*
  # Admin Authentication Setup

  1. Changes
    - Use Supabase's built-in auth.users table for authentication
    - Create a profiles table that links to auth.users
    - Seed admin users with credentials

  2. Security
    - Uses Supabase's built-in authentication system
    - In production, passwords are automatically hashed by Supabase
*/

-- Create a profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ========== END OF 20250325000001_admin_authentication.sql ==========

-- ========== START OF 20250325000002_website_content.sql ==========

/*
  # Website Content Management System

  1. Changes
    - Create tables for pages, components, sections, and content
    - Create tables for media (images, videos, files)
    - Create tables for themes and styles
    - Set up RLS policies for all tables
    - Seed initial content from the website

  2. Security
    - RLS policies ensure only admin users can modify content
    - Public users can view published content
*/

-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.page_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.styles ENABLE ROW LEVEL SECURITY;

-- Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create components table
CREATE TABLE IF NOT EXISTS public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component_type TEXT NOT NULL,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create sections table
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component_id UUID REFERENCES public.components(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id),
  content JSONB NOT NULL,
  position INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create page_content_history table
CREATE TABLE IF NOT EXISTS public.page_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_content_id UUID REFERENCES public.page_content(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create themes table
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  variables JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create styles table
CREATE TABLE IF NOT EXISTS public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  css TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS policies for pages
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pages' AND policyname = 'Anyone can view published pages'
  ) THEN
    CREATE POLICY "Anyone can view published pages"
      ON public.pages
      FOR SELECT
      USING (is_published = true OR public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pages' AND policyname = 'Admin users can insert pages'
  ) THEN
    CREATE POLICY "Admin users can insert pages"
      ON public.pages
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pages' AND policyname = 'Admin users can update pages'
  ) THEN
    CREATE POLICY "Admin users can update pages"
      ON public.pages
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pages' AND policyname = 'Admin users can delete pages'
  ) THEN
    CREATE POLICY "Admin users can delete pages"
      ON public.pages
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for components
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'components' AND policyname = 'Anyone can view components'
  ) THEN
    CREATE POLICY "Anyone can view components"
      ON public.components
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'components' AND policyname = 'Admin users can insert components'
  ) THEN
    CREATE POLICY "Admin users can insert components"
      ON public.components
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'components' AND policyname = 'Admin users can update components'
  ) THEN
    CREATE POLICY "Admin users can update components"
      ON public.components
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'components' AND policyname = 'Admin users can delete components'
  ) THEN
    CREATE POLICY "Admin users can delete components"
      ON public.components
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for sections
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Anyone can view sections'
  ) THEN
    CREATE POLICY "Anyone can view sections"
      ON public.sections
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Admin users can insert sections'
  ) THEN
    CREATE POLICY "Admin users can insert sections"
      ON public.sections
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Admin users can update sections'
  ) THEN
    CREATE POLICY "Admin users can update sections"
      ON public.sections
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Admin users can delete sections'
  ) THEN
    CREATE POLICY "Admin users can delete sections"
      ON public.sections
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for page_content
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content' AND policyname = 'Anyone can view published page content'
  ) THEN
    CREATE POLICY "Anyone can view published page content"
      ON public.page_content
      FOR SELECT
      USING (is_published = true OR public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content' AND policyname = 'Admin users can insert page content'
  ) THEN
    CREATE POLICY "Admin users can insert page content"
      ON public.page_content
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content' AND policyname = 'Admin users can update page content'
  ) THEN
    CREATE POLICY "Admin users can update page content"
      ON public.page_content
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content' AND policyname = 'Admin users can delete page content'
  ) THEN
    CREATE POLICY "Admin users can delete page content"
      ON public.page_content
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for page_content_history
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content_history' AND policyname = 'Admin users can view page content history'
  ) THEN
    CREATE POLICY "Admin users can view page content history"
      ON public.page_content_history
      FOR SELECT
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_content_history' AND policyname = 'Admin users can insert page content history'
  ) THEN
    CREATE POLICY "Admin users can insert page content history"
      ON public.page_content_history
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for media
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Anyone can view media'
  ) THEN
    CREATE POLICY "Anyone can view media"
      ON public.media
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Admin users can insert media'
  ) THEN
    CREATE POLICY "Admin users can insert media"
      ON public.media
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Admin users can update media'
  ) THEN
    CREATE POLICY "Admin users can update media"
      ON public.media
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media' AND policyname = 'Admin users can delete media'
  ) THEN
    CREATE POLICY "Admin users can delete media"
      ON public.media
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for themes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Anyone can view themes'
  ) THEN
    CREATE POLICY "Anyone can view themes"
      ON public.themes
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can insert themes'
  ) THEN
    CREATE POLICY "Admin users can insert themes"
      ON public.themes
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can update themes'
  ) THEN
    CREATE POLICY "Admin users can update themes"
      ON public.themes
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can delete themes'
  ) THEN
    CREATE POLICY "Admin users can delete themes"
      ON public.themes
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- RLS policies for styles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'styles' AND policyname = 'Anyone can view styles'
  ) THEN
    CREATE POLICY "Anyone can view styles"
      ON public.styles
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'styles' AND policyname = 'Admin users can insert styles'
  ) THEN
    CREATE POLICY "Admin users can insert styles"
      ON public.styles
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'styles' AND policyname = 'Admin users can update styles'
  ) THEN
    CREATE POLICY "Admin users can update styles"
      ON public.styles
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'styles' AND policyname = 'Admin users can delete styles'
  ) THEN
    CREATE POLICY "Admin users can delete styles"
      ON public.styles
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Seed initial data for pages
INSERT INTO public.pages (slug, title, description, is_published)
VALUES 
  ('home', 'Home', 'Tasman Capital home page', true),
  ('about', 'About Us', 'About Tasman Capital', true),
  ('investments', 'Investments', 'Our investment portfolio', true),
  ('team', 'Our Team', 'Meet the Tasman Capital team', true),
  ('contact', 'Contact Us', 'Get in touch with Tasman Capital', true),
  ('privacy-policy', 'Privacy Policy', 'Tasman Capital privacy policy', true),
  ('terms-of-use', 'Terms of Use', 'Tasman Capital terms of use', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial components
INSERT INTO public.components (name, description, component_type, schema)
VALUES 
  ('Hero', 'Hero section with heading, subheading, and CTA', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "subheading",
        "label": "Subheading",
        "type": "rich-text"
      },
      {
        "id": "ctaText",
        "label": "CTA Button Text",
        "type": "text"
      },
      {
        "id": "ctaLink",
        "label": "CTA Button Link",
        "type": "text"
      },
      {
        "id": "backgroundImage",
        "label": "Background Image",
        "type": "image"
      }
    ]
  }'),
  ('ProvenTrackRecord', 'Section showcasing track record', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "description",
        "label": "Description",
        "type": "rich-text"
      },
      {
        "id": "stats",
        "label": "Statistics",
        "type": "array",
        "items": {
          "fields": [
            {
              "id": "value",
              "label": "Value",
              "type": "text"
            },
            {
              "id": "label",
              "label": "Label",
              "type": "text"
            }
          ]
        }
      }
    ]
  }'),
  ('PastInvestments', 'Section showcasing past investments', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "description",
        "label": "Description",
        "type": "rich-text"
      },
      {
        "id": "investments",
        "label": "Investments",
        "type": "array",
        "items": {
          "fields": [
            {
              "id": "name",
              "label": "Name",
              "type": "text"
            },
            {
              "id": "description",
              "label": "Description",
              "type": "rich-text"
            },
            {
              "id": "image",
              "label": "Image",
              "type": "image"
            }
          ]
        }
      }
    ]
  }'),
  ('Performance', 'Section showcasing performance metrics', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "description",
        "label": "Description",
        "type": "rich-text"
      },
      {
        "id": "metrics",
        "label": "Performance Metrics",
        "type": "array",
        "items": {
          "fields": [
            {
              "id": "label",
              "label": "Label",
              "type": "text"
            },
            {
              "id": "value",
              "label": "Value",
              "type": "text"
            },
            {
              "id": "change",
              "label": "Change",
              "type": "text"
            }
          ]
        }
      }
    ]
  }'),
  ('LogoShowcase', 'Section showcasing partner logos', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text"
      },
      {
        "id": "logos",
        "label": "Logos",
        "type": "array",
        "items": {
          "fields": [
            {
              "id": "name",
              "label": "Company Name",
              "type": "text"
            },
            {
              "id": "logo",
              "label": "Logo",
              "type": "image"
            },
            {
              "id": "url",
              "label": "Website URL",
              "type": "text"
            }
          ]
        }
      }
    ]
  }'),
  ('TeamMembers', 'Section showcasing team members', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "description",
        "label": "Description",
        "type": "rich-text"
      },
      {
        "id": "members",
        "label": "Team Members",
        "type": "array",
        "items": {
          "fields": [
            {
              "id": "name",
              "label": "Name",
              "type": "text"
            },
            {
              "id": "title",
              "label": "Title",
              "type": "text"
            },
            {
              "id": "bio",
              "label": "Biography",
              "type": "rich-text"
            },
            {
              "id": "image",
              "label": "Photo",
              "type": "image"
            }
          ]
        }
      }
    ]
  }'),
  ('ContactForm', 'Contact form section', 'section', '{
    "fields": [
      {
        "id": "heading",
        "label": "Heading",
        "type": "text",
        "required": true
      },
      {
        "id": "description",
        "label": "Description",
        "type": "rich-text"
      },
      {
        "id": "address",
        "label": "Address",
        "type": "text"
      },
      {
        "id": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "id": "phone",
        "label": "Phone",
        "type": "text"
      }
    ]
  }')
ON CONFLICT DO NOTHING;

-- Create default theme with CSS variables
INSERT INTO public.themes (name, description, is_active, variables)
VALUES (
  'Default Theme', 
  'Default theme for Tasman Capital website', 
  true, 
  '{
    "colors": {
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
      "--ring": "215 215 215"
    },
    "dark": {
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
      "--ring": "30 30 45"
    },
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "headingFontFamily": "Inter, sans-serif",
      "baseFontSize": "16px",
      "lineHeight": "1.5"
    },
    "spacing": {
      "containerWidth": "1200px",
      "gutter": "2rem"
    }
  }'
)
ON CONFLICT DO NOTHING;


-- ========== END OF 20250325000002_website_content.sql ==========

-- ========== START OF 20250325000003_seed_pages.sql ==========

/*
  # Seed Website Pages and Basic Structure

  1. Changes
    - Insert all website pages
    - Create basic page structure
    - Set up navigation items
    - Add page metadata

  2. Content
    - Home page
    - About page
    - Investments page
    - Team page
    - Contact page
    - Privacy Policy page
    - Terms of Use page
*/

-- Seed pages with complete metadata
INSERT INTO public.pages (slug, title, description, meta_title, meta_description, is_published)
VALUES 
  ('home', 'Home', 'Tasman Capital - Building Great Businesses Through Strategic Partnership', 'Tasman Capital | Private Investment Firm', 'A leading private investment firm with a proven track record of creating value through strategic partnerships and operational excellence.', true),
  ('about', 'About Us', 'Who we are - A leading private investment firm focused on partnering with exceptional management teams', 'About Tasman Capital | Our History & Values', 'Learn about Tasman Capital, a leading private investment firm focused on partnering with exceptional management teams to build great businesses across Australia and New Zealand.', true),
  ('investments', 'Investments', 'Our investment portfolio across Australia and New Zealand', 'Investments | Tasman Capital Portfolio', 'Explore Tasman Capital''s current and past investments across Australia and New Zealand, showcasing our strategic partnerships and value creation.', true),
  ('team', 'Our Team', 'Meet the experienced team behind Tasman Capital', 'Our Team | Tasman Capital Leadership', 'Meet the experienced leadership team at Tasman Capital with decades of experience in private equity, mergers & acquisitions, and operational excellence.', true),
  ('contact', 'Contact Us', 'Get in touch with Tasman Capital', 'Contact Tasman Capital | Get in Touch', 'Contact Tasman Capital for investment opportunities, partnership inquiries, or general information about our private investment firm.', true),
  ('privacy-policy', 'Privacy Policy', 'Tasman Capital privacy policy', 'Privacy Policy | Tasman Capital', 'Read Tasman Capital''s privacy policy to understand how we collect, use, and protect your personal information.', true),
  ('terms-of-use', 'Terms of Use', 'Tasman Capital terms of use', 'Terms of Use | Tasman Capital', 'Review Tasman Capital''s terms of use for our website and services.', true)
ON CONFLICT (slug) DO UPDATE 
SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  is_published = EXCLUDED.is_published;

-- Create navigation structure
CREATE TABLE IF NOT EXISTS public.navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on navigation
ALTER TABLE IF EXISTS public.navigation ENABLE ROW LEVEL SECURITY;

-- RLS policies for navigation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation' AND policyname = 'Anyone can view navigation'
  ) THEN
    CREATE POLICY "Anyone can view navigation"
      ON public.navigation
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation' AND policyname = 'Admin users can insert navigation'
  ) THEN
    CREATE POLICY "Admin users can insert navigation"
      ON public.navigation
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation' AND policyname = 'Admin users can update navigation'
  ) THEN
    CREATE POLICY "Admin users can update navigation"
      ON public.navigation
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation' AND policyname = 'Admin users can delete navigation'
  ) THEN
    CREATE POLICY "Admin users can delete navigation"
      ON public.navigation
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Seed navigation
INSERT INTO public.navigation (name, type, items)
VALUES 
  ('Main Navigation', 'header', '[
    {
      "label": "About",
      "url": "/about",
      "external": false
    },
    {
      "label": "Investments",
      "url": "/investments",
      "external": false
    },
    {
      "label": "Team",
      "url": "/team",
      "external": false
    },
    {
      "label": "Contact",
      "url": "/contact",
      "external": false
    }
  ]'),
  ('Footer Navigation', 'footer', '[
    {
      "label": "Privacy Policy",
      "url": "/privacy-policy",
      "external": false
    },
    {
      "label": "Terms of Use",
      "url": "/terms-of-use",
      "external": false
    }
  ]')
ON CONFLICT DO NOTHING;

-- Create site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' AND policyname = 'Anyone can view site settings'
  ) THEN
    CREATE POLICY "Anyone can view site settings"
      ON public.site_settings
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' AND policyname = 'Admin users can insert site settings'
  ) THEN
    CREATE POLICY "Admin users can insert site settings"
      ON public.site_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' AND policyname = 'Admin users can update site settings'
  ) THEN
    CREATE POLICY "Admin users can update site settings"
      ON public.site_settings
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' AND policyname = 'Admin users can delete site settings'
  ) THEN
    CREATE POLICY "Admin users can delete site settings"
      ON public.site_settings
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Seed site settings
INSERT INTO public.site_settings (name, value)
VALUES 
  ('company_info', '{
    "name": "Tasman Capital",
    "address": "Level 5, 50 Carrington Street, Sydney NSW 2000",
    "email": "info@tasmancapital.com.au",
    "phone": "+61 2 9252 2222",
    "social": {
      "linkedin": "https://www.linkedin.com/company/tasman-capital/"
    },
    "logo": {
      "light": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "dark": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    }
  }')
ON CONFLICT DO NOTHING;


-- ========== END OF 20250325000003_seed_pages.sql ==========

-- ========== START OF 20250325000004_seed_home_page.sql ==========

/*
  # Seed Home Page Content

  1. Changes
    - Insert home page sections
    - Create content for Hero section
    - Create content for Proven Track Record section
    - Create content for Past Investments section
    - Create content for Performance section
    - Create content for Logo Showcase section
*/

-- Get page ID for home page
DO $$
DECLARE
  home_page_id UUID;
BEGIN
  -- Get the home page ID
  SELECT id INTO home_page_id FROM public.pages WHERE slug = 'home';
  
  -- Create sections for home page
  -- Hero Section
  INSERT INTO public.sections (name, description)
  VALUES ('Hero', 'Main hero section with video background and headline')
  ON CONFLICT DO NOTHING;
  
  -- Insert hero content
  WITH hero_section AS (
    SELECT id FROM public.sections WHERE name = 'Hero' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    home_page_id,
    (SELECT id FROM hero_section),
    '{
      "heading": "Building Great Businesses Through Strategic Partnership",
      "subheading": "A leading private investment firm with a proven track record of creating value through strategic partnerships and operational excellence.",
      "backgroundVideo": "https://thinkenergy.au/tasman/tasman_capital_landing.mp4"
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Proven Track Record Section
  INSERT INTO public.sections (name, description)
  VALUES ('ProvenTrackRecord', 'Section showcasing track record and statistics')
  ON CONFLICT DO NOTHING;
  
  -- Insert proven track record content
  WITH proven_section AS (
    SELECT id FROM public.sections WHERE name = 'ProvenTrackRecord' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    home_page_id,
    (SELECT id FROM proven_section),
    '{
      "heading": "Proven Track Record",
      "description": "With over two decades of experience in private equity investment, Tasman Capital has established a strong track record of creating value through strategic partnerships and operational excellence.",
      "stats": [
        {
          "value": "20+",
          "label": "Years Experience"
        },
        {
          "value": "12",
          "label": "Platform Investments"
        },
        {
          "value": "60+",
          "label": "Add-on Acquisitions"
        },
        {
          "value": "9",
          "label": "Successful Exits"
        }
      ]
    }',
    2,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Past Investments Section
  INSERT INTO public.sections (name, description)
  VALUES ('PastInvestments', 'Section showcasing past investment highlights')
  ON CONFLICT DO NOTHING;
  
  -- Insert past investments content
  WITH investments_section AS (
    SELECT id FROM public.sections WHERE name = 'PastInvestments' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    home_page_id,
    (SELECT id FROM investments_section),
    '{
      "heading": "Investment Highlights",
      "description": "We focus on mid-market opportunities across Australia and New Zealand, partnering with management teams to drive operational improvements and strategic growth.",
      "investments": [
        {
          "name": "Serenitas",
          "description": "A leading operator and developer of over-50s lifestyle communities",
          "image": "https://thinkenergy.au/tasman/serenitas.png",
          "url": "https://www.serenitas.com.au"
        },
        {
          "name": "Tasman Holiday Parks",
          "description": "Leading manager of holiday park assets in Australia and New Zealand",
          "image": "https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp",
          "url": "https://tasmanholidayparks.com.au"
        },
        {
          "name": "Axicorp",
          "description": "A leading global foreign exchange trading platform",
          "image": "https://thinkenergy.au/tasman/pastdeals/Axicorp.webp",
          "url": "https://www.axi.com/au"
        }
      ],
      "ctaText": "View All Investments",
      "ctaLink": "/investments"
    }',
    3,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Performance Section
  INSERT INTO public.sections (name, description)
  VALUES ('Performance', 'Section showcasing performance metrics')
  ON CONFLICT DO NOTHING;
  
  -- Insert performance content
  WITH performance_section AS (
    SELECT id FROM public.sections WHERE name = 'Performance' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    home_page_id,
    (SELECT id FROM performance_section),
    '{
      "heading": "Performance",
      "description": "Our investment approach has consistently delivered strong returns across multiple economic cycles. We focus on creating sustainable value through operational improvements and strategic growth initiatives.",
      "metrics": [
        {
          "label": "Average IRR",
          "value": "25%+",
          "change": "positive"
        },
        {
          "label": "Average MOIC",
          "value": "3.0x+",
          "change": "positive"
        },
        {
          "label": "Average Hold Period",
          "value": "5 Years",
          "change": "neutral"
        }
      ]
    }',
    4,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Logo Showcase Section
  INSERT INTO public.sections (name, description)
  VALUES ('LogoShowcase', 'Section showcasing partner logos')
  ON CONFLICT DO NOTHING;
  
  -- Insert logo showcase content
  WITH logo_section AS (
    SELECT id FROM public.sections WHERE name = 'LogoShowcase' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    home_page_id,
    (SELECT id FROM logo_section),
    '{
      "heading": "Our Partners",
      "logos": [
        {
          "name": "Serenitas",
          "logo": "https://thinkenergy.au/tasman/serenitas.png",
          "url": "https://www.serenitas.com.au"
        },
        {
          "name": "Tasman Holiday Parks",
          "logo": "https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp",
          "url": "https://tasmanholidayparks.com.au"
        },
        {
          "name": "Axicorp",
          "logo": "https://thinkenergy.au/tasman/pastdeals/Axicorp.webp",
          "url": "https://www.axi.com/au"
        },
        {
          "name": "Bledisloe",
          "logo": "https://thinkenergy.au/tasman/pastdeals/BL+LOGO.png",
          "url": "https://www.invocare.com.au/"
        },
        {
          "name": "FleetPartners",
          "logo": "https://thinkenergy.au/tasman/pastdeals/FP.png",
          "url": "https://www.fleetpartners.com.au"
        },
        {
          "name": "Healthcare Australia",
          "logo": "https://thinkenergy.au/tasman/pastdeals/HCA.png",
          "url": "https://www.healthcareaustralia.com.au"
        }
      ]
    }',
    5,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000004_seed_home_page.sql ==========

-- ========== START OF 20250325000005_seed_about_page.sql ==========

/*
  # Seed About Page Content

  1. Changes
    - Insert About page sections
    - Create content for Who We Are section
    - Create content for History Timeline section
    - Create content for Values section
*/

-- Get page ID for about page
DO $$
DECLARE
  about_page_id UUID;
BEGIN
  -- Get the about page ID
  SELECT id INTO about_page_id FROM public.pages WHERE slug = 'about';
  
  -- Create sections for about page
  -- Who We Are Section
  INSERT INTO public.sections (name, description)
  VALUES ('WhoWeAre', 'Main section introducing the company')
  ON CONFLICT DO NOTHING;
  
  -- Insert who we are content
  WITH who_we_are_section AS (
    SELECT id FROM public.sections WHERE name = 'WhoWeAre' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    about_page_id,
    (SELECT id FROM who_we_are_section),
    '{
      "heading": "Who we are",
      "description": "A leading private investment firm focused on partnering with exceptional management teams to build great businesses across Australia and New Zealand.\n\nLike Abel Tasman, Tasman Capital is at the forefront of identifying and capitalising on new opportunities on both sides of the Tasman Sea; in Australia and New Zealand.",
      "backgroundImage": "https://thinkenergy.au/tasman/tasman_captal_about.JPG"
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- History Timeline Section
  INSERT INTO public.sections (name, description)
  VALUES ('HistoryTimeline', 'Section showcasing company history timeline')
  ON CONFLICT DO NOTHING;
  
  -- Insert history timeline content
  WITH timeline_section AS (
    SELECT id FROM public.sections WHERE name = 'HistoryTimeline' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    about_page_id,
    (SELECT id FROM timeline_section),
    '{
      "heading": "Our History",
      "description": "From our founding in 1999 to present day, explore the key milestones that have shaped Tasman Capital''s journey in private investment.",
      "events": [
        {
          "year": "1999",
          "title": "Foundation",
          "description": "Tasman Capital was founded with a focus on private equity investments in Australia and New Zealand."
        },
        {
          "year": "2003",
          "title": "First Investment",
          "description": "Completed first major investment in Loscam, a leading pallet pooling business in Asia Pacific."
        },
        {
          "year": "2005",
          "title": "First Exit",
          "description": "Successfully exited Loscam investment with strong returns."
        },
        {
          "year": "2008",
          "title": "Expansion",
          "description": "Expanded team and investment focus to include more sectors across Australia and New Zealand."
        },
        {
          "year": "2011",
          "title": "Lifestyle Communities",
          "description": "Entered the residential land lease community sector with investment in Tasman Lifestyle Continuum."
        },
        {
          "year": "2016",
          "title": "Financial Services",
          "description": "Expanded into financial services with investment in Axicorp."
        },
        {
          "year": "2019",
          "title": "Tourism Sector",
          "description": "Entered tourism sector with investment in Tasman Holiday Parks."
        },
        {
          "year": "2024",
          "title": "Continued Growth",
          "description": "Successful exit of Serenitas and formation of Tasman Serenitas Continuation Fund alongside Pacific Equity Partners SAF II & Mirvac."
        }
      ]
    }',
    2,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Values Section
  INSERT INTO public.sections (name, description)
  VALUES ('Values', 'Section showcasing company values')
  ON CONFLICT DO NOTHING;
  
  -- Insert values content
  WITH values_section AS (
    SELECT id FROM public.sections WHERE name = 'Values' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    about_page_id,
    (SELECT id FROM values_section),
    '{
      "heading": "Our Values",
      "description": "At Tasman Capital, we are guided by a set of core principles that define our investment philosophy and approach to value creation. Our commitment to operational excellence, strategic growth, and sustainable partnerships has been the cornerstone of our success across Australia and New Zealand.",
      "values": [
        {
          "title": "Strategic Partnership",
          "description": "We forge deep, collaborative relationships with management teams, providing not just capital, but strategic guidance, operational expertise, and access to our extensive network across the region.",
          "points": [
            "Management team collaboration",
            "Strategic guidance and expertise",
            "Regional network access"
          ]
        },
        {
          "title": "Value Creation",
          "description": "Our approach combines disciplined investment strategy with hands-on operational improvement.",
          "points": [
            "Defensive: Non-discretionary businesses resilient through economic cycles",
            "Operational: Improving underperforming businesses through cost and revenue initiatives",
            "Roll-ups: Consolidating sectors to create market leaders through strategic acquisitions"
          ]
        },
        {
          "title": "Long-term Vision",
          "description": "We take a patient, long-term approach to building sustainable businesses. Our track record of successful exits and strong returns is built on our ability to identify and execute transformative growth strategies.",
          "points": [
            "Sustainable business growth",
            "Proven track record of exits",
            "Transformative strategies"
          ]
        }
      ],
      "historicalImage": {
        "src": "https://thinkenergy.au/tasman/abel-tasman-map.JPG",
        "alt": "Abel Tasman''s Historical Map",
        "caption": "Like Abel Tasman''s pioneering voyages, we navigate uncharted territories in search of exceptional opportunities."
      }
    }',
    3,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000005_seed_about_page.sql ==========

-- ========== START OF 20250325000006_seed_investments_page.sql ==========

/*
  # Seed Investments Page Content

  1. Changes
    - Insert Investments page sections
    - Create content for Current Investments section
    - Create content for Realized Investments section
    - Create content for Investment Approach section
*/

-- Get page ID for investments page
DO $$
DECLARE
  investments_page_id UUID;
BEGIN
  -- Get the investments page ID
  SELECT id INTO investments_page_id FROM public.pages WHERE slug = 'investments';
  
  -- Create sections for investments page
  -- Investment Approach Section
  INSERT INTO public.sections (name, description)
  VALUES ('InvestmentApproach', 'Section describing investment strategy and approach')
  ON CONFLICT DO NOTHING;
  
  -- Insert investment approach content
  WITH approach_section AS (
    SELECT id FROM public.sections WHERE name = 'InvestmentApproach' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    investments_page_id,
    (SELECT id FROM approach_section),
    '{
      "heading": "Our Investment Approach",
      "description": "Tasman Capital focuses on mid-market opportunities across Australia and New Zealand. We partner with management teams to drive operational improvements and strategic growth.",
      "strategies": [
        {
          "title": "Defensive",
          "description": "Non-discretionary businesses resilient through economic cycles"
        },
        {
          "title": "Operational",
          "description": "Improving underperforming businesses through cost and revenue initiatives"
        },
        {
          "title": "Roll-ups",
          "description": "Consolidating sectors to create market leaders through strategic acquisitions"
        }
      ],
      "criteria": {
        "heading": "Investment Criteria",
        "items": [
          "Enterprise Value: $50M - $300M",
          "Sectors: Consumer, Healthcare, Financial Services, Business Services",
          "Geography: Australia and New Zealand",
          "Ownership: Control or significant minority positions",
          "Management: Strong teams with alignment of interests"
        ]
      }
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Current Investments Section
  INSERT INTO public.sections (name, description)
  VALUES ('CurrentInvestments', 'Section showcasing current investment portfolio')
  ON CONFLICT DO NOTHING;
  
  -- Insert current investments content
  WITH current_investments_section AS (
    SELECT id FROM public.sections WHERE name = 'CurrentInvestments' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    investments_page_id,
    (SELECT id FROM current_investments_section),
    '{
      "heading": "Current Investments",
      "description": "Our current portfolio represents partnerships with exceptional management teams across diverse sectors.",
      "investments": [
        {
          "name": "Serenitas",
          "id": "serenitas",
          "logo": "https://thinkenergy.au/tasman/serenitas.png",
          "type": "Current Investment",
          "url": "https://www.serenitas.com.au",
          "description": "A leading operator and developer of \"over-50s\" lifestyle communities",
          "sector": "Residential Land Lease Communities",
          "investment": "2011",
          "details": "Tasman Capital has partnered with Serenitas to develop and operate premium residential land lease communities for \"over-50s\" across Australia. The business has grown significantly through greenfield developments and strategic acquisitions."
        },
        {
          "name": "Tasman Holiday Parks",
          "id": "tasman-holiday-parks",
          "logo": "https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp",
          "type": "Current Investment",
          "url": "https://tasmanholidayparks.com.au",
          "description": "Leading manager of holiday park assets in Australia and New Zealand",
          "sector": "Tourism & Hospitality",
          "investment": "2019",
          "details": "Tasman Holiday Parks is a leading owner and operator of holiday parks across Australia and New Zealand. The business has expanded through strategic acquisitions and operational improvements to create a premium network of parks in key tourist destinations."
        }
      ]
    }',
    2,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Realized Investments Section
  INSERT INTO public.sections (name, description)
  VALUES ('RealizedInvestments', 'Section showcasing past investment exits')
  ON CONFLICT DO NOTHING;
  
  -- Insert realized investments content
  WITH realized_investments_section AS (
    SELECT id FROM public.sections WHERE name = 'RealizedInvestments' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    investments_page_id,
    (SELECT id FROM realized_investments_section),
    '{
      "heading": "Realized Investments",
      "description": "Our track record of successful exits demonstrates our ability to create value and deliver strong returns.",
      "investments": [
        {
          "name": "Axicorp",
          "id": "axicorp",
          "logo": "https://thinkenergy.au/tasman/pastdeals/Axicorp.webp",
          "type": "Realised Investment",
          "url": "https://www.axi.com/au",
          "description": "A leading global foreign exchange trading platform",
          "sector": "Financial Services",
          "investment": "2016",
          "exit": "2022",
          "details": "During our partnership, Axicorp expanded its global footprint, enhanced its technology platform, and significantly grew its client base across multiple regions."
        },
        {
          "name": "Bledisloe",
          "id": "bledisloe",
          "logo": "https://thinkenergy.au/tasman/pastdeals/BL+LOGO.png",
          "type": "Realised Investment",
          "url": "https://www.invocare.com.au/",
          "description": "Leading funeral services provider in Australia and New Zealand",
          "sector": "Funeral Services",
          "investment": "2006",
          "exit": "2011",
          "details": "Under Tasman Capital''s ownership, Bledisloe expanded its network of funeral homes and crematoria across Australia and New Zealand through organic growth and strategic acquisitions."
        },
        {
          "name": "FleetPartners",
          "id": "fleetpartners",
          "logo": "https://thinkenergy.au/tasman/pastdeals/FP.png",
          "type": "Realised Investment",
          "url": "https://www.fleetpartners.com.au",
          "description": "Leading vehicle leasing and fleet management company",
          "sector": "Financial Services",
          "investment": "2003",
          "exit": "2008",
          "details": "During our partnership, FleetPartners expanded its service offering and geographic reach to become one of the largest independent fleet management companies in Australia and New Zealand."
        },
        {
          "name": "Healthcare Australia",
          "id": "healthcare-australia",
          "logo": "https://thinkenergy.au/tasman/pastdeals/HCA.png",
          "type": "Realised Investment",
          "url": "https://www.healthcareaustralia.com.au",
          "description": "Leading healthcare staffing and services provider",
          "sector": "Healthcare",
          "investment": "2010",
          "exit": "2015",
          "details": "Under Tasman Capital''s ownership, Healthcare Australia expanded its service offering and geographic footprint to become the largest healthcare staffing provider in Australia."
        },
        {
          "name": "Loscam",
          "id": "loscam",
          "logo": "https://thinkenergy.au/tasman/pastdeals/Loscam.png",
          "type": "Realised Investment",
          "url": "https://www.loscam.com",
          "description": "Leading pallet pooling business in Asia Pacific",
          "sector": "Logistics",
          "investment": "2001",
          "exit": "2005",
          "details": "During our partnership, Loscam expanded its pallet pooling network across Asia Pacific and enhanced its service offering to become a leading provider in the region."
        },
        {
          "name": "Tasman Building Products",
          "id": "tasman-building-products",
          "logo": "https://thinkenergy.au/tasman/pastdeals/TBP.png",
          "type": "Realised Investment",
          "url": "#",
          "description": "Leading manufacturer and distributor of building products",
          "sector": "Building Materials",
          "investment": "2003",
          "exit": "2007",
          "details": "Under Tasman Capital''s ownership, Tasman Building Products expanded its product range and distribution network to become a leading supplier to the construction industry in Australia."
        }
      ]
    }',
    3,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Case Studies Section
  INSERT INTO public.sections (name, description)
  VALUES ('CaseStudies', 'Section showcasing detailed investment case studies')
  ON CONFLICT DO NOTHING;
  
  -- Insert case studies content
  WITH case_studies_section AS (
    SELECT id FROM public.sections WHERE name = 'CaseStudies' LIMIT 1
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    investments_page_id,
    (SELECT id FROM case_studies_section),
    '{
      "heading": "Case Studies",
      "description": "Explore how our strategic partnership approach has created value across our portfolio.",
      "caseStudies": [
        {
          "name": "Serenitas",
          "logo": "https://thinkenergy.au/tasman/serenitas.png",
          "challenge": "When we invested in Serenitas in 2011, the residential land lease community sector was fragmented with limited institutional investment.",
          "approach": "We partnered with the management team to develop a scalable platform for growth through both greenfield development and strategic acquisitions.",
          "results": [
            "Grew from 1 to 15 communities",
            "Developed industry-leading operational practices",
            "Created a premium brand in the \"over-50s\" lifestyle community sector",
            "Successful partial exit in 2024 with formation of Tasman Serenitas Continuation Fund alongside Pacific Equity Partners SAF II & Mirvac"
          ],
          "testimonial": {
            "quote": "Tasman Capital has been an invaluable partner in our growth journey, providing not just capital but strategic guidance and operational expertise.",
            "author": "CEO, Serenitas"
          }
        },
        {
          "name": "Tasman Holiday Parks",
          "logo": "https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp",
          "challenge": "The holiday park sector in Australia and New Zealand was highly fragmented with opportunities for consolidation and operational improvement.",
          "approach": "We built a platform for growth through strategic acquisitions of premium parks in key tourist destinations, combined with operational enhancements and brand development.",
          "results": [
            "Acquired and integrated over 20 holiday parks across Australia and New Zealand",
            "Implemented centralized booking and revenue management systems",
            "Developed premium accommodation offerings to drive yield improvement",
            "Created a recognized brand in the holiday park sector"
          ],
          "testimonial": {
            "quote": "Tasman Capital''s strategic vision and operational focus have been instrumental in transforming our business into a market leader.",
            "author": "CEO, Tasman Holiday Parks"
          }
        }
      ]
    }',
    4,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000006_seed_investments_page.sql ==========

-- ========== START OF 20250325000007_seed_team_page.sql ==========

/*
  # Seed Team Page Content

  1. Changes
    - Insert Team page sections
    - Create content for Team Members section
    - Create content for Team Overview section
*/

-- Get page ID for team page
DO $$
DECLARE
  team_page_id UUID;
BEGIN
  -- Get the team page ID
  SELECT id INTO team_page_id FROM public.pages WHERE slug = 'team';
  
  -- Create sections for team page
  -- Team Overview Section
  INSERT INTO public.sections (name, description)
  VALUES ('TeamOverview', 'Section introducing the team')
  ON CONFLICT DO NOTHING;
  
  -- Insert team overview content
  WITH overview_section AS (
    SELECT id FROM public.sections WHERE name = 'TeamOverview'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    team_page_id,
    (SELECT id FROM overview_section),
    '{
      "heading": "Our Team",
      "description": "Tasman Capital''s team brings together decades of experience in private equity, mergers & acquisitions, and operational management. Our diverse backgrounds and complementary skill sets enable us to identify unique opportunities and create value across our portfolio.",
      "backgroundImage": "https://thinkenergy.au/tasman/tasman_capital_team.jpg"
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Team Members Section
  INSERT INTO public.sections (name, description)
  VALUES ('TeamMembers', 'Section showcasing team member profiles')
  ON CONFLICT DO NOTHING;
  
  -- Insert team members content
  WITH members_section AS (
    SELECT id FROM public.sections WHERE name = 'TeamMembers'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    team_page_id,
    (SELECT id FROM members_section),
    '{
      "heading": "Leadership Team",
      "description": "Meet the experienced professionals leading Tasman Capital''s investment strategy and portfolio management.",
      "members": [
        {
          "id": "rob-nichols",
          "name": "Rob Nichols",
          "role": "Managing Partner",
          "image": "https://thinkenergy.au/tasman/team/1.jpg",
          "summary": "Rob co-founded Tasman Capital in 2008 and has over 25 years of experience in private equity and investment banking.",
          "details": [
            "Prior to Tasman Capital, Rob was a Managing Director at Catalyst Investment Managers, where he led numerous successful investments across various sectors.",
            "Rob began his career in investment banking at Macquarie Bank, where he worked on M&A transactions and capital raisings.",
            "He holds a Bachelor of Commerce and a Bachelor of Laws from the University of New South Wales, and is a Fellow of the Financial Services Institute of Australasia."
          ],
          "linkedin": "https://www.linkedin.com/in/rob-nichols/"
        },
        {
          "id": "craig-cartner",
          "name": "Craig Cartner",
          "role": "Partner",
          "image": "https://thinkenergy.au/tasman/team/2.jpg",
          "summary": "Craig joined Tasman Capital in 2010 and has over 20 years of experience in private equity, corporate finance, and operational management.",
          "details": [
            "Before joining Tasman Capital, Craig was an Investment Director at Archer Capital, where he was involved in numerous successful investments across healthcare, consumer, and business services sectors.",
            "Craig previously held senior roles at PwC Corporate Finance and KPMG, advising on M&A transactions and corporate restructurings.",
            "He holds a Bachelor of Commerce from the University of Melbourne and is a Chartered Accountant."
          ],
          "linkedin": "https://www.linkedin.com/in/craig-cartner/"
        },
        {
          "id": "michael-lukin",
          "name": "Michael Lukin",
          "role": "Partner",
          "image": "https://thinkenergy.au/tasman/team/3.jpg",
          "summary": "Michael joined Tasman Capital in 2012 and has over 15 years of experience in private equity and investment banking.",
          "details": [
            "Prior to Tasman Capital, Michael was an Investment Director at Pacific Equity Partners, where he worked on investments across consumer, healthcare, and business services sectors.",
            "Michael began his career in investment banking at Goldman Sachs, where he advised on M&A transactions and capital raisings.",
            "He holds a Bachelor of Commerce and a Bachelor of Engineering (Honours) from the University of Sydney."
          ],
          "linkedin": "https://www.linkedin.com/in/michael-lukin/"
        },
        {
          "id": "david-jenkins",
          "name": "David Jenkins",
          "role": "Investment Director",
          "image": "https://thinkenergy.au/tasman/team/4.jpg",
          "summary": "David joined Tasman Capital in 2015 and has over 10 years of experience in private equity and corporate finance.",
          "details": [
            "Before joining Tasman Capital, David was an Associate at Bain Capital, where he worked on investments across various sectors in Australia and New Zealand.",
            "David previously worked in the investment banking division of UBS, advising on M&A transactions and capital raisings.",
            "He holds a Bachelor of Commerce (Honours) from the University of Melbourne and is a CFA Charterholder."
          ],
          "linkedin": "https://www.linkedin.com/in/david-jenkins/"
        },
        {
          "id": "sarah-thompson",
          "name": "Sarah Thompson",
          "role": "Investment Director",
          "image": "https://thinkenergy.au/tasman/team/5.jpg",
          "summary": "Sarah joined Tasman Capital in 2016 and has over 10 years of experience in private equity and strategy consulting.",
          "details": [
            "Prior to Tasman Capital, Sarah was a Senior Associate at KKR, where she worked on investments across consumer, healthcare, and technology sectors.",
            "Sarah previously worked at McKinsey & Company, advising clients on corporate strategy and operational improvement.",
            "She holds a Bachelor of Commerce and a Bachelor of Laws (Honours) from the University of Sydney."
          ],
          "linkedin": "https://www.linkedin.com/in/sarah-thompson/"
        },
        {
          "id": "james-wilson",
          "name": "James Wilson",
          "role": "Investment Manager",
          "image": "https://thinkenergy.au/tasman/team/6.jpg",
          "summary": "James joined Tasman Capital in 2018 and has over 8 years of experience in private equity and investment banking.",
          "details": [
            "Before joining Tasman Capital, James was an Associate at Quadrant Private Equity, where he worked on investments across consumer, healthcare, and business services sectors.",
            "James previously worked in the investment banking division of Macquarie Capital, advising on M&A transactions and capital raisings.",
            "He holds a Bachelor of Commerce and a Bachelor of Engineering (Honours) from the University of Melbourne."
          ],
          "linkedin": "https://www.linkedin.com/in/james-wilson/"
        }
      ]
    }',
    2,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Advisory Board Section
  INSERT INTO public.sections (name, description)
  VALUES ('AdvisoryBoard', 'Section showcasing advisory board members')
  ON CONFLICT DO NOTHING;
  
  -- Insert advisory board content
  WITH advisory_section AS (
    SELECT id FROM public.sections WHERE name = 'AdvisoryBoard'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    team_page_id,
    (SELECT id FROM advisory_section),
    '{
      "heading": "Advisory Board",
      "description": "Our advisory board brings together industry leaders with deep expertise across our target sectors, providing strategic guidance and valuable insights to our investment team.",
      "members": [
        {
          "id": "john-smith",
          "name": "John Smith",
          "role": "Chairman",
          "image": "https://thinkenergy.au/tasman/team/7.jpg",
          "summary": "John has over 35 years of experience in private equity, investment banking, and corporate governance.",
          "details": [
            "John was previously the CEO of a major Australian financial services group and has served on the boards of numerous ASX-listed companies.",
            "He brings extensive experience in corporate governance, strategic planning, and capital allocation.",
            "John holds a Bachelor of Economics from the University of Sydney and is a Fellow of the Australian Institute of Company Directors."
          ],
          "linkedin": "https://www.linkedin.com/in/john-smith/"
        },
        {
          "id": "elizabeth-brown",
          "name": "Elizabeth Brown",
          "role": "Advisory Board Member",
          "image": "https://thinkenergy.au/tasman/team/8.jpg",
          "summary": "Elizabeth has over 30 years of experience in healthcare management and investment.",
          "details": [
            "Elizabeth was previously the CEO of a major healthcare provider and has served on the boards of several healthcare and life sciences companies.",
            "She brings deep industry knowledge and operational expertise in the healthcare sector.",
            "Elizabeth holds a Bachelor of Medicine and Bachelor of Surgery from the University of Queensland and an MBA from Harvard Business School."
          ],
          "linkedin": "https://www.linkedin.com/in/elizabeth-brown/"
        },
        {
          "id": "richard-lee",
          "name": "Richard Lee",
          "role": "Advisory Board Member",
          "image": "https://thinkenergy.au/tasman/team/9.jpg",
          "summary": "Richard has over 25 years of experience in technology and digital transformation.",
          "details": [
            "Richard was previously the CTO of a major technology company and has advised numerous businesses on digital strategy and technology implementation.",
            "He brings expertise in technology trends, digital transformation, and innovation.",
            "Richard holds a Bachelor of Science in Computer Science from the University of Melbourne and an MBA from INSEAD."
          ],
          "linkedin": "https://www.linkedin.com/in/richard-lee/"
        }
      ]
    }',
    3,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Careers Section
  INSERT INTO public.sections (name, description)
  VALUES ('Careers', 'Section for career opportunities')
  ON CONFLICT DO NOTHING;
  
  -- Insert careers content
  WITH careers_section AS (
    SELECT id FROM public.sections WHERE name = 'Careers'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    team_page_id,
    (SELECT id FROM careers_section),
    '{
      "heading": "Join Our Team",
      "description": "We are always looking for talented individuals to join our team. If you are passionate about private equity and want to work in a dynamic and collaborative environment, we''d love to hear from you.",
      "openPositions": [
        {
          "title": "Investment Associate",
          "location": "Sydney",
          "type": "Full-time",
          "description": "We are seeking an Investment Associate to join our team in Sydney. The successful candidate will be involved in all aspects of the investment process, including deal sourcing, due diligence, transaction execution, and portfolio management.",
          "requirements": [
            "3-5 years of experience in private equity, investment banking, or management consulting",
            "Strong analytical and financial modeling skills",
            "Excellent communication and interpersonal skills",
            "Bachelor''s degree in finance, economics, or related field"
          ],
          "applyLink": "mailto:careers@tasmancapital.com.au?subject=Investment Associate Application"
        },
        {
          "title": "Portfolio Operations Manager",
          "location": "Melbourne",
          "type": "Full-time",
          "description": "We are seeking a Portfolio Operations Manager to work closely with our investment team and portfolio company management teams to drive operational improvements and value creation initiatives.",
          "requirements": [
            "5+ years of experience in management consulting, private equity operations, or similar roles",
            "Strong project management and leadership skills",
            "Experience in operational improvement and value creation",
            "Bachelor''s degree in business, engineering, or related field"
          ],
          "applyLink": "mailto:careers@tasmancapital.com.au?subject=Portfolio Operations Manager Application"
        }
      ],
      "generalApplications": {
        "description": "If you don''t see a position that matches your skills and experience but are interested in joining our team, we encourage you to submit a general application.",
        "applyLink": "mailto:careers@tasmancapital.com.au?subject=General Application"
      }
    }',
    4,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000007_seed_team_page.sql ==========

-- ========== START OF 20250325000008_seed_contact_page.sql ==========

/*
  # Seed Contact Page Content

  1. Changes
    - Insert Contact page sections
    - Create content for Contact Information section
    - Create content for Contact Form section
    - Create content for Office Locations section
*/

-- Get page ID for contact page
DO $$
DECLARE
  contact_page_id UUID;
BEGIN
  -- Get the contact page ID
  SELECT id INTO contact_page_id FROM public.pages WHERE slug = 'contact';
  
  -- Create sections for contact page
  -- Contact Information Section
  INSERT INTO public.sections (name, description)
  VALUES ('ContactInformation', 'Section with contact details and information')
  ON CONFLICT DO NOTHING;
  
  -- Insert contact information content
  WITH info_section AS (
    SELECT id FROM public.sections WHERE name = 'ContactInformation'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    contact_page_id,
    (SELECT id FROM info_section),
    '{
      "heading": "Contact Us",
      "description": "We welcome inquiries from management teams, business owners, and advisors regarding potential investment opportunities or partnerships.",
      "contactTypes": [
        {
          "title": "Investment Opportunities",
          "description": "If you are a business owner or advisor looking to discuss a potential investment opportunity, please contact our investment team.",
          "email": "investments@tasmancapital.com.au",
          "phone": "+61 2 9252 2222"
        },
        {
          "title": "Portfolio Companies",
          "description": "For inquiries related to our portfolio companies, please contact our portfolio management team.",
          "email": "portfolio@tasmancapital.com.au",
          "phone": "+61 2 9252 2223"
        },
        {
          "title": "Media Inquiries",
          "description": "For media inquiries or press-related matters, please contact our communications team.",
          "email": "media@tasmancapital.com.au",
          "phone": "+61 2 9252 2224"
        },
        {
          "title": "General Inquiries",
          "description": "For all other inquiries, please contact our main office.",
          "email": "info@tasmancapital.com.au",
          "phone": "+61 2 9252 2222"
        }
      ]
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Office Locations Section
  INSERT INTO public.sections (name, description)
  VALUES ('OfficeLocations', 'Section showcasing office locations')
  ON CONFLICT DO NOTHING;
  
  -- Insert office locations content
  WITH locations_section AS (
    SELECT id FROM public.sections WHERE name = 'OfficeLocations'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    contact_page_id,
    (SELECT id FROM locations_section),
    '{
      "heading": "Our Offices",
      "offices": [
        {
          "city": "Sydney",
          "address": "Level 5, 50 Carrington Street, Sydney NSW 2000",
          "phone": "+61 2 9252 2222",
          "email": "sydney@tasmancapital.com.au",
          "coordinates": {
            "lat": -33.8651,
            "lng": 151.2099
          },
          "isHeadquarters": true
        },
        {
          "city": "Melbourne",
          "address": "Level 20, 101 Collins Street, Melbourne VIC 3000",
          "phone": "+61 3 9653 7777",
          "email": "melbourne@tasmancapital.com.au",
          "coordinates": {
            "lat": -37.8136,
            "lng": 144.9631
          },
          "isHeadquarters": false
        },
        {
          "city": "Auckland",
          "address": "Level 15, 188 Quay Street, Auckland 1010, New Zealand",
          "phone": "+64 9 379 8888",
          "email": "auckland@tasmancapital.com.au",
          "coordinates": {
            "lat": -36.8422,
            "lng": 174.7629
          },
          "isHeadquarters": false
        }
      ]
    }',
    2,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Contact Form Section
  INSERT INTO public.sections (name, description)
  VALUES ('ContactForm', 'Section with contact form')
  ON CONFLICT DO NOTHING;
  
  -- Insert contact form content
  WITH form_section AS (
    SELECT id FROM public.sections WHERE name = 'ContactForm'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    contact_page_id,
    (SELECT id FROM form_section),
    '{
      "heading": "Get in Touch",
      "description": "Complete the form below and a member of our team will be in touch shortly.",
      "formFields": [
        {
          "id": "name",
          "label": "Name",
          "type": "text",
          "placeholder": "Your name",
          "required": true
        },
        {
          "id": "email",
          "label": "Email",
          "type": "email",
          "placeholder": "Your email address",
          "required": true
        },
        {
          "id": "phone",
          "label": "Phone",
          "type": "tel",
          "placeholder": "Your phone number",
          "required": false
        },
        {
          "id": "company",
          "label": "Company",
          "type": "text",
          "placeholder": "Your company name",
          "required": false
        },
        {
          "id": "inquiryType",
          "label": "Inquiry Type",
          "type": "select",
          "options": [
            "Investment Opportunity",
            "Portfolio Company",
            "Media Inquiry",
            "General Inquiry",
            "Other"
          ],
          "required": true
        },
        {
          "id": "message",
          "label": "Message",
          "type": "textarea",
          "placeholder": "Please provide details of your inquiry",
          "required": true
        }
      ],
      "submitButtonText": "Submit",
      "successMessage": "Thank you for your message. We will be in touch shortly.",
      "errorMessage": "There was an error submitting your message. Please try again."
    }',
    3,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000008_seed_contact_page.sql ==========

-- ========== START OF 20250325000009_seed_legal_pages.sql ==========

/*
  # Seed Legal Pages Content

  1. Changes
    - Insert Privacy Policy page content
    - Insert Terms of Use page content
*/

-- Get page IDs for legal pages
DO $$
DECLARE
  privacy_page_id UUID;
  terms_page_id UUID;
BEGIN
  -- Get the privacy policy page ID
  SELECT id INTO privacy_page_id FROM public.pages WHERE slug = 'privacy-policy';
  
  -- Get the terms of use page ID
  SELECT id INTO terms_page_id FROM public.pages WHERE slug = 'terms-of-use';
  
  -- Create sections for legal pages
  -- Privacy Policy Section
  INSERT INTO public.sections (name, description)
  VALUES ('PrivacyPolicy', 'Section containing privacy policy content')
  ON CONFLICT DO NOTHING;
  
  -- Insert privacy policy content
  WITH privacy_section AS (
    SELECT id FROM public.sections WHERE name = 'PrivacyPolicy'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    privacy_page_id,
    (SELECT id FROM privacy_section),
    '{
      "heading": "Privacy Policy",
      "lastUpdated": "March 1, 2024",
      "introduction": "At Tasman Capital, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or communicate with us.",
      "sections": [
        {
          "title": "Information We Collect",
          "content": "We may collect personal information that you voluntarily provide to us when you contact us, subscribe to our newsletter, or participate in other activities on our website. The personal information we collect may include your name, email address, phone number, company name, and any other information you choose to provide.\n\nWe may also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about your usage of our website."
        },
        {
          "title": "How We Use Your Information",
          "content": "We may use the information we collect for various purposes, including to:\n\n- Provide, maintain, and improve our website\n- Respond to your inquiries and provide customer service\n- Send you newsletters, updates, and marketing communications\n- Monitor and analyze usage patterns and trends\n- Protect against, identify, and prevent fraud and other unlawful activity\n- Comply with legal obligations"
        },
        {
          "title": "Disclosure of Your Information",
          "content": "We may share your information with third parties in certain circumstances, including:\n\n- With service providers who perform services on our behalf\n- To comply with legal obligations\n- To protect and defend our rights and property\n- With your consent or at your direction"
        },
        {
          "title": "Security of Your Information",
          "content": "We use reasonable security measures designed to protect your information. However, no security system is impenetrable, and we cannot guarantee the security of our systems or your information."
        },
        {
          "title": "Your Choices",
          "content": "You may opt out of receiving marketing communications from us by following the unsubscribe instructions included in these communications. You may also update your personal information by contacting us."
        },
        {
          "title": "Changes to This Privacy Policy",
          "content": "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date."
        },
        {
          "title": "Contact Us",
          "content": "If you have any questions about this Privacy Policy, please contact us at:\n\nTasman Capital\nLevel 5, 50 Carrington Street\nSydney NSW 2000\nAustralia\nEmail: privacy@tasmancapital.com.au\nPhone: +61 2 9252 2222"
        }
      ]
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
  
  -- Terms of Use Section
  INSERT INTO public.sections (name, description)
  VALUES ('TermsOfUse', 'Section containing terms of use content')
  ON CONFLICT DO NOTHING;
  
  -- Insert terms of use content
  WITH terms_section AS (
    SELECT id FROM public.sections WHERE name = 'TermsOfUse'
  )
  INSERT INTO public.page_content (page_id, section_id, content, position, is_published)
  VALUES (
    terms_page_id,
    (SELECT id FROM terms_section),
    '{
      "heading": "Terms of Use",
      "lastUpdated": "March 1, 2024",
      "introduction": "Welcome to the Tasman Capital website. By accessing or using our website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.",
      "sections": [
        {
          "title": "Use of Website",
          "content": "You may use our website for lawful purposes and in accordance with these Terms of Use. You agree not to use our website:\n\n- In any way that violates any applicable federal, state, local, or international law or regulation\n- To transmit, or procure the sending of, any advertising or promotional material without our prior written consent\n- To impersonate or attempt to impersonate Tasman Capital, a Tasman Capital employee, or any other person or entity\n- To engage in any other conduct that restricts or inhibits anyone''s use or enjoyment of the website"
        },
        {
          "title": "Intellectual Property Rights",
          "content": "The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Tasman Capital, its licensors, or other providers of such material and are protected by Australian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws."
        },
        {
          "title": "Disclaimer of Warranties",
          "content": "Your use of the website is at your own risk. The website and its content are provided on an \"as is\" and \"as available\" basis, without any warranties of any kind, either express or implied. Neither Tasman Capital nor any person associated with Tasman Capital makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the website."
        },
        {
          "title": "Limitation of Liability",
          "content": "In no event will Tasman Capital, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website, any websites linked to it, any content on the website or such other websites, including any direct, indirect, special, incidental, consequential, or punitive damages."
        },
        {
          "title": "Indemnification",
          "content": "You agree to defend, indemnify, and hold harmless Tasman Capital, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys'' fees) arising out of or relating to your violation of these Terms of Use or your use of the website."
        },
        {
          "title": "Changes to the Terms of Use",
          "content": "We may revise and update these Terms of Use from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the website following the posting of revised Terms of Use means that you accept and agree to the changes."
        },
        {
          "title": "Contact Us",
          "content": "If you have any questions about these Terms of Use, please contact us at:\n\nTasman Capital\nLevel 5, 50 Carrington Street\nSydney NSW 2000\nAustralia\nEmail: legal@tasmancapital.com.au\nPhone: +61 2 9252 2222"
        }
      ]
    }',
    1,
    true
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ========== END OF 20250325000009_seed_legal_pages.sql ==========

-- ========== START OF 20250325000010_seed_theme_styles.sql ==========

/*
  # Seed Theme Styles and CSS Variables

  1. Changes
    - Create themes table
    - Add CSS variables for light and dark themes
    - Add typography styles
    - Add component-specific styles
*/

-- First, drop the themes table if it exists to avoid column issues
DROP TABLE IF EXISTS public.themes;

-- Create themes table with all required columns
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  variables JSONB NOT NULL,
  typography JSONB NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on themes
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- RLS policies for themes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Anyone can view themes'
  ) THEN
    CREATE POLICY "Anyone can view themes"
      ON public.themes
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can insert themes'
  ) THEN
    CREATE POLICY "Admin users can insert themes"
      ON public.themes
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can update themes'
  ) THEN
    CREATE POLICY "Admin users can update themes"
      ON public.themes
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'themes' AND policyname = 'Admin users can delete themes'
  ) THEN
    CREATE POLICY "Admin users can delete themes"
      ON public.themes
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Seed default theme with CSS variables
INSERT INTO public.themes (name, description, is_default, variables, typography, components)
VALUES (
  'Default Theme', 
  'Default Tasman Capital theme with light and dark mode support', 
  true,
  '{
    "light": {
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
      "--card": "255 255 255",
      "--card-foreground": "20 20 20",
      "--destructive": "220 38 38",
      "--destructive-foreground": "255 255 255",
      "--success": "22 163 74",
      "--success-foreground": "255 255 255",
      "--warning": "234 179 8",
      "--warning-foreground": "20 20 20"
    },
    "dark": {
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
      "--card": "10 10 25",
      "--card-foreground": "255 255 255",
      "--destructive": "220 38 38",
      "--destructive-foreground": "255 255 255",
      "--success": "22 163 74",
      "--success-foreground": "255 255 255",
      "--warning": "234 179 8",
      "--warning-foreground": "20 20 20"
    }
  }'::jsonb,
  '{
    "fontFamily": {
      "sans": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
      "serif": "Georgia, Cambria, \"Times New Roman\", Times, serif",
      "mono": "Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem"
    },
    "fontWeight": {
      "thin": "100",
      "extralight": "200",
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800",
      "black": "900"
    },
    "lineHeight": {
      "none": "1",
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "letterSpacing": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0em",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  }'::jsonb,
  '{
    "hero": {
      "container": {
        "padding": "6rem 1.5rem",
        "maxWidth": "1280px",
        "margin": "0 auto",
        "textAlign": "center",
        "position": "relative",
        "overflow": "hidden"
      },
      "heading": {
        "fontSize": "3.75rem",
        "fontWeight": "700",
        "lineHeight": "1.2",
        "marginBottom": "1.5rem",
        "color": "rgb(var(--foreground))"
      },
      "subheading": {
        "fontSize": "1.25rem",
        "fontWeight": "400",
        "lineHeight": "1.5",
        "marginBottom": "2rem",
        "maxWidth": "800px",
        "margin": "0 auto 2rem",
        "color": "rgb(var(--foreground))"
      },
      "backgroundVideo": {
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "objectFit": "cover",
        "zIndex": "-1"
      },
      "overlay": {
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "backgroundColor": "rgba(0, 0, 0, 0.5)",
        "zIndex": "-1"
      },
      "button": {
        "backgroundColor": "rgb(var(--primary))",
        "color": "rgb(var(--primary-foreground))",
        "padding": "0.75rem 1.5rem",
        "borderRadius": "0.25rem",
        "fontWeight": "500",
        "textDecoration": "none",
        "display": "inline-block",
        "transition": "background-color 0.2s ease",
        "hover": {
          "backgroundColor": "rgb(var(--accent))"
        }
      }
    },
    "section": {
      "container": {
        "padding": "4rem 1.5rem",
        "maxWidth": "1280px",
        "margin": "0 auto"
      },
      "heading": {
        "fontSize": "2.25rem",
        "fontWeight": "700",
        "lineHeight": "1.2",
        "marginBottom": "1.5rem",
        "color": "rgb(var(--foreground))"
      },
      "subheading": {
        "fontSize": "1.125rem",
        "fontWeight": "400",
        "lineHeight": "1.5",
        "marginBottom": "2rem",
        "color": "rgb(var(--foreground))"
      }
    },
    "footer": {
      "container": {
        "backgroundColor": "rgb(var(--secondary))",
        "color": "rgb(var(--secondary-foreground))",
        "padding": "4rem 1.5rem 2rem"
      },
      "logo": {
        "height": "2.5rem",
        "marginBottom": "2rem"
      },
      "inner": {
        "display": "flex",
        "flexWrap": "wrap",
        "justifyContent": "space-between",
        "maxWidth": "1280px",
        "margin": "0 auto",
        "gap": "2rem"
      },
      "section": {
        "flex": "1",
        "minWidth": "250px"
      },
      "heading": {
        "fontSize": "1.125rem",
        "fontWeight": "600",
        "marginBottom": "1rem"
      },
      "link": {
        "display": "block",
        "marginBottom": "0.5rem",
        "color": "rgb(var(--secondary-foreground))",
        "opacity": "0.8",
        "textDecoration": "none",
        "transition": "opacity 0.2s ease",
        "hover": {
          "opacity": "1"
        }
      },
      "copyright": {
        "textAlign": "center",
        "marginTop": "3rem",
        "padding": "1.5rem 0 0",
        "borderTop": "1px solid rgba(var(--border), 0.5)",
        "opacity": "0.7",
        "fontSize": "0.875rem"
      }
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE 
SET 
  description = EXCLUDED.description,
  is_default = EXCLUDED.is_default,
  variables = EXCLUDED.variables,
  typography = EXCLUDED.typography,
  components = EXCLUDED.components,
  updated_at = now();


-- ========== END OF 20250325000010_seed_theme_styles.sql ==========

-- ========== START OF 20250325000011_page_templates.sql ==========

/*
  # Page Templates

  1. Changes
    - Create page_templates table
    - Add basic templates (Standard, Landing, Content, etc.)
    - Add template sections and structure
    - Enable template selection when creating pages
*/

-- Create page_templates table
CREATE TABLE IF NOT EXISTS public.page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on page_templates
ALTER TABLE IF EXISTS public.page_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for page_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_templates' AND policyname = 'Anyone can view page templates'
  ) THEN
    CREATE POLICY "Anyone can view page templates"
      ON public.page_templates
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_templates' AND policyname = 'Admin users can insert page templates'
  ) THEN
    CREATE POLICY "Admin users can insert page templates"
      ON public.page_templates
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_templates' AND policyname = 'Admin users can update page templates'
  ) THEN
    CREATE POLICY "Admin users can update page templates"
      ON public.page_templates
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_templates' AND policyname = 'Admin users can delete page templates'
  ) THEN
    CREATE POLICY "Admin users can delete page templates"
      ON public.page_templates
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Add template_id to pages table if it doesn't exist
ALTER TABLE IF EXISTS public.pages
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.page_templates(id);

-- Seed standard page templates
INSERT INTO public.page_templates (name, slug, description, structure, thumbnail)
VALUES 
(
  'Standard Page', 
  'standard-page', 
  'A standard page with header, content sections, and footer', 
  '{
    "layout": "default",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sections": [
      {
        "name": "Hero",
        "type": "hero",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Page Title",
          "subheading": "Page description goes here",
          "backgroundImage": null,
          "backgroundVideo": null,
          "alignment": "center"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "Content",
        "type": "content",
        "required": false,
        "limit": null,
        "defaultContent": {
          "heading": "Section Heading",
          "content": "<p>Add your content here.</p>"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "CallToAction",
        "type": "cta",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Ready to get started?",
          "subheading": "Contact us today to learn more about our services.",
          "buttonText": "Contact Us",
          "buttonLink": "/contact"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--secondary))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/standard-page.jpg'
),
(
  'Landing Page', 
  'landing-page', 
  'A landing page focused on conversion with hero, features, testimonials, and CTA', 
  '{
    "layout": "default",
    "header": {
      "type": "minimal",
      "showLogo": true,
      "showNavigation": false
    },
    "sections": [
      {
        "name": "Hero",
        "type": "hero",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Your Compelling Headline",
          "subheading": "A brief description of your value proposition",
          "backgroundImage": null,
          "backgroundVideo": null,
          "alignment": "center",
          "buttonText": "Get Started",
          "buttonLink": "#features"
        },
        "styles": {
          "padding": "8rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "Features",
        "type": "features",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Key Features",
          "subheading": "Why choose our solution",
          "features": [
            {
              "icon": "star",
              "title": "Feature 1",
              "description": "Description of feature 1"
            },
            {
              "icon": "shield",
              "title": "Feature 2",
              "description": "Description of feature 2"
            },
            {
              "icon": "zap",
              "title": "Feature 3",
              "description": "Description of feature 3"
            }
          ]
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "Testimonials",
        "type": "testimonials",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "What Our Clients Say",
          "testimonials": [
            {
              "quote": "This is an amazing service that has transformed our business.",
              "author": "John Doe",
              "company": "ABC Company"
            },
            {
              "quote": "We have seen incredible results since implementing this solution.",
              "author": "Jane Smith",
              "company": "XYZ Corp"
            }
          ]
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "backgroundColor": "rgb(var(--secondary))"
        }
      },
      {
        "name": "CallToAction",
        "type": "cta",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Ready to Transform Your Business?",
          "subheading": "Get started today and see the difference.",
          "buttonText": "Sign Up Now",
          "buttonLink": "/contact"
        },
        "styles": {
          "padding": "8rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--primary))",
          "color": "rgb(var(--primary-foreground))"
        }
      }
    ],
    "footer": {
      "type": "minimal",
      "showLogo": true,
      "showNavigation": false,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/landing-page.jpg'
),
(
  'Content Page', 
  'content-page', 
  'A page focused on presenting detailed content with sidebar navigation', 
  '{
    "layout": "sidebar",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sidebar": {
      "position": "left",
      "width": "300px",
      "showNavigation": true,
      "showSearch": true
    },
    "sections": [
      {
        "name": "PageHeader",
        "type": "pageHeader",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Page Title",
          "breadcrumbs": true
        },
        "styles": {
          "padding": "2rem 0",
          "borderBottom": "1px solid rgb(var(--border))"
        }
      },
      {
        "name": "Content",
        "type": "content",
        "required": true,
        "limit": null,
        "defaultContent": {
          "heading": "Section Heading",
          "content": "<p>Add your detailed content here. This template is ideal for documentation, articles, and other text-heavy content.</p>"
        },
        "styles": {
          "padding": "2rem 0"
        }
      },
      {
        "name": "RelatedContent",
        "type": "relatedContent",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Related Pages",
          "items": [
            {
              "title": "Related Page 1",
              "link": "/page-1"
            },
            {
              "title": "Related Page 2",
              "link": "/page-2"
            },
            {
              "title": "Related Page 3",
              "link": "/page-3"
            }
          ]
        },
        "styles": {
          "padding": "2rem 0",
          "borderTop": "1px solid rgb(var(--border))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/content-page.jpg'
),
(
  'Team Page', 
  'team-page', 
  'A page designed to showcase team members with profiles and details', 
  '{
    "layout": "default",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sections": [
      {
        "name": "Hero",
        "type": "hero",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Our Team",
          "subheading": "Meet the people behind our success",
          "backgroundImage": null,
          "alignment": "center"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "TeamMembers",
        "type": "teamGrid",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Leadership Team",
          "subheading": "The people guiding our vision",
          "teamMembers": [
            {
              "name": "John Doe",
              "position": "CEO",
              "bio": "Brief biography goes here",
              "image": null,
              "social": {
                "linkedin": "https://linkedin.com/in/johndoe",
                "twitter": "https://twitter.com/johndoe"
              }
            },
            {
              "name": "Jane Smith",
              "position": "CTO",
              "bio": "Brief biography goes here",
              "image": null,
              "social": {
                "linkedin": "https://linkedin.com/in/janesmith",
                "twitter": "https://twitter.com/janesmith"
              }
            }
          ]
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "TeamValues",
        "type": "content",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Our Values",
          "content": "<p>Description of company values and culture.</p>"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--secondary))"
        }
      },
      {
        "name": "JoinTeam",
        "type": "cta",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Join Our Team",
          "subheading": "We are always looking for talented individuals to join us.",
          "buttonText": "View Openings",
          "buttonLink": "/careers"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/team-page.jpg'
),
(
  'Investment Page', 
  'investment-page', 
  'A page designed to showcase investment portfolio and approach', 
  '{
    "layout": "default",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sections": [
      {
        "name": "Hero",
        "type": "hero",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Our Investment Approach",
          "subheading": "How we create value and generate returns",
          "backgroundImage": null,
          "alignment": "center"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "InvestmentStrategy",
        "type": "content",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Investment Strategy",
          "content": "<p>Detailed description of investment philosophy and strategy.</p>"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "Portfolio",
        "type": "portfolio",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Current Portfolio",
          "subheading": "Our active investments",
          "investments": [
            {
              "name": "Company A",
              "sector": "Technology",
              "description": "Brief description of investment",
              "image": null,
              "link": "/investments/company-a"
            },
            {
              "name": "Company B",
              "sector": "Healthcare",
              "description": "Brief description of investment",
              "image": null,
              "link": "/investments/company-b"
            },
            {
              "name": "Company C",
              "sector": "Finance",
              "description": "Brief description of investment",
              "image": null,
              "link": "/investments/company-c"
            }
          ]
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--secondary))"
        }
      },
      {
        "name": "InvestmentCriteria",
        "type": "features",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Investment Criteria",
          "subheading": "What we look for in potential investments",
          "features": [
            {
              "icon": "target",
              "title": "Market Opportunity",
              "description": "Description of market criteria"
            },
            {
              "icon": "users",
              "title": "Strong Management",
              "description": "Description of management criteria"
            },
            {
              "icon": "trending-up",
              "title": "Growth Potential",
              "description": "Description of growth criteria"
            }
          ]
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "ContactCTA",
        "type": "cta",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Interested in Working with Us?",
          "subheading": "Contact our investment team to discuss opportunities.",
          "buttonText": "Contact Us",
          "buttonLink": "/contact"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--primary))",
          "color": "rgb(var(--primary-foreground))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/investment-page.jpg'
),
(
  'Contact Page', 
  'contact-page', 
  'A page with contact information, form, and office locations', 
  '{
    "layout": "default",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sections": [
      {
        "name": "Hero",
        "type": "hero",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Contact Us",
          "subheading": "Get in touch with our team",
          "backgroundImage": null,
          "alignment": "center"
        },
        "styles": {
          "padding": "6rem 1.5rem",
          "textAlign": "center",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "ContactInfo",
        "type": "contactInfo",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Contact Information",
          "email": "info@example.com",
          "phone": "+1 (555) 123-4567",
          "address": "123 Main Street, City, State, ZIP",
          "hours": "Monday-Friday: 9am-5pm"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "ContactForm",
        "type": "contactForm",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Send Us a Message",
          "subheading": "We will get back to you as soon as possible",
          "successMessage": "Thank you for your message. We will be in touch shortly.",
          "fields": [
            {
              "name": "name",
              "label": "Your Name",
              "type": "text",
              "required": true
            },
            {
              "name": "email",
              "label": "Email Address",
              "type": "email",
              "required": true
            },
            {
              "name": "phone",
              "label": "Phone Number",
              "type": "tel",
              "required": false
            },
            {
              "name": "message",
              "label": "Your Message",
              "type": "textarea",
              "required": true
            }
          ],
          "submitButtonText": "Send Message"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--secondary))"
        }
      },
      {
        "name": "Locations",
        "type": "locations",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Our Offices",
          "locations": [
            {
              "name": "Headquarters",
              "address": "123 Main Street, City, State, ZIP",
              "phone": "+1 (555) 123-4567",
              "email": "hq@example.com",
              "mapEmbed": ""
            },
            {
              "name": "Regional Office",
              "address": "456 Oak Avenue, City, State, ZIP",
              "phone": "+1 (555) 987-6543",
              "email": "regional@example.com",
              "mapEmbed": ""
            }
          ]
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/contact-page.jpg'
),
(
  'Legal Page', 
  'legal-page', 
  'A page for legal content such as privacy policy or terms of service', 
  '{
    "layout": "default",
    "header": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true
    },
    "sections": [
      {
        "name": "PageHeader",
        "type": "pageHeader",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "Legal Information",
          "breadcrumbs": true
        },
        "styles": {
          "padding": "2rem 1.5rem",
          "borderBottom": "1px solid rgb(var(--border))"
        }
      },
      {
        "name": "LegalContent",
        "type": "content",
        "required": true,
        "limit": 1,
        "defaultContent": {
          "heading": "",
          "content": "<p>Insert your legal content here. This template is designed for privacy policies, terms of service, and other legal documents.</p>"
        },
        "styles": {
          "padding": "4rem 1.5rem",
          "backgroundColor": "rgb(var(--background))"
        }
      },
      {
        "name": "EffectiveDate",
        "type": "content",
        "required": false,
        "limit": 1,
        "defaultContent": {
          "heading": "Effective Date",
          "content": "<p>This policy is effective as of [Date].</p>"
        },
        "styles": {
          "padding": "2rem 1.5rem",
          "backgroundColor": "rgb(var(--background))",
          "borderTop": "1px solid rgb(var(--border))"
        }
      }
    ],
    "footer": {
      "type": "standard",
      "showLogo": true,
      "showNavigation": true,
      "showSocial": true,
      "showCopyright": true
    }
  }'::jsonb,
  'https://thinkenergy.au/tasman/templates/legal-page.jpg'
)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  structure = EXCLUDED.structure,
  thumbnail = EXCLUDED.thumbnail,
  updated_at = now();


-- ========== END OF 20250325000011_page_templates.sql ==========

-- ========== START OF 20250325000012_header_footer_customization.sql ==========

/*
  # Header and Footer Customization

  1. Changes
    - Create headers table for different header styles
    - Create footers table for different footer styles
    - Add relationships to page templates
    - Seed default header and footer styles
*/

-- Create headers table
CREATE TABLE IF NOT EXISTS public.headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  styles JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on headers
ALTER TABLE IF EXISTS public.headers ENABLE ROW LEVEL SECURITY;

-- RLS policies for headers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'headers' AND policyname = 'Anyone can view headers'
  ) THEN
    CREATE POLICY "Anyone can view headers"
      ON public.headers
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'headers' AND policyname = 'Admin users can insert headers'
  ) THEN
    CREATE POLICY "Admin users can insert headers"
      ON public.headers
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'headers' AND policyname = 'Admin users can update headers'
  ) THEN
    CREATE POLICY "Admin users can update headers"
      ON public.headers
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'headers' AND policyname = 'Admin users can delete headers'
  ) THEN
    CREATE POLICY "Admin users can delete headers"
      ON public.headers
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Create footers table
CREATE TABLE IF NOT EXISTS public.footers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  styles JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on footers
ALTER TABLE IF EXISTS public.footers ENABLE ROW LEVEL SECURITY;

-- RLS policies for footers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'footers' AND policyname = 'Anyone can view footers'
  ) THEN
    CREATE POLICY "Anyone can view footers"
      ON public.footers
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'footers' AND policyname = 'Admin users can insert footers'
  ) THEN
    CREATE POLICY "Admin users can insert footers"
      ON public.footers
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'footers' AND policyname = 'Admin users can update footers'
  ) THEN
    CREATE POLICY "Admin users can update footers"
      ON public.footers
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'footers' AND policyname = 'Admin users can delete footers'
  ) THEN
    CREATE POLICY "Admin users can delete footers"
      ON public.footers
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Add header_id and footer_id to page_templates table
ALTER TABLE IF EXISTS public.page_templates
ADD COLUMN IF NOT EXISTS header_id UUID REFERENCES public.headers(id),
ADD COLUMN IF NOT EXISTS footer_id UUID REFERENCES public.footers(id);

-- Add header_id and footer_id to pages table
ALTER TABLE IF EXISTS public.pages
ADD COLUMN IF NOT EXISTS header_id UUID REFERENCES public.headers(id),
ADD COLUMN IF NOT EXISTS footer_id UUID REFERENCES public.footers(id);

-- Seed default header styles
INSERT INTO public.headers (name, slug, description, structure, styles, is_default)
VALUES 
(
  'Standard Header', 
  'standard-header', 
  'Default header with logo and navigation', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "navigation": {
      "type": "horizontal",
      "alignment": "right",
      "items": []
    },
    "actions": {
      "showThemeToggle": true,
      "buttons": []
    },
    "sticky": true,
    "transparent": false,
    "mobileMenuType": "drawer"
  }'::jsonb,
  '{
    "container": {
      "padding": "1rem 1.5rem",
      "maxWidth": "1280px",
      "margin": "0 auto",
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "space-between"
    },
    "background": {
      "default": "rgb(var(--background) / 0.8)",
      "scrolled": "rgb(var(--background))"
    },
    "backdropFilter": "blur(10px)",
    "borderBottom": "1px solid rgb(var(--border))",
    "height": "80px",
    "transition": "all 0.3s ease",
    "zIndex": "50",
    "boxShadow": {
      "default": "none",
      "scrolled": "0 2px 10px rgba(0, 0, 0, 0.05)"
    },
    "logo": {
      "maxHeight": "40px"
    },
    "navigation": {
      "gap": "2rem",
      "fontSize": "1rem",
      "fontWeight": "500"
    },
    "link": {
      "color": "rgb(var(--foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      },
      "active": {
        "color": "rgb(var(--primary))",
        "fontWeight": "600"
      }
    },
    "mobileMenuButton": {
      "color": "rgb(var(--foreground))",
      "size": "24px"
    },
    "dropdown": {
      "background": "rgb(var(--background))",
      "border": "1px solid rgb(var(--border))",
      "borderRadius": "0.375rem",
      "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.1)",
      "padding": "0.5rem 0",
      "minWidth": "200px"
    },
    "dropdownItem": {
      "padding": "0.5rem 1rem",
      "hover": {
        "backgroundColor": "rgb(var(--secondary))"
      }
    }
  }'::jsonb,
  true
),
(
  'Transparent Header', 
  'transparent-header', 
  'Transparent header for use with hero sections', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "navigation": {
      "type": "horizontal",
      "alignment": "right",
      "items": []
    },
    "actions": {
      "showThemeToggle": true,
      "buttons": []
    },
    "sticky": true,
    "transparent": true,
    "mobileMenuType": "drawer"
  }'::jsonb,
  '{
    "container": {
      "padding": "1rem 1.5rem",
      "maxWidth": "1280px",
      "margin": "0 auto",
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "space-between"
    },
    "background": {
      "default": "transparent",
      "scrolled": "rgb(var(--background) / 0.8)"
    },
    "backdropFilter": {
      "default": "none",
      "scrolled": "blur(10px)"
    },
    "borderBottom": {
      "default": "none",
      "scrolled": "1px solid rgb(var(--border))"
    },
    "height": "80px",
    "transition": "all 0.3s ease",
    "zIndex": "50",
    "boxShadow": {
      "default": "none",
      "scrolled": "0 2px 10px rgba(0, 0, 0, 0.05)"
    },
    "logo": {
      "maxHeight": "40px"
    },
    "navigation": {
      "gap": "2rem",
      "fontSize": "1rem",
      "fontWeight": "500"
    },
    "link": {
      "color": {
        "default": "rgb(255, 255, 255)",
        "scrolled": "rgb(var(--foreground))"
      },
      "hover": {
        "color": "rgb(var(--primary))"
      },
      "active": {
        "color": "rgb(var(--primary))",
        "fontWeight": "600"
      }
    },
    "mobileMenuButton": {
      "color": {
        "default": "rgb(255, 255, 255)",
        "scrolled": "rgb(var(--foreground))"
      },
      "size": "24px"
    },
    "dropdown": {
      "background": "rgb(var(--background))",
      "border": "1px solid rgb(var(--border))",
      "borderRadius": "0.375rem",
      "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.1)",
      "padding": "0.5rem 0",
      "minWidth": "200px"
    },
    "dropdownItem": {
      "padding": "0.5rem 1rem",
      "hover": {
        "backgroundColor": "rgb(var(--secondary))"
      }
    }
  }'::jsonb,
  false
),
(
  'Minimal Header', 
  'minimal-header', 
  'Minimal header with just logo and essential navigation', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "navigation": {
      "type": "horizontal",
      "alignment": "right",
      "items": []
    },
    "actions": {
      "showThemeToggle": false,
      "buttons": []
    },
    "sticky": true,
    "transparent": false,
    "mobileMenuType": "drawer"
  }'::jsonb,
  '{
    "container": {
      "padding": "0.75rem 1.5rem",
      "maxWidth": "1280px",
      "margin": "0 auto",
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "space-between"
    },
    "background": "rgb(var(--background))",
    "backdropFilter": "none",
    "borderBottom": "1px solid rgb(var(--border))",
    "height": "60px",
    "transition": "all 0.3s ease",
    "zIndex": "50",
    "boxShadow": "none",
    "logo": {
      "maxHeight": "32px"
    },
    "navigation": {
      "gap": "1.5rem",
      "fontSize": "0.875rem",
      "fontWeight": "500"
    },
    "link": {
      "color": "rgb(var(--foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      },
      "active": {
        "color": "rgb(var(--primary))",
        "fontWeight": "600"
      }
    },
    "mobileMenuButton": {
      "color": "rgb(var(--foreground))",
      "size": "20px"
    },
    "dropdown": {
      "background": "rgb(var(--background))",
      "border": "1px solid rgb(var(--border))",
      "borderRadius": "0.375rem",
      "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.1)",
      "padding": "0.5rem 0",
      "minWidth": "180px"
    },
    "dropdownItem": {
      "padding": "0.5rem 1rem",
      "hover": {
        "backgroundColor": "rgb(var(--secondary))"
      }
    }
  }'::jsonb,
  false
);

-- Seed default footer styles
INSERT INTO public.footers (name, slug, description, structure, styles, is_default)
VALUES 
(
  'Standard Footer', 
  'standard-footer', 
  'Default footer with logo, navigation, and social links', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "columns": [
      {
        "title": "Company",
        "links": [
          {
            "label": "About",
            "url": "/about",
            "external": false
          },
          {
            "label": "Team",
            "url": "/team",
            "external": false
          },
          {
            "label": "Investments",
            "url": "/investments",
            "external": false
          },
          {
            "label": "Contact",
            "url": "/contact",
            "external": false
          }
        ]
      },
      {
        "title": "Legal",
        "links": [
          {
            "label": "Privacy Policy",
            "url": "/privacy-policy",
            "external": false
          },
          {
            "label": "Terms of Use",
            "url": "/terms-of-use",
            "external": false
          }
        ]
      },
      {
        "title": "Contact",
        "content": "Level 5, 50 Carrington Street<br>Sydney NSW 2000<br>Australia<br><br>+61 2 9252 2222<br>info@tasmancapital.com.au"
      }
    ],
    "social": [
      {
        "platform": "linkedin",
        "url": "https://www.linkedin.com/company/tasman-capital/",
        "icon": "linkedin"
      }
    ],
    "copyright": " 2025 Tasman Capital. All rights reserved.",
    "showBackToTop": true
  }'::jsonb,
  '{
    "container": {
      "padding": "4rem 1.5rem 2rem",
      "maxWidth": "1280px",
      "margin": "0 auto"
    },
    "background": "rgb(var(--secondary))",
    "color": "rgb(var(--secondary-foreground))",
    "logo": {
      "maxHeight": "40px",
      "marginBottom": "2rem"
    },
    "columns": {
      "display": "grid",
      "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))",
      "gap": "2rem",
      "marginBottom": "3rem"
    },
    "columnTitle": {
      "fontSize": "1.125rem",
      "fontWeight": "600",
      "marginBottom": "1rem",
      "color": "rgb(var(--secondary-foreground))"
    },
    "link": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "marginBottom": "0.5rem",
      "display": "block",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "content": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "lineHeight": "1.6"
    },
    "social": {
      "display": "flex",
      "gap": "1rem",
      "marginBottom": "2rem"
    },
    "socialIcon": {
      "width": "24px",
      "height": "24px",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "bottom": {
      "borderTop": "1px solid rgb(var(--border))",
      "paddingTop": "2rem",
      "display": "flex",
      "justifyContent": "space-between",
      "alignItems": "center",
      "flexWrap": "wrap",
      "gap": "1rem"
    },
    "copyright": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))"
    },
    "backToTop": {
      "display": "flex",
      "alignItems": "center",
      "gap": "0.5rem",
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    }
  }'::jsonb,
  true
),
(
  'Minimal Footer', 
  'minimal-footer', 
  'Simplified footer with essential information', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "links": [
      {
        "label": "Privacy Policy",
        "url": "/privacy-policy",
        "external": false
      },
      {
        "label": "Terms of Use",
        "url": "/terms-of-use",
        "external": false
      }
    ],
    "social": [
      {
        "platform": "linkedin",
        "url": "https://www.linkedin.com/company/tasman-capital/",
        "icon": "linkedin"
      }
    ],
    "copyright": " 2025 Tasman Capital. All rights reserved.",
    "showBackToTop": false
  }'::jsonb,
  '{
    "container": {
      "padding": "2rem 1.5rem",
      "maxWidth": "1280px",
      "margin": "0 auto"
    },
    "background": "rgb(var(--background))",
    "color": "rgb(var(--foreground))",
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "textAlign": "center",
    "logo": {
      "maxHeight": "32px",
      "marginBottom": "1.5rem"
    },
    "links": {
      "display": "flex",
      "gap": "1.5rem",
      "marginBottom": "1.5rem"
    },
    "link": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "social": {
      "display": "flex",
      "gap": "1rem",
      "marginBottom": "1.5rem"
    },
    "socialIcon": {
      "width": "20px",
      "height": "20px",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "copyright": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))"
    }
  }'::jsonb,
  false
),
(
  'Expanded Footer', 
  'expanded-footer', 
  'Comprehensive footer with multiple columns and newsletter signup', 
  '{
    "logo": {
      "src": "https://thinkenergy.au/tasman/tasman-capital-logo.png",
      "alt": "Tasman Capital",
      "width": 180,
      "height": 60,
      "darkModeSrc": "https://thinkenergy.au/tasman/tasman-capital-logo-white.png"
    },
    "columns": [
      {
        "title": "Company",
        "links": [
          {
            "label": "About",
            "url": "/about",
            "external": false
          },
          {
            "label": "Team",
            "url": "/team",
            "external": false
          },
          {
            "label": "Investments",
            "url": "/investments",
            "external": false
          },
          {
            "label": "Contact",
            "url": "/contact",
            "external": false
          }
        ]
      },
      {
        "title": "Legal",
        "links": [
          {
            "label": "Privacy Policy",
            "url": "/privacy-policy",
            "external": false
          },
          {
            "label": "Terms of Use",
            "url": "/terms-of-use",
            "external": false
          }
        ]
      },
      {
        "title": "Contact",
        "content": "Level 5, 50 Carrington Street<br>Sydney NSW 2000<br>Australia<br><br>+61 2 9252 2222<br>info@tasmancapital.com.au"
      }
    ],
    "newsletter": {
      "title": "Subscribe to our newsletter",
      "description": "Stay updated with our latest news and insights",
      "placeholder": "Your email address",
      "buttonText": "Subscribe"
    },
    "social": [
      {
        "platform": "linkedin",
        "url": "https://www.linkedin.com/company/tasman-capital/",
        "icon": "linkedin"
      }
    ],
    "copyright": " 2025 Tasman Capital. All rights reserved.",
    "showBackToTop": true
  }'::jsonb,
  '{
    "container": {
      "padding": "5rem 1.5rem 2rem",
      "maxWidth": "1280px",
      "margin": "0 auto"
    },
    "background": "rgb(var(--secondary))",
    "color": "rgb(var(--secondary-foreground))",
    "logo": {
      "maxHeight": "40px",
      "marginBottom": "2rem"
    },
    "grid": {
      "display": "grid",
      "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))",
      "gap": "3rem",
      "marginBottom": "4rem"
    },
    "columnTitle": {
      "fontSize": "1.25rem",
      "fontWeight": "600",
      "marginBottom": "1.5rem",
      "color": "rgb(var(--secondary-foreground))"
    },
    "link": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "marginBottom": "0.75rem",
      "display": "block",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "content": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "lineHeight": "1.6"
    },
    "newsletter": {
      "marginBottom": "3rem"
    },
    "newsletterDescription": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "marginBottom": "1rem"
    },
    "newsletterForm": {
      "display": "flex",
      "gap": "0.5rem"
    },
    "newsletterInput": {
      "flex": "1",
      "height": "2.5rem",
      "padding": "0 0.75rem",
      "fontSize": "0.875rem",
      "backgroundColor": "rgb(var(--background))",
      "color": "rgb(var(--foreground))",
      "border": "1px solid rgb(var(--border))",
      "borderRadius": "0.375rem"
    },
    "newsletterButton": {
      "height": "2.5rem",
      "padding": "0 1rem",
      "fontSize": "0.875rem",
      "backgroundColor": "rgb(var(--primary))",
      "color": "rgb(var(--primary-foreground))",
      "borderRadius": "0.375rem",
      "fontWeight": "500"
    },
    "social": {
      "display": "flex",
      "gap": "1rem",
      "marginBottom": "2rem"
    },
    "socialIcon": {
      "width": "24px",
      "height": "24px",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    },
    "bottom": {
      "borderTop": "1px solid rgb(var(--border))",
      "paddingTop": "2rem",
      "display": "flex",
      "justifyContent": "space-between",
      "alignItems": "center",
      "flexWrap": "wrap",
      "gap": "1rem"
    },
    "copyright": {
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))"
    },
    "backToTop": {
      "display": "flex",
      "alignItems": "center",
      "gap": "0.5rem",
      "fontSize": "0.875rem",
      "color": "rgb(var(--muted-foreground))",
      "hover": {
        "color": "rgb(var(--primary))"
      }
    }
  }'::jsonb,
  false
);

-- Update existing pages with default header and footer IDs
DO $$
DECLARE
  standard_header_id UUID;
  transparent_header_id UUID;
  standard_footer_id UUID;
BEGIN
  -- Get header and footer IDs
  SELECT id INTO standard_header_id FROM public.headers WHERE slug = 'standard-header';
  SELECT id INTO transparent_header_id FROM public.headers WHERE slug = 'transparent-header';
  SELECT id INTO standard_footer_id FROM public.footers WHERE slug = 'standard-footer';
  
  -- Update home page with transparent header
  UPDATE public.pages SET header_id = transparent_header_id, footer_id = standard_footer_id WHERE slug = 'home';
  
  -- Update other pages with standard header
  UPDATE public.pages SET header_id = standard_header_id, footer_id = standard_footer_id 
  WHERE slug IN ('about', 'investments', 'team', 'contact', 'privacy-policy', 'terms-of-use');
END $$;


-- ========== END OF 20250325000012_header_footer_customization.sql ==========

-- ========== START OF 20250325000013_navigation_menus.sql ==========

/*
  # Navigation Menus

  1. Changes
    - Create navigation_menus table for different menu configurations
    - Create menu_items table for menu structure
    - Add relationships to headers and footers
    - Seed default navigation menus
    - Add responsive behavior configuration
*/

-- Create navigation_menus table
CREATE TABLE IF NOT EXISTS public.navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT NOT NULL, -- 'header', 'footer', 'mobile', 'sidebar', etc.
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on navigation_menus
ALTER TABLE IF EXISTS public.navigation_menus ENABLE ROW LEVEL SECURITY;

-- RLS policies for navigation_menus
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation_menus' AND policyname = 'Anyone can view navigation_menus'
  ) THEN
    CREATE POLICY "Anyone can view navigation_menus"
      ON public.navigation_menus
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation_menus' AND policyname = 'Admin users can insert navigation_menus'
  ) THEN
    CREATE POLICY "Admin users can insert navigation_menus"
      ON public.navigation_menus
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation_menus' AND policyname = 'Admin users can update navigation_menus'
  ) THEN
    CREATE POLICY "Admin users can update navigation_menus"
      ON public.navigation_menus
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'navigation_menus' AND policyname = 'Admin users can delete navigation_menus'
  ) THEN
    CREATE POLICY "Admin users can delete navigation_menus"
      ON public.navigation_menus
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT,
  page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  icon TEXT,
  target TEXT DEFAULT '_self', -- '_self', '_blank', etc.
  classes TEXT,
  attributes JSONB,
  order_index INTEGER NOT NULL DEFAULT 0,
  responsive_behavior JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(menu_id, label, url)
);

-- Enable RLS on menu_items
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for menu_items
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' AND policyname = 'Anyone can view menu_items'
  ) THEN
    CREATE POLICY "Anyone can view menu_items"
      ON public.menu_items
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' AND policyname = 'Admin users can insert menu_items'
  ) THEN
    CREATE POLICY "Admin users can insert menu_items"
      ON public.menu_items
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' AND policyname = 'Admin users can update menu_items'
  ) THEN
    CREATE POLICY "Admin users can update menu_items"
      ON public.menu_items
      FOR UPDATE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'menu_items' AND policyname = 'Admin users can delete menu_items'
  ) THEN
    CREATE POLICY "Admin users can delete menu_items"
      ON public.menu_items
      FOR DELETE
      TO authenticated
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Add header_menu_id and footer_menu_id to headers and footers tables
ALTER TABLE IF EXISTS public.headers
ADD COLUMN IF NOT EXISTS menu_id UUID REFERENCES public.navigation_menus(id);

ALTER TABLE IF EXISTS public.footers
ADD COLUMN IF NOT EXISTS menu_id UUID REFERENCES public.navigation_menus(id);

-- Seed default navigation menus
INSERT INTO public.navigation_menus (name, slug, description, location, is_default)
VALUES 
('Main Navigation', 'main-navigation', 'Primary navigation for the header', 'header', true),
('Footer Navigation', 'footer-navigation', 'Primary navigation for the footer', 'footer', true),
('Mobile Navigation', 'mobile-navigation', 'Navigation for mobile devices', 'mobile', true),
('Legal Navigation', 'legal-navigation', 'Navigation for legal pages', 'footer', false)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  updated_at = now();

-- Seed main navigation menu items
DO $$
DECLARE
  main_nav_id UUID;
  home_page_id UUID;
  about_page_id UUID;
  investments_page_id UUID;
  team_page_id UUID;
  contact_page_id UUID;
BEGIN
  -- Get menu ID
  SELECT id INTO main_nav_id FROM public.navigation_menus WHERE slug = 'main-navigation';
  
  -- Get page IDs
  SELECT id INTO home_page_id FROM public.pages WHERE slug = 'home';
  SELECT id INTO about_page_id FROM public.pages WHERE slug = 'about';
  SELECT id INTO investments_page_id FROM public.pages WHERE slug = 'investments';
  SELECT id INTO team_page_id FROM public.pages WHERE slug = 'team';
  SELECT id INTO contact_page_id FROM public.pages WHERE slug = 'contact';
  
  -- Insert menu items
  INSERT INTO public.menu_items (menu_id, label, url, page_id, order_index, responsive_behavior)
  VALUES 
  (
    main_nav_id, 
    'Home', 
    '/', 
    home_page_id, 
    0,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  ),
  (
    main_nav_id, 
    'About', 
    '/about', 
    about_page_id, 
    1,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  ),
  (
    main_nav_id, 
    'Investments', 
    '/investments', 
    investments_page_id, 
    2,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  ),
  (
    main_nav_id, 
    'Team', 
    '/team', 
    team_page_id, 
    3,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  ),
  (
    main_nav_id, 
    'Contact', 
    '/contact', 
    contact_page_id, 
    4,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  )
  ON CONFLICT (menu_id, label, url) 
  WHERE page_id IS NOT NULL 
  DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    responsive_behavior = EXCLUDED.responsive_behavior,
    updated_at = now();
END $$;

-- Seed legal navigation menu items
DO $$
DECLARE
  legal_nav_id UUID;
  privacy_page_id UUID;
  terms_page_id UUID;
BEGIN
  -- Get menu ID
  SELECT id INTO legal_nav_id FROM public.navigation_menus WHERE slug = 'legal-navigation';
  
  -- Get page IDs
  SELECT id INTO privacy_page_id FROM public.pages WHERE slug = 'privacy-policy';
  SELECT id INTO terms_page_id FROM public.pages WHERE slug = 'terms-of-use';
  
  -- Insert menu items
  INSERT INTO public.menu_items (menu_id, label, url, page_id, order_index, responsive_behavior)
  VALUES 
  (
    legal_nav_id, 
    'Privacy Policy', 
    '/privacy-policy', 
    privacy_page_id, 
    0,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  ),
  (
    legal_nav_id, 
    'Terms of Use', 
    '/terms-of-use', 
    terms_page_id, 
    1,
    '{
      "desktop": {
        "display": true,
        "classes": ""
      },
      "tablet": {
        "display": true,
        "classes": ""
      },
      "mobile": {
        "display": true,
        "classes": ""
      }
    }'::jsonb
  )
  ON CONFLICT (menu_id, label, url) 
  WHERE page_id IS NOT NULL 
  DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    responsive_behavior = EXCLUDED.responsive_behavior,
    updated_at = now();
END $$;

-- Create function to get menu items with their children
CREATE OR REPLACE FUNCTION get_menu_items_with_children(p_menu_slug TEXT)
RETURNS TABLE (
  id UUID,
  menu_id UUID,
  parent_id UUID,
  label TEXT,
  url TEXT,
  page_id UUID,
  icon TEXT,
  target TEXT,
  classes TEXT,
  attributes JSONB,
  order_index INTEGER,
  responsive_behavior JSONB,
  level INTEGER,
  path TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE menu_tree AS (
    -- Base case: get all root level items
    SELECT 
      mi.id,
      mi.menu_id,
      mi.parent_id,
      mi.label,
      mi.url,
      mi.page_id,
      mi.icon,
      mi.target,
      mi.classes,
      mi.attributes,
      mi.order_index,
      mi.responsive_behavior,
      0 AS level,
      ARRAY[mi.label] AS path
    FROM 
      public.menu_items mi
      JOIN public.navigation_menus nm ON mi.menu_id = nm.id
    WHERE 
      nm.slug = p_menu_slug
      AND mi.parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: get all children
    SELECT 
      c.id,
      c.menu_id,
      c.parent_id,
      c.label,
      c.url,
      c.page_id,
      c.icon,
      c.target,
      c.classes,
      c.attributes,
      c.order_index,
      c.responsive_behavior,
      p.level + 1,
      p.path || c.label
    FROM 
      public.menu_items c
      JOIN menu_tree p ON c.parent_id = p.id
  )
  SELECT * FROM menu_tree
  ORDER BY level, order_index;
END;
$$ LANGUAGE plpgsql;


-- ========== END OF 20250325000013_navigation_menus.sql ==========

-- ========== START OF 20250326000001_custom_authentication.sql ==========

-- Create custom authentication tables
-- This migration creates admin_users and profiles tables in the public schema

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.admin_users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create function to hash passwords securely
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(input_email TEXT, input_password TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    p.role
  FROM
    public.admin_users u
    JOIN public.profiles p ON u.id = p.id
  WHERE
    u.email = input_email
    AND u.password_hash = crypt(input_password, u.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed admin users
INSERT INTO public.admin_users (email, password_hash)
VALUES
  ('tito@nrgy.com.au', public.hash_password('!Daftfunk1')),
  ('admin@tasmancapital.com.au', public.hash_password('Tasman!!2025'))
ON CONFLICT (email) DO NOTHING;

-- Seed profiles for admin users
INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT 
  id, 
  CASE 
    WHEN email = 'tito@nrgy.com.au' THEN 'Tito'
    WHEN email = 'admin@tasmancapital.com.au' THEN 'Admin'
  END,
  CASE 
    WHEN email = 'tito@nrgy.com.au' THEN 'Admin'
    WHEN email = 'admin@tasmancapital.com.au' THEN 'User'
  END,
  'admin'
FROM 
  public.admin_users
WHERE 
  email IN ('tito@nrgy.com.au', 'admin@tasmancapital.com.au')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY admin_users_select_policy ON public.admin_users
  FOR SELECT USING (true);

-- Create policies for profiles table
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ========== END OF 20250326000001_custom_authentication.sql ==========
