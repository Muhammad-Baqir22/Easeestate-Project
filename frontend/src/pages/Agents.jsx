import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AGENTS = {
  Rawalpindi: [
    { img: '/img/agent1.jpeg', name: 'Ali Khan',    contact: '+92 300 1234567', email: 'ali.khan@gmail.com',    experience: '5 years' },
    { img: '/img/agent2.jpg',  name: 'Sara Ahmed',  contact: '+92 300 7654321', email: 'sara.ahmed@gmail.com',  experience: '7 years' },
  ],
  Peshawar: [
    { img: '/img/agent1.jpeg', name: 'Usman Ali',   contact: '+92 300 1122334', email: 'usman.ali@gmail.com',   experience: '4 years' },
    { img: '/img/agent2.jpg',  name: 'Fatima Khan', contact: '+92 300 4433221', email: 'fatima.khan@gmail.com', experience: '6 years' },
  ],
};

export default function Agents() {
  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Property Agents
        </h1>
        <p className="text-white/60 max-w-[480px] mx-auto">
          Connect with experienced agents in your city.
        </p>
      </div>

      <main className="max-w-[1020px] mx-auto px-6 py-12 flex flex-col gap-12">
        {Object.entries(AGENTS).map(([city, agents]) => (
          <section key={city}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-navy whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}>{city}</h2>
              <div className="flex-1 h-px bg-border-c" />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
              {agents.map(a => (
                <div key={a.name}
                  className="bg-white border border-border-c rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all flex">
                  <img src={a.img} alt={a.name}
                    className="w-28 object-cover flex-shrink-0" />
                  <div className="p-5 flex flex-col justify-center gap-1.5">
                    <h3 className="font-bold text-navy text-[16px]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {a.name}
                    </h3>
                    <p className="text-sm text-slate">📞 {a.contact}</p>
                    <p className="text-sm text-slate">✉️ {a.email}</p>
                    <span className="mt-1 inline-block bg-gold-bright/20 text-gold text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ fontFamily: 'var(--font-heading)' }}>
                      {a.experience} exp.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
