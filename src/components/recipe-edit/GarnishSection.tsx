
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  const handleGarnishIngredientsDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      moveGarnishIngredient(sourceIndex, destinationIndex);
    }
  };

  const handleGarnishInstructionsDragEnd = (result: any) => {
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
          <FormLabel className="font-fredoka text-lg text-choco">מצרכים לתוספת</FormLabel>
          <div className="space-y-4 mt-2">
            <DragDropContext onDragEnd={handleGarnishIngredientsDragEnd}>
              <Droppable droppableId="garnish-ingredients-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {garnishIngredientFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg bg-white' : ''}`}
                          >
                            <FormField
                              control={control}
                              name={`garnish_ingredients.${index}.description`}
                              render={({ field: formField }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 font-medium w-6 text-center">{index + 1}.</span>
                                    <FormControl>
                                      <Input {...formField} placeholder="לדוגמה: עלי פטרוזיליה" />
                                    </FormControl>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="icon" 
                                      onClick={() => removeGarnishIngredient(index)} 
                                      aria-label="מחק מצרך לתוספת"
                                    >
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
              <PlusCircle className="mr-2 h-4 w-4" /> הוסף מצרך לתוספת
            </Button>
            {/* Mobile Add Button */}
            <Button type="button" variant="outline" size="icon" onClick={() => appendGarnishIngredient({ description: '' })} className="sm:hidden" aria-label="הוסף מצרך לתוספת">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <FormLabel className="font-fredoka text-lg text-choco mt-4">אופן הכנת התוספת</FormLabel>
          <div className="space-y-4 mt-2">
            <DragDropContext onDragEnd={handleGarnishInstructionsDragEnd}>
              <Droppable droppableId="garnish-instructions-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {garnishInstructionFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg bg-white' : ''}`}
                          >
                            <FormField
                              control={control}
                              name={`garnish_instructions.${index}.description`}
                              render={({ field: formField }) => (
                                <FormItem>
                                  <FormLabel>שלב {index + 1}</FormLabel>
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-2 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <FormControl>
                                      <Textarea {...formField} placeholder="תאר את שלב הכנת התוספת..." />
                                    </FormControl>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="icon" 
                                      onClick={() => removeGarnishInstruction(index)} 
                                      aria-label="מחק שלב מהתוספת"
                                    >
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
