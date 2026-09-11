import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 py-3 px-4 bg-slate-100/70 border-b border-slate-200/60 rounded-xl mb-6">
      <Link to="/" className="flex items-center space-x-1 hover:text-cyan-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedLabel = value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="font-bold text-slate-800 capitalize text-cyan-700">{formattedLabel}</span>
            ) : (
              <Link to={to} className="hover:text-cyan-600 transition-colors capitalize">
                {formattedLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
