import { useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, ChevronRight, Heart, Plus, RotateCcw, Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/models';
import { errorMessage } from '../lib/helpers';

export default function LibraryPage() {
  const { user, mode } = useAuth();
  const { books, recipes, loading, error, toggleFavorite, resetDemo } = useRecipes();
  const [showBookForm, setShowBookForm] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const firstName = (user?.name || user?.display_name || 'Home Cook').split(' ')[0];
  const matchingBooks = useMemo(() => books.filter(book => `${book.title} ${book.description || ''}`.toLowerCase().includes(query.toLowerCase())), [books, query]);
  const matchingRecipes = useMemo(() => recipes.filter(recipe => {
    const matchesSearch = `${recipe.title} ${recipe.description || ''} ${recipe.category || ''}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (filter === 'All' || (filter === 'Favorites' ? recipe.isFavorite : recipe.category === filter));
  }), [recipes, query, filter]);
  const filters = ['All', 'Favorites', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  const favorites = recipes.filter(recipe => recipe.isFavorite).length;
  const favorite = async (recipe: Recipe) => { try { await toggleFavorite(recipe); } catch (e) { window.alert(errorMessage(e)); } };

  return <main className="dashboard container">
    <div className="dashboard__welcome"><div><div className="eyebrow"><Sparkles size={15}/> YOUR PERSONAL KITCHEN</div><h1>Welcome back, <span>{firstName}.</span></h1><p>Your favorite recipes are right where you left them.</p></div><button className="button button--primary" onClick={() => setShowBookForm(true)}><Plus size={18}/> New recipe book</button></div>
    {mode === 'demo' && <div className="demo-notice"><span>✨ You're exploring a <strong>browser-only demo</strong>. Your changes stay on this device, not in Turso.</span><button onClick={resetDemo}><RotateCcw size={15}/> Reset demo</button></div>}
    {loading && <div className="state-message">Loading your library…</div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="dashboard-stats"><div className="stat"><div className="stat__icon"><BookOpenText size={22}/></div><div><strong>{books.length}</strong><span>Recipe books</span></div></div><div className="stat"><div className="stat__icon"><UtensilsCrossed size={22}/></div><div><strong>{recipes.length}</strong><span>Total recipes</span></div></div><div className="stat"><div className="stat__icon"><Heart size={22}/></div><div><strong>{favorites}</strong><span>Favorites</span></div></div></div>
    <div className="dashboard-search"><Search size={20}/><input type="search" aria-label="Search your recipes and books" placeholder="Search recipes, books, ingredients of your imagination…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery('')}>Clear</button>}</div>
    <section className="dashboard-section"><div className="dashboard-section__heading"><div><div className="eyebrow">YOUR COLLECTIONS</div><h2>My recipe books <span className="count-bubble">{matchingBooks.length}</span></h2></div><button className="text-link" onClick={() => setShowBookForm(true)}>Create book <Plus size={17}/></button></div>
      <div className="books-grid"><button className="create-book-card" onClick={() => setShowBookForm(true)}><span><Plus size={25}/></span><strong>Create a recipe book</strong><small>Start a brand-new collection</small></button>{matchingBooks.map(book => <BookCard key={book.id} book={book} recipes={recipes}/>)}</div>
      {!matchingBooks.length && query && <p className="empty-note">No books match “{query}”.</p>}
    </section>
    <section className="dashboard-section dashboard-section--recipes"><div className="dashboard-section__heading"><div><div className="eyebrow">FROM YOUR KITCHEN</div><h2>All my recipes <span className="count-bubble">{matchingRecipes.length}</span></h2></div></div><div className="chip-row" role="group" aria-label="Filter recipes">{filters.map(item => <button key={item} className={`chip ${filter === item ? 'is-active' : ''}`} onClick={() => setFilter(item)}>{item === 'Favorites' && <Heart size={14}/>} {item}</button>)}</div>
      {matchingRecipes.length ? <div className="recipe-grid">{matchingRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onFavorite={favorite}/>)}</div> : <div className="empty-state"><UtensilsCrossed size={38}/><h3>No recipes here just yet</h3><p>Try another filter, or open a recipe book to add your first recipe.</p><button className="button button--outline" onClick={() => { setFilter('All'); setQuery(''); }}>Clear filters <ArrowRight size={17}/></button></div>}
    </section>
    {showBookForm && <BookForm onClose={() => setShowBookForm(false)} onCreated={(book) => { setShowBookForm(false); navigate(`/books/${book.id}`); }}/>} 
  </main>;
}
