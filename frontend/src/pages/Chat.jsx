import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Chat() {
  const { propertyId, receiverId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/${propertyId}/${receiverId}`)
      .then(r => setMessages(r.data.messages))
      .catch(() => setMessages([]));
  }, [propertyId, receiverId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/chat/send', {
        property_id: Number(propertyId),
        receiver_id: Number(receiverId),
        message: text,
      });
      setMessages(prev => [...prev, {
        sender_id: user?.id,
        sender_name: user?.username || 'You',
        message: text,
        timestamp: 'Just now',
      }]);
      setText('');
    } catch {
      alert('Failed to send message.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-navy py-10 px-6 text-center border-b border-white/10">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Property Chat
        </h1>
      </div>

      <main className="max-w-[700px] mx-auto px-6 py-8">
        <div className="bg-white border border-border-c rounded-2xl overflow-hidden shadow-sm flex flex-col">

          {/* Messages */}
          <div className="flex-1 h-[420px] overflow-y-auto p-5 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((m, i) => {
                const isMe = m.sender_id === user?.id;
                return (
                  <div key={i} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[11px] text-muted font-semibold px-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {m.sender_name}
                    </span>
                    <div className={`max-w-[72%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                      isMe
                        ? 'bg-navy text-white rounded-br-sm'
                        : 'bg-surface-2 text-ink rounded-bl-sm'
                    }`}>
                      {m.message}
                    </div>
                    <span className="text-[10px] text-muted px-1">{m.timestamp}</span>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Send form */}
          <form onSubmit={send}
            className="flex gap-2 p-4 border-t border-border-c bg-surface">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="field flex-1"
            />
            <button type="submit" className="btn px-6">Send</button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
