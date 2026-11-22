import { Link } from 'react-router-dom';

interface BrandProps { to?: string; compact?: boolean; }
export default function Brand({ to = '/', compact = false }: BrandProps) {
  return <Link to={to} className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Cook's Collection home">
    <svg className="brand__mark" viewBox="0 0 50 50" role="img" aria-label="Open cookbook icon">
      <path d="M5 16c8-2 14-1 20 3v24c-6-4-12-5-20-3z" fill="#fb7c29" />
      <path d="M45 16c-8-2-14-1-20 3v24c6-4 12-5 20-3z" fill="#ffa14d" />
      <path d="M5 16c8-2 14-1 20 3 6-4 12-5 20-3M25 19v24" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M21 11c-3-5 2-6 1-10M29 12c3-5-2-6-1-10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
    <span>Cook's <span>Collection</span></span>
  </Link>;
}
