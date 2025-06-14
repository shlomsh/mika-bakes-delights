
import { Recipe as BaseRecipe } from '@/data/sampleRecipes';

export interface Ingredient {
  description: string;
  sort_order: number;
}

export interface Instruction {
  description: string;
  step_number: number;
}

export interface Sauce {
  description: string;
  step_number: number;
}

export interface SauceIngredient {
  description: string;
  sort_order: number;
}

export interface GarnishIngredient {
  description: string;
  sort_order: number;
}

export interface GarnishInstruction {
  description: string;
  step_number: number;
}

export type RecipeWithDetails = Omit<BaseRecipe, 'ingredients' | 'instructions'> & {
  recommended: boolean;
  recipe_ingredients: Ingredient[];
  recipe_instructions: Instruction[];
  recipe_sauces: Sauce[];
  recipe_sauce_ingredients: SauceIngredient[];
  recipe_garnish_ingredients: GarnishIngredient[];
  recipe_garnish_instructions: GarnishInstruction[];
  categories: {
    id: string;
    slug: string;
    name: string;
  } | null;
};
