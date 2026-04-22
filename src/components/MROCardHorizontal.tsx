import { MapPin } from 'lucide-react';

export interface MROCardHorizontalProps {
  name?: string;
  location?: string;
  available?: boolean;
  imageUrl?: string;
}

export default function MROCardHorizontal({
  name = 'Facility Name',
  location = 'Location',
  available = true,
  imageUrl,
}: MROCardHorizontalProps) {
  return (
    <div className="w-[290px] h-[120px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex">
      {/* Thumb */}
      <div
        className="w-[120px] h-full shrink-0 bg-slate-200"
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      />

      {/* Info */}
      <div className="flex flex-col justify-center gap-2 p-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-slate-900 truncate">{name}</span>
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 truncate">{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-[7px] h-[7px] rounded-full shrink-0 ${available ? 'bg-emerald-500' : 'bg-slate-400'}`}
          />
          <span className="text-xs font-medium text-slate-600">
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
}
