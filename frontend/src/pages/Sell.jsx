import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

export default function Sell() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '', colony: '',
    size: '5-marla', price: '', category: 'house',
  });
  const [images, setImages]     = useState([]);
  const [submitting, setSub]    = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.set('property_type', 'sale');
      images.forEach(img => data.append('images', img));
      await api.post('/properties', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/buy');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post property.');
    } finally {
      setSub(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-[720px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
            Post Property for Sale
          </h1>
          <p className="text-muted mt-1.5">Fill in the details below to list your property.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border-c shadow-sm p-9 flex flex-col gap-5">
          <Field label="Property Title">
            <input type="text" placeholder="e.g. 10 Marla House in DHA Phase 5" value={form.title}
              onChange={set('title')} required className="field" />
          </Field>

          <Field label="Description">
            <textarea placeholder="Describe the property in detail..." value={form.description}
              onChange={set('description')} required className="field min-h-[110px] resize-y" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type of Property">
              <select value={form.category} onChange={set('category')} required className="field cursor-pointer">
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="shop">Shop</option>
                <option value="plot">Plot</option>
              </select>
            </Field>
            <Field label="Size">
              <select value={form.size} onChange={set('size')} required className="field cursor-pointer">
                <option value="5-marla">5 Marla</option>
                <option value="10-marla">10 Marla</option>
                <option value="1-kanal">1 Kanal</option>
                <option value="2-kanal">2 Kanal</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="City / Location">
              <input type="text" placeholder="e.g. Rawalpindi" value={form.location}
                onChange={set('location')} required className="field" />
            </Field>
            <Field label="Colony / Area">
              <input type="text" placeholder="e.g. Bahria Town" value={form.colony}
                onChange={set('colony')} required className="field" />
            </Field>
          </div>

          <Field label="Price (Rs)">
            <input type="number" placeholder="Enter asking price" value={form.price}
              onChange={set('price')} required className="field" />
          </Field>

          <Field label="Property Images">
            <input type="file" accept="image/*" multiple onChange={e => setImages([...e.target.files])}
              required className="field py-2.5 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-navy-mid" />
          </Field>

          <button type="submit" className="btn w-full py-4 text-[15px] mt-2" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
