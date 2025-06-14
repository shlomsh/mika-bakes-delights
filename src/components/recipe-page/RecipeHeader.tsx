
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowRight } from 'lucide-react';
import AuthComponent from '@/components/Auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RecipeWithDetails } from './types';

interface RecipeHeaderProps {
  recipe: RecipeWithDetails;
  isAuthenticated: boolean;
  isDeletePending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe, isAuthenticated, isDeletePending, onEdit, onDelete }) => {
  return (
    <header className="w-full max-w-5xl mb-6 md:mb-10 flex flex-col">
      <div className="flex items-center gap-4 self-end mb-4 md:mb-6">
        {isAuthenticated && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="ml-2 h-4 w-4" />
              ערוך מתכון
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="ml-2 h-4 w-4" />
                  מחק מתכון
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent style={{direction: 'rtl'}}>
                <AlertDialogHeader>
                  <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                  <AlertDialogDescription>
                    פעולה זו לא ניתנת לביטול. פעולה זו תמחק לצמיתות את המתכון מהשרתים שלנו.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeletePending}
                  >
                    {isDeletePending ? "מוחק..." : "מחק"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
        <AuthComponent />
      </div>
      <div>
        <h1 className="font-fredoka text-3xl md:text-4xl text-choco text-center md:text-right">{recipe.name}</h1>
        {recipe.categories && (
          <Link to={`/category/${recipe.categories.slug}`} className="text-pastelOrange hover:underline font-fredoka text-lg">
            קטגוריה: {recipe.categories.name}
          </Link>
        )}
      </div>
    </header>
  );
};

export default RecipeHeader;
