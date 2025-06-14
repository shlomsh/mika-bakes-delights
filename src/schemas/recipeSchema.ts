
import * as z from 'zod';

export const recipeSchema = z.object({
  name: z.string().min(3, { message: "שם המתכון חייב להכיל לפחות 3 תווים." }),
  description: z.string().optional(),
  category_id: z.string().uuid().nullable().optional(),
  image_file: z.instanceof(FileList).optional(),
  ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות מרכיב אחד."),
  instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור ההוראה לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות שלב הכנה אחד."),
  sauces: z.array(z.object({
    description: z.string().min(1, { message: "תיאור הרוטב לא יכול להיות ריק." })
  })).optional(),
  garnish_ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור מרכיב התוספת לא יכול להיות ריק." })
  })).optional(),
  garnish_instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור התוספת לא יכול להיות ריק." })
  })).optional(),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
