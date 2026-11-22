import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Home, LogOut, Menu, Plus, UserRound, X } from 'lucide-react';
import Brand from './Brand';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, mode, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const logout = async () => { await signOut(); close(); navigate('/'); };

  return <header className="site-header">
    <div className="nav-container">
      <Brand />
      <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" onClick={close} end className={({ isActive }) => `nav-link ${isActive ? 'is-current' : ''}`}><Home size={17} /> Home</NavLink>
        <NavLink to="/library" onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'is-current' : ''}`}><BookOpen size={17} /> My Recipe Books</NavLink>
        {user && <span className="nav-mobile-account"><UserRound size={17} /> {user.name || user.display_name || 'Home Cook'}{mode === 'demo' ? ' · Demo' : ''}</span>}
        {user ? <button className="nav-mobile-logout" onClick={logout}><LogOut size={17} /> Log out</button> : <>
          <Link className="nav-mobile-logout" to="/login" onClick={close}>Log in</Link>
          <Link className="nav-mobile-logout" to="/signup" onClick={close}>Create account</Link>
        </>}
      </nav>
      <div className="nav-actions">
        {user ? <>
          {mode === 'demo' && <span className="demo-pill">Demo mode</span>}
          <Link to="/library" className="nav-avatar" aria-label="Go to my recipe library"><UserRound size={18} /></Link>
          <button className="button button--outline button--small nav-logout" onClick={logout}><LogOut size={15}/> Log out</button>
        </> : <>
          <Link to="/login" className="button button--outline button--small">Log in</Link>
          <Link to="/signup" className="button button--primary button--small">Create account <Plus size={16} /></Link>
        </>}
      </div>
      <button className="nav-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
    </div>
  </header>;
}
