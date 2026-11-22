import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText, ChefHat, Clock3, Heart, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { IMAGES } from '../data/demoData';
import RecipeForm from '../components/RecipeForm';
import { errorMessage } from '../lib/helpers';

export default function RecipePage() {
  const { id } = useParams();
  const { recipes, books, loading, toggleFavorite, deleteRecipe } = useRecipes();
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === id);
  const book = books.find(b => b.id === recipe?.bookId);
  if (loading) return <main className="container state-message">Loading recipe…</main>;
  if (!recipe) return <main className="container missing-page"><ChefHat size={40}/><h1>Recipe not found.</h1><Link className="button button--primary" to="/library">Back to my recipes</Link></main>;
  async function remove() {
    if (!recipe) return;
    if (!window.confirm(`Delete “${recipe.title}”? This cannot be undone.`)) return;
    setDeleting(true);
    try { await deleteRecipe(recipe.id); navigate(`/books/${recipe.bookId}`, { replace: true }); }
    catch (err) { window.alert(errorMessage(err)); setDeleting(false); }
  }
  const favorite = async () => { if (!recipe) return; try { await toggleFavorite(recipe); } catch (e) { window.alert(errorMessage(e)); } };

  return <main className="recipe-page container">
    <Link to={book ? `/books/${book.id}` : '/library'} className="back-link"><ArrowLeft size={17}/> {book ? book.title : 'My recipe books'}</Link>
    <div className="recipe-detail__top"><div className="recipe-detail__info"><div className="eyebrow">{recipe.category || 'YOUR RECIPE'} · SAVED IN {book?.title?.toUpperCase() || 'YOUR LIBRARY'}</div><h1>{recipe.title}</h1><p>{recipe.description || 'A recipe worth keeping.'}</p><div className="recipe-detail__stats"><div><Clock3 size={19}/><strong>{recipe.prepMinutes || 0} min</strong><span>Prep time</span></div><div><ChefHat size={19}/><strong>{recipe.cookMinutes || 0} min</strong><span>Cook time</span></div><div><Users size={19}/><strong>{recipe.servings || 1}</strong><span>Servings</span></div></div><div className="inline-actions recipe-detail__actions"><button className={`button button--outline ${recipe.isFavorite ? 'is-favorite' : ''}`} onClick={favorite}><Heart size={17} fill={recipe.isFavorite ? 'currentColor' : 'none'}/>{recipe.isFavorite ? 'Saved as favorite' : 'Add to favorites'}</button><button className="button button--primary" onClick={() => setEditing(true)}><Pencil size={16}/> Edit recipe</button></div></div><div className="recipe-detail__photo"><img src={recipe.imageUrl || IMAGES.salad} alt={recipe.title}/></div></div>
    <div className="recipe-detail__body"><aside className="ingredients-panel"><div className="recipe-detail__section-heading"><div className="eyebrow">WHAT YOU NEED</div><h2>Ingredients</h2><p>For {recipe.servings || 1} servings</p></div><div className="ingredient-list">{(recipe.ingredients || []).map((item, index) => <label key={index} className={checked.includes(index) ? 'is-checked' : ''}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked(previous => previous.includes(index) ? previous.filter(i => i !== index) : [...previous, index])}/><span>{item}</span></label>)}</div></aside>
    <section className="instructions-panel"><div className="recipe-detail__section-heading"><div className="eyebrow">LET'S GET COOKING</div><h2>Step by step</h2><p>One delicious step at a time.</p></div><ol className="steps-list">{(recipe.instructions || []).map((instruction, i) => <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{instruction}</p></li>)}</ol><div className="recipe-ending"><span>♥</span> Made with love, saved for later.</div></section></div>
    <div className="recipe-page__footer"><Link to={book ? `/books/${book.id}` : '/library'} className="back-link"><ArrowLeft size={17}/> Back to {book?.title || 'my library'}</Link><button className="button button--outline button--danger" disabled={deleting} onClick={remove}><Trash2 size={16}/> Delete recipe</button></div>
    {editing && <RecipeForm recipe={recipe} bookId={recipe.bookId} onClose={() => setEditing(false)} onSaved={() => setEditing(false)}/>} 
  </main>;
}
