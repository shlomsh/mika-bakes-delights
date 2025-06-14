
import React from 'react';
import { ChefHat } from 'lucide-react';

const RecipeLoading = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
    <ChefHat className="h-16 w-16 text-choco animate-pulse mb-4" />
    <p className="text-choco text-xl font-fredoka">טוען מתכון...</p>
  </div>
);

export default RecipeLoading;
