import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [postAdOpen, setPostAdOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLink = 'px-4 py-2 text-white/80 text-[15px] font-semibold rounded-xl transition-all duration-200 hover:text-gold-bright hover:bg-white/5 select-none';

  return (
    <header className="bg-navy sticky top-0 z-50 border-b border-white/5">
      <nav className="flex items-left justify-between max-w-[1240px] mx-auto px-7 h-[72px]">

        {/* Logo */}
        <Link to={user ? '/home' : '/'} className="flex-shrink-0">
          <img src="/img/logo3.png" alt="EaseEstate" className="h-18 w-auto" />
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-1 list-none" style={{ fontFamily: 'var(--font-heading)' }}>
          {user ? (
            <>
              <li><Link to="/buy" className={navLink}>Buy</Link></li>
              <li><Link to="/rent" className={navLink}>Rent</Link></li>

              {/* Post an Ad */}
              <li
                className="relative"
                onMouseEnter={() => setPostAdOpen(true)}
                onMouseLeave={() => setPostAdOpen(false)}
              >
                <span className={`${navLink} cursor-pointer flex items-center gap-1`}>
                  Post an Ad
                  <svg
                    className={`w-3 h-3 opacity-60 transition-transform duration-200 ${postAdOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {postAdOpen && (
                  <ul className="animate-drop absolute top-full left-0 bg-navy-light border border-gold-bright/20 rounded-2xl shadow-2xl z-[1000] list-none min-w-[160px] pt-3 pb-1.5 px-1.5">
                    <li>
                      <Link to="/sell" className="block px-4 py-2.5 text-white/85 text-sm font-medium rounded-xl hover:bg-white/8 hover:text-gold-bright transition-all duration-150">
                        Sell Property
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-rent" className="block px-4 py-2.5 text-white/85 text-sm font-medium rounded-xl hover:bg-white/8 hover:text-gold-bright transition-all duration-150">
                        Rent Property
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li><Link to="/agents" className={navLink}>Agents</Link></li>
              <li><Link to="/blogs" className={navLink}>Blogs</Link></li>
              <li><Link to="/about" className={navLink}>About</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className={navLink}>Buy</Link></li>
              <li><Link to="/login" className={navLink}>Sell</Link></li>
              <li><Link to="/login" className={navLink}>Rent</Link></li>
              <li><Link to="/blogs" className={navLink}>Blogs</Link></li>
              <li><Link to="/about" className={navLink}>About</Link></li>
            </>
          )}
        </ul>

        {/* Right side */}
        {user ? (
          <div ref={profileRef} className="relative p-3">
            <button
              onClick={() => setProfileOpen(p => !p)}
              className=" w-[42px] h-[42px] rounded-full border-2 border-gold overflow-hidden hover:border-gold-bright hover:shadow-[0_0_0_3px_rgba(255,217,61,0.22)] transition-all duration-200 p-0 bg-transparent"
            >
              <img src="/img/profilelogo.png" alt="Profile" className="w-full h-full object-cover" />
            </button>

            {profileOpen && (
              <ul className="animate-drop absolute top-[calc(100%+10px)] right-0 bg-white border border-border-c rounded-2xl shadow-2xl z-[1000] w-[220px] list-none overflow-hidden">
                {/* Header */}
                <li className="px-4 py-3.5 bg-navy border-b-2 border-gold-bright flex items-center gap-3">
                  <img src="/img/default-profile.png" alt="Avatar"
                    className="w-9 h-9 rounded-full border-2 border-gold flex-shrink-0" />
                  <span className="text-white font-bold text-sm"
                    style={{ fontFamily: 'var(--font-heading)' }}>{user.username}</span>
                </li>
                {[
                  { to: '/profile', label: 'My Profile' },
                  { to: '/my-properties', label: 'My Ads' },
                  { to: '/inbox', label: 'Inbox' },
                ].map(item => (
                  <li key={item.to} className="border-b border-border-c last:border-0">
                    <Link to={item.to}
                      className="block px-5 py-3 text-ink text-sm font-medium hover:bg-surface hover:text-navy transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-border-c">
                  <button onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-red-err text-sm font-semibold hover:bg-red-50 transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex gap-2.5 items-center">
            <Link to="/login">
              <button className="px-5 py-2 border border-white/50 text-white text-sm font-semibold rounded-xl hover:border-gold-bright hover:text-gold-bright transition-all"
                style={{ fontFamily: 'var(--font-heading)' }}>
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
