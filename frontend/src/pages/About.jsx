import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TEAM = [
  { img: '/img/agent1.jpeg', name: 'Ali Khan',        role: 'Co-Founder & CEO' },
  { img: '/img/agent2.jpg',  name: 'Sara Ahmad',      role: 'Co-Founder & CTO' },
  { img: '/img/agent1.jpeg', name: 'Michael Johnson',  role: 'Head of Sales' },
  { img: '/img/agent2.jpg',  name: 'Sarah Williams',  role: 'Marketing Manager' },
];

const VALUES = [
  { icon: '🔍', title: 'Transparency',   desc: 'We believe in providing clear and honest information to our users.' },
  { icon: '❤️', title: 'Customer Focus', desc: 'Our users are at the heart of everything we do.' },
  { icon: '💡', title: 'Innovation',     desc: 'We continuously strive to improve and innovate our platform.' },
];

export default function About() {
  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          About EaseEstate
        </h1>
        <p className="text-white/60 max-w-[480px] mx-auto">
          Simplifying real estate in Pakistan, one property at a time.
        </p>
      </div>

      <main className="max-w-[1020px] mx-auto px-6 py-14 flex flex-col gap-14">

        {/* Mission */}
        <section className="bg-gradient-to-r from-navy to-navy-mid rounded-2xl p-10 border-l-[5px] border-gold-bright">
          <h2 className="text-gold-bright text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Mission
          </h2>
          <p className="text-white/80 leading-[1.85] text-[15px]">
            At EaseEstate, our mission is to simplify the process of buying, selling, and renting properties.
            We aim to provide a seamless and user-friendly platform that connects buyers, sellers, and agents,
            making real estate transactions easier and more transparent.
          </p>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Team
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
            {TEAM.map(m => (
              <div key={m.name} className="bg-white border border-border-c rounded-2xl p-6 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <img src={m.img} alt={m.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-3 border-gold-bright" />
                <h3 className="font-bold text-navy text-[15px] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {m.name}
                </h3>
                <p className="text-muted text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Values
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white border border-border-c rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-navy text-[17px] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {v.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
