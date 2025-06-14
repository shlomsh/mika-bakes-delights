
-- Rename existing table to clarify it's for instructions
ALTER TABLE public.recipe_garnishes RENAME TO recipe_garnish_instructions;

-- Create a table for recipe garnish ingredients
CREATE TABLE public.recipe_garnish_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for garnish ingredients
ALTER TABLE public.recipe_garnish_ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access to garnish ingredients
CREATE POLICY "Public can read recipe garnish ingredients"
  ON public.recipe_garnish_ingredients
  FOR SELECT
  USING (true);

-- Allow authenticated users full access to garnish ingredients
CREATE POLICY "Allow authenticated users full access to recipe garnish ingredients"
  ON public.recipe_garnish_ingredients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_garnish_ingredients_recipe_id ON public.recipe_garnish_ingredients(recipe_id);
