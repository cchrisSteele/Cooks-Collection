import { Link } from 'react-router-dom';
import Brand from './Brand';
export default function Footer() {
  return <footer className="footer">
    <div className="container footer__inner">
      <div><Brand compact /><p>Made for the recipes you'll want to make again.</p></div>
      <div className="footer__links"><Link to="/">Home</Link><Link to="/library">My Recipe Books</Link><Link to="/signup">Get started</Link></div>
      <p className="footer__copyright">© {new Date().getFullYear()} Cook's Collection</p>
    </div>
  </footer>;
}
