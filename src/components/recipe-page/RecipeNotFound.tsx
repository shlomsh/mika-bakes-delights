
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const RecipeNotFound = () => (
  <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
    <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
      <h1 className="font-fredoka text-3xl text-choco">
        אופס! מתכון לא נמצא
      </h1>
      <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
        <Link to="/">
          <ArrowRight className="ml-2 h-4 w-4" />
          חזרה לדף הבית
        </Link>
      </Button>
    </header>
    <main className="w-full max-w-4xl">
      <p className="text-choco/80 text-lg text-center">
        לא הצלחנו למצוא את המתכון המבוקש. אולי הוא התחבא? נסה לחזור אחורה ולבחור מתכון אחר.
      </p>
    </main>
  </div>
);

export default RecipeNotFound;
