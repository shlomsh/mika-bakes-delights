
import React from "react";
import { Cake, Utensils, BookOpen } from "lucide-react";

const categories = [
  {
    label: "קינוחים",
    color: "bg-pastelBlue",
    icon: Cake,
    desc: "עוגות, עוגיות, פודינגים וטעמים מתוקים לילדים ולמבוגרים"
  },
  {
    label: "מאפים מלוחים",
    color: "bg-pastelOrange",
    icon: Utensils,
    desc: "בצקים, לחמים, פשטידות ומגוון מאפים שאוהבים"
  },
  {
    label: "תבשילים",
    color: "bg-pastelGreen",
    icon: BookOpen,
    desc: "מנות ביתיות, תבשילי משפחה ומאכלים מנחמים"
  }
];

const CategoryCards: React.FC = () => (
  <aside className="flex flex-col gap-6 w-full" dir="rtl">
    {categories.map((cat) => (
      <div
        key={cat.label}
        className={`rounded-3xl shadow-xl p-5 flex flex-col items-center justify-around h-40 ${cat.color} relative transition-transform hover:scale-105`}
        dir="rtl"
      >
        <cat.icon className="w-8 h-8 text-choco mb-2 opacity-85" strokeWidth={2.5} />
        <span className="font-fredoka text-2xl text-choco tracking-wide">{cat.label}</span>
        <span className="mt-2 text-choco/75 text-sm text-center w-11/12">{cat.desc}</span>
      </div>
    ))}
  </aside>
);

export default CategoryCards;
