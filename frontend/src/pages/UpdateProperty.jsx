import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const TYPES = ['plot', 'house', 'apartment', 'shop'];
const SIZES = ['5-marla', '10-marla', '1-kanal', '2-kanal'];

export default function UpdateProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [form, setForm]         = useState({ price: '', location: '', description: '', property_type: '', size: '' });
  const [submitting, setSub]    = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`).then(r => {
      const p = r.data.property;
      setProperty(p);
      setForm({ price: p.price, location: p.location, description: p.description, property_type: p.property_type, size: p.size });
    });
  }, [id]);

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      await api.put(`/properties/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/my-properties');
    } catch {
      alert('Failed to update property.');
    } finally {
      setSub(false);
    }
  };

  if (!property) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
      </div>
      <Footer />
    </>
  );

  const radioClass = (selected, val) =>
    `flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
      selected === val
        ? 'border-navy bg-navy text-white'
        : 'border-border-c text-slate hover:border-navy-mid'
    }`;

  return (
    <>
      <Navbar />
      <main className="max-w-[720px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
            Update Property
          </h1>
          <p className="text-muted mt-1.5">Editing: <strong className="text-ink">{property.title}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border-c shadow-sm p-9 flex flex-col gap-5">
          <div>
            <label className="label">Price (Rs)</label>
            <input type="number" placeholder="Enter updated price" value={form.price} onChange={set('price')} className="field" />
          </div>

          <div>
            <label className="label">Location</label>
            <input type="text" placeholder="Enter updated location" value={form.location} onChange={set('location')} className="field" />
          </div>

          <div>
            <label className="label">Property Type</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TYPES.map(t => (
                <label key={t} className={radioClass(form.property_type, t)} style={{ fontFamily: 'var(--font-heading)' }}>
                  <input type="radio" name="property_type" value={t}
                    checked={form.property_type === t} onChange={set('property_type')} className="sr-only" />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Size</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SIZES.map(s => (
                <label key={s} className={radioClass(form.size, s)} style={{ fontFamily: 'var(--font-heading)' }}>
                  <input type="radio" name="size" value={s}
                    checked={form.size === s} onChange={set('size')} className="sr-only" />
                  {s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea placeholder="Enter updated description" value={form.description}
              onChange={set('description')} className="field min-h-[110px] resize-y" />
          </div>

          <button type="submit" className="btn w-full py-4 text-[15px] mt-2" disabled={submitting}>
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
