
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { sampleRecipes, Recipe } from '@/data/sampleRecipes'; // Import recipes and type

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' ')
    : 'Category';

  const recipesForCategory = sampleRecipes.filter(
    (recipe) => recipe.categorySlug === categoryName
  );

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
                <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle className="font-fredoka text-xl text-choco">{recipe.name}</CardTitle>
                  <CardDescription className="text-choco/75 h-12 overflow-hidden text-ellipsis">{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button className="w-full bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold">
                    הצג מתכון
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-choco/80 text-lg text-center">
            לא נמצאו מתכונים בקטגוריה זו. מתכונים נוספים יתווספו בקרוב!
          </p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
