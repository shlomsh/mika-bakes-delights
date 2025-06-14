
-- Update category colors to a new pastel theme
UPDATE public.categories SET color = 'bg-pastelOrange' WHERE slug = 'desserts';
UPDATE public.categories SET color = 'bg-pastelYellow' WHERE slug = 'savory-pastries';
UPDATE public.categories SET color = 'bg-pastelGreen' WHERE slug = 'stews';
