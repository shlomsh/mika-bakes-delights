
-- Add columns to categories table for UI properties if they don't exist
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;

-- === Populate new columns for existing categories from local data ===
-- This is a one-time update to sync database with the hardcoded data.
UPDATE public.categories SET
  color = 'bg-rose-200',
  icon = 'Cake',
  description = 'עוגות, עוגיות, פודינגים וטעמים מתוקים לילדים ולמבוגרים'
WHERE slug = 'desserts' AND color IS NULL; -- Only update if not already set

UPDATE public.categories SET
  color = 'bg-pink-100',
  icon = 'Utensils',
  description = 'בצקים, לחמים, פשטידות ומגוון מאפים שאוהבים'
WHERE slug = 'savory-pastries' AND color IS NULL; -- Only update if not already set

UPDATE public.categories SET
  color = 'bg-rose-100',
  icon = 'BookOpen',
  description = 'מנות ביתיות, תבשילי משפחה ומאכלים מנחמים'
WHERE slug = 'stews' AND color IS NULL; -- Only update if not already set

-- === Categories Table RLS ===
-- Drop existing policies if they exist, to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users full access to categories" ON public.categories;


-- Allow authenticated users to insert new categories
CREATE POLICY "Allow authenticated users to insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update categories
CREATE POLICY "Allow authenticated users to update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete categories
CREATE POLICY "Allow authenticated users to delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (true);
