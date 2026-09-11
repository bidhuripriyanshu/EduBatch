import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  PhoneCall, 
  LogOut, 
  Menu, 
  X,
  ShoppingCart,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { noticeApi } from '../../api/noticeApi';

export default function Navbar() {
  const { user, currentRole, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [noticeCount, setNoticeCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      noticeApi.getNotices()
        .then((res) => {
          const list = res.data?.notices || [];
          setNoticeCount(list.length);
        })
        .catch((err) => console.warn('Notices count fetch notice:', err));
    }
  }, [isAuthenticated, location.pathname]);

  // Public Links (shown always)
  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Authenticated Links (Dashboard added ONLY when logged in)
  const authenticatedLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Dashboard', path: `/${currentRole}/dashboard` },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <nav className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 text-white sticky top-0 z-50 shadow-lg border-b border-purple-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-300 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
                EduBatch
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-300/80 -mt-1">
                Learning Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                               (link.name === 'Dashboard' && location.pathname.includes('/dashboard')) ||
                               (link.name === 'Notices' && location.pathname.includes('/notices'));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-cyan-300 font-semibold'
                      : 'text-purple-100 hover:text-cyan-300'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Shopping Cart Icon Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-purple-800/60 hover:bg-purple-700/80 text-cyan-300 hover:text-white transition-all border border-purple-600/40 flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Contact Call Badge */}
            <a
              href="tel:+919876543210"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-full text-xs flex items-center space-x-2 shadow-md transition-transform hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
              <span>+91 98765 43210</span>
            </a>

            {/* Auth State (Login / Sign Up or Profile / Logout) */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l border-purple-800/80 pl-4">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <img
                    src={user?.avatar || (user?.role === 'admin' ? '/admin.png' : user?.role === 'teacher' ? '/teacher.png' : '/student.png')}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full ring-2 ring-cyan-400 object-cover group-hover:ring-amber-400 transition-all bg-white"
                  />
                  <span className="text-xs font-semibold text-purple-100 group-hover:text-cyan-300 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors flex items-center space-x-1 text-xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-purple-100 hover:text-cyan-300 px-3 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-2 rounded-full text-xs shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-purple-900/60 text-cyan-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-purple-900/60 text-purple-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-purple-950/95 border-b border-purple-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-purple-100 hover:bg-purple-900/60 hover:text-cyan-300"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-purple-800/60 flex flex-col space-y-2">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-purple-100 bg-purple-900/40 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-slate-950 bg-cyan-400 rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 text-sm font-semibold text-purple-200 bg-purple-900/40 rounded-xl flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
            <a
              href="tel:+919876543210"
              className="bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-center text-xs flex items-center justify-center space-x-2 mt-2"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950" />
              <span>+91 98765 43210</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
