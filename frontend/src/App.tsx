import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LibraryPage from './pages/LibraryPage';
import BookPage from './pages/BookPage';
import RecipePage from './pages/RecipePage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { checking, user } = useAuth();
  if (checking) return <main className="container state-message">Preparing your kitchen…</main>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
function GuestOnly({ children }: { children: ReactNode }) {
  const { checking, user } = useAuth();
  if (checking) return <main className="container state-message">Preparing your kitchen…</main>;
  return user ? <Navigate to="/library" replace /> : <>{children}</>;
}
function PageLayout() {
  return <div className="app-shell"><Navbar /><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<GuestOnly><AuthPage kind="login" /></GuestOnly>} />
    <Route path="/signup" element={<GuestOnly><AuthPage kind="signup" /></GuestOnly>} />
    <Route path="/library" element={<RequireAuth><LibraryPage /></RequireAuth>} />
    <Route path="/books/:id" element={<RequireAuth><BookPage /></RequireAuth>} />
    <Route path="/recipes/:id" element={<RequireAuth><RecipePage /></RequireAuth>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><Footer /></div>;
}
export default function App() {
  return <AuthProvider><RecipeProvider><PageLayout /></RecipeProvider></AuthProvider>;
}
