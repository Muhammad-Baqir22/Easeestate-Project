import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function ChatBox({ propertyId, receiverId, initialMessages = [] }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/chat/send', { property_id: propertyId, receiver_id: receiverId, message: text });
      setMessages(prev => [...prev, {
        sender_id: user?.id,
        sender_name: user?.username || 'You',
        message: text,
        timestamp: 'Just now',
      }]);
      setText('');
    } catch {
      alert('Failed to send message. Please log in.');
    }
  };

  return (
    <div className="bg-surface border border-border-c rounded-2xl p-6 mb-8">
      <h3 className="text-[18px] font-bold text-navy mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}>
        Message Seller
      </h3>
      <div className="border border-border-c rounded-xl overflow-hidden">
        <div className="chat-messages">
          {messages.length === 0 && (
            <p className="text-sm text-muted text-center py-8">No messages yet. Start the conversation!</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.sender_id === user?.id
                  ? 'self-end bg-navy text-white rounded-br-sm ml-auto'
                  : 'self-start bg-surface-2 text-ink rounded-bl-sm'
              }`}
            >
              <strong className="block text-[11px] opacity-60 mb-1">{m.sender_name}</strong>
              <p>{m.message}</p>
              <small className="block text-[11px] opacity-50 mt-1.5">{m.timestamp}</small>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="flex border-t border-border-c">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 px-4 py-3.5 text-sm text-ink outline-none bg-white"
          />
          <button type="submit" className="btn rounded-none px-6">Send</button>
        </form>
      </div>
    </div>
  );
}
