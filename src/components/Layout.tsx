import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, ListTodo, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';

const Layout: React.FC = () => {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();

  const navigationItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/todos', icon: ListTodo, label: 'Tâches' },
    { path: '/add', icon: Plus, label: 'Ajouter' },
    { path: '/settings', icon: SettingsIcon, label: 'Paramètres' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      {/* Navbar fixe en haut en mode desktop, en bas en mode mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-base-200 border-t md:border-b border-base-300 px-4 py-2 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`group flex flex-col items-center p-2 transition-all duration-200 hover:text-primary
                  ${location.pathname === path ? 'text-primary' : 'text-base-content'}
                `}
              >
                <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-xs mt-1 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal avec marges adaptées */}
      <main className="flex-grow container mx-auto px-4 py-4 mt-4 mb-20 md:mt-20 md:mb-4">
        <Outlet />
      </main>

      {/* Bouton de thème */}
      <Button
        variant="ghost"
        shape="circle"
        className="fixed top-4 right-4 z-50"
        onClick={toggleTheme}
        icon={isDark ? SunIcon : MoonIcon}
        animation="hover-glow"
      />
    </div>
  );
};

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

export default Layout;