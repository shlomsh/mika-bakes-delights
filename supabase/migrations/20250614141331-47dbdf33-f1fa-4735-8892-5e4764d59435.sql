
-- Create a table for recipe sauces
CREATE TABLE public.recipe_sauces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for sauces
ALTER TABLE public.recipe_sauces ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sauces
CREATE POLICY "Public can read recipe sauces"
  ON public.recipe_sauces
  FOR SELECT
  USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to recipe sauces" ON public.recipe_sauces FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_sauces_recipe_id ON public.recipe_sauces(recipe_id);


-- Create a table for recipe garnishes
CREATE TABLE public.recipe_garnishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for garnishes
ALTER TABLE public.recipe_garnishes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to garnishes
CREATE POLICY "Public can read recipe garnishes"
  ON public.recipe_garnishes
  FOR SELECT
  USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to recipe garnishes" ON public.recipe_garnishes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_garnishes_recipe_id ON public.recipe_garnishes(recipe_id);
