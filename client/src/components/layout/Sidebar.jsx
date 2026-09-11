import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  CalendarCheck,
  BellRing,
  UserCircle,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { noticeApi } from '../../api/noticeApi';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentRole, isAuthenticated } = useAuth();
  const [noticeCount, setNoticeCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      noticeApi.getNotices()
        .then((res) => {
          const list = res.data?.notices || [];
          setNoticeCount(list.length);
        })
        .catch((err) => console.warn('Sidebar notice count fetch notice:', err));
    }
  }, [isAuthenticated, location.pathname]);

  const roleMenus = {
    student: [
      { name: 'User Portal', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Batches', path: '/student/batches', icon: Layers },
      { name: 'Fee Status & Pay', path: '/student/payments', icon: CreditCard },
      { name: 'My Attendance', path: '/student/attendance', icon: CalendarCheck },
      { name: 'Notices', path: '/student/notices', icon: BellRing },
    ],
    admin: [
      { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Batch Management', path: '/admin/batches', icon: Layers },
      { name: 'Payments & Fees', path: '/admin/payments', icon: CreditCard },
      { name: 'Notice Board', path: '/admin/notices', icon: BellRing },
    ],
    teacher: [
      { name: 'Teacher Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
      { name: 'Assigned Batches', path: '/teacher/batches', icon: Layers },
      { name: 'Batch Notices', path: '/teacher/notices', icon: BellRing },
    ]
  };

  const menuItems = roleMenus[currentRole] || roleMenus.student;
  const roleLabel = currentRole === 'admin' ? 'Admin Portal' : currentRole === 'teacher' ? 'Teacher Portal' : 'User Portal';

  const sidebarContent = (
    <div className="bg-slate-900 text-slate-100 w-64 h-full min-h-[calc(100vh-5rem)] border-r border-slate-800 flex flex-col justify-between p-4 shadow-2xl">
      <div className="space-y-6">

        {/* User Role Header Badge & Mobile Close Button */}
        <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-700/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              {roleLabel}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>
            {/* Mobile Close Icon */}
            <button
              onClick={() => setIsOpen && setIsOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-cyan-300'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {item.name.includes('Notice') && noticeCount > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950'
                      }`}>
                      {noticeCount}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Shortcut */}
      <div className="pt-4 border-t border-slate-800/80">
        <Link
          to="/profile"
          onClick={() => setIsOpen && setIsOpen(false)}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-slate-300 hover:text-white"
        >
          <UserCircle className="w-5 h-5 text-cyan-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Account Settings</p>
            <p className="text-[10px] text-slate-400 truncate">Profile & Security</p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Visible on md and larger) */}
      <aside className="hidden md:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          {sidebarContent}
          {/* Backdrop Click Handler */}
          <div className="flex-1" onClick={() => setIsOpen && setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
