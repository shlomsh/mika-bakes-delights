
import * as z from 'zod';

export const recipeEditSchema = z.object({
  name: z.string().min(3, { message: "שם המתכון חייב להכיל לפחות 3 תווים." }),
  description: z.string().optional(),
  category_id: z.string().uuid({ message: "קטגוריה לא חוקית" }).nullable().optional(),
  image_file: z.instanceof(FileList).optional(),
  ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לא יכול להיות ריק." })
  })),
  instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור ההוראה לא יכול להיות ריק." })
  })),
  sauce_ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לרוטב לא יכול להיות ריק." })
  })).optional(),
  sauces: z.array(z.object({
    description: z.string().min(1, { message: "תיאור הרוטב לא יכול להיות ריק." })
  })).optional(),
  garnish_ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור מרכיב התוספת לא יכול להיות ריק." })
  })).optional(),
  garnish_instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור הוראת התוספת לא יכול להיות ריק." })
  })).optional(),
});

export type RecipeEditFormValues = z.infer<typeof recipeEditSchema>;
