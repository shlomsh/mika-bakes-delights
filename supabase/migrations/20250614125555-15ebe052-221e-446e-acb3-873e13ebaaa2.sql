
-- Fix permissions to allow authenticated users to update recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to recipes" ON public.recipes FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to recipe ingredients" ON public.recipe_ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.recipe_instructions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to recipe instructions" ON public.recipe_instructions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create table to log recipe updates
CREATE TABLE public.recipe_update_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    changes jsonb
);

-- Enable RLS for logs
ALTER TABLE public.recipe_update_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view logs
CREATE POLICY "Allow authenticated users to view logs"
ON public.recipe_update_logs FOR SELECT
TO authenticated
USING (true);

-- Allow updates to be logged
CREATE POLICY "Allow logging of recipe updates"
ON public.recipe_update_logs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
