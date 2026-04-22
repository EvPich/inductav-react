import { MapPin } from 'lucide-react';

export interface MROCardProps {
  name?: string;
  location?: string;
  serviceType?: string;
  available?: boolean;
  imageUrl?: string;
}

export default function MROCard({
  name = 'Lufthansa Technik',
  location = 'Hamburg, Germany',
  serviceType = 'General MRO',
  available = true,
  imageUrl,
}: MROCardProps) {
  return (
    <div className="w-[380px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div
        className="w-full h-[180px] bg-slate-200 shrink-0"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Top */}
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-slate-900">{name}</span>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500">{location}</span>
          </div>
        </div>

        {/* Mid */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {serviceType}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${available ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            <span className="text-xs font-medium text-slate-600">
              {available ? 'Available Now' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Book */}
        <button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors mt-auto">
          Book Now
        </button>
      </div>
    </div>
  );
}
