
-- Create a table for recipe ingredients
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for ingredients
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ingredients
CREATE POLICY "Public can read recipe ingredients"
  ON public.recipe_ingredients
  FOR SELECT
  USING (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);


-- Create a table for recipe instructions
CREATE TABLE public.recipe_instructions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for instructions
ALTER TABLE public.recipe_instructions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to instructions
CREATE POLICY "Public can read recipe instructions"
  ON public.recipe_instructions
  FOR SELECT
  USING (true);

-- Create an index on recipe_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_recipe_id ON public.recipe_instructions(recipe_id);
