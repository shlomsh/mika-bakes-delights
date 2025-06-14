
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react'; // Using an available icon

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  // Capitalize the first letter of the category name for display
  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : 'Category';

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
        <h1 className="font-fredoka text-3xl text-choco">
          מתכונים בקטגוריית: {formattedCategoryName}
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
          בקרוב יוצגו כאן המתכונים עבור קטגוריה זו.
        </p>
        {/* Placeholder for recipes list */}
      </main>
    </div>
  );
};

export default CategoryPage;
