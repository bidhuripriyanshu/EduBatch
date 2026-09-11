import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, KeyRound, UserCheck, ShieldAlert, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredSuccess = location.state?.registered;

  const handleLoginSubmit = async (emailToUse, passwordToUse) => {
    setError('');

    const targetEmail = emailToUse || email;
    const targetPassword = passwordToUse || password;

    if (!targetEmail || !targetPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      const assignedRole = await login(targetEmail, targetPassword);
      navigate(`/${assignedRole}/dashboard`);
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  // Quick fill helper
  const fillCredentials = (sampleEmail, samplePassword) => {
    setEmail(sampleEmail);
    setPassword(samplePassword);
    handleLoginSubmit(sampleEmail, samplePassword);
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
          <h2 className="text-2xl font-extrabold text-white">Sign in</h2>
        </div>

        {/* Registration Success Banner */}
        {registeredSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Registration successful! Please sign in with your account credentials.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-200 text-xs px-3.5 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all shadow-inner"
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-purple-200 hover:text-cyan-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold py-3.5 rounded-lg text-sm transition-all shadow-lg hover:shadow-amber-400/30 flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-purple-200">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-cyan-300 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
