import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { authApi } from '../../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSuccessMessage(res.message || 'Password reset token generated and sent to email!');
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err) {
      setErrorMessage(err.message || 'No user found with that email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Enter your registered email address below. We'll generate a secure reset token to restore your account access.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success View */}
        {successMessage ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-900">Reset Token Generated!</h3>
              <p className="text-xs text-emerald-700">Password reset instructions have been sent to your email.</p>
            </div>

            <button
              onClick={() => navigate('/reset-password', { state: { token: resetToken } })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium text-slate-700">
            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="rahul.student@edubatch.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3.5 rounded-xl text-xs shadow-md shadow-cyan-400/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Generate Reset Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Log In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
