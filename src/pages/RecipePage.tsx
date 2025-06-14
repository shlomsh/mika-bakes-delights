import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, ChefHat, ListChecks, Utensils } from 'lucide-react';
import { Recipe } from '@/data/sampleRecipes'; // Assuming Recipe type is here
import { type Json } from "@/integrations/supabase/types";

const fetchRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  // recipeId is now asserted to be a string when this function is called by useQuery
  // No need for: if (!recipeId) return null; as queryFn won't run if key has null.

  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      ingredients,
      instructions,
      category_id,
      created_at,
      updated_at,
      categories (
        id,
        slug,
        name
      )
    `)
    .eq('id', recipeId)
    .single(); 

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
  return data as Recipe;
};

const RecipePage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>(); // recipeId can be undefined initially

  const { data: recipe, isLoading, error } = useQuery({
    // Use null in queryKey to disable query if recipeId is undefined/falsy
    // This is often more stable for hook counts than toggling 'enabled'.
    queryKey: ['recipe', recipeId || null], 
    queryFn: () => {
      // queryFn will only execute if recipeId is truthy (not null in key)
      // So, recipeId can be safely asserted as string here.
      if (!recipeId) return Promise.resolve(null); // Defensive, though should not be hit if key is null
      return fetchRecipeById(recipeId);
    },
    // Remove 'enabled: !!recipeId' as null in queryKey handles this.
  });

  const ingredientsArray = React.useMemo(() => {
    if (!recipe || !recipe.ingredients) return [];
    if (Array.isArray(recipe.ingredients)) return recipe.ingredients as string[];
    console.warn("Recipe ingredients are in an unexpected format:", recipe.ingredients);
    return [];
  }, [recipe]); // Keep dependency on 'recipe' as a whole for simplicity here

  const instructionsArray = React.useMemo(() => {
    if (!recipe || !recipe.instructions) return [];
    // Ensure instructions is a string before calling split
    if (typeof recipe.instructions !== 'string') {
        console.warn("Recipe instructions are not a string:", recipe.instructions);
        return [];
    }
    return recipe.instructions.split('\n').filter(line => line.trim() !== '');
  }, [recipe]); // Keep dependency on 'recipe' as a whole

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <ChefHat className="h-16 w-16 text-choco animate-pulse mb-4" />
        <p className="text-choco text-xl font-fredoka">טוען מתכון...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
          <h1 className="font-fredoka text-3xl text-choco">
            אופס! מתכון לא נמצא
          </h1>
          <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
        </header>
        <main className="w-full max-w-4xl">
          <p className="text-choco/80 text-lg text-center">
            לא הצלחנו למצוא את המתכון המבוקש. אולי הוא התחבא? נסה לחזור אחורה ולבחור מתכון אחר.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <header className="w-full max-w-5xl mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-fredoka text-3xl md:text-4xl text-choco text-center md:text-right">{recipe.name}</h1>
          {recipe.categories && (
            <Link to={`/category/${recipe.categories.slug}`} className="text-pastelOrange hover:underline font-fredoka text-lg">
              קטגוריה: {recipe.categories.name}
            </Link>
          )}
        </div>
        <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
          <Link to="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
      </header>

      <main className="w-full max-w-5xl">
        <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={recipe.image_url || `https://via.placeholder.com/600x400/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`}
                alt={recipe.name}
                className="w-full h-64 md:h-full object-cover md:rounded-r-lg md:rounded-l-none"
              />
            </div>
            <div className="md:w-1/2 flex flex-col">
              <CardHeader className="pb-3">
                {recipe.description && (
                  <CardDescription className="text-choco/80 text-md leading-relaxed">
                    {recipe.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                {ingredientsArray.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                      <ListChecks className="mr-2 text-pastelOrange" />
                      מצרכים:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                      {ingredientsArray.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
          {instructionsArray.length > 0 && (
            <CardFooter className="flex-col items-start p-6 bg-white rounded-b-lg border-t border-choco/10">
              <h2 className="font-fredoka text-xl text-choco mb-3 flex items-center">
                <Utensils className="mr-2 text-pastelBlue" />
                אופן ההכנה:
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-choco/90 w-full">
                {instructionsArray.map((step, index) => (
                  <li
                    key={index}
                    className="leading-relaxed p-2 bg-pastelBlue/10 rounded-md"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                ))}
              </ol>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
};

export default RecipePage;
