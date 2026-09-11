import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  KeyRound, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Award,
  Crown,
  BookOpen,
  Lock,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(authUser || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    phone: authUser?.phone || '',
    avatar: authUser?.avatar || '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      const userData = res.data?.user || res.user || res.data;
      if (userData) {
        setProfile(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || '',
        });
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      console.warn('Failed to load profile via getMe:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate profile update or update stored user state
      const updatedUser = {
        ...profile,
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(updatedUser);
      showNotification('Account settings updated successfully!');
    } catch (err) {
      showNotification(err.message || 'Failed to update profile settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const roleBadges = {
    admin: { label: 'System Admin', color: 'bg-amber-400 text-slate-950', icon: Crown },
    teacher: { label: 'Faculty Instructor', color: 'bg-purple-900 text-cyan-300', icon: Award },
    student: { label: 'Enrolled Student', color: 'bg-cyan-400 text-slate-950', icon: BookOpen },
  };

  const RoleIcon = roleBadges[profile?.role]?.icon || BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading Account Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Notification Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce ${
          toast.type === 'error' 
            ? 'bg-rose-900 text-rose-200 border border-rose-700' 
            : 'bg-slate-900 text-cyan-300 border border-cyan-400/50'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6 relative z-10">
          
          {/* Avatar Photo Container */}
          <div className="relative group">
            <img
              src={profile?.avatar || (profile?.role === 'admin' ? '/admin.png' : profile?.role === 'teacher' ? '/teacher.png' : '/student.png')}
              alt={profile?.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-cyan-400/80 shadow-2xl bg-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 p-2 rounded-xl border border-cyan-400 text-cyan-300 shadow-md">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{profile?.name || 'User Profile'}</h1>
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${roleBadges[profile?.role]?.color || 'bg-slate-800 text-white'}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleBadges[profile?.role]?.label || profile?.role}</span>
              </span>
            </div>
            <p className="text-purple-200 text-xs flex items-center space-x-2 font-medium">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{profile?.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Account</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Account Profile Details</span>
              </h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Account Active</span>
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-medium text-slate-700">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Email Address (Read-Only)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Assigned Platform Role</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value={profile?.role?.toUpperCase() || 'STUDENT'}
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-purple-900 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-900">Avatar Photo URL</label>
                <input
                  type="url"
                  name="avatar"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-400/20 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Account Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Security & Access Info */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Security & Password</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your account is secured with JWT tokens and bcrypt password hashing.
            </p>

            <div className="pt-2">
              <a
                href="/forgot-password"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-between shadow-sm transition-all"
              >
                <span>Change / Reset Password</span>
                <KeyRound className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md space-y-3">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Active Auth Session</span>
            </div>
            <p className="text-[11px] text-purple-200">
              User ID: <code className="font-mono text-cyan-200 select-all">{profile?._id || profile?.id}</code>
            </p>
            <p className="text-[11px] text-purple-200">
              Role Permission: <strong className="text-amber-400 uppercase">{profile?.role}</strong>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
