import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const BASE = '/api/uploads/';

export default function Profile() {
  const [user, setUser]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState('');

  useEffect(() => { api.get('/profile').then(r => setUser(r.data.user)); }, []);

  if (!user) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
      </div>
      <Footer />
    </>
  );

  const set = (f) => (e) => setUser(u => ({ ...u, [f]: e.target.value }));

  const handlePic = (e) => {
    const file = e.target.files[0];
    if (file) { setProfilePic(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const data = new FormData();
      data.append('username', user.username);
      data.append('email', user.email);
      data.append('phone', user.phone || '');
      data.append('address', user.address || '');
      if (profilePic) data.append('profile_pic', profilePic);
      await api.put('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Profile updated successfully!');
    } catch {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = preview
    ? preview
    : user.profile_image
      ? BASE + user.profile_image
      : '/img/default-profile.png';

  const isSuccess = msg.includes('success');

  return (
    <>
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="bg-navy pb-16 pt-10 px-6">
        <div className="max-w-[860px] mx-auto flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gold-bright shadow-[0_0_0_6px_rgba(200,149,42,0.18)]"
            />
            <label
              title="Change photo"
              className="absolute bottom-1 right-1 w-8 h-8 bg-gold-bright rounded-full flex items-center justify-center cursor-pointer hover:bg-gold transition-colors shadow-md"
            >
              <svg className="w-4 h-4 text-navy" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-3 1 1-3a4 4 0 01.828-1.414z" />
              </svg>
              <input type="file" accept="image/*" onChange={handlePic} className="hidden" />
            </label>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {user.username}
            </h1>
            <p className="text-white/50 text-sm mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── Content cards (overlap hero slightly) ── */}
      <main className="max-w-[860px] mx-auto px-6 -mt-6 pb-14 flex flex-col gap-5">

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-border-c shadow-md">
          <div className="px-7 py-5 border-b border-border-c flex items-center gap-3">
            <span className="w-1 h-6 bg-gold-bright rounded-full block flex-shrink-0" />
            <h2 className="text-[17px] font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
              Personal Information
            </h2>
          </div>

          <div className="px-7 py-6">
            {msg && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm font-medium ${
                isSuccess
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-err/30 text-red-err'
              }`}>
                <span>{isSuccess ? '✓' : '✕'}</span>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">
                {[
                  { label: 'Full Name',     field: 'username', type: 'text',  placeholder: 'Your full name'    },
                  { label: 'Email Address', field: 'email',    type: 'email', placeholder: 'your@email.com'    },
                  { label: 'Phone Number',  field: 'phone',    type: 'tel',   placeholder: '+92 300 0000000'   },
                  { label: 'Address',       field: 'address',  type: 'text',  placeholder: 'Your city/address' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    <input
                      type={type}
                      value={user[field] || ''}
                      onChange={set(field)}
                      placeholder={placeholder}
                      className="field"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn px-9 py-3"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-2xl border border-border-c shadow-md">
          <div className="px-7 py-5 border-b border-border-c flex items-center gap-3">
            <span className="w-1 h-6 bg-gold-bright rounded-full block flex-shrink-0" />
            <h2 className="text-[17px] font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
              Activity Overview
            </h2>
          </div>

          <div className="px-7 py-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Total Listed', value: '5', icon: '🏠' },
              { label: 'Sold',         value: '3', icon: '✅' },
              { label: 'Rented',       value: '2', icon: '🔑' },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-surface border border-border-c rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                <span className="text-2xl mb-2 block">{icon}</span>
                <p className="text-3xl font-black text-navy mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {value}
                </p>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
