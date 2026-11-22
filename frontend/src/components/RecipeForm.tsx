import { useState, type FormEvent } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import Modal from './Modal';
import { useRecipes } from '../context/RecipeContext';
import { splitLines, errorMessage } from '../lib/helpers';
import type { Recipe } from '../types/models';

interface RecipeFormProps {
  bookId: string;
  recipe?: Recipe | null;
  onClose: () => void;
  onSaved: (recipeId: string) => void;
}
interface RecipeFormState {
  title: string; description: string; category: string;
  prepMinutes: number; cookMinutes: number; servings: number;
  imageUrl: string; ingredients: string; instructions: string;
}
const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'];

export default function RecipeForm({ bookId, recipe = null, onClose, onSaved }: RecipeFormProps) {
  const [values, setValues] = useState<RecipeFormState>({
    title: recipe?.title || '', description: recipe?.description || '',
    category: recipe?.category || 'Dinner', prepMinutes: recipe?.prepMinutes ?? 10,
    cookMinutes: recipe?.cookMinutes ?? 20, servings: recipe?.servings ?? 2,
    imageUrl: recipe?.imageUrl || '',
    ingredients: (recipe?.ingredients || []).join('\n'),
    instructions: (recipe?.instructions || []).join('\n'),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { createRecipe, updateRecipe } = useRecipes();
  const update = <K extends keyof RecipeFormState>(key: K, value: RecipeFormState[K]) => setValues(previous => ({ ...previous, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ingredients = splitLines(values.ingredients);
    const instructions = splitLines(values.instructions);
    if (!ingredients.length || !instructions.length) { setError('Add at least one ingredient and one instruction.'); return; }
    setBusy(true); setError('');
    try {
      const payload = { ...values, ingredients, instructions, bookId, isFavorite: recipe?.isFavorite ?? false };
      if (recipe) {
        await updateRecipe(recipe.id, payload);
        onSaved(recipe.id);
      } else {
        const created = await createRecipe(payload);
        onSaved(created.id);
      }
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return <Modal title={recipe ? 'Edit recipe' : 'Add a new recipe'} subtitle="Write it once, make it forever. Every detail can be updated later." onClose={onClose} wide>
    <form className="form-stack" onSubmit={submit}>
      <div className="field"><label htmlFor="recipe-title">Recipe name <span>*</span></label><input id="recipe-title" autoFocus required maxLength={100} value={values.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Mom's chicken adobo"/></div>
      <div className="field"><label htmlFor="recipe-description">Short description</label><textarea id="recipe-description" rows={2} value={values.description} onChange={e => update('description', e.target.value)} placeholder="What makes this recipe special?"/></div>
      <div className="form-grid form-grid--four">
        <div className="field"><label htmlFor="recipe-category">Category</label><select id="recipe-category" value={values.category} onChange={e => update('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="field"><label htmlFor="recipe-prep">Prep (min)</label><input id="recipe-prep" type="number" min="0" max="9999" value={values.prepMinutes} onChange={e => update('prepMinutes', Number(e.target.value))} /></div>
        <div className="field"><label htmlFor="recipe-cook">Cook (min)</label><input id="recipe-cook" type="number" min="0" max="9999" value={values.cookMinutes} onChange={e => update('cookMinutes', Number(e.target.value))}/></div>
        <div className="field"><label htmlFor="recipe-servings">Servings</label><input id="recipe-servings" type="number" min="1" max="1000" value={values.servings} onChange={e => update('servings', Number(e.target.value))}/></div>
      </div>
      <div className="field"><label htmlFor="recipe-image">Photo URL (optional)</label><input id="recipe-image" type="url" value={values.imageUrl} onChange={e => update('imageUrl', e.target.value)} placeholder="https://..."/><small>Photo uploads can be added when your backend is connected.</small></div>
      <div className="form-grid">
        <div className="field"><label htmlFor="recipe-ingredients">Ingredients <span>*</span></label><textarea id="recipe-ingredients" rows={7} value={values.ingredients} onChange={e => update('ingredients', e.target.value)} placeholder={'1 cup flour\n2 eggs\n½ cup milk'} required/><small>Put each ingredient on a new line.</small></div>
        <div className="field"><label htmlFor="recipe-instructions">Instructions <span>*</span></label><textarea id="recipe-instructions" rows={7} value={values.instructions} onChange={e => update('instructions', e.target.value)} placeholder={'Preheat the oven.\nMix the ingredients.\nBake until golden.'} required/><small>Put each step on a new line.</small></div>
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="button button--primary button--full" disabled={busy}>{busy ? <LoaderCircle size={18} className="spin"/> : <Save size={18}/>} {recipe ? 'Save changes' : 'Save recipe'}</button>
    </form>
  </Modal>;
}
