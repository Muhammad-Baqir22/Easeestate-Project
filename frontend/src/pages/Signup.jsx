import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, phone: form.phone, address: form.address, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-navy-mid px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[460px] overflow-hidden">

        {/* Header */}
        <div className="bg-navy px-9 pt-8 pb-6 border-b-[3px] border-gold-bright">
          <img src="/img/logo3.png" alt="EaseEstate" className="h-10 w-auto mb-3" />
          <h2 className="text-white text-[22px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Create your account
          </h2>
          <p className="text-white/55 text-sm mt-1">Join EaseEstate today — it&apos;s free</p>
        </div>

        {/* Form */}
        <div className="px-9 py-8">
          {error && (
            <div className="bg-red-50 border border-red-err/30 text-red-err rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input type="text" placeholder="Your name" value={form.username}
                  onChange={set('username')} required className="field" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" placeholder="you@email.com" value={form.email}
                  onChange={set('email')} required className="field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone</label>
                <input type="tel" placeholder="+92 300..." value={form.phone}
                  onChange={set('phone')} className="field" />
              </div>
              <div>
                <label className="label">Address</label>
                <input type="text" placeholder="City, Area" value={form.address}
                  onChange={set('address')} className="field" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" placeholder="Create a password" value={form.password}
                onChange={set('password')} required className="field" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirm}
                onChange={set('confirm')} required className="field" />
            </div>

            <button type="submit" className="btn w-full py-3.5 text-[15px] mt-1" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-navy font-bold border-b border-gold-bright pb-px hover:text-navy-mid transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
