import type { Recipe, RecipeBook } from "../types/models";

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=85',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=82',
  salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=82',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=82',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=82',
  pancakes: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=82',
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=82',
};

export const demoBooks: RecipeBook[] = [
  { id: 'book-weeknight', title: 'Weeknight Favorites', description: 'The simple, satisfying dishes I make on repeat.', emoji: '🍝', createdAt: '2026-11-01' },
  { id: 'book-baking', title: 'Baking & Sweet Treats', description: 'Cookies, cakes, and little moments of joy.', emoji: '🧁', createdAt: '2026-11-02' },
  { id: 'book-fresh', title: 'Fresh & Feel-Good', description: 'Bright, nourishing recipes for any season.', emoji: '🥗', createdAt: '2026-11-03' },
];

export const demoRecipes: Recipe[] = [
  {
    id: 'recipe-pasta', bookId: 'book-weeknight', title: 'Creamy Garlic Pasta',
    description: 'A silky parmesan sauce, sweet garlic, and your favorite pasta. Your new 25-minute comfort meal.',
    category: 'Dinner', prepMinutes: 10, cookMinutes: 15, servings: 3, imageUrl: IMAGES.pasta, isFavorite: true,
    ingredients: ['250 g fettuccine', '3 tbsp unsalted butter', '4 cloves garlic, minced', '¾ cup heavy cream', '½ cup grated parmesan', 'Salt and black pepper', 'Fresh parsley, to serve'],
    instructions: ['Boil the pasta in salted water until al dente. Reserve ½ cup pasta water.', 'Melt butter in a skillet, add garlic, and cook gently until fragrant.', 'Pour in cream and stir in parmesan. Loosen with pasta water as needed.', 'Toss pasta into the sauce. Season and finish with parsley.'], createdAt: '2026-11-04',
  },
  {
    id: 'recipe-salmon', bookId: 'book-weeknight', title: 'Honey Lemon Salmon',
    description: 'Golden, tender salmon with a sweet and tangy pan glaze.',
    category: 'Dinner', prepMinutes: 10, cookMinutes: 20, servings: 2, imageUrl: IMAGES.salmon, isFavorite: false,
    ingredients: ['2 salmon fillets', '1 tbsp olive oil', '1 tbsp honey', '1 lemon, juiced', '2 cloves garlic', 'Salt and pepper'],
    instructions: ['Pat salmon dry and season.', 'Sear salmon in oil, skin-side down, until golden.', 'Add honey, lemon, and garlic; baste until cooked through.', 'Serve with vegetables or rice.'], createdAt: '2026-11-05',
  },
  {
    id: 'recipe-cake', bookId: 'book-baking', title: 'Sunday Chocolate Cake',
    description: 'Rich chocolate layers with a soft, tender crumb and a luscious frosting.',
    category: 'Dessert', prepMinutes: 25, cookMinutes: 35, servings: 8, imageUrl: IMAGES.cake, isFavorite: true,
    ingredients: ['1½ cups all-purpose flour', '1 cup sugar', '½ cup cocoa powder', '1 tsp baking soda', '1 cup milk', '½ cup vegetable oil', '2 eggs'],
    instructions: ['Heat oven to 350°F (175°C). Grease a cake pan.', 'Whisk dry ingredients together.', 'Add wet ingredients and mix until combined.', 'Bake for 30–35 minutes. Cool before frosting.'], createdAt: '2026-11-06',
  },
  {
    id: 'recipe-pancakes', bookId: 'book-baking', title: 'Fluffy Weekend Pancakes',
    description: 'Golden edges, pillowy centers, and plenty of maple syrup.',
    category: 'Breakfast', prepMinutes: 10, cookMinutes: 15, servings: 4, imageUrl: IMAGES.pancakes, isFavorite: false,
    ingredients: ['1½ cups flour', '3½ tsp baking powder', '1 tbsp sugar', '1¼ cups milk', '1 egg', '3 tbsp melted butter'],
    instructions: ['Combine dry ingredients in a bowl.', 'Whisk the milk, egg, and butter separately.', 'Fold together gently, leaving a few lumps.', 'Cook ¼-cup portions on a buttered pan until golden on both sides.'], createdAt: '2026-11-07',
  },
  {
    id: 'recipe-salad', bookId: 'book-fresh', title: 'Everyday Green Goddess Bowl',
    description: 'Crunchy greens, colorful veggies, and a zippy herby dressing.',
    category: 'Lunch', prepMinutes: 15, cookMinutes: 0, servings: 2, imageUrl: IMAGES.salad, isFavorite: false,
    ingredients: ['2 cups mixed greens', '1 cucumber', '1 avocado', '½ cup cherry tomatoes', '¼ cup Greek yogurt', 'Fresh herbs', '½ lemon'],
    instructions: ['Wash and chop the vegetables.', 'Blend yogurt, herbs, lemon, and water to make the dressing.', 'Arrange greens and veggies in bowls.', 'Drizzle dressing and serve.'], createdAt: '2026-11-08',
  },
  {
    id: 'recipe-pizza', bookId: 'book-weeknight', title: 'Homemade Margherita Pizza',
    description: 'Crisp edges, bubbling mozzarella, and fresh basil.',
    category: 'Dinner', prepMinutes: 15, cookMinutes: 12, servings: 2, imageUrl: IMAGES.pizza, isFavorite: false,
    ingredients: ['1 pizza dough', '½ cup tomato sauce', '125 g fresh mozzarella', 'Handful fresh basil', 'Olive oil', 'Pinch of salt'],
    instructions: ['Heat oven as hot as it will go, ideally 475°F (245°C).', 'Stretch dough and spread with tomato sauce.', 'Top with mozzarella and bake until crisp.', 'Finish with basil and olive oil.'], createdAt: '2026-11-09',
  },
];
