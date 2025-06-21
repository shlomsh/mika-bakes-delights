
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const InstructionsSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "instructions",
  });

  const moveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco">אופן ההכנה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`instructions.${index}.description`}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>שלב {index + 1}</FormLabel>
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col gap-1 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => moveUp(index)}
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
                        onClick={() => moveDown(index)}
                        disabled={index === fields.length - 1}
                        className="h-6 w-6"
                        aria-label="הזז למטה"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea {...formField} placeholder="תאר את שלב ההכנה..." />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => remove(index)} 
                      aria-label="מחק שלב"
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
        <Button type="button" variant="outline" onClick={() => append({ description: '' })} className="hidden sm:inline-flex">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף שלב
        </Button>
        {/* Mobile Add Button */}
        <Button type="button" variant="outline" size="icon" onClick={() => append({ description: '' })} className="sm:hidden" aria-label="הוסף שלב">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstructionsSection;
