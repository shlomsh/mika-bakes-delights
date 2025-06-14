
import React from "react";
import { Link } from "react-router-dom";
import { categories } from "@/data/categoriesData";

const CategoryCards: React.FC = () => (
  <aside className="flex flex-col gap-6 w-full" dir="rtl">
    {categories.map((cat) => (
      <Link to={`/category/${cat.slug}`} key={cat.label} className="no-underline">
        <div
          className={`rounded-3xl shadow-xl p-5 flex flex-col items-center justify-around h-40 ${cat.color} relative transition-transform hover:scale-105 cursor-pointer`}
          dir="rtl"
        >
          <cat.icon className="w-8 h-8 text-choco mb-2 opacity-85" strokeWidth={2.5} />
          <span className="font-fredoka text-2xl text-choco tracking-wide">{cat.label}</span>
          <span className="mt-2 text-choco/75 text-sm text-center w-11/12">{cat.desc}</span>
        </div>
      </Link>
    ))}
  </aside>
);

export default CategoryCards;
