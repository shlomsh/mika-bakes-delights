import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Blend } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const SauceSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  
  const { fields: sauceIngredientFields, append: appendSauceIngredient, remove: removeSauceIngredient } = useFieldArray({
    control, name: "sauce_ingredients"
  });

  const { fields: sauceFields, append: appendSauce, remove: removeSauce } = useFieldArray({
    control, name: "sauces"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco flex items-center">
          <Blend className="ml-2 h-5 w-5 text-pastelOrange" />
          רוטב (אופציונלי)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <FormLabel className="font-fredoka text-lg text-choco">מצרכים לרוטב</FormLabel>
          <div className="space-y-4 mt-2">
            {sauceIngredientFields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`sauce_ingredients.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium w-6 text-center">{index + 1}.</span>
                      <FormControl><Input {...field} placeholder="לדוגמה: 1/2 כוס שמן זית" /></FormControl>
                      <Button type="button" variant="outline" size="icon" onClick={() => removeSauceIngredient(index)} aria-label="מחק מצרך לרוטב">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {/* Desktop Add Button */}
            <Button type="button" variant="outline" onClick={() => appendSauceIngredient({ description: '' })} className="hidden sm:inline-flex">
              <PlusCircle className="mr-2 h-4 w-4" /> הוסף מצרך לרוטב
            </Button>
            {/* Mobile Add Button */}
            <Button type="button" variant="outline" size="icon" onClick={() => appendSauceIngredient({ description: '' })} className="sm:hidden" aria-label="הוסף מצרך לרוטב">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <FormLabel className="font-fredoka text-lg text-choco mt-4">אופן הכנת הרוטב</FormLabel>
          <div className="space-y-4 mt-2">
            {sauceFields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`sauces.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שלב {index + 1}</FormLabel>
                    <div className="flex items-start gap-2">
                      <FormControl><Textarea {...field} placeholder="תאר את שלב הכנת הרוטב..." /></FormControl>
                      <Button type="button" variant="outline" size="icon" onClick={() => removeSauce(index)} aria-label="מחק שלב מהרוטב">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {/* Desktop Add Button */}
            <Button type="button" variant="outline" onClick={() => appendSauce({ description: '' })} className="hidden sm:inline-flex">
              <PlusCircle className="mr-2 h-4 w-4" /> הוסף שלב לרוטב
            </Button>
            {/* Mobile Add Button */}
            <Button type="button" variant="outline" size="icon" onClick={() => appendSauce({ description: '' })} className="sm:hidden" aria-label="הוסף שלב לרוטב">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SauceSection;
