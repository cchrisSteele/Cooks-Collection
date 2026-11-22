import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, ChevronRight, ChefHat, Heart, LockKeyhole, Plus, Sparkles, Smartphone, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { demoBooks, demoRecipes, IMAGES } from '../data/demoData';
import RecipeCard from '../components/RecipeCard';

const perks = [
  { icon: BookOpen, title: 'Your own recipe books', description: 'Keep family classics, quick meals, and sweet treats in their own collections.' },
  { icon: Heart, title: 'Everything you love', description: 'Save ingredients, instructions, and little notes that make a recipe yours.' },
  { icon: Smartphone, title: 'Cook from anywhere', description: 'A beautiful, easy-to-use experience on your phone, tablet, or laptop.' },
];

export default function LandingPage() {
  const { user, enterDemo } = useAuth();
  const navigate = useNavigate();
  const tryDemo = () => { enterDemo(); navigate('/library'); };
  return <main>
    <section className="landing-hero">
      <div className="container landing-hero__grid">
        <div className="landing-hero__copy">
          <div className="eyebrow"><Sparkles size={15}/> YOUR KITCHEN, YOUR COLLECTION</div>
          <h1>Every great recipe deserves a <em>place to live.</em></h1>
          <p>From handed-down family favorites to tonight's new discovery, keep every recipe you love in one beautifully organized home.</p>
          <div className="hero-actions">
            <Link className="button button--primary button--large" to={user ? '/library' : '/signup'}>{user ? 'Open my recipe books' : 'Start your recipe book'} <ArrowRight size={19}/></Link>
            {!user && <button className="button button--text" onClick={tryDemo}>Explore the demo <ChevronRight size={18}/></button>}
          </div>
          <div className="hero-notes"><span><Check size={15}/> Free to start</span><span><Check size={15}/> Private by default</span><span><Check size={15}/> Made for every cook</span></div>
        </div>
        <div className="landing-hero__visual">
          <div className="hero-photo"><img src={IMAGES.hero} alt="Fresh pasta with herbs ready to serve" /></div>
          <div className="hero-floating-card">
            <div className="floating-heart"><Heart size={19} fill="currentColor"/></div>
            <div><strong>Made with love.</strong><span>Saved for the next time.</span></div>
          </div>
          <div className="hero-scribble">a little taste of home <span>↗</span></div>
        </div>
      </div>
    </section>

    <section className="intro-band">
      <div className="container intro-band__inner"><span><ChefHat size={21}/> A home for every flavor</span><span className="intro-band__dot"/><span><LockKeyhole size={20}/> Just yours, for now</span><span className="intro-band__dot"/><span><Users size={21}/> Made for sharing someday</span></div>
    </section>

    <section className="section section--recipes">
      <div className="container">
        <div className="section-heading"><div><div className="eyebrow">SOMETHING DELICIOUS</div><h2>Recipes worth <span>keeping.</span></h2><p>See how your favorite dishes will look in your own collection.</p></div><Link className="text-link" to={user ? '/library' : '/signup'}>Explore recipe books <ArrowRight size={18}/></Link></div>
        <div className="recipe-grid">{demoRecipes.slice(0, 4).map(r => <RecipeCard key={r.id} recipe={r} preview/>)}</div>
      </div>
    </section>

    <section className="section section--features">
      <div className="container">
        <div className="center-heading"><div className="eyebrow">COOK MORE. SEARCH LESS.</div><h2>Your recipes, <span>your way.</span></h2><p>All the little things that make cooking feel effortless.</p></div>
        <div className="feature-grid">{perks.map(({ icon: Icon, title, description }, i) => <div className="feature-card" key={title}><div className="feature-card__icon"><Icon size={26}/></div><span className="feature-card__num">0{i + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
      </div>
    </section>

    <section className="section section--books">
      <div className="container books-showcase">
        <div className="books-showcase__copy"><div className="eyebrow">A SHELF FULL OF POSSIBILITIES</div><h2>Make room for <span>every craving.</span></h2><p>One book for cozy weeknight dinners. Another for the cookies everyone asks you to make. Organize your kitchen exactly the way you want.</p><Link className="button button--outline" to={user ? '/library' : '/signup'}>Build your collection <ArrowRight size={18}/></Link></div>
        <div className="books-showcase__cards">{demoBooks.map((book, index) => <div key={book.id} className={`mini-book mini-book--${index}`}><div className="mini-book__cover"><span>{book.emoji}</span></div><div><small>RECIPE COLLECTION</small><strong>{book.title}</strong><span>{[3, 2, 1][index]} recipes</span></div></div>)}</div>
      </div>
    </section>

    <section className="section section--cta"><div className="container"><div className="cta-panel"><span className="cta-panel__glow"/><div className="eyebrow"><Sparkles size={15}/> THE BEST RECIPES ARE THE ONES WE KEEP</div><h2>Start your next chapter<br/><span>in the kitchen.</span></h2><p>Your new favorite place for all your old favorites.</p><Link className="button button--primary button--large" to={user ? '/library' : '/signup'}>{user ? 'Go to my library' : 'Create your free account'} <ArrowRight size={18}/></Link></div></div></section>
  </main>;
}
