import { useState } from 'react';

const SIZES      = ['5-marla', '10-marla', '1-kanal', '2-kanal'];
const CATEGORIES = ['house', 'apartment', 'shop', 'plot'];

export default function FilterSidebar({ onSearch, onReset }) {
  const [city, setCity]         = useState('');
  const [colony, setColony]     = useState('');
  const [sizes, setSizes]       = useState([]);
  const [cats, setCats]         = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const toggle = (val, list, setList) =>
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {};
    if (city.trim())     filters.city      = city.trim();
    if (colony.trim())   filters.colony    = colony.trim();
    if (sizes.length)    filters.size      = sizes;
    if (cats.length)     filters.category  = cats;
    if (minPrice.trim()) filters.min_price = minPrice.trim();
    if (maxPrice.trim()) filters.max_price = maxPrice.trim();
    onSearch(filters);
  };

  const handleReset = () => {
    setCity(''); setColony(''); setSizes([]); setCats([]); setMinPrice(''); setMaxPrice('');
    if (onReset) onReset();
  };

  const sectionTitle = 'text-[11px] font-bold text-ink uppercase tracking-[0.07em] mb-3 block';
  const inputClass   = 'field mt-1.5';
  const checkLabel   = 'flex items-center gap-2.5 text-sm text-slate cursor-pointer select-none';

  return (
    <aside className="w-[272px] flex-shrink-0 bg-white border border-border-c rounded-2xl p-6 shadow-sm self-start sticky top-[88px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-gold-bright">
        <h2 className="text-[17px] font-bold text-navy" style={{ fontFamily: 'var(--font-heading)' }}>
          Filters
        </h2>
        <button type="button" onClick={handleReset}
          className="text-[12px] text-muted hover:text-red-err transition-colors font-semibold">
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* City */}
        <div>
          <label className={sectionTitle}>City</label>
          <input type="text" placeholder="e.g. Rawalpindi" value={city}
            onChange={e => setCity(e.target.value)} className={inputClass} />
        </div>

        {/* Colony */}
        <div>
          <label className={sectionTitle}>Colony</label>
          <input type="text" placeholder="e.g. Bahria Town" value={colony}
            onChange={e => setColony(e.target.value)} className={inputClass} />
        </div>

        {/* Size */}
        <div>
          <span className={sectionTitle}>Property Size</span>
          <div className="flex flex-col gap-2.5">
            {SIZES.map(s => (
              <label key={s} className={checkLabel}>
                <input type="checkbox" checked={sizes.includes(s)}
                  onChange={() => toggle(s, sizes, setSizes)}
                  className="w-4 h-4 rounded" />
                {s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <span className={sectionTitle}>Property Type</span>
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map(c => (
              <label key={c} className={checkLabel}>
                <input type="checkbox" checked={cats.includes(c)}
                  onChange={() => toggle(c, cats, setCats)}
                  className="w-4 h-4 rounded" />
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <span className={sectionTitle}>Price Range (Rs)</span>
          <input type="number" placeholder="Min Price" value={minPrice}
            onChange={e => setMinPrice(e.target.value)} className={`${inputClass} mb-2`} />
          <input type="number" placeholder="Max Price" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)} className={inputClass} />
        </div>

        <button type="submit"
          className="w-full bg-navy text-white py-3 rounded-[10px] font-bold text-sm hover:bg-navy-mid transition-colors mt-1"
          style={{ fontFamily: 'var(--font-heading)' }}>
          Search Properties
        </button>
      </form>
    </aside>
  );
}
