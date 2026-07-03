import { useNavigate } from 'react-router-dom';

const BASE = '/api/uploads/';

const SIZE_LABEL = {
  '5-marla': '5 Marla',
  '10-marla': '10 Marla',
  '1-kanal': '1 Kanal',
  '2-kanal': '2 Kanal',
};

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const imgSrc = property.images && property.images.length > 0
    ? BASE + property.images[0]
    : '/img/default-property.png';

  return (
    <div
      className="bg-white rounded-2xl border border-border-c shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={property.title}
          className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          {property.property_type && (
            <span
              className="bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {property.property_type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          )}
          {property.category && (
            <span
              className="bg-gold-bright text-navy text-[10px] font-bold px-3 py-1 rounded-full capitalize ml-auto"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {property.category}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h3
          className="text-navy font-bold text-[15px] leading-snug mb-1 line-clamp-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {property.title}
        </h3>

        <div
          className="text-[19px] font-black text-navy mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Rs {Number(property.price).toLocaleString()}
          {property.property_type === 'rent' && (
            <span className="text-[13px] font-normal text-muted"> /mo</span>
          )}
        </div>

        <p className="text-[13px] text-muted flex items-center gap-1.5">
          <span>📍</span>
          <span>{property.location}{property.colony ? `, ${property.colony}` : ''}</span>
        </p>
        <p className="text-[13px] text-muted flex items-center gap-1.5">
          <span>📐</span>
          <span>{SIZE_LABEL[property.size] || property.size}</span>
        </p>
      </div>

      {/* Action */}
      <div className="px-4 pb-4">
        <button
          className="w-full bg-navy text-white py-2.5 rounded-[10px] text-sm font-bold hover:bg-navy-mid transition-colors duration-200"
          style={{ fontFamily: 'var(--font-heading)' }}
          onClick={e => { e.stopPropagation(); navigate(`/property/${property.id}`); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
