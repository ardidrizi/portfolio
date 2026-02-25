import { useState } from 'react'
import { NavLink } from '../lib/router.jsx'

const navItems = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/about', 'About'],
  ['/resume', 'Resume'],
  ['/contact', 'Contact'],
]

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="container nav" aria-label="Main navigation">
          <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">
              AI
            </span>
            <span>Ardian Idrizi</span>
          </NavLink>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" className="container page-content">
        {children}
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <p className="footer-title">Ardian Idrizi</p>
            <p className="small-text">Building fast, accessible, and product-ready interfaces.</p>
          </div>
          <div className="footer-links">
            {navItems.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
          </div>
          <p className="small-text">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
