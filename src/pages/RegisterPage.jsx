import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundOrbs from '../components/BackgroundOrbs';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-theme">
      <BackgroundOrbs />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-dark-card shadow-2xl mb-4 border border-white dark:border-white/10 glass-card">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-surface-500 font-medium">Start organizing your style today</p>
        </div>

        <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect bottom right */}
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent-500/10 blur-3xl rounded-full"></div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-50/50 dark:bg-dark-bg/50 border border-surface-200 dark:border-dark-border focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium"
                placeholder="Alex Styles"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-50/50 dark:bg-dark-bg/50 border border-surface-200 dark:border-dark-border focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium"
                placeholder="alex@style.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-50/50 dark:bg-dark-bg/50 border border-surface-200 dark:border-dark-border focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-surface-50/50 dark:bg-dark-bg/50 border border-surface-200 dark:border-dark-border focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 btn-glow"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
