import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type RecipePick = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

const fetchRecommendedRecipes = async (): Promise<RecipePick[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, name, description, image_url')
    .eq('recommended', true);

  if (error) {
    console.error('Error fetching recommended recipes:', error);
    throw new Error('Could not fetch recommended recipes');
  }

  return data || [];
};

const RecipePicks: React.FC = () => {
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['recommendedRecipes'],
    queryFn: fetchRecommendedRecipes,
  });

  if (isLoading) {
    return (
      <section className="bg-white rounded-3xl shadow-lg p-7 mt-8 flex justify-center items-center" dir="rtl" style={{ minHeight: '200px' }}>
        <Loader2 className="w-8 h-8 text-choco animate-spin" />
      </section>
    );
  }
  
  return (
    <section className="bg-white rounded-3xl shadow-lg p-7 mt-8" dir="rtl">
      <h2 className="font-fredoka text-2xl mb-4 text-choco">מומלצים</h2>
      {isError || !recipes || recipes.length === 0 ? (
        <p className="text-choco/80">לא נמצאו מתכונים מומלצים כרגע.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recipes.map((recipe) => (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/20" key={recipe.id}>
              <img 
                src={recipe.image_url || `https://via.placeholder.com/150/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`} 
                alt={recipe.name} 
                className="w-16 h-16 object-cover rounded-xl border-2 border-pastelYellow shadow" 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-fredoka text-lg text-choco flex-row">
                  <span>{recipe.name}</span>
                </div>
                <div className="text-choco/80 text-sm">{recipe.description}</div>
              </div>
              <Button
                asChild
                size="sm"
                className="mr-auto bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold shrink-0"
              >
                <Link to={`/recipe/${recipe.id}`}>
                  הצג מתכון
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecipePicks;
