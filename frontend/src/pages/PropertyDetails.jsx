import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import ChatBox from '../components/ChatBox';
import api from '../utils/api';

const SIZE_LABEL = { '5-marla': '5 Marla', '10-marla': '10 Marla', '1-kanal': '1 Kanal', '2-kanal': '2 Kanal' };

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(r => setProperty(r.data.property))
      .catch(() => navigate('/buy'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
      </div>
      <Footer />
    </>
  );
  if (!property) return null;

  const DetailRow = ({ label, value }) => (
    <div className="bg-surface rounded-xl p-4">
      <span className="block text-[11px] font-bold text-muted uppercase tracking-[0.07em] mb-1.5"
        style={{ fontFamily: 'var(--font-heading)' }}>{label}</span>
      <span className="text-[15px] font-semibold text-ink capitalize">{value}</span>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-[940px] mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-2xl font-bold text-navy mb-6 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}>
          {property.title}
        </h1>

        <ImageSlider images={property.images} />

        {/* Price banner */}
        <div className="bg-surface border-l-4 border-gold-bright rounded-2xl p-6 mb-7 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}>
              {property.property_type === 'rent' ? 'Monthly Rent' : 'Asking Price'}
            </p>
            <h2 className="text-4xl font-black text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
              Rs {Number(property.price).toLocaleString()}
            </h2>
          </div>
          <div className="flex gap-2">
            {property.property_type && (
              <span className="bg-navy text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {property.property_type === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
            )}
            {property.category && (
              <span className="bg-gold-bright text-navy text-xs font-bold px-4 py-1.5 rounded-full capitalize"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {property.category}
              </span>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="mb-7">
          <h3 className="text-[19px] font-bold text-navy mb-4 pb-3 border-b-2 border-gold-bright"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Property Details
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            <DetailRow label="Location" value={property.location} />
            <DetailRow label="Colony" value={property.colony} />
            <DetailRow label="Type" value={property.property_type} />
            <DetailRow label="Size" value={SIZE_LABEL[property.size] || property.size} />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-[19px] font-bold text-navy mb-4 pb-3 border-b-2 border-gold-bright"
            style={{ fontFamily: 'var(--font-heading)' }}>
            Description
          </h3>
          <p className="text-slate leading-[1.8]">{property.description}</p>
        </div>

        <ChatBox
          propertyId={property.id}
          receiverId={property.owner_id}
          initialMessages={property.messages || []}
        />

        {/* Similar Properties */}
        <div>
          <h3 className="text-[19px] font-bold text-navy mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Similar Properties
          </h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              { title: '10 Marla House', price: '15,000,000', city: 'Lahore', colony: 'Bahria Town' },
              { title: '1 Kanal Plot', price: '20,000,000', city: 'Islamabad', colony: 'Park View City' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border-c shadow-sm overflow-hidden">
                <img src="/img/default-property.png" alt={s.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h4>
                  <p className="text-[17px] font-black text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Rs {s.price}
                  </p>
                  <p className="text-sm text-muted">📍 {s.city}, {s.colony}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
