
-- Insert sample recipes into the database

-- Recipe 1: עוגיות שוקולד צ'יפס (Desserts)
INSERT INTO public.recipes (name, description, image_url, ingredients, instructions, category_id)
SELECT
  'עוגיות שוקולד צ''יפס', -- Note: Escaped single quote for SQL
  'עוגיות נימוחות עם המון שוקולד צ''יפס', -- Note: Escaped single quote
  '/lovable-uploads/4987dbcd-1e75-4507-80c7-b7fc9ca1f7ee.png',
  '["1 כוס קמח", "100 גרם חמאה", "1/2 כוס סוכר חום", "1/4 כוס סוכר לבן", "1 ביצה", "1 כפית תמצית וניל", "1/2 כפית סודה לשתייה", "קורט מלח", "1 כוס שוקולד צ''יפס"]'::jsonb, -- Note: Escaped single quote
  '1. חממו תנור ל-180 מעלות.\n2. ערבבו חמאה וסוכרים.\n3. הוסיפו ביצה ווניל.\n4. בקערה נפרדת ערבבו קמח, סודה לשתייה ומלח.\n5. הוסיפו את תערובת הקמח לתערובת החמאה.\n6. הוסיפו שוקולד צ''יפס.\n7. צרו עוגיות ואפו 10-12 דקות.', -- Note: Escaped single quote
  c.id
FROM public.categories c
WHERE c.slug = 'desserts';

-- Recipe 2: עלי גפן (Savory Pastries)
INSERT INTO public.recipes (name, description, image_url, ingredients, instructions, category_id)
SELECT
  'עלי גפן',
  'עלי גפן ממולאים באורז וירקות, מתכון משפחתי',
  '/lovable-uploads/1ccfb5d5-09ee-4b54-8cdc-7af66df9703b.png',
  '["50 עלי גפן טריים או משומרים", "1 כוס אורז עגול", "2 בצלים קצוצים", "1/2 כוס פטרוזיליה קצוצה", "1/4 כוס שמיר קצוץ", "1/4 כוס נענע קצוצה", "1/4 כוס שמן זית", "מיץ מ-2 לימונים", "מלח ופלפל לפי הטעם"]'::jsonb,
  '1. אם משתמשים בעלים טריים, חולטים אותם במים רותחים.\n2. מטגנים בצל בשמן זית.\n3. מוסיפים אורז, עשבי תיבול, מלח ופלפל.\n4. ממלאים כל עלה בכפית מהמלית ומגלגלים.\n5. מסדרים בסיר, מוסיפים מים, מיץ לימון ומעט שמן זית.\n6. מבשלים על אש נמוכה כשעה.',
  c.id
FROM public.categories c
WHERE c.slug = 'savory-pastries';

