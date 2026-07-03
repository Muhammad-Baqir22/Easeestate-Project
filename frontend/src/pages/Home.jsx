import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ColonyCard from '../components/ColonyCard';

const COLONIES = [
  { image: '/img/bahria.png',  name: 'Bahria Town' },
  { image: '/img/DHA.jpeg',   name: 'DHA' },
  { image: '/img/gulberg.jpeg', name: 'Gulberg Green' },
  { image: '/img/pvc.png',    name: 'Park View City' },
];

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState('buy');
  const [location, setLocation] = useState('');
  const [size, setSize]       = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (size)     params.set('size', size);
    params.set('type', mode === 'buy' ? 'sale' : 'rent');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0 bg-[url('/img/cover.jpg')] bg-cover bg-center" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/45 to-navy/75" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-block bg-gold-bright/20 text-gold-bright text-xs font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Pakistan&apos;s #1 Real Estate Platform
          </span>

          <h1 className="text-white font-bold leading-tight mb-3 text-[clamp(28px,5vw,56px)]"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>
            Find Your <span className="text-gold-bright">Dream Home</span>
            <br />in Pakistan
          </h1>
          <p className="text-white/75 text-[17px] mb-10 max-w-[440px] leading-relaxed">
            Browse thousands of verified properties for sale and rent across the country.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-[640px] border border-white/40">
            {/* Tabs */}
            <div className="flex bg-surface-2 rounded-xl p-1 mb-5 gap-1">
              {['buy', 'rent'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-bold transition-all duration-200 capitalize ${
                    mode === m
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-muted hover:text-navy hover:bg-navy/6'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  {m === 'buy' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-3 items-stretch">
              <input
                type="text"
                placeholder="Enter city or location..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
                className="flex-1 px-4 py-3.5 border border-border-c rounded-xl text-[15px] text-ink bg-white outline-none transition-all focus:border-navy-mid focus:ring-2 focus:ring-navy-mid/10 min-w-0"
              />
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="px-3 py-3.5 border border-border-c rounded-xl text-[15px] text-slate bg-white outline-none focus:border-navy-mid focus:ring-2 focus:ring-navy-mid/10 cursor-pointer"
              >
                <option value="">Any Size</option>
                <option value="5-marla">5 Marla</option>
                <option value="10-marla">10 Marla</option>
                <option value="1-kanal">1 Kanal</option>
                <option value="2-kanal">2 Kanal</option>
              </select>
              <button type="submit" className="btn px-6 flex-shrink-0">
                Search
              </button>
            </form>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 mt-8">
            {[['10K+', 'Properties'], ['5K+', 'Happy Clients'], ['200+', 'Agents']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-gold-bright text-2xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>{n}</p>
                <p className="text-white/60 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Colonies ─── */}
      <section className="py-20 px-6 bg-surface text-center">
        <span className="inline-block text-gold text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 bg-gold/10 rounded-full mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}>
          Explore
        </span>
        <h2 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Featured Colonies
        </h2>
        <p className="text-muted text-[15px] mb-10 max-w-[400px] mx-auto">
          Pakistan&apos;s most sought-after residential areas
        </p>

        <div className="flex justify-center gap-5 flex-wrap">
          {COLONIES.map(c => <ColonyCard key={c.name} {...c} />)}
        </div>
      </section>

      <Footer />
    </>
  );
}
