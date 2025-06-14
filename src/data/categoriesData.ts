
import type { LucideIcon } from "lucide-react";
import { Cake, Utensils, BookOpen } from "lucide-react";

interface Category {
  label: string;
  slug: string;
  color: string;
  icon: LucideIcon;
  desc: string;
}

export const categories: Category[] = [
  {
    label: "קינוחים",
    slug: "desserts",
    color: "bg-rose-200",
    icon: Cake,
    desc: "עוגות, עוגיות, פודינגים וטעמים מתוקים לילדים ולמבוגרים"
  },
  {
    label: "מאפים מלוחים",
    slug: "savory-pastries",
    color: "bg-pink-100",
    icon: Utensils,
    desc: "בצקים, לחמים, פשטידות ומגוון מאפים שאוהבים"
  },
  {
    label: "תבשילים",
    slug: "stews",
    color: "bg-rose-100",
    icon: BookOpen,
    desc: "מנות ביתיות, תבשילי משפחה ומאכלים מנחמים"
  }
];
