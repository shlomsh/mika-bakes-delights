
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const GarnishSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();

  const { fields: garnishIngredientFields, append: appendGarnishIngredient, remove: removeGarnishIngredient, move: moveGarnishIngredient } = useFieldArray({
    control, name: "garnish_ingredients"
  });

  const { fields: garnishInstructionFields, append: appendGarnishInstruction, remove: removeGarnishInstruction, move: moveGarnishInstruction } = useFieldArray({
    control, name: "garnish_instructions"
  });

  const handleGarnishIngredientDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      moveGarnishIngredient(sourceIndex, destinationIndex);
    }
  };

  const handleGarnishInstructionDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      moveGarnishInstruction(sourceIndex, destinationIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco flex items-center">
          <Sparkles className="ml-2 h-5 w-5 text-pastelYellow" />
          תוספת (אופציונלי)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <FormLabel className="font-fredoka text-lg text-choco">מרכיבי התוספת</FormLabel>
          <div className="space-y-4 mt-2">
            <DragDropContext onDragEnd={handleGarnishIngredientDragEnd}>
              <Droppable droppableId="garnish-ingredients">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {garnishIngredientFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={`garnish-ingredients-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <FormField
                              control={control}
                              name={`garnish_ingredients.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-500 font-medium w-6 text-center">{index + 1}.</span>
                                    <FormControl><Input {...field} placeholder="לדוגמה: 1/2 כוס פטרוזיליה קצוצה" /></FormControl>
                                    <Button type="button" variant="outline" size="icon" onClick={() => removeGarnishIngredient(index)} aria-label="מחק מרכיב מהתוספת">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {/* Desktop Add Button */}
            <Button type="button" variant="outline" onClick={() => appendGarnishIngredient({ description: '' })} className="hidden sm:inline-flex">
              <PlusCircle className="mr-2 h-4 w-4" /> הוסף מרכיב לתוספת
            </Button>
            {/* Mobile Add Button */}
            <Button type="button" variant="outline" size="icon" onClick={() => appendGarnishIngredient({ description: '' })} className="sm:hidden" aria-label="הוסף מרכיב לתוספת">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <FormLabel className="font-fredoka text-lg text-choco mt-4">הוראות להכנת התוספת</FormLabel>
          <div className="space-y-4 mt-2">
            <DragDropContext onDragEnd={handleGarnishInstructionDragEnd}>
              <Droppable droppableId="garnish-instructions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {garnishInstructionFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={`garnish-instructions-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <FormField
                              control={control}
                              name={`garnish_instructions.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>שלב {index + 1}</FormLabel>
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors mt-2"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <FormControl><Textarea {...field} placeholder="תאר את שלב הכנת התוספת..." /></FormControl>
                                    <Button type="button" variant="outline" size="icon" onClick={() => removeGarnishInstruction(index)} aria-label="מחק שלב מהתוספת">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {/* Desktop Add Button */}
            <Button type="button" variant="outline" onClick={() => appendGarnishInstruction({ description: '' })} className="hidden sm:inline-flex">
              <PlusCircle className="mr-2 h-4 w-4" /> הוסף שלב לתוספת
            </Button>
            {/* Mobile Add Button */}
            <Button type="button" variant="outline" size="icon" onClick={() => appendGarnishInstruction({ description: '' })} className="sm:hidden" aria-label="הוסף שלב לתוספת">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GarnishSection;
