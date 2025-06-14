
-- Drop existing foreign key constraints that don't cascade deletes
ALTER TABLE public.recipe_ingredients
DROP CONSTRAINT IF EXISTS recipe_ingredients_recipe_id_fkey;

ALTER TABLE public.recipe_instructions
DROP CONSTRAINT IF EXISTS recipe_instructions_recipe_id_fkey;

-- Add new foreign key constraints with ON DELETE CASCADE
ALTER TABLE public.recipe_ingredients
ADD CONSTRAINT recipe_ingredients_recipe_id_fkey
FOREIGN KEY (recipe_id)
REFERENCES public.recipes(id)
ON DELETE CASCADE;

ALTER TABLE public.recipe_instructions
ADD CONSTRAINT recipe_instructions_recipe_id_fkey
FOREIGN KEY (recipe_id)
REFERENCES public.recipes(id)
ON DELETE CASCADE;
