import { useState } from 'react';

const BASE = '/api/uploads/';

export default function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const imgs = images && images.length > 0 ? images : [null];

  const prev = () => setCurrent(c => (c - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent(c => (c + 1) % imgs.length);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-7 shadow-md">
      <div>
        {imgs.map((img, i) => (
          <img
            key={i}
            src={img ? BASE + img : '/img/default-property.png'}
            alt={`Property ${i + 1}`}
            className={`slider-img${i === current ? ' active' : ''}`}
          />
        ))}
      </div>
      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy/75 text-white flex items-center justify-center text-lg hover:bg-navy/95 transition-colors backdrop-blur-sm"
          >
            &#10094;
          </button>
          <button
            onClick={next}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy/75 text-white flex items-center justify-center text-lg hover:bg-navy/95 transition-colors backdrop-blur-sm"
          >
            &#10095;
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold-bright w-5' : 'bg-white/60'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
