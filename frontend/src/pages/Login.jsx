import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-navy-mid px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[430px] overflow-hidden">

        {/* Header strip */}
        <div className="bg-navy px-9 pt-8 pb-6 border-b-[3px] border-gold-bright">
          <div className="flex items-center gap-3 mb-3">
            <img src="/img/logo3.png" alt="EaseEstate" className="h-10 w-auto" />
          </div>
          <h2 className="text-white text-[22px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back
          </h2>
          <p className="text-white/55 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="px-9 py-8">
          {error && (
            <div className="bg-red-50 border border-red-err/30 text-red-err rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Email</label>
              <input type="email" placeholder="Enter your email" value={email}
                onChange={e => setEmail(e.target.value)} required className="field" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} required className="field" />
            </div>

            <button type="submit" className="btn w-full py-3.5 text-[15px] mt-1" disabled={loading}>
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-navy font-bold border-b border-gold-bright pb-px hover:text-navy-mid transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
