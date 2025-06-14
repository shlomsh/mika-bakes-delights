import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchRecipesByName } from '@/api/search';

export function RecipeSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipeSearch', debouncedQuery],
    queryFn: () => searchRecipesByName(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  const handleSelect = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <Button
        variant="secondary"
        className="relative h-10 w-full justify-start rounded-md text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="hidden lg:inline-flex">חפש מתכון...</span>
        <span className="inline-flex lg:hidden">חפש...</span>
        <kbd className="pointer-events-none absolute right-[0.5rem] top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-choco/20 bg-choco/10 px-1.5 font-mono text-[10px] font-medium text-choco opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="הקלד שם מתכון..." 
          value={query}
          onValueChange={setQuery}
          dir="rtl"
        />
        <CommandList dir="rtl">
          <CommandEmpty>{!isLoading && query.length > 0 ? 'לא נמצאו מתכונים.' : 'התחל להקליד כדי לחפש...'}</CommandEmpty>
          {isLoading && <div className="p-4 py-6 text-center text-sm">טוען...</div>}
          {recipes && recipes.length > 0 && (
            <CommandGroup 
              heading="מתכונים"
              className="[&_[cmdk-group-heading]]:text-choco [&_[cmdk-group-heading]]:font-fredoka [&_[cmdk-group-heading]]:text-lg"
            >
              {recipes.map((recipe) => (
                <CommandItem
                  key={recipe.id}
                  value={recipe.name}
                  onSelect={() => handleSelect(recipe.id)}
                  className="cursor-pointer flex items-center gap-4 py-2 data-[selected='true']:bg-pastelBlue/40"
                >
                  <img
                    src={recipe.image_url || '/placeholder.svg'}
                    alt={recipe.name}
                    className="w-12 h-12 object-cover rounded-md"
                    width={48}
                    height={48}
                  />
                  <span className="font-medium text-choco">{recipe.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
