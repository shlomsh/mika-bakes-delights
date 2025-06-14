
-- Update category colors to a new, distinct pastel theme
UPDATE public.categories SET color = 'bg-pastelBlue' WHERE slug = 'desserts';
UPDATE public.categories SET color = 'bg-pastelGreen' WHERE slug = 'savory-pastries';
UPDATE public.categories SET color = 'bg-pastelOrange' WHERE slug = 'stews';
