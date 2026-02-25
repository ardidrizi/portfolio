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
            Portfolio
          </NavLink>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
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
          <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
          <p>Built with React + Vite.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
