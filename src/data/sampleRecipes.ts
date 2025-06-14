
export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  categorySlug: 'desserts' | 'savory-pastries' | 'stews';
}

export const sampleRecipes: Recipe[] = [
  // Desserts
  {
    id: 'dessert-1',
    name: 'עוגת שוקולד פשוטה',
    description: 'עוגת שוקולד עשירה וקלה להכנה, מושלמת לכל אירוע.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400', // Placeholder cake image
    categorySlug: 'desserts',
  },
  {
    id: 'dessert-2',
    name: 'עוגיות חמאה קלאסיות',
    description: 'עוגיות חמאה פריכות ונמסות בפה, בדיוק כמו של סבתא.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=400', // Placeholder cookies image
    categorySlug: 'desserts',
  },
  // Savory Pastries
  {
    id: 'savory-1',
    name: 'קיש בצל ופטריות',
    description: 'קיש עשיר בטעמים עם בצק פריך ומילוי מפנק של בצל ופטריות.',
    image: 'https://images.unsplash.com/photo-1565000095752-57f0518b38a5?q=80&w=400', // Placeholder quiche image
    categorySlug: 'savory-pastries',
  },
  {
    id: 'savory-2',
    name: 'לחמניות שום מהירות',
    description: 'לחמניות שום רכות ואווריריות שכיף להגיש לצד כל ארוחה.',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4200d586b6?q=80&w=400', // Placeholder bread rolls image
    categorySlug: 'savory-pastries',
  },
  // Stews
  {
    id: 'stew-1',
    name: 'תבשיל קציצות ברוטב עגבניות',
    description: 'קציצות בשר רכות ועסיסיות ברוטב עגבניות עשיר וביתי.',
    image: 'https://images.unsplash.com/photo-1560801619-01c3e9a4db84?q=80&w=400', // Placeholder meatballs stew image
    categorySlug: 'stews',
  },
  {
    id: 'stew-2',
    name: 'מרק ירקות כתום',
    description: 'מרק ירקות כתומים סמיך ומנחם, מושלם לימי החורף הקרים.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400', // Placeholder soup image
    categorySlug: 'stews',
  },
];
