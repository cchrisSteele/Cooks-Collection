import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { endpoints, unwrapCollection } from '../lib/api';
import { makeId } from '../lib/helpers';
import { demoBooks, demoRecipes } from '../data/demoData';
import type { BookInput, Recipe, RecipeBook, RecipeChanges, RecipeInput } from '../types/models';

interface RecipeContextValue {
  books: RecipeBook[];
  recipes: Recipe[];
  loading: boolean;
  error: string;
  createBook: (values: BookInput) => Promise<RecipeBook>;
  deleteBook: (id: string) => Promise<void>;
  createRecipe: (values: RecipeInput) => Promise<Recipe>;
  updateRecipe: (id: string, changes: RecipeChanges) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (recipe: Recipe) => Promise<void>;
  resetDemo: () => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);
const STORE_KEY = 'cooks-collection-demo-library-v1';

function readDemoLibrary(): { books: RecipeBook[]; recipes: Recipe[] } {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as { books?: RecipeBook[]; recipes?: Recipe[] };
      if (Array.isArray(stored.books) && Array.isArray(stored.recipes))
        return { books: stored.books, recipes: stored.recipes };
    }
  } catch { /* Start fresh if cached data is invalid. */ }
  return { books: structuredClone(demoBooks), recipes: structuredClone(demoRecipes) };
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { user, mode } = useAuth();
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [readyToPersist, setReadyToPersist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setReadyToPersist(false);
    setError('');
    if (!user) {
      setBooks([]); setRecipes([]); setLoading(false);
      return () => { active = false; };
    }
    if (mode === 'demo') {
      const saved = readDemoLibrary();
      setBooks(saved.books); setRecipes(saved.recipes);
      setReadyToPersist(true); setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    Promise.all([endpoints.books(), endpoints.recipes()])
      .then(([bookData, recipeData]) => {
        if (!active) return;
        setBooks(unwrapCollection(bookData, 'books'));
        setRecipes(unwrapCollection(recipeData, 'recipes'));
      })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Could not load recipes.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, mode]);

  useEffect(() => {
    if (user && mode === 'demo' && readyToPersist) {
      localStorage.setItem(STORE_KEY, JSON.stringify({ books, recipes }));
    }
  }, [user, mode, readyToPersist, books, recipes]);

  async function createBook(values: BookInput): Promise<RecipeBook> {
    const payload: BookInput = { title: values.title.trim(), description: values.description?.trim() || '', emoji: values.emoji || '📖' };
    const response = mode === 'demo' ? { ...payload, id: makeId(), createdAt: new Date().toISOString() } : await endpoints.createBook(payload);
    const book: RecipeBook = 'book' in response ? response.book : response;
    if (!book?.id) throw new Error('Invalid book response from backend.');
    setBooks(previous => [book, ...previous]);
    return book;
  }

  async function deleteBook(id: string): Promise<void> {
    if (mode !== 'demo') await endpoints.deleteBook(id);
    setBooks(previous => previous.filter(book => book.id !== id));
    setRecipes(previous => previous.filter(recipe => recipe.bookId !== id));
  }

  async function createRecipe(values: RecipeInput): Promise<Recipe> {
    const payload: RecipeInput = {
      bookId: values.bookId, title: values.title.trim(),
      description: values.description?.trim() || '', category: values.category || 'Other',
      prepMinutes: Number(values.prepMinutes) || 0, cookMinutes: Number(values.cookMinutes) || 0,
      servings: Number(values.servings) || 1, imageUrl: values.imageUrl?.trim() || '',
      ingredients: values.ingredients || [], instructions: values.instructions || [], isFavorite: false,
    };
    const response = mode === 'demo' ? { ...payload, id: makeId(), createdAt: new Date().toISOString() } : await endpoints.createRecipe(payload);
    const recipe: Recipe = 'recipe' in response ? response.recipe : response;
    if (!recipe?.id) throw new Error('Invalid recipe response from backend.');
    setRecipes(previous => [recipe, ...previous]);
    return recipe;
  }

  async function updateRecipe(id: string, changes: RecipeChanges): Promise<void> {
    const response = mode === 'demo' ? null : await endpoints.editRecipe(id, changes);
    const updates: RecipeChanges = mode === 'demo' ? changes : response && 'recipe' in response ? response.recipe : response || {};
    setRecipes(previous => previous.map(recipe => recipe.id === id ? { ...recipe, ...updates } : recipe));
  }

  async function deleteRecipe(id: string): Promise<void> {
    if (mode !== 'demo') await endpoints.deleteRecipe(id);
    setRecipes(previous => previous.filter(recipe => recipe.id !== id));
  }

  async function toggleFavorite(recipe: Recipe): Promise<void> {
    await updateRecipe(recipe.id, { isFavorite: !recipe.isFavorite });
  }

  function resetDemo(): void {
    if (mode !== 'demo') return;
    const fresh = { books: structuredClone(demoBooks), recipes: structuredClone(demoRecipes) };
    setBooks(fresh.books); setRecipes(fresh.recipes);
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
  }

  return <RecipeContext.Provider value={{ books, recipes, loading, error, createBook, deleteBook, createRecipe, updateRecipe, deleteRecipe, toggleFavorite, resetDemo }}>
    {children}
  </RecipeContext.Provider>;
}

export function useRecipes(): RecipeContextValue {
  const value = useContext(RecipeContext);
  if (!value) throw new Error('useRecipes must be used inside RecipeProvider');
  return value;
}
