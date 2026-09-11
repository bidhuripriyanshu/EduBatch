import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Menu, Sparkles, ChevronRight } from 'lucide-react';
import Header from './Header';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, currentRole } = useAuth();
  const location = useLocation();

  // Public pages list
  const isPublicPage = location.pathname === '/' || 
                       location.pathname === '/about' || 
                       location.pathname === '/contact' || 
                       location.pathname === '/courses' || 
                       location.pathname === '/cart' || 
                       location.pathname.startsWith('/login') || 
                       location.pathname.startsWith('/register') || 
                       location.pathname.startsWith('/forgot-password') || 
                       location.pathname.startsWith('/reset-password');

  // Sidebar ONLY shows when user is logged in AND on a protected dashboard route
  const showSidebar = isAuthenticated && !isPublicPage;
  const roleTitle = currentRole === 'admin' ? 'Admin Portal' : currentRole === 'teacher' ? 'Teacher Portal' : 'User Portal';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      
      {/* Top Announcement Header Bar */}
      <Header />

      {/* Main Navbar */}
      <Navbar />

      {/* Mobile Portal Toggle Bar (Shown only on mobile protected dashboard routes) */}
      {showSidebar && (
        <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">{roleTitle}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-cyan-300 font-bold px-3 py-1.5 rounded-xl text-xs border border-purple-600/50 shadow-sm"
          >
            <Menu className="w-4 h-4" />
            <span>Portal Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
        
        {/* Role Sidebar (ONLY shown when authenticated and on dashboard pages) */}
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}

        {/* Content Body Area */}
        <main className={`flex-1 w-full max-w-full overflow-x-hidden ${showSidebar ? 'p-4 md:p-8 bg-slate-50' : 'p-0'}`}>
          {showSidebar && <Breadcrumbs />}
          {children || <Outlet />}
        </main>

      </div>

      {/* Footer Component */}
      <Footer />

    </div>
  );
}
