
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowRight } from 'lucide-react';
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
      <div className="flex items-center gap-2 sm:gap-4 self-end mb-4 md:mb-6">
        {isAuthenticated && (
          <>
            {/* Desktop Edit Button */}
            <Button variant="outline" onClick={onEdit} className="hidden sm:inline-flex">
              <Pencil className="ml-2 h-4 w-4" />
              ערוך מתכון
            </Button>
            {/* Mobile Edit Button */}
            <Button variant="outline" size="icon" onClick={onEdit} className="sm:hidden" aria-label="ערוך מתכון">
              <Pencil className="h-4 w-4" />
            </Button>
            
            {/* Desktop Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="hidden sm:inline-flex">
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

            {/* Mobile Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="sm:hidden" aria-label="מחק מתכון">
                  <Trash2 className="h-4 w-4" />
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
        {/* Desktop Back Button */}
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link to="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
        {/* Mobile Back Button */}
        <Button asChild variant="outline" size="icon" className="sm:hidden" aria-label="חזרה לדף הבית">
          <Link to="/">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
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
