import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiHome, FiShoppingBag, FiScissors, FiCalendar, FiBarChart2, FiHeart, FiLogOut, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';

const links = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/wardrobe', icon: FiShoppingBag, label: 'Wardrobe' },
  { to: '/outfit-builder', icon: FiScissors, label: 'Outfit Builder' },
  { to: '/calendar', icon: FiCalendar, label: 'Calendar' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/favorites', icon: FiHeart, label: 'Favorites' },
];

export default function Navbar() {
  const { logout, user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }, [logout, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 relative group overflow-hidden ${
      isActive
        ? 'text-white'
        : 'text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/50 dark:hover:bg-dark-card/50'
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-3xl border-r border-white/10 dark:border-white/5 z-40 transition-theme shadow-[8px_0_32px_rgba(0,0,0,0.01)]">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <span className="text-xl">👗</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent tracking-tighter">
              OUTFIT
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {({ isActive }) => (
                <>
                  <Icon size={20} className={`stroke-[2.5] relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-500`} />
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg shadow-primary-600/20 animate-fade-in"></div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="glass-card p-4 flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-bg transition-colors group"
            >
              <span className="text-sm font-bold text-surface-600 dark:text-surface-400">Appearance</span>
              <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-dark-bg flex items-center justify-center text-primary-600 group-hover:rotate-45 transition-transform duration-500">
                {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-90 transition-transform">
                <FiLogOut size={18} />
              </div>
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-black shadow-lg">
              {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-surface-900 dark:text-white truncate">{user?.displayName || 'User'}</span>
              <span className="text-xs font-medium text-surface-500 truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 z-40 px-4 flex items-center justify-between transition-theme">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg">
            <span className="text-sm">👗</span>
          </div>
          <h1 className="text-xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent tracking-tighter">OUTFIT</h1>
         </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-card flex items-center justify-center text-surface-600 dark:text-surface-400"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <nav className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-dark-surface p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black tracking-tighter dark:text-white">MENU</span>
              <button onClick={() => setIsOpen(false)} className="text-surface-400"><FiX size={24} /></button>
            </div>
            <div className="flex-1 space-y-2">
              {links.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
            <div className="pt-6 border-t border-surface-100 dark:border-dark-border space-y-4">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-between w-full p-2 text-surface-600 dark:text-surface-400 font-bold"
              >
                <span>Theme</span>
                {dark ? <FiSun /> : <FiMoon />}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-2 text-red-500 font-bold"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// Fixed import for Link which was missing
import { Link } from 'react-router-dom';
