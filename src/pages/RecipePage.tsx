import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, ChefHat, ListChecks, Utensils, Pencil } from 'lucide-react';
import { Recipe as BaseRecipe } from '@/data/sampleRecipes';
import RecipeEditForm from '@/components/RecipeEditForm';

interface Ingredient {
  description: string;
  sort_order: number;
}

interface Instruction {
  description: string;
  step_number: number;
}

type RecipeWithDetails = Omit<BaseRecipe, 'ingredients' | 'instructions'> & {
  recipe_ingredients: Ingredient[];
  recipe_instructions: Instruction[];
  categories: {
    id: string;
    slug: string;
    name: string;
  } | null;
};


const fetchRecipeById = async (recipeId: string): Promise<RecipeWithDetails | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      category_id,
      created_at,
      updated_at,
      categories (
        id,
        slug,
        name
      ),
      recipe_ingredients (
        description,
        sort_order
      ),
      recipe_instructions (
        description,
        step_number
      )
    `)
    .eq('id', recipeId)
    .order('sort_order', { foreignTable: 'recipe_ingredients', ascending: true })
    .order('step_number', { foreignTable: 'recipe_instructions', ascending: true })
    .single(); 

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
  return data as unknown as RecipeWithDetails;
};

const RecipePage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const { data: recipe, isLoading, error, refetch } = useQuery({
    queryKey: ['recipe', recipeId || null], 
    queryFn: () => {
      if (!recipeId) return Promise.resolve(null);
      return fetchRecipeById(recipeId);
    },
  });

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

  const handleSaveSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  if (isEditing) {
    return <RecipeEditForm recipe={recipe} onCancel={() => setIsEditing(false)} onSaveSuccess={handleSaveSuccess} />;
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
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-choco border-choco hover:bg-choco/10" onClick={() => setIsEditing(true)}>
            <Pencil className="ml-2 h-4 w-4" />
            ערוך מתכון
          </Button>
          <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
        </div>
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
                {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                      <ListChecks className="mr-2 text-pastelOrange" />
                      מצרכים:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                      {recipe.recipe_ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
          {recipe.recipe_instructions && recipe.recipe_instructions.length > 0 && (
            <CardFooter className="flex-col items-start p-6 bg-white rounded-b-lg border-t border-choco/10">
              <h2 className="font-fredoka text-xl text-choco mb-4 flex items-center">
                <Utensils className="mr-2 text-pastelBlue" />
                אופן ההכנה:
              </h2>
              <ol className="w-full list-none space-y-6 text-choco/90">
                {recipe.recipe_instructions.map((step) => (
                  <li key={step.step_number} className="flex items-start gap-x-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pastelBlue text-choco font-fredoka text-lg font-bold">
                      {step.step_number}
                    </div>
                    <div
                      className="flex-1 pt-1 leading-relaxed text-choco/90"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </li>
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
