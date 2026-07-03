import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/chat/inbox')
      .then(r => setMessages(r.data.messages))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-navy py-14 px-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Inbox
        </h1>
        <p className="text-white/60">Your recent property conversations.</p>
      </div>

      <main className="max-w-[760px] mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <button
                key={i}
                onClick={() => navigate(`/chat/${m.property_id}/${m.sender_id}`)}
                className="bg-white border border-border-c rounded-2xl px-6 py-4 text-left hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all w-full"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-navy text-[15px]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {m.sender_name}
                  </span>
                  <span className="text-[11px] text-muted">{m.timestamp}</span>
                </div>
                <p className="text-slate text-sm line-clamp-2 mb-1.5">{m.message}</p>
                <span className="text-[11px] text-muted font-medium">{m.property_title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-5">💬</p>
            <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No Messages Yet
            </h3>
            <p className="text-muted">When someone messages you about a property, it will appear here.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
