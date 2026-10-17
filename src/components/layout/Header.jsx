import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { business } from '../../content/business';
import { navigation, ui } from '../../content/navigation';
export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const key = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label={`${business.name} home`}>
          <img
            src={business.logo}
            alt={business.name}
            width="1200"
            height="196"
          />
        </Link>
        <button
          id="menu-toggle"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? ui.closeMenu : ui.menu}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? 'navigation is-open' : 'navigation'}
        >
          {navigation.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
          <Link className="button button-primary nav-book" to="/book-service">
            {ui.book}
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
