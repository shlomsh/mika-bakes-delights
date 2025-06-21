
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const IngredientsSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      move(sourceIndex, destinationIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco">מצרכים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="ingredients-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={`ingredients-${field.id}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <FormField
                          control={control}
                          name={`ingredients.${index}.description`}
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
                                <FormControl><Input {...field} placeholder="לדוגמה: 2 כוסות קמח" /></FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="מחק מרכיב">
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
        <Button type="button" variant="outline" onClick={() => append({ description: '' })} className="hidden sm:inline-flex">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף מרכיב
        </Button>
        {/* Mobile Add Button */}
        <Button type="button" variant="outline" size="icon" onClick={() => append({ description: '' })} className="sm:hidden" aria-label="הוסף מרכיב">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default IngredientsSection;
