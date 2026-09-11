import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        phone,
      });
      setSuccessMessage('✓ Account created successfully! Redirecting to Sign In...');
      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Registration failed. Email may already be registered.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex items-center justify-center bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 py-12 px-4">
      <div className="w-full max-w-md bg-purple-700/90 border border-purple-500/40 rounded-2xl shadow-2xl p-8 space-y-6 text-white backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-cyan-300">
            EduBatch
          </span>
        </div>

        {/* Title */}
        <div className="text-left pt-2">
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-purple-200 mt-1">Register to access structured batches, schedules, and learning materials.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-200 text-xs px-3.5 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center space-x-2">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <input
              type="text"
              placeholder="Phone Number (e.g. +919876543210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
              required
            />
          </div>

          {/* Sign Up CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold py-3.5 rounded-lg text-sm transition-all shadow-lg hover:shadow-amber-400/30 flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-purple-600/40">
          <p className="text-xs text-purple-200">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
