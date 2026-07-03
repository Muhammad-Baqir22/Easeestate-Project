import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import api from '../utils/api';

export default function Rent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);

  const load = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/search', { params: { type: 'rent', ...filters } });
      setProperties(res.data.properties);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-[1240px] mx-auto px-7 py-9 flex gap-7 items-start">
        <FilterSidebar onSearch={load} onReset={() => load()} />

        <section className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[21px] font-bold text-navy whitespace-nowrap"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Properties for Rent
            </h2>
            <div className="flex-1 h-px bg-border-c" />
            {!loading && (
              <span className="text-sm text-muted whitespace-nowrap">
                {properties.length} result{properties.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-gold-bright rounded-full animate-spin" />
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🏘️</p>
              <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                No Rentals Available
              </h3>
              <p className="text-muted mb-6">We couldn&apos;t find any properties matching your criteria.</p>
              <button className="btn" onClick={() => load()}>Reset Filters</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
