
DO $$
DECLARE
    dessert_category_id UUID;
    new_recipe_id UUID;
BEGIN
    -- 1. Get the ID for the 'desserts' category
    SELECT id INTO dessert_category_id FROM public.categories WHERE slug = 'desserts' LIMIT 1;

    -- If the category doesn't exist, we can't proceed.
    IF dessert_category_id IS NULL THEN
        RAISE EXCEPTION 'Category "desserts" not found. Please ensure it exists before running this script.';
    END IF;

    -- 2. Insert the new chocolate cake recipe
    INSERT INTO public.recipes (name, description, image_url, category_id, recommended)
    VALUES (
        'עוגת שוקולד עשירה',
        'עוגת שוקולד קלאסית, עשירה ונימוחה שכולם אוהבים. מושלמת לכל אירוע או סתם כשמתחשק משהו מתוק ומפנק.',
        'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=1964&auto=format&fit=crop',
        dessert_category_id,
        true
    )
    RETURNING id INTO new_recipe_id;

    -- 3. Insert ingredients for the recipe
    INSERT INTO public.recipe_ingredients (recipe_id, description, sort_order)
    VALUES
        (new_recipe_id, '200 גרם שוקולד מריר, קצוץ', 1),
        (new_recipe_id, '200 גרם חמאה', 2),
        (new_recipe_id, '1 כוס סוכר לבן', 3),
        (new_recipe_id, '4 ביצים גדולות', 4),
        (new_recipe_id, '1 כוס קמח לבן', 5),
        (new_recipe_id, '1 כפית אבקת אפייה', 6),
        (new_recipe_id, 'קורט מלח', 7);

    -- 4. Insert instructions for the recipe
    INSERT INTO public.recipe_instructions (recipe_id, description, step_number)
    VALUES
        (new_recipe_id, 'מחממים תנור ל-170 מעלות צלזיוס ומשמנים היטב תבנית עגולה בקוטר 24 ס"מ.', 1),
        (new_recipe_id, 'ממיסים יחד שוקולד מריר וחמאה בקערה חסינת חום מעל סיר עם מים רותחים (בן מארי), או במיקרוגל בפולסים קצרים.', 2),
        (new_recipe_id, 'מורידים מהאש, מוסיפים את הסוכר ומערבבים היטב עד שהוא נמס בתערובת.', 3),
        (new_recipe_id, 'מוסיפים את הביצים, אחת בכל פעם, וטורפים היטב לאחר כל הוספה עד לקבלת תערובת חלקה.', 4),
        (new_recipe_id, 'בקערה נפרדת, מערבבים את הקמח, אבקת האפייה והמלח. מוסיפים את תערובת היבשים לתערובת השוקולד ומערבבים בעדינות רק עד שהקמח נטמע. היזהרו מערבוב יתר.', 5),
        (new_recipe_id, 'יוצקים את הבלילה לתבנית המשומנת ואופים במשך 30-35 דקות. העוגה מוכנה כאשר קיסם הננעץ במרכזה יוצא עם פירורים לחים.', 6),
        (new_recipe_id, 'מוציאים מהתנור ומניחים לעוגה להצטנן בתבנית במשך 15 דקות לפני שמעבירים אותה לרשת צינון להצטננות מלאה. ניתן לקשט באבקת סוכר או גנאש שוקולד.', 7);
END $$;
