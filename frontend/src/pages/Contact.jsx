import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CONTACTS = [
  { name: 'Muhammad Bakar', role: 'Backend Developer', email: '22p-9116@std.nuces.edu.pk' },
  { name: 'Abdul Rehman',   role: 'Frontend Developer', email: '22p-9124@std.nuces.edu.pk' },
];

export default function Contact() {
  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Contact Us
        </h1>
        <p className="text-white/60 max-w-[480px] mx-auto">
          We&apos;re here to help. Reach out to the team behind EaseEstate.
        </p>
      </div>

      <main className="max-w-[860px] mx-auto px-6 py-14">
        <div className="grid grid-cols-2 gap-6">
          {CONTACTS.map(c => (
            <div key={c.email}
              className="bg-white border border-border-c rounded-2xl p-9 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mx-auto mb-5">
                <span className="text-gold-bright text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {c.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-navy text-[18px] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {c.name}
              </h3>
              <p className="text-muted text-sm mb-4">{c.role}</p>
              <a href={`mailto:${c.email}`}
                className="inline-block bg-surface border border-border-c text-navy text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-gold-bright hover:border-gold-bright hover:text-navy transition-all"
                style={{ fontFamily: 'var(--font-heading)' }}>
                ✉️ {c.email}
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
