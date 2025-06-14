
-- This script migrates data from the old json columns in 'recipes' to the new structured tables.

-- 1. Create a temporary function to perform the migration.
CREATE OR REPLACE FUNCTION migrate_recipe_data()
RETURNS void AS $$
DECLARE
    r record;
    ingredient_desc text;
    instruction_desc text;
    ingredient_sort_order integer;
    instruction_step_number integer;
BEGIN
    FOR r IN SELECT * FROM public.recipes LOOP
        -- Migrate ingredients if they exist and are a JSON array
        IF r.ingredients IS NOT NULL AND jsonb_typeof(r.ingredients) = 'array' THEN
            ingredient_sort_order := 1;
            FOR ingredient_desc IN SELECT * FROM jsonb_array_elements_text(r.ingredients) LOOP
                INSERT INTO public.recipe_ingredients (recipe_id, description, sort_order)
                VALUES (r.id, ingredient_desc, ingredient_sort_order);
                ingredient_sort_order := ingredient_sort_order + 1;
            END LOOP;
        END IF;

        -- Migrate instructions if they exist
        IF r.instructions IS NOT NULL THEN
            BEGIN
                -- Instructions are stored as a JSON string in a text column, so we cast it
                instruction_step_number := 1;
                FOR instruction_desc IN SELECT * FROM jsonb_array_elements_text(r.instructions::jsonb) LOOP
                    INSERT INTO public.recipe_instructions (recipe_id, description, step_number)
                    VALUES (r.id, instruction_desc, instruction_step_number);
                    instruction_step_number := instruction_step_number + 1;
                END LOOP;
            EXCEPTION WHEN others THEN
                -- If casting to JSON fails for any reason, we'll log it and continue.
                RAISE NOTICE 'Could not parse instructions for recipe ID %', r.id;
            END;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. Execute the migration function to move the data.
SELECT migrate_recipe_data();

-- 3. Drop the temporary function as it's no longer needed.
DROP FUNCTION migrate_recipe_data();

-- 4. Remove the old 'ingredients' and 'instructions' columns from the 'recipes' table.
ALTER TABLE public.recipes DROP COLUMN IF EXISTS ingredients;
ALTER TABLE public.recipes DROP COLUMN IF EXISTS instructions;
