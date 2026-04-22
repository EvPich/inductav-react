import { MapPin, Star } from 'lucide-react';

export interface ResultCardProps {
  name?: string;
  location?: string;
  rating?: number;
  available?: boolean;
  serviceTypes?: string[];
  priceRange?: string;
  imageUrl?: string;
  onViewProfile?: () => void;
}

export default function ResultCard({
  name = 'Facility Name',
  location = 'Location, Country',
  rating = 4.2,
  available = true,
  serviceTypes = ['General'],
  priceRange = '$150K – $300K',
  imageUrl,
  onViewProfile,
}: ResultCardProps) {
  return (
    <div className="w-full h-[160px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex">
      {/* Thumbnail */}
      <div
        className="w-[180px] h-full shrink-0 bg-slate-200"
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      />

      {/* Body */}
      <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
        {/* Top: name + availability */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[15px] font-semibold text-slate-900 leading-tight">{name}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-[7px] h-[7px] rounded-full ${available ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            <span className="text-[11px] font-medium text-slate-600">
              {available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500">{location}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'}
            />
          ))}
          <span className="text-xs font-medium text-slate-600 ml-0.5">{rating}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5">
          {serviceTypes.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full">
              {s}
            </span>
          ))}
        </div>

        {/* Bottom: price + button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">{priceRange}</span>
          <button
            onClick={onViewProfile}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
