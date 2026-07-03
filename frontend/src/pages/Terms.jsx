import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />

      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Terms of Service
        </h1>
        <p className="text-white/50 text-sm">Last updated: October 2023</p>
      </div>

      <main className="max-w-[760px] mx-auto px-6 py-12 flex flex-col gap-6">
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing and using EaseEstate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
          },
          {
            title: '2. User Responsibilities',
            body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and truthful information when listing properties or registering an account.',
          },
          {
            title: '3. Property Listings',
            body: 'All property listings must be accurate and not misleading. EaseEstate reserves the right to remove any listings that violate our policies or applicable laws.',
          },
          {
            title: '5. Limitation of Liability',
            body: 'EaseEstate is not responsible for any transactions between buyers and sellers. We are a platform that facilitates connections and do not guarantee the accuracy of any listings.',
          },
          {
            title: '6. Termination',
            body: 'We reserve the right to terminate your account at any time for violation of these terms or for any other reason at our discretion.',
          },
        ].map(s => (
          <div key={s.title} className="bg-white border border-border-c rounded-2xl p-7 shadow-sm">
            <h2 className="font-bold text-navy text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {s.title}
            </h2>
            <p className="text-slate text-[15px] leading-relaxed">{s.body}</p>
          </div>
        ))}

        {/* Prohibited Activities */}
        <div className="bg-white border border-border-c rounded-2xl p-7 shadow-sm">
          <h2 className="font-bold text-navy text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            4. Prohibited Activities
          </h2>
          <ul className="flex flex-col gap-2">
            {[
              'Posting false or misleading property information',
              'Using the platform for fraudulent activities',
              'Harassing other users',
              'Attempting to circumvent our security measures',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-slate text-[15px]">
                <span className="text-gold mt-0.5">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </>
  );
}
