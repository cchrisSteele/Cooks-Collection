import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpenText } from 'lucide-react';
import { IMAGES } from '../data/demoData';
import type { RecipeBook, Recipe } from '../types/models';

export default function BookCard({ book, recipes }: { book: RecipeBook; recipes: Recipe[] }) {
  const count = recipes.filter(recipe => recipe.bookId === book.id).length;
  const photo = recipes.find(recipe => recipe.bookId === book.id)?.imageUrl || IMAGES.salad;
  return <Link to={`/books/${book.id}`} className="book-card">
    <div className="book-card__cover"><img src={photo} alt="" loading="lazy" /><span className="book-card__emoji">{book.emoji || '📖'}</span></div>
    <div className="book-card__body"><div><p className="eyebrow subtle">YOUR COOKBOOK</p><h3>{book.title}</h3><p className="book-card__desc">{book.description || 'Your collection of delicious ideas.'}</p><div className="book-card__count"><BookOpenText size={15}/>{count} {count === 1 ? 'recipe' : 'recipes'}</div></div><ArrowUpRight size={21} className="book-card__arrow" /></div>
  </Link>;
}
