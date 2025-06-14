
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  ingredients JSONB, -- e.g., ["1 cup flour", "2 eggs"] or [{"item": "flour", "quantity": "1 cup"}, {"item": "eggs", "quantity": "2"}]
  instructions TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, -- Or ON DELETE CASCADE if recipes must belong to a category
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Public can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Enable Row Level Security for recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to recipes
CREATE POLICY "Public can read recipes"
  ON public.recipes
  FOR SELECT
  USING (true);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_recipes_category_id ON public.recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Insert initial categories based on existing data
INSERT INTO public.categories (slug, name) VALUES
('desserts', 'קינוחים'),
('savory-pastries', 'מאפים מלוחים'),
('stews', 'תבשילים');

