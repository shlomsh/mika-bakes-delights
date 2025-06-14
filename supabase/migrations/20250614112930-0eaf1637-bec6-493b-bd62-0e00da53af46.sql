
-- Update the category for 'עלי גפן' recipe to 'תבשילים' (stews)
UPDATE public.recipes
SET category_id = (SELECT id FROM public.categories WHERE slug = 'stews')
WHERE name = 'עלי גפן';
