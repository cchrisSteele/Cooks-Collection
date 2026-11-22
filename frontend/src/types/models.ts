export interface User {
  id?: string;
  user_id?: string;
  name?: string;
  display_name?: string;
  email?: string;
}

export interface RecipeBook {
  id: string;
  title: string;
  description: string;
  emoji: string;
  createdAt?: string;
}

export interface Recipe {
  id: string;
  bookId: string;
  title: string;
  description: string;
  category: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  isFavorite: boolean;
  createdAt?: string;
}

export type BookInput = Pick<RecipeBook, 'title' | 'description' | 'emoji'>;
export type RecipeInput = Omit<Recipe, 'id' | 'createdAt'>;
export type RecipeChanges = Partial<RecipeInput>;

export interface AuthCredentials { email: string; password: string; }
export interface SignUpCredentials extends AuthCredentials { name: string; }
export type AuthMode = 'demo' | 'real';
