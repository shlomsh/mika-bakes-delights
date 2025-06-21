
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const InstructionsSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "instructions",
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
        <CardTitle className="font-fredoka text-xl text-choco">אופן ההכנה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="instructions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={`instructions-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <FormField
                          control={control}
                          name={`instructions.${index}.description`}
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
                                <FormControl><Textarea {...field} placeholder="תאר את שלב ההכנה..." /></FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="מחק שלב">
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
