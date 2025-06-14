
DO $$
DECLARE
    new_recipe_id UUID;
    desserts_category_id UUID;
BEGIN
    -- Get the UUID for the 'desserts' category
    SELECT id INTO desserts_category_id FROM public.categories WHERE slug = 'desserts' LIMIT 1;

    -- Insert the new recipe and get its ID
    INSERT INTO public.recipes (name, description, category_id, image_url)
    VALUES (
        'פבלובה עם פירות יער',
        'פבלובה קלאסית, קריספית מבחוץ ורכה כמו מרשמלו מבפנים, עם קצפת וניל ופירות יער טריים.',
        desserts_category_id,
        '/lovable-uploads/a7bf2bc5-e9ca-40f6-82fd-ca8916ffc199.png'
    )
    RETURNING id INTO new_recipe_id;

    -- Insert ingredients for the new recipe
    INSERT INTO public.recipe_ingredients (recipe_id, description, sort_order)
    VALUES
        (new_recipe_id, '4 חלבונים L, בטמפרטורת החדר', 1),
        (new_recipe_id, '1 כוס (200 גרם) סוכר לבן', 2),
        (new_recipe_id, '1 כפית חומץ בן יין לבן', 3),
        (new_recipe_id, '1 כפית קורנפלור', 4),
        (new_recipe_id, '1 כפית תמצית וניל איכותית', 5),
        (new_recipe_id, 'לציפוי: 1 מיכל (250 מ"ל) שמנת מתוקה 38%', 6),
        (new_recipe_id, 'לציפוי: 2 כפות אבקת סוכר', 7),
        (new_recipe_id, 'לציפוי: 1 סלסלת פירות יער טריים (תותים, פטל, אוכמניות)', 8);

    -- Insert instructions for the new recipe
    INSERT INTO public.recipe_instructions (recipe_id, description, step_number)
    VALUES
        (new_recipe_id, 'מחממים תנור ל-120 מעלות (חום עליון-תחתון, לא טורבו) ומרפדים תבנית בנייר אפייה.', 1),
        (new_recipe_id, 'בקערת מיקסר נקייה ויבשה, מקציפים את החלבונים במהירות בינונית-גבוהה עד שנוצר קצף לבן ורך.', 2),
        (new_recipe_id, 'מוסיפים את הסוכר בהדרגה, כף אחר כף, וממשיכים להקציף עד שהקצף הופך ליציב, מבריק וכל הסוכר נמס (בודקים בין האצבעות).', 3),
        (new_recipe_id, 'מוסיפים את החומץ, הקורנפלור ותמצית הוניל ומקפלים בעדינות בעזרת מרית רק עד לאיחוד.', 4),
        (new_recipe_id, 'מעבירים את קצף המרנג לתבנית ויוצרים צורה של עיגול בקוטר של כ-20 ס"מ, עם שקע קטן במרכז.', 5),
        (new_recipe_id, 'אופים במשך שעה וחצי. לאחר האפייה, מכבים את התנור ומשאירים את הפבלובה להתקרר לחלוטין בתוך התנור עם הדלת סגורה (לפחות 3 שעות).', 6),
        (new_recipe_id, 'לפני ההגשה, מקציפים את השמנת המתוקה עם אבקת הסוכר לקצפת יציבה. מורחים את הקצפת במרכז הפבלובה ומקשטים בנדיבות עם פירות היער.', 7);
END $$;
