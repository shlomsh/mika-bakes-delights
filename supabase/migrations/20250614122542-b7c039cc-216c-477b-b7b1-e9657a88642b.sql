
DO $$
DECLARE
    cookie_recipe_id UUID;
BEGIN
    -- 1. Find the ID for the 'Chocolate Chip Cookies' recipe
    SELECT id INTO cookie_recipe_id FROM public.recipes WHERE name = 'עוגיות שוקולד צ''יפס' LIMIT 1;

    -- If the recipe exists, proceed to update it.
    IF cookie_recipe_id IS NOT NULL THEN
        -- 2. Clean up any old ingredients or instructions for this recipe to avoid duplication.
        DELETE FROM public.recipe_ingredients WHERE recipe_id = cookie_recipe_id;
        DELETE FROM public.recipe_instructions WHERE recipe_id = cookie_recipe_id;

        -- 3. Insert the new, structured ingredients.
        INSERT INTO public.recipe_ingredients (recipe_id, description, sort_order)
        VALUES
            (cookie_recipe_id, '1 כוס קמח', 1),
            (cookie_recipe_id, '100 גרם חמאה רכה', 2),
            (cookie_recipe_id, '1/2 כוס סוכר חום', 3),
            (cookie_recipe_id, '1/4 כוס סוכר לבן', 4),
            (cookie_recipe_id, '1 ביצה', 5),
            (cookie_recipe_id, '1 כפית תמצית וניל', 6),
            (cookie_recipe_id, '1/2 כפית סודה לשתייה', 7),
            (cookie_recipe_id, 'קורט מלח', 8),
            (cookie_recipe_id, '1 כוס שוקולד צ''יפס', 9);

        -- 4. Insert the new, step-by-step instructions.
        INSERT INTO public.recipe_instructions (recipe_id, description, step_number)
        VALUES
            (cookie_recipe_id, 'חממו תנור מראש ל-180 מעלות צלזיוס ורפדו תבנית אפייה בנייר אפייה.', 1),
            (cookie_recipe_id, 'בקערה בינונית, ערבבו יחד קמח, סודה לשתייה ומלח. הניחו בצד.', 2),
            (cookie_recipe_id, 'בקערה גדולה, הקציפו יחד חמאה רכה, סוכר לבן וסוכר חום עד לקבלת תערובת קרמית.', 3),
            (cookie_recipe_id, 'הוסיפו את הביצה ותמצית הווניל, וערבבו היטב.', 4),
            (cookie_recipe_id, 'הוסיפו בהדרגה את תערובת היבשים לתערובת הרטובה וערבבו רק עד לאיחוד.', 5),
            (cookie_recipe_id, 'קפלו בעדינות את השוקולד צ''יפס לתוך הבצק.', 6),
            (cookie_recipe_id, 'צרו כדורים מהבצק והניחו אותם על התבנית במרווחים.', 7),
            (cookie_recipe_id, 'אפו במשך 10-12 דקות, עד שהשוליים מזהיבים והמרכז עדיין רך.', 8),
            (cookie_recipe_id, 'הניחו לעוגיות להתקרר על התבנית למספר דקות לפני העברה לרשת צינון מלא. בתיאבון!', 9);
    ELSE
        RAISE EXCEPTION 'Recipe "עוגיות שוקולד צ''יפס" not found. Cannot update.';
    END IF;
END $$;
