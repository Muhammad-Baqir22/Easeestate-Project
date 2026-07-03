import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 pt-14">
      <div className="max-w-[1240px] mx-auto px-7 grid grid-cols-3 gap-12 pb-12">

        {/* Brand */}
        <div>
          <img src="/img/logo3.png" alt="EaseEstate" className="h-12 w-auto mb-4" />
          <p className="text-sm text-white/50 leading-relaxed max-w-[260px]">
            Pakistan's trusted platform for buying, selling, and renting properties.
            Find your perfect home today.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[11px] font-bold text-white tracking-[0.1em] uppercase mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Company
          </h4>
          <ul className="flex flex-col gap-3 list-none">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/blogs', label: 'Blogs' },
              { to: '/agents', label: 'Agents' },
              { to: '/contact', label: 'Contact' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/55 text-sm hover:text-gold-bright transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + Social */}
        <div>
          <h4 className="text-[11px] font-bold text-white tracking-[0.1em] uppercase mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Legal
          </h4>
          <ul className="flex flex-col gap-3 list-none mb-8">
            <li><Link to="/privacy" className="text-white/55 text-sm hover:text-gold-bright transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-white/55 text-sm hover:text-gold-bright transition-colors">Terms of Service</Link></li>
          </ul>

          <h4 className="text-[11px] font-bold text-white tracking-[0.1em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Follow Us
          </h4>
          <div className="flex gap-3">
            {[
              { href: 'https://facebook.com', src: '/img/facebook.png', alt: 'Facebook' },
              { href: 'https://instagram.com', src: '/img/insta.png', alt: 'Instagram' },
              { href: 'https://twitter.com', src: '/img/twitter.png', alt: 'Twitter' },
              { href: 'https://linkedin.com', src: '/img/linkedin.png', alt: 'LinkedIn' },
            ].map(s => (
              <a key={s.alt} href={s.href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-gold-bright hover:bg-gold-bright/20 transition-all">
                <img src={s.src} alt={s.alt} className="w-[18px] h-[18px]"
                  style={{ filter: 'brightness(0) invert(1)' }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-[13px] text-white/35">
          &copy; {new Date().getFullYear()} EaseEstate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
