import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BLOGS = [
  {
    img: '/img/blog1.jpg',
    title: 'Top 5 Tips for First-Time Home Buyers',
    meta: 'Published on October 10, 2023 by John Doe',
    excerpt: 'Buying your first home can be overwhelming. Here are 5 tips to help you navigate the process and make the best decision for your future.',
  },
  {
    img: '/img/blog2.jpg',
    title: 'How to Stage Your Home for a Quick Sale',
    meta: 'Published on October 5, 2023 by Jane Smith',
    excerpt: 'Staging your home can significantly increase its appeal to potential buyers. Learn how to stage your home effectively to sell it quickly.',
  },
  {
    img: '/img/blog3.jpg',
    title: 'Understanding Property Taxes: A Complete Guide',
    meta: 'Published on September 28, 2023 by Michael Johnson',
    excerpt: 'Property taxes can be confusing. This guide breaks down everything you need to know about property taxes and how they affect your investment.',
  },
];

export default function Blogs() {
  const [messages, setMessages] = useState([{ from: 'admin', text: 'Hello! How can we assist you today?' }]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
  };

  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Property Blogs
        </h1>
        <p className="text-white/60 max-w-[480px] mx-auto">
          Expert insights and guides for buyers, sellers, and investors.
        </p>
      </div>

      <main className="max-w-[1020px] mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Blog cards */}
        {BLOGS.map(b => (
          <div key={b.title}
            className="bg-white border border-border-c rounded-2xl overflow-hidden flex gap-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <img src={b.img} alt={b.title}
              className="w-[280px] min-h-[190px] object-cover flex-shrink-0" />
            <div className="flex flex-col justify-center p-8">
              <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {b.title}
              </h2>
              <p className="text-xs text-muted mb-3 uppercase tracking-wide">{b.meta}</p>
              <p className="text-slate text-[15px] leading-relaxed mb-5">{b.excerpt}</p>
              <a href="#" className="btn self-start" onClick={e => e.preventDefault()}>Read More</a>
            </div>
          </div>
        ))}

        {/* Ask Us chat widget */}
        <div className="bg-white border border-border-c rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-navy px-7 py-4 border-b-[3px] border-gold-bright">
            <h2 className="text-white font-bold text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>
              Have a Question? Ask Us!
            </h2>
          </div>

          <div className="h-[260px] overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-navy text-white rounded-br-sm'
                    : 'bg-surface-2 text-ink rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="flex gap-2 p-4 border-t border-border-c bg-surface">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="field flex-1"
            />
            <button type="submit" className="btn px-5">Send</button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
