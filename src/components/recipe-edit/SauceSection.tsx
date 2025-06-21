
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Blend, ChevronUp, ChevronDown } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const SauceSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  
  const { fields: sauceIngredientFields, append: appendSauceIngredient, remove: removeSauceIngredient, move: moveSauceIngredient } = useFieldArray({
    control, name: "sauce_ingredients"
  });

  const { fields: sauceFields, append: appendSauce, remove: removeSauce, move: moveSauce } = useFieldArray({
    control, name: "sauces"
  });

  const moveSauceIngredientUp = (index: number) => {
    if (index > 0) {
      moveSauceIngredient(index, index - 1);
    }
  };

  const moveSauceIngredientDown = (index: number) => {
    if (index < sauceIngredientFields.length - 1) {
      moveSauceIngredient(index, index + 1);
    }
  };

  const moveSauceUp = (index: number) => {
    if (index > 0) {
      moveSauce(index, index - 1);
    }
  };

  const moveSauceDown = (index: number) => {
    if (index < sauceFields.length - 1) {
      moveSauce(index, index + 1);
    }
  };

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
            <div className="space-y-4">
              {sauceIngredientFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={control}
                  name={`sauce_ingredients.${index}.description`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveSauceIngredientUp(index)}
                            disabled={index === 0}
                            className="h-6 w-6"
                            aria-label="הזז למעלה"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveSauceIngredientDown(index)}
                            disabled={index === sauceIngredientFields.length - 1}
                            className="h-6 w-6"
                            aria-label="הזז למטה"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-gray-500 font-medium w-6 text-center">{index + 1}.</span>
                        <FormControl>
                          <Input {...formField} placeholder="לדוגמה: 1/2 כוס שמן זית" />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => removeSauceIngredient(index)} 
                          aria-label="מחק מצרך לרוטב"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
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
            <div className="space-y-4">
              {sauceFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={control}
                  name={`sauces.${index}.description`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>שלב {index + 1}</FormLabel>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-1 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveSauceUp(index)}
                            disabled={index === 0}
                            className="h-6 w-6"
                            aria-label="הזז למעלה"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveSauceDown(index)}
                            disabled={index === sauceFields.length - 1}
                            className="h-6 w-6"
                            aria-label="הזז למטה"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea {...formField} placeholder="תאר את שלב הכנת הרוטב..." />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => removeSauce(index)} 
                          aria-label="מחק שלב מהרוטב"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
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
