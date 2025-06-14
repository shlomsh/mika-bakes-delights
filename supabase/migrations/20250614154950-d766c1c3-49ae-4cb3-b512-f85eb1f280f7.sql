
-- Create a table for recipe sauce ingredients
CREATE TABLE public.recipe_sauce_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for sauce ingredients
ALTER TABLE public.recipe_sauce_ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sauce ingredients
CREATE POLICY "Public can read recipe sauce ingredients"
  ON public.recipe_sauce_ingredients
  FOR SELECT
  USING (true);

-- Allow authenticated users full access to sauce ingredients
CREATE POLICY "Allow authenticated users full access to recipe sauce ingredients"
  ON public.recipe_sauce_ingredients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_sauce_ingredients_recipe_id ON public.recipe_sauce_ingredients(recipe_id);
