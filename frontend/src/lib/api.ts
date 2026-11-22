import type { AuthCredentials, BookInput, RecipeBook, Recipe, RecipeChanges, RecipeInput, SignUpCredentials, User } from '../types/models';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

type UserResponse = User | { user: User };
type BookResponse = RecipeBook | { book: RecipeBook };
type RecipeResponse = Recipe | { recipe: Recipe };
type BookListResponse = RecipeBook[] | { books: RecipeBook[] };
type RecipeListResponse = Recipe[] | { recipes: Recipe[] };

/** The Flask API is NOT included. Expect secure HTTP-only cookie sessions. */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach your Flask backend yet. Start your API, or choose “Try the demo”.');
  }
  const body: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const problem = body as { message?: string; error?: string } | null;
    throw new Error(problem?.message || problem?.error || `Request failed (${response.status}).`);
  }
  return body as T;
}

export const endpoints = {
  me: () => api<{ user: User | null }>('/api/auth/me'),
  signIn: (data: AuthCredentials) => api<UserResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signUp: (data: SignUpCredentials) => api<UserResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  signOut: () => api<unknown>('/api/auth/logout', { method: 'POST' }),
  books: () => api<BookListResponse>('/api/books'),
  createBook: (data: BookInput) => api<BookResponse>('/api/books', { method: 'POST', body: JSON.stringify(data) }),
  deleteBook: (id: string) => api<unknown>(`/api/books/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  recipes: () => api<RecipeListResponse>('/api/recipes'),
  createRecipe: (data: RecipeInput) => api<RecipeResponse>('/api/recipes', { method: 'POST', body: JSON.stringify(data) }),
  editRecipe: (id: string, data: RecipeChanges) => api<RecipeResponse>(`/api/recipes/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRecipe: (id: string) => api<unknown>(`/api/recipes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export function unwrapCollection<T>(value: T[] | Record<string, T[]>, key: string): T[] {
  return Array.isArray(value) ? value : (value?.[key] || []);
}
