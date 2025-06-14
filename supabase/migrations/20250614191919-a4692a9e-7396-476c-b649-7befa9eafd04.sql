
-- Update category colors to a new pastel red/pink theme
UPDATE public.categories SET color = 'bg-rose-200' WHERE slug = 'desserts';
UPDATE public.categories SET color = 'bg-pink-200' WHERE slug = 'savory-pastries';
UPDATE public.categories SET color = 'bg-red-200' WHERE slug = 'stews';
