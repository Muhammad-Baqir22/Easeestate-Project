import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import api from '../utils/api';

export default function SearchResults() {
  const [searchParams]          = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]   = useState(true);

  const runSearch = async (params) => {
    setLoading(true);
    try {
      const res = await api.get('/search', { params });
      setProperties(res.data.properties);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const type = searchParams.get('type') || 'sale';

  return (
    <>
      <Navbar />
      <main className="max-w-[1240px] mx-auto px-7 py-9 flex gap-7 items-start">
        <FilterSidebar onSearch={(f) => runSearch({ ...f, type })} onReset={() => runSearch({ type })} />

        <section className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[21px] font-bold text-navy whitespace-nowrap"
              style={{ fontFamily: 'var(--font-heading)' }}>
              Search Results
            </h2>
            <div className="flex-1 h-px bg-border-c" />
            {!loading && (
              <span className="text-sm text-muted">{properties.length} found</span>
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
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                No Properties Found
              </h3>
              <p className="text-muted mb-6">Try adjusting your search filters.</p>
              <Link to={type === 'rent' ? '/rent' : '/buy'}>
                <button className="btn">View All Properties</button>
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
