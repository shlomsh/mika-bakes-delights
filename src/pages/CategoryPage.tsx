import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Recipe, Category } from '@/data/sampleRecipes';
import { type Json } from "@/integrations/supabase/types";

const fetchCategoryAndRecipes = async (categorySlug: string | undefined): Promise<{ category: Category | null; recipes: Recipe[] }> => {
  if (!categorySlug) {
    return { category: null, recipes: [] };
  }

  // 1. Fetch the category by slug
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !categoryData) {
    console.error('Error fetching category:', categoryError);
    return { category: null, recipes: [] };
  }

  // 2. Fetch recipes for that category
  const { data: recipesData, error: recipesError } = await supabase
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
        name,
        created_at,
        updated_at
      )
    `)
    .eq('category_id', categoryData.id);

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError);
    return { category: categoryData, recipes: [] };
  }
  
  // Ensure recipesData is not null. It should conform to Recipe[] due to the select and types.
  // Type casting might be needed if Supabase types and frontend types diverge significantly,
  // but the changes to Recipe interface and select statement should align them.
  const recipes: Recipe[] = recipesData || [];

  return { category: categoryData, recipes };
};

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: () => fetchCategoryAndRecipes(categoryName),
    enabled: !!categoryName, // Only run query if categoryName is defined
  });

  const category = data?.category;
  const recipesForCategory = data?.recipes || [];

  const formattedCategoryName = category
    ? category.name
    : categoryName?.replace('-', ' ') || 'קטגוריה';


  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <p className="text-choco text-xl">טוען מתכונים...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
          <h1 className="font-fredoka text-3xl text-choco">
            קטגוריה לא נמצאה
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
            לא הצלחנו למצוא את הקטגוריה המבוקשת. נסה לחזור לדף הבית ולבחור קטגוריה אחרת.
          </p>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
        <h1 className="font-fredoka text-3xl text-choco">
          מתכונים בקטגוריית: {formattedCategoryName}
        </h1>
        <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
          <Link to="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        {recipesForCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipesForCategory.map((recipe: Recipe) => (
              <Card key={recipe.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={recipe.image_url || `https://via.placeholder.com/400x200/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`} 
                  alt={recipe.name} 
                  className="w-full h-48 object-cover" 
                />
                <CardHeader>
                  <CardTitle className="font-fredoka text-xl text-choco">{recipe.name}</CardTitle>
                  {recipe.description && (
                    <CardDescription className="text-choco/75 h-12 overflow-hidden text-ellipsis">
                      {recipe.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto">
                  {/* This button will eventually link to a full recipe page */}
                  <Button className="w-full bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold">
                    הצג מתכון
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-16 w-16 text-choco/50 mb-4" />
            <p className="text-choco/80 text-lg">
              אוי, עוד אין מתכונים בקטגוריה זו.
            </p>
            <p className="text-choco/60 text-md">בקרוב נוסיף לכאן עוד המון מתכונים טעימים!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
