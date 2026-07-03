export default function ColonyCard({ image, name }) {
  return (
    <div className="relative w-[230px] rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:shadow-xl flex-shrink-0">
      <img src={image} alt={name} className="w-full h-40 object-cover block" />
      {/* Gradient overlay with name */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
      <p
        className="absolute bottom-3.5 left-4 right-4 text-white text-[15px] font-bold leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {name}
      </p>
    </div>
  );
}
