import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect personal information such as your name, email address, phone number, and address when you register on our platform. We also collect property-related information that you provide when listing properties.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to provide our services, including facilitating property transactions, communicating with you about your account, and improving our platform.' },
  { title: '3. Data Security', body: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.' },
  { title: '4. Sharing Your Information', body: 'We do not sell or rent your personal information to third parties. We may share your information with real estate agents and potential buyers/sellers as necessary to complete transactions.' },
  { title: '5. Cookies', body: 'We use session cookies to maintain your login session. These are temporary and are deleted when you close your browser or log out.' },
  { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal information at any time through your profile settings.' },
  { title: '7. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at support@easeestate.com.' },
  { title: '8. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.' },
];

export default function Privacy() {
  return (
    <>
      <Navbar />

      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Privacy Policy
        </h1>
        <p className="text-white/50 text-sm">Last updated: October 2023</p>
      </div>

      <main className="max-w-[760px] mx-auto px-6 py-12 flex flex-col gap-6">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-white border border-border-c rounded-2xl p-7 shadow-sm">
            <h2 className="font-bold text-navy text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {s.title}
            </h2>
            <p className="text-slate text-[15px] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </main>

      <Footer />
    </>
  );
}
