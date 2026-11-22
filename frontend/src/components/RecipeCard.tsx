import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Heart, Users } from 'lucide-react';
import { IMAGES } from '../data/demoData';
import type { Recipe } from '../types/models';

interface RecipeCardProps {
  recipe: Recipe;
  onFavorite?: (recipe: Recipe) => void | Promise<void>;
  preview?: boolean;
}
export default function RecipeCard({ recipe, onFavorite, preview = false }: RecipeCardProps) {
  const card = <>
    <div className="recipe-card__image-wrap">
      <img src={recipe.imageUrl || IMAGES.salad} alt={recipe.title} loading="lazy" />
      <span className="recipe-card__tag">{recipe.category || 'Recipe'}</span>
    </div>
    <div className="recipe-card__content">
      <div className="recipe-card__title-line"><h3>{recipe.title}</h3><ArrowUpRight size={18} className="card-arrow"/></div>
      <p>{recipe.description || 'A recipe worth keeping.'}</p>
      <div className="recipe-card__meta"><span><Clock3 size={15} /> {(Number(recipe.prepMinutes) || 0) + (Number(recipe.cookMinutes) || 0)} min</span><span><Users size={15} /> {recipe.servings || 1} servings</span></div>
    </div>
  </>;

  return <article className="recipe-card">
    {preview ? <Link to="/signup" className="recipe-card__link" aria-label={`Get started to save ${recipe.title}`}>{card}</Link>
      : <Link to={`/recipes/${recipe.id}`} className="recipe-card__link">{card}</Link>}
    {!preview && onFavorite && <button type="button" className={`recipe-card__favorite ${recipe.isFavorite ? 'is-favorite' : ''}`} onClick={() => void onFavorite(recipe)} aria-label={recipe.isFavorite ? `Remove ${recipe.title} from favorites` : `Favorite ${recipe.title}`}><Heart size={19} fill={recipe.isFavorite ? 'currentColor' : 'none'}/></button>}
  </article>;
}
