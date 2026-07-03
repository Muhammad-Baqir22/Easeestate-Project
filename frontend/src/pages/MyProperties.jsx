import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const BASE = '/api/uploads/';

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  const load = () => {
    api.get('/myproperties')
      .then(r => setProperties(r.data.properties))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete property.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-[920px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
            My Listed Properties
          </h1>
          <Link to="/sell">
            <button className="btn">+ Post New Ad</button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="flex flex-col gap-5">
            {properties.map(p => {
              const img = p.images?.length ? BASE + p.images[0] : '/img/default-property.png';
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-border-c shadow-sm flex overflow-hidden hover:shadow-md transition-shadow">
                  <img src={img} alt={p.title}
                    className="w-[190px] min-h-[140px] object-cover flex-shrink-0" />
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-navy text-[16px]"
                          style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h3>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 uppercase ${
                          p.property_type === 'sale' ? 'bg-navy/10 text-navy' : 'bg-gold-bright/20 text-gold'
                        }`} style={{ fontFamily: 'var(--font-heading)' }}>
                          {p.property_type === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                      <p className="text-xl font-black text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Rs {Number(p.price).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted">📍 {p.location} &bull; {p.size}</p>
                    </div>
                    <div className="flex gap-2.5 mt-3">
                      <button onClick={() => navigate(`/update-property/${p.id}`)}
                        className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-[10px] hover:bg-navy-mid transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}>
                        Update
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="px-4 py-2 border border-red-err text-red-err text-sm font-semibold rounded-[10px] hover:bg-red-err hover:text-white transition-all"
                        style={{ fontFamily: 'var(--font-heading)' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-5">🏡</p>
            <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No Properties Listed
            </h3>
            <p className="text-muted mb-6">You haven&apos;t listed any properties yet.</p>
            <Link to="/sell"><button className="btn px-8">Post Your First Ad</button></Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
