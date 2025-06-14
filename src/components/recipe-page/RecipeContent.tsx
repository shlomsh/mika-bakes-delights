
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from '@/components/ui/card';
import { ListChecks, Utensils, Soup, Sparkles } from 'lucide-react';
import { RecipeWithDetails } from './types';

interface RecipeContentProps {
  recipe: RecipeWithDetails;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  return (
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
            {recipe.recipe_garnishes && recipe.recipe_garnishes.length > 0 && (
              <div className="mb-6">
                <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                  <Sparkles className="mr-2 text-pastelYellow" />
                  תוספת:
                </h2>
                <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                  {recipe.recipe_garnishes.map((step) => (
                    <li key={step.step_number}>{step.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </div>
      </div>
      {recipe.recipe_instructions && recipe.recipe_instructions.length > 0 && (
        <CardFooter className="flex-col items-start p-6 bg-white border-t border-choco/10">
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
      {recipe.recipe_sauces && recipe.recipe_sauces.length > 0 && (
        <CardFooter className="flex-col items-start p-6 bg-white rounded-b-lg border-t border-choco/10">
          <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
            <Soup className="mr-2 text-pastelOrange" />
            רוטב:
          </h2>
          <ul className="w-full list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
            {recipe.recipe_sauces.map((step) => (
              <li key={step.step_number}>{step.description}</li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecipeContent;
