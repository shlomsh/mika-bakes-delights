
-- Add a 'recommended' column to the recipes table to mark featured recipes.
-- This column will be a boolean, defaulting to false.
ALTER TABLE public.recipes
ADD COLUMN recommended BOOLEAN NOT NULL DEFAULT false;

-- Set the 'recommended' flag to true for the two recipes
-- that were previously hardcoded as picks.
UPDATE public.recipes
SET recommended = true
WHERE name = 'עוגיות שוקולד צ''יפס' OR name = 'עלי גפן';
