import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText, Heart, LockKeyhole, Plus, Trash2 } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import { IMAGES } from '../data/demoData';
import type { Recipe } from '../types/models';
import { errorMessage } from '../lib/helpers';

export default function BookPage() {
  const { id } = useParams();
  const bookId = id ?? '';
  const { books, recipes, loading, deleteBook, toggleFavorite } = useRecipes();
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const book = books.find(b => b.id === id);
  const inBook = recipes.filter(recipe => recipe.bookId === id);
  const cover = inBook.find(r => r.imageUrl)?.imageUrl || IMAGES.pasta;

  async function remove() {
    if (!book) return;
    if (!window.confirm(`Delete “${book.title}” and all ${inBook.length} recipes in it? This cannot be undone.`)) return;
    setDeleting(true);
    try { await deleteBook(bookId); navigate('/library', { replace: true }); }
    catch (err) { window.alert(errorMessage(err)); setDeleting(false); }
  }
  const favorite = async (recipe: Recipe) => { try { await toggleFavorite(recipe); } catch (e) { window.alert(errorMessage(e)); } };
  if (loading) return <main className="container state-message">Loading book…</main>;
  if (!book) return <main className="container missing-page"><BookOpenText size={38}/><h1>We couldn't find that book.</h1><Link className="button button--primary" to="/library">Back to my library</Link></main>;

  return <main className="book-page container">
    <Link to="/library" className="back-link"><ArrowLeft size={17}/> Back to my recipe books</Link>
    <div className="book-hero"><div className="book-hero__photo"><img src={cover} alt=""/></div><div className="book-hero__scrim"/><div className="book-hero__content"><div className="book-hero__icon">{book.emoji || '📖'}</div><div className="eyebrow"><LockKeyhole size={14}/> PRIVATE RECIPE BOOK</div><h1>{book.title}</h1><p>{book.description || 'A home for the dishes you love.'}</p><div className="book-hero__meta"><span><BookOpenText size={16}/> {inBook.length} recipes</span><span><Heart size={16}/> {inBook.filter(r => r.isFavorite).length} favorites</span></div></div></div>
    <div className="book-page__toolbar"><div><div className="eyebrow">SAVED WITH LOVE</div><h2>Inside this book</h2></div><div className="inline-actions"><button className="button button--outline button--danger" onClick={remove} disabled={deleting}><Trash2 size={16}/> Delete book</button><button className="button button--primary" onClick={() => setShowRecipeForm(true)}><Plus size={18}/> Add recipe</button></div></div>
    {inBook.length ? <div className="recipe-grid">{inBook.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onFavorite={favorite}/>)}</div> : <div className="empty-state"><BookOpenText size={40}/><h3>Your first recipe belongs here.</h3><p>Start with a family classic, tonight's dinner, or a recipe you've been meaning to try.</p><button className="button button--primary" onClick={() => setShowRecipeForm(true)}><Plus size={18}/> Add my first recipe</button></div>}
    {showRecipeForm && <RecipeForm bookId={bookId} onClose={() => setShowRecipeForm(false)} onSaved={(recipeId) => { setShowRecipeForm(false); navigate(`/recipes/${recipeId}`); }}/>} 
  </main>;
}
